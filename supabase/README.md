# Supabase setup

## Running the migrations

Once you have a project (see ARCHITECTURE.md / ROADMAP.md Phase 1), apply the
SQL files in `migrations/` in order. Easiest path while you don't have the
Supabase CLI installed: open the project's **SQL Editor** in the dashboard,
paste each file's contents in filename order, and run it.

1. `20260719120000_initial_schema.sql` — enums + tables + indexes
2. `20260719120100_auth_and_rls.sql` — auth sync trigger + RLS policies
3. `20260719120200_storage_buckets.sql` — `news-images` / `classified-images` buckets

If you install the Supabase CLI later, `supabase link` + `supabase db push`
will apply these same files instead.

## Phone OTP + MSG91 — a gotcha worth knowing up front

`ROADMAP.md` names MSG91 as the SMS provider. Supabase's built-in phone auth
has native support for Twilio, Twilio Verify, MessageBird, and Vonage — **not**
MSG91 directly. The app code (`PhoneLoginForm`, `signInWithOtp`/`verifyOtp`)
doesn't change regardless of provider, but to actually use MSG91 you have two
options when you get to that point:

- **Fastest to ship:** use Twilio (or one of the natively-supported providers)
  for the MVP, configured entirely in the Supabase Dashboard under
  Authentication → Providers → Phone. No extra code.
- **To use MSG91 specifically:** implement a
  [Send SMS Hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook)
  — an Edge Function Supabase calls instead of its built-in provider, which
  you point at MSG91's API.

Not a blocker for Stage A — just flagging it before you configure the phone
provider in the dashboard, so it doesn't come as a surprise.
