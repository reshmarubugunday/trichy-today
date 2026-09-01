# Supabase setup

## Running the migrations

Once you have a project (see ARCHITECTURE.md / ROADMAP.md Phase 1), apply the
SQL files in `migrations/` in order. Easiest path while you don't have the
Supabase CLI installed: open the project's **SQL Editor** in the dashboard,
paste each file's contents in filename order, and run it.

1. `20260719120000_initial_schema.sql` — enums + tables + indexes
2. `20260719120100_auth_and_rls.sql` — auth sync trigger + RLS policies
3. `20260719120200_storage_buckets.sql` — `news-images` / `classified-images` buckets
4. `20260812000000_email_auth.sql` — switches the auth sync trigger from phone to email
5. `20260815000000_capture_name_on_signup.sql` — captures the signup form's name into `public.users`
6. `20260831000000_admin_user_management.sql` — `users.is_banned`, `is_admin()`, admin read/update RLS on `users`

If you install the Supabase CLI later, `supabase link` + `supabase db push`
will apply these same files instead.

## Auth: email OTP, not phone

Login is email-based (`EmailAuthForm`, `signInWithOtp`/`verifyOtp` with a
magic link) — Supabase's built-in email sending handles delivery, no
third-party provider needed. `users.phone` still exists as a plain, optional
profile column, but it's no longer synced from auth or used for login;
classified listings collect `contact_phone` per-listing independently.
