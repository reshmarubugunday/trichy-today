import { EmailAuthForm } from '@/components/auth/EmailAuthForm';

interface Props {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Log in</h1>
      <EmailAuthForm
        mode="login"
        next={next}
        confirmError={error === 'confirm-failed'}
      />
    </div>
  );
}
