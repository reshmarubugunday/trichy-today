'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push('/');
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
      Log out
    </Button>
  );
}
