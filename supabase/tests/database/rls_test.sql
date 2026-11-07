-- RLS: user A can read/write own rows; user B sees nothing.
begin;
create extension if not exists pgtap with schema extensions;

select plan(12);

-- service role seeds two auth users (profile trigger fires)
set local role postgres;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, is_anonymous
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'a@dearwallet.test',
    crypt('password', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, false
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'b@dearwallet.test',
    crypt('password', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, false
  );

-- act as user A
set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","role":"authenticated"}',
  true
);

select lives_ok(
  $$insert into public.items (id, user_id, kind, name, amount_cents)
    values ('11111111-1111-4111-8111-111111111111', auth.uid(), 'kept', 'tea', 450)$$,
  'A can insert own item'
);

select is(
  (select count(*)::integer from public.items where name = 'tea'),
  1,
  'A can select own item'
);

select lives_ok(
  $$insert into public.diary_entries (id, user_id, entry_date, mood, body)
    values ('22222222-2222-4222-8222-222222222222', auth.uid(), current_date, 'chill', 'hi')$$,
  'A can insert diary entry'
);

select lives_ok(
  $$insert into public.goals (id, user_id, name, target_cents)
    values ('33333333-3333-4333-8333-333333333333', auth.uid(), 'trip', 50000)$$,
  'A can insert goal'
);

select lives_ok(
  $$insert into public.stars (user_id, day, earned_by)
    values (auth.uid(), current_date, 'log')$$,
  'A can insert star'
);

select lives_ok(
  $$insert into public.quests (user_id, day, quest_id, completed_at)
    values (auth.uid(), current_date, 'log_one', now())$$,
  'A can insert quest'
);

select lives_ok(
  $$insert into public.milestones (user_id, milestone_id)
    values (auth.uid(), 'kept_100')$$,
  'A can insert milestone'
);

select lives_ok(
  $$insert into public.unlocks (user_id, unlock_id)
    values (auth.uid(), 'palette:midnight')$$,
  'A can insert unlock'
);

select lives_ok(
  $$insert into public.sticker_awards (id, user_id, sticker_id, source)
    values ('88888888-8888-4888-8888-888888888888', auth.uid(), 'star', 'log')$$,
  'A can insert sticker award'
);

select is(
  (select count(*)::integer from public.profiles where id = auth.uid()),
  1,
  'A can read own profile'
);

-- act as user B — should see none of A's rows
select set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', true);
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb","role":"authenticated"}',
  true
);

select is(
  (select count(*)::integer from public.items),
  0,
  'B cannot see A items'
);

select is(
  (select count(*)::integer from public.diary_entries)
  + (select count(*)::integer from public.goals)
  + (select count(*)::integer from public.stars)
  + (select count(*)::integer from public.quests)
  + (select count(*)::integer from public.milestones)
  + (select count(*)::integer from public.unlocks)
  + (select count(*)::integer from public.sticker_awards),
  0,
  'B cannot see A rows on other tables'
);

select * from finish();
rollback;
