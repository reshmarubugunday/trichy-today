'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

type Step = 'phone' | 'otp';

export function PhoneLoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ phone });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep('otp');
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    router.push('/');
  }

  if (step === 'otp') {
    return (
      <form onSubmit={verifyOtp} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-text-primary">
            Enter the code sent to {phone}
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="123456"
          />
        </div>
        {error && <p className="text-sm text-primary">{error}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="text-sm text-text-secondary hover:underline"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendOtp} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-primary">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="+91XXXXXXXXXX"
        />
      </div>
      {error && <p className="text-sm text-primary">{error}</p>}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Sending...' : 'Send code'}
      </Button>
    </form>
  );
}
