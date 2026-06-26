import { SignIn } from '@clerk/nextjs';
import { AuthHeader } from '@/components/layout/Header';
import { clerkAppearance } from '@/lib/clerk-appearance';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AuthHeader />
        <div className="bg-bg-surface rounded-xl shadow-modal border border-border-subtle p-8 w-full">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </div>
  );
}
