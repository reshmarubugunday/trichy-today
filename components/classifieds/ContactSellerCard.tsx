'use client';

import { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ContactSellerCardProps {
  listingId: string;
  contactName: string;
  phoneMasked: string;
  whatsappEnabled: boolean;
  email?: string;
}

// The full phone number never ships in the page's initial HTML — only
// `phoneMasked` does. Clicking "Show Phone Number" calls the reveal-phone
// API route, which logs the reveal and returns the real number; only then
// do the tel:/WhatsApp links get the full number (client-side, post-reveal).
export function ContactSellerCard({
  listingId,
  contactName,
  phoneMasked,
  whatsappEnabled,
  email,
}: ContactSellerCardProps) {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function revealPhone() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/classifieds/${listingId}/reveal-phone`, { method: 'POST' });
      if (!res.ok) throw new Error('reveal-phone request failed');
      const data = (await res.json()) as { phone: string };
      setPhone(data.phone);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-border rounded-xl p-5 sticky top-24">
      <h3 className="text-base font-semibold text-text-primary mb-1">Contact Seller</h3>
      <p className="text-sm text-text-secondary mb-4">{contactName}</p>

      {phone ? (
        <Button href={`tel:${phone}`} variant="primary" fullWidth className="mb-3">
          <Phone className="w-4 h-4 mr-2" />
          {phone}
        </Button>
      ) : (
        <Button variant="primary" fullWidth className="mb-3" onClick={revealPhone} disabled={loading}>
          <Phone className="w-4 h-4 mr-2" />
          {loading ? 'Loading…' : `Show Phone Number (${phoneMasked})`}
        </Button>
      )}
      {error && (
        <p className="text-xs text-red-600 mb-3">Couldn&apos;t load the phone number. Please try again.</p>
      )}

      {whatsappEnabled && phone && (
        <Button
          href={`https://wa.me/${phone.replace(/\D/g, '')}`}
          variant="secondary"
          fullWidth
          className="mb-3"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat on WhatsApp
        </Button>
      )}

      {email && (
        <Button href={`mailto:${email}`} variant="ghost" fullWidth>
          Send Email
        </Button>
      )}

      <p className="text-[10px] text-text-secondary mt-4 leading-relaxed">
        Always meet in a safe, public place. Verify identity before any transaction.
        Trichy Today is not responsible for transactions between buyers and sellers.
      </p>
    </div>
  );
}
