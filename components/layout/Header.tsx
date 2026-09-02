'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import { isEditorOrAdmin, type CurrentUser } from '@/lib/auth/roles';

// Auth state is loaded client-side (not passed down from the root layout)
// so pages stay statically generated — reading cookies in a server layout
// would force every route to render dynamically on every request.
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [justSignedIn, setJustSignedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const loginHref = `/login?next=${encodeURIComponent(pathname)}`;

  // The email confirmation link (app/auth/confirm/route.ts) redirects here
  // with ?confirmed=1 on success — otherwise signing in is silent, since the
  // only feedback would be the small "Log out" link appearing in the top bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('confirmed') !== '1') return;

    params.delete('confirmed');
    const qs = params.toString();
    window.history.replaceState({}, '', qs ? `${pathname}?${qs}` : pathname);

    // setTimeout, not a direct call — react-hooks/set-state-in-effect flags
    // setState called synchronously in an effect body.
    const showTimer = setTimeout(() => setJustSignedIn(true), 0);
    const hideTimer = setTimeout(() => setJustSignedIn(false), 5000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  useEffect(() => {
    // Created here, not at component-body scope — this runs only in the
    // browser after mount, never during the server-rendered/prerendered
    // pass, so a static build doesn't need Supabase env vars available.
    const supabase = createClient();
    let active = true;

    async function loadUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        if (active) setUser(null);
        return;
      }
      const { data } = await supabase
        .from('users')
        .select('id, role, name, phone, is_banned')
        .eq('id', authUser.id)
        .maybeSingle();
      // A banned user is treated as signed out everywhere — see getCurrentUser.ts.
      if (active) setUser(data && !data.is_banned ? (data as CurrentUser) : null);
    }

    loadUser();
    const { data: subscription } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
    setMobileOpen(false);
    router.push('/');
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="opacity-80">{today}</span>
          <div className="flex items-center gap-4 opacity-80">
            <Link href="/post/classified" className="hover:opacity-100 hover:underline">Post Ad</Link>
            {user ? (
              <>
                {isEditorOrAdmin(user) && (
                  <Link href="/admin" className="hover:opacity-100 hover:underline">Admin</Link>
                )}
                <button type="button" onClick={handleLogout} className="hover:opacity-100 hover:underline">
                  Log out
                </button>
              </>
            ) : (
              <Link href={loginHref} className="hover:opacity-100 hover:underline">Log in</Link>
            )}
          </div>
        </div>
      </div>

      {justSignedIn && (
        <div className="bg-green-50 border-b border-green-100 text-green-800 text-sm">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
            <span>You&apos;re signed in.</span>
            <button
              type="button"
              onClick={() => setJustSignedIn(false)}
              aria-label="Dismiss"
              className="text-green-800/70 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Masthead */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-text-primary" style={{ fontFamily: 'Georgia, serif' }}>
              Trichy
            </span>
            <span className="text-2xl font-bold tracking-tight text-primary" style={{ fontFamily: 'Georgia, serif' }}>
              Today
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
        </Link>

        <div className="hidden md:block flex-1 max-w-sm">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/classifieds" className="px-3 py-1.5 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
            Post Free Ad
          </Link>
        </nav>

        <button
          className="md:hidden p-2 text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Category nav */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden md:flex items-center gap-0 overflow-x-auto">
            <Link
              href="/news"
              className="px-4 py-3 text-sm font-medium text-text-primary hover:text-primary border-b-2 border-transparent hover:border-primary transition-all whitespace-nowrap"
            >
              All News
            </Link>
            {NEWS_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/news/${cat.value}`}
                className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-primary border-b-2 border-transparent hover:border-primary transition-all whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/classifieds"
              className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-primary border-b-2 border-transparent hover:border-primary transition-all whitespace-nowrap"
            >
              Classifieds
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white pb-4">
          <div className="px-4 pt-3">
            <SearchBar className="mb-4" />
          </div>
          <nav className="flex flex-col">
            <Link href="/news" className="px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
              All News
            </Link>
            {NEWS_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/news/${cat.value}`}
                className="px-4 py-2.5 text-sm text-text-secondary hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link href="/classifieds" className="px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                Classifieds
              </Link>
              <Link href="/post/classified" className="mx-4 mt-2 block text-center py-2.5 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark" onClick={() => setMobileOpen(false)}>
                Post Free Ad
              </Link>
              {user ? (
                <>
                  {isEditorOrAdmin(user) && (
                    <Link href="/admin" className="px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 text-sm text-left text-text-primary hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link href={loginHref} className="px-4 py-2.5 text-sm font-medium text-text-primary hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
