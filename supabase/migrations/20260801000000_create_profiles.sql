-- Profiles: extends Supabase's built-in auth.users with app-specific fields.
-- auth.users already owns: id, email, encrypted_password, email_confirmed_at,
-- created_at, and (via auth.identities) one row per linked OAuth provider
-- (google, etc.) — this migration only adds what Supabase doesn't track.

create type public.user_status as enum ('active', 'disabled');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username varchar unique,
  status public.user_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'App-specific user data. One row per auth.users row, created automatically on signup.';

-- Keep updated_at current on every row change.
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth.users row is created,
-- whether the user signed up via email/password or an OAuth provider.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS: users can only read/update their own profile.
alter table public.profiles enable row level security;

create policy "profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- profiles has no insert/delete policy: rows are created only by the
-- handle_new_user trigger (security definer) and removed only via the
-- auth.users cascade delete.
