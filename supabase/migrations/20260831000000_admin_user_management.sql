-- Trichy Today — admin user management
-- `users` previously only had "read own row" / "update own row" RLS, so
-- there was no way for the admin panel to list all users or change
-- someone else's role/ban status. Role changes are admin-only (not
-- editor) — editors moderate content, they shouldn't be able to grant
-- themselves or anyone else admin access.

-- Idempotent (if not exists / or replace / drop-then-create) — this is
-- applied by hand via the SQL Editor with no migration tracking, so it
-- needs to be safe to re-run after a partial failure.

alter table public.users
  add column if not exists is_banned boolean not null default false;

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

drop policy if exists "users admin read all" on users;
create policy "users admin read all" on users
  for select using (is_editor_or_admin());

drop policy if exists "users admin update all" on users;
create policy "users admin update all" on users
  for update using (is_admin());
