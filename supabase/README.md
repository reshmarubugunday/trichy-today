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

**Redirect URL allowlist.** Add every domain the app is actually served from
(the production domain, and any Netlify preview/branch URLs you test with) to
**Authentication → URL Configuration → Redirect URLs** in the dashboard. A
magic link whose `emailRedirectTo` isn't on that list fails confirmation —
this looks identical to the Safe Links issue below, so check this first if
every login on a given domain fails.

**6-digit code fallback.** The same OTP email also carries a numeric code
(`EmailAuthForm` has an "enter the code" field for it), because the magic
link alone breaks for some recipients: Outlook/Hotmail's Safe Links (and
similar corporate email scanners) prefetch every link in an incoming email
to scan it, which silently consumes the single-use magic-link token before
the person ever clicks it — they see "link expired" on what looks like
their first click. Supabase's default Magic Link template doesn't include
the code — add `{{ .Token }}` to it under **Authentication → Email
Templates → Magic Link**, or the fallback field has nothing to show.
