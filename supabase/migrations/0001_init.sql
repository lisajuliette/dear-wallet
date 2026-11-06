-- Dear Wallet · Supabase schema (Postgres)
-- Offline-first: every row id is a client-generated uuid, every table has updated_at + deleted_at
-- (soft delete) so the sync layer can upsert and pull changes since a timestamp.
-- Row level security: a user can only ever see and change their own rows.

create extension if not exists "pgcrypto";

-- ---------- helpers ----------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles (one per auth user) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  palette text not null default 'cloud'
    check (palette in ('cloud','lilac','peachfuzz','peachsoda','orchid','midnight')),
  currency text not null default 'USD',
  sounds boolean not null default true,
  haptics boolean not null default true,
  reduced_motion boolean not null default false,
  app_lock text not null default 'off' check (app_lock in ('off','diary','app')),
  checkin_enabled boolean not null default true,
  checkin_weekday smallint not null default 0 check (checkin_weekday between 0 and 6), -- 0 = Sunday
  checkin_time time not null default '19:00',
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- create a profile automatically for every new auth user (including anonymous users)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- items: things she didn't buy (kept) and things she bought and loved ----------
create table public.items (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  kind text not null check (kind in ('kept','loved')),
  name text not null check (char_length(name) between 1 and 80),
  amount_cents integer check (amount_cents is null or amount_cents >= 0), -- required for kept, optional for loved
  currency text not null default 'USD',
  category text check (char_length(category) <= 32),
  note text check (char_length(note) <= 280),
  photo_path text,                          -- storage path in bucket item-photos
  tag text check (tag in ('savings','debt')), -- quiet side total only
  bought_after_all_at timestamptz,          -- set = removed from every kept total, can be undone
  happened_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint kept_needs_amount check (kind <> 'kept' or amount_cents is not null)
);
create index items_user_time on public.items (user_id, happened_at desc);
create index items_user_updated on public.items (user_id, updated_at);

-- ---------- diary ----------
create table public.diary_entries (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  entry_date date not null,
  prompt_id text,
  mood text check (mood in ('proud','chill','meh','tempted','wobbly')),
  body text not null default '' check (char_length(body) <= 280),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint entry_has_something check (mood is not null or char_length(body) > 0)
);
create index diary_user_date on public.diary_entries (user_id, entry_date desc);

-- stickers placed on a diary page. x/y are the sticker centre as a fraction of the page (0..1),
-- scale is relative to the base sticker size (96 pt), rotation in degrees, z = stacking order.
create table public.page_stickers (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  diary_entry_id uuid not null references public.diary_entries(id) on delete cascade,
  sticker_id text not null,
  x real not null check (x between 0 and 1),
  y real not null check (y between 0 and 1),
  scale real not null default 1 check (scale between 0.4 and 2.5),
  rotation real not null default 0,
  z integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index page_stickers_entry on public.page_stickers (diary_entry_id);

-- ---------- rewards ----------
-- every sticker she has earned. Tray count = awards - stickers currently placed (not deleted).
create table public.sticker_awards (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  sticker_id text not null,
  source text not null check (source in ('log','diary','milestone','pack','quest')),
  source_id uuid,
  awarded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index awards_user on public.sticker_awards (user_id, awarded_at desc);

-- one star per local calendar day with any action. Stars never reset.
create table public.stars (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  day date not null,
  earned_by text not null check (earned_by in ('log','diary','decorate','quest')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table public.quests (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  day date not null,
  quest_id text not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- milestones are only ever added, never revoked (buying something after all does not remove one)
create table public.milestones (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  milestone_id text not null, -- e.g. kept_100, kept_500, logs_50, diary_30, first_nvm
  achieved_at timestamptz not null default now(),
  seen_at timestamptz,        -- full-screen celebration shown
  updated_at timestamptz not null default now(),
  primary key (user_id, milestone_id)
);

create table public.unlocks (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  unlock_id text not null, -- e.g. pack:y2k-desk, pack:holo-club, palette:peachsoda
  unlocked_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, unlock_id)
);

-- ---------- one goal at a time ----------
create table public.goals (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null check (char_length(name) between 1 and 60),
  target_cents integer not null check (target_cents > 0),
  started_at timestamptz not null default now(),
  reached_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create unique index one_active_goal on public.goals (user_id) where archived_at is null and deleted_at is null;

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','items','diary_entries','page_stickers','sticker_awards','stars','quests','milestones','unlocks','goals'] loop
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------- row level security ----------
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['items','diary_entries','page_stickers','sticker_awards','stars','quests','milestones','unlocks','goals'] loop
    execute format('alter table public.%1$s enable row level security', t);
    execute format('create policy "own rows" on public.%1$s for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

-- ---------- storage: private item photos at item-photos/{user_id}/{item_id}.jpg ----------
insert into storage.buckets (id, name, public) values ('item-photos', 'item-photos', false)
  on conflict (id) do nothing;
create policy "own photos read" on storage.objects for select
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos write" on storage.objects for insert
  with check (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos update" on storage.objects for update
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos delete" on storage.objects for delete
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- account deletion (required before public launch) ----------
-- Call from the app via supabase.rpc('delete_my_account'). Cascades remove every row; photos are
-- removed by the delete-account Edge Function before this runs (storage is not cascaded).
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
