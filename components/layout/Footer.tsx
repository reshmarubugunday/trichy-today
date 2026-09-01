import Link from 'next/link';
import { NEWS_CATEGORIES, CLASSIFIED_CATEGORIES } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Trichy
              </span>
              <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Georgia, serif' }}>
                Today
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5 ml-0.5" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Trichy&apos;s trusted source for local news, classifieds, and community updates.
            </p>
            <p className="text-xs text-gray-500">
              திருச்சிராப்பள்ளியின் நம்பகமான செய்தி மூலம்
            </p>
          </div>

          {/* News categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">News</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/news" className="text-sm hover:text-white transition-colors">All News</Link>
              </li>
              {NEWS_CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <Link href={`/news/${cat.value}`} className="text-sm hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Classifieds */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Classifieds</h3>
            <ul className="space-y-2">
              {CLASSIFIED_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.value}>
                  <Link href={`/classifieds/${cat.value}`} className="text-sm hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Advertise</Link></li>
              <li><Link href="#" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/post/classified" className="text-sm hover:text-white transition-colors">Post Free Ad</Link></li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((s) => (
                <a key={s} href="#" aria-label={s} className="text-gray-400 hover:text-white transition-colors text-xs">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Trichy Today. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300">Terms of Use</Link>
            <Link href="#" className="hover:text-gray-300">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
