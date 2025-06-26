'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpButton() {
  const { user, loading, handleSignIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`flex items-center justify-center w-full gap-3 py-3 px-4 rounded-xl transition-all border text-sm font-medium
        ${
          loading
            ? 'bg-zinc-800 border-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-white hover:shadow-md'
        }`}
    >
      <FcGoogle className="text-xl" />
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}
