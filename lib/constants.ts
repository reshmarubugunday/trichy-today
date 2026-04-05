import { NewsCategory } from '@/types/news';
import { ClassifiedCategory } from '@/types/classifieds';

export const NEWS_CATEGORIES: { value: NewsCategory; label: string; labelTamil: string }[] = [
  { value: 'local', label: 'Local', labelTamil: 'உள்ளூர்' },
  { value: 'business', label: 'Business', labelTamil: 'வணிகம்' },
  { value: 'entertainment', label: 'Entertainment', labelTamil: 'பொழுதுபோக்கு' },
  { value: 'sports', label: 'Sports', labelTamil: 'விளையாட்டு' },
  { value: 'politics', label: 'Politics', labelTamil: 'அரசியல்' },
  { value: 'education', label: 'Education', labelTamil: 'கல்வி' },
  { value: 'health', label: 'Health', labelTamil: 'சுகாதாரம்' },
];

export const CLASSIFIED_CATEGORIES: {
  value: ClassifiedCategory;
  label: string;
  icon: string;
  subCategories: string[];
}[] = [
  {
    value: 'jobs',
    label: 'Jobs',
    icon: 'Briefcase',
    subCategories: ['IT / Software', 'Engineering', 'Healthcare', 'Teaching', 'Sales', 'Other'],
  },
  {
    value: 'real-estate',
    label: 'Real Estate',
    icon: 'Home',
    subCategories: ['Apartment', 'House', 'Land / Plot', 'Commercial', 'PG / Hostel'],
  },
  {
    value: 'vehicles',
    label: 'Vehicles',
    icon: 'Car',
    subCategories: ['Cars', 'Two-Wheelers', 'Auto Parts', 'Trucks', 'Other'],
  },
  {
    value: 'electronics',
    label: 'Electronics',
    icon: 'Smartphone',
    subCategories: ['Mobile Phones', 'Laptops', 'TVs', 'Cameras', 'Other'],
  },
  {
    value: 'services',
    label: 'Services',
    icon: 'Wrench',
    subCategories: ['Home Services', 'Tutoring', 'Event Services', 'Transport', 'Other'],
  },
  {
    value: 'matrimony',
    label: 'Matrimony',
    icon: 'Heart',
    subCategories: ['Bride', 'Groom'],
  },
  {
    value: 'education',
    label: 'Education',
    icon: 'GraduationCap',
    subCategories: ['Coaching', 'Courses', 'Schools', 'Colleges'],
  },
  {
    value: 'other',
    label: 'Others',
    icon: 'LayoutGrid',
    subCategories: ['Furniture', 'Clothing', 'Books', 'Sports', 'Other'],
  },
];

export const TRICHY_AREAS = [
  'Srirangam',
  'Woraiyur',
  'Ariyamangalam',
  'Thillai Nagar',
  'KK Nagar',
  'Tennur',
  'Cantonment',
  'Teppakulam',
  'Puthur',
  'Chatram Bus Stand',
  'Golden Rock',
  'Ponmalai',
  'Palakkarai',
  'Chinthamani',
  'Mannarpuram',
  'Karumandapam',
  'Others',
];
