export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoString);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function formatPrice(price: number, currency = 'INR'): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

// Masks all but the last 2 digits, grouped in 4s to match the ROADMAP
// example: "9876543210" → "●●●● ●●●● 10". Used for classified listing
// contact numbers — the full number is only ever sent to the client via
// the reveal-phone API call, logged, never in the initial page HTML.
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 2) return '●'.repeat(digits.length);

  const visible = digits.slice(-2);
  const masked = '●'.repeat(digits.length - 2);
  const groups: string[] = [];
  for (let i = 0; i < masked.length; i += 4) {
    groups.push(masked.slice(i, i + 4));
  }
  groups.push(visible);
  return groups.join(' ');
}

export function categoryLabel(category: string): string {
  return category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
