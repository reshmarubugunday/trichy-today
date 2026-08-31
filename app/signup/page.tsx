import { EmailAuthForm } from '@/components/auth/EmailAuthForm';

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function SignupPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Sign up</h1>
      <EmailAuthForm mode="signup" defaultEmail={email} />
    </div>
  );
}
