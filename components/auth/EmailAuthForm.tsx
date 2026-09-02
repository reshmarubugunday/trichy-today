'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

interface EmailAuthFormProps {
  mode: 'login' | 'signup';
  defaultEmail?: string;
  next?: string;
  confirmError?: boolean;
}

const inputCls =
  'mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

export function EmailAuthForm({ mode, defaultEmail = '', next, confirmError }: EmailAuthFormProps) {
  const supabase = createClient();

  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(
    confirmError ? "That link didn't work — it may have expired. Enter your email to get a new one." : null
  );
  const [noAccount, setNoAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const crossLinkHref = (path: '/login' | '/signup') => {
    const params = new URLSearchParams();
    if (path === '/signup' && email) params.set('email', email);
    if (next) params.set('next', next);
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNoAccount(false);
    setLoading(true);

    const confirmUrl = new URL('/auth/confirm', window.location.origin);
    if (next) confirmUrl.searchParams.set('next', next);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: confirmUrl.toString(),
        shouldCreateUser: mode === 'signup',
        ...(mode === 'signup' && name.trim() ? { data: { name: name.trim() } } : {}),
      },
    });

    setLoading(false);
    if (error) {
      // Supabase's response for "no account exists" when shouldCreateUser is
      // false — steer people to /signup instead of showing a raw API error.
      if (mode === 'login' && error.code === 'otp_disabled') {
        setNoAccount(true);
        return;
      }
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-base font-semibold text-text-primary mb-1">Check your email</h2>
        <p className="text-sm text-text-secondary">
          We sent a sign-in link to <span className="font-medium">{email}</span>. Click it to{' '}
          {mode === 'signup' ? 'finish creating your account' : 'log in'}.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-text-secondary hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}

      {noAccount && (
        <p className="text-sm text-primary">
          No account found for that email.{' '}
          <Link href={crossLinkHref('/signup')} className="underline font-medium">
            Sign up instead
          </Link>
          .
        </p>
      )}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Sending...' : mode === 'signup' ? 'Sign up' : 'Send sign-in link'}
      </Button>

      <p className="text-sm text-text-secondary text-center">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link href={crossLinkHref('/login')} className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <Link href={crossLinkHref('/signup')} className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
