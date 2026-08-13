'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

export function EmailLoginForm() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });

    setLoading(false);
    if (error) {
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
          We sent a sign-in link to <span className="font-medium">{email}</span>. Click it to log in.
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
    <form onSubmit={sendMagicLink} className="space-y-4">
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
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="you@example.com"
        />
      </div>
      {error && <p className="text-sm text-primary">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Sending...' : 'Send sign-in link'}
      </Button>
    </form>
  );
}
