import { PostClassifiedForm } from '@/components/forms/PostClassifiedForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Post a Free Classified Ad' };

export default function PostClassifiedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Post a Free Ad</h1>
          <p className="text-text-secondary">Reach thousands of Trichy residents. Free for individuals.</p>
        </div>
        <PostClassifiedForm />
      </div>
    </div>
  );
}
