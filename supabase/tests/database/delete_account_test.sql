-- delete_my_account removes the auth user (cascade clears owned rows).
begin;
create extension if not exists pgtap with schema extensions;

select plan(3);

set local role postgres;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, is_anonymous
) values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'delete@dearwallet.test',
  crypt('password', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
  false, false
);

set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","role":"authenticated"}',
  true
);

insert into public.items (id, user_id, kind, name, amount_cents)
values ('11111111-1111-4111-8111-111111111111', auth.uid(), 'kept', 'bye', 100);

select is(
  (select count(*)::integer from public.items where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  1,
  'item exists before delete'
);

select lives_ok(
  $$select public.delete_my_account()$$,
  'delete_my_account runs'
);

-- verify as postgres (user gone)
set local role postgres;
reset role;
set local role postgres;

select is(
  (select count(*)::integer from auth.users where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')
  + (select count(*)::integer from public.items where id = '11111111-1111-4111-8111-111111111111')
  + (select count(*)::integer from public.profiles where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  0,
  'user, profile, and items are gone'
);

select * from finish();
rollback;
