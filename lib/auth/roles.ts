// Split from getCurrentUser.ts, which imports next/headers — importing that
// from a Client Component (e.g. Header) fails the build. This file has no
// server-only dependencies, so it's safe to import from client code too.

export interface CurrentUser {
  id: string;
  role: 'user' | 'editor' | 'admin';
  name: string | null;
  phone: string | null;
}

export function isEditorOrAdmin(user: CurrentUser | null): boolean {
  return user?.role === 'editor' || user?.role === 'admin';
}

export function isAdmin(user: CurrentUser | null): boolean {
  return user?.role === 'admin';
}
