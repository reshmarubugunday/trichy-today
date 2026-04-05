import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  href?: string;
  accentColor?: boolean;
}

export function SectionHeader({ title, href, accentColor = false }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-6 rounded-full ${accentColor ? 'bg-accent' : 'bg-primary'}`} />
        <h2 className="text-xl font-bold text-text-primary tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm text-primary hover:underline font-medium flex items-center gap-1"
        >
          See all →
        </Link>
      )}
    </div>
  );
}
