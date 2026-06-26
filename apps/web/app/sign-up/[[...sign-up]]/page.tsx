import { SignUp } from '@clerk/nextjs';
import { AuthHeader } from '@/components/layout/Header';
import { clerkAppearance } from '@/lib/clerk-appearance';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <AuthHeader />
        <div className="bg-bg-surface rounded-xl shadow-modal border border-border-subtle p-8 w-full">
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            appearance={clerkAppearance}
          />
        </div>
      </div>
    </div>
  );
}
