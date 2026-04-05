import Link from 'next/link';
import {
  Briefcase,
  Home,
  Car,
  Smartphone,
  Wrench,
  Heart,
  GraduationCap,
  LayoutGrid,
} from 'lucide-react';
import { CLASSIFIED_CATEGORIES } from '@/lib/constants';

const IconMap: Record<string, React.ElementType> = {
  Briefcase,
  Home,
  Car,
  Smartphone,
  Wrench,
  Heart,
  GraduationCap,
  LayoutGrid,
};

const colorMap: Record<string, string> = {
  jobs: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
  'real-estate': 'bg-green-50 text-green-600 group-hover:bg-green-100',
  vehicles: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  electronics: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
  services: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100',
  matrimony: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100',
  education: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100',
  other: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
};

export function ClassifiedCategoryGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
      {CLASSIFIED_CATEGORIES.map((cat) => {
        const Icon = IconMap[cat.icon];
        const colors = colorMap[cat.value] ?? 'bg-gray-50 text-gray-600';
        return (
          <Link
            key={cat.value}
            href={`/classifieds/${cat.value}`}
            className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-sm transition-all text-center"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${colors}`}>
              {Icon && <Icon className="w-5 h-5" />}
            </div>
            <span className="text-xs font-medium text-text-primary leading-tight">{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
