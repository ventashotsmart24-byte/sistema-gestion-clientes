
'use client';

import { useAuth } from '@/components/auth-provider';
import { LoginForm } from '@/components/login-form';
import { Dashboard } from '@/components/dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
}
