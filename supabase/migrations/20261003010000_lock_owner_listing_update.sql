-- Trichy Today — lock down what an owner can change on their own listing
-- "classified_listings owner update" (auth_and_rls.sql) only has a USING
-- clause, no WITH CHECK — RLS is row-level, not column-level, so it never
-- stopped an owner from directly calling the Supabase client with their own
-- session to set status='active'/is_verified=true on their own row, or even
-- reassign posted_by. That became a live concern once /account/listings
-- gave owners a routine reason to update their own rows (edit/renew/delete).
--
-- A BEFORE UPDATE trigger is the right tool here, not a WITH CHECK: it can
-- act per-column (pin values back) rather than just allow/reject the whole
-- row. Editors/admins acting in their own session, and the service-role
-- client, both skip the lock — the service-role bypass is deliberate: it's
-- how lib/classifieds/myListingsActions.ts's renewMyListing/deleteMyListing
-- set status to 'active'/'removed' as a trusted path that already checks
-- auth + ownership in application code before ever reaching this table.

create or replace function lock_owner_listing_update() returns trigger as $$
begin
  if auth.role() = 'service_role' or is_editor_or_admin() then
    return new;
  end if;

  -- Anyone else writing to this row — including a hand-crafted request
  -- using the owner's own session, not just the app's own edit form — can
  -- only resubmit content for moderation. status always resets to
  -- 'pending' (same as the app's own update already intends); is_verified,
  -- posted_by, and view_count can't move from this path at all.
  new.status := 'pending';
  new.is_verified := old.is_verified;
  new.posted_by := old.posted_by;
  new.view_count := old.view_count;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger classified_listings_lock_owner_update
  before update on classified_listings
  for each row execute function lock_owner_listing_update();
