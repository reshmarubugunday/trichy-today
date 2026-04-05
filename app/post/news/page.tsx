'use client';
import { useState } from 'react';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';

export default function PostNewsPage() {
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: '',
    authorName: '',
    authorEmail: '',
    body: '',
    sourceUrl: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">News Submitted!</h2>
        <p className="text-text-secondary mb-6">Thank you for contributing. Our editorial team will review and publish it soon.</p>
        <Button href="/news" variant="primary">Back to News</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Submit a News Story</h1>
          <p className="text-text-secondary">Help keep Trichy informed. Share local news, events, or tips.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Headline *</label>
            <input
              required
              type="text"
              placeholder="Write a clear, descriptive headline"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Category *</label>
            <div className="flex flex-wrap gap-2">
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                    ${form.category === cat.value ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary hover:border-primary hover:text-primary'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Summary *</label>
            <textarea
              required
              rows={3}
              placeholder="A brief 1-2 sentence summary of the story"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Full Story *</label>
            <textarea
              required
              rows={8}
              placeholder="Write the full news story here..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">Source URL (optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Your Name *</label>
              <input
                required
                type="text"
                placeholder="Full name"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary block mb-1.5">Email *</label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={form.authorEmail}
                onChange={(e) => setForm({ ...form, authorEmail: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            <p className="font-medium mb-1">Editorial Guidelines</p>
            <p className="text-xs">All submissions are reviewed by our editorial team. We do not publish unverified rumours, personal attacks, or political propaganda. Submissions may be edited for clarity and length.</p>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg">
            Submit for Review →
          </Button>
        </form>
      </div>
    </div>
  );
}
