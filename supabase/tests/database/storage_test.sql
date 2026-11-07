-- Storage: item-photos/{user_id}/… readable by owner only.
begin;
create extension if not exists pgtap with schema extensions;

select plan(3);

set local role postgres;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, is_anonymous
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'a-storage@dearwallet.test',
    crypt('password', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, false
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'b-storage@dearwallet.test',
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
  $$insert into storage.objects (bucket_id, name, owner, owner_id)
    values (
      'item-photos',
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/item1.jpg',
      auth.uid(),
      auth.uid()::text
    )$$,
  'A can write photo in own folder'
);

select is(
  (select count(*)::integer from storage.objects where bucket_id = 'item-photos'),
  1,
  'A can read own photo'
);

select set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer from storage.objects where bucket_id = 'item-photos'),
  0,
  'B cannot read A photo folder'
);

select * from finish();
rollback;
