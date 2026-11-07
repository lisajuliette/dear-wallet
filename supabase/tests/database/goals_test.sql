-- Only one active (non-archived, non-deleted) goal per user.
begin;
create extension if not exists pgtap with schema extensions;

select plan(2);

set local role postgres;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, is_anonymous
) values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'goals@dearwallet.test',
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

select lives_ok(
  $$insert into public.goals (id, user_id, name, target_cents)
    values ('33333333-3333-4333-8333-333333333333', auth.uid(), 'first', 10000)$$,
  'first active goal succeeds'
);

select throws_ok(
  $$insert into public.goals (id, user_id, name, target_cents)
    values ('33333333-3333-4333-8333-333333333334', auth.uid(), 'second', 20000)$$,
  '23505',
  null,
  'second active goal is rejected'
);

select * from finish();
rollback;
