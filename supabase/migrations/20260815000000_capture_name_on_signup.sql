-- Trichy Today — capture name entered on the /signup form
-- EmailAuthForm passes { data: { name } } to signInWithOtp on signup, which
-- Supabase stores on auth.users.raw_user_meta_data. Pull it into
-- public.users.name at insert time so it isn't silently dropped.

create or replace function handle_new_auth_user() returns trigger as $$
begin
  insert into public.users (id, email, name, is_verified)
  values (
    new.id,
    new.email,
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;
