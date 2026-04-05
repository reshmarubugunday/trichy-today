'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { NEWS_CATEGORIES } from '@/lib/constants';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Link href="/post/news" className="hover:opacity-100 hover:underline">Submit News</Link>
            <Link href="/post/classified" className="hover:opacity-100 hover:underline">Post Ad</Link>
          </div>
        </div>
      </div>

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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
