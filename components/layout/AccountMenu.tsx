'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { isEditorOrAdmin, type CurrentUser } from '@/lib/auth/roles';

interface AccountMenuProps {
  user: CurrentUser;
  onLogout: () => void;
}

export function AccountMenu({ user, onLogout }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const label = user.name?.trim() || user.email?.split('@')[0] || 'Account';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 opacity-80 hover:opacity-100"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-44 rounded-md border border-border bg-white text-text-primary normal-case text-sm shadow-lg py-1"
        >
          <Link
            href="/account"
            role="menuitem"
            className="block px-3 py-2 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            My Account
          </Link>
          {isEditorOrAdmin(user) && (
            <Link
              href="/admin"
              role="menuitem"
              className="block px-3 py-2 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
