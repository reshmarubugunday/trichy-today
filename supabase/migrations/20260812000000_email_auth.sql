-- Trichy Today — switch primary auth identifier from phone to email
-- Phone OTP required a paid SMS provider (MSG91/Twilio) with no free tier
-- and India-only delivery; email OTP uses Supabase's built-in email
-- sending, no third-party provider needed. `users.phone` stays as a plain,
-- optional profile field — it's no longer synced from auth and is unrelated
-- to login. (Classified listings already collect contact_phone per-listing
-- independently of the users table, so nothing downstream depends on this.)

create or replace function handle_new_auth_user() returns trigger as $$
begin
  insert into public.users (id, email, is_verified)
  values (new.id, new.email, new.email_confirmed_at is not null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

alter table public.users
  add constraint users_email_key unique (email);
