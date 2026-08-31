import { EmailAuthForm } from '@/components/auth/EmailAuthForm';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Log in</h1>
      <EmailAuthForm mode="login" />
    </div>
  );
}
