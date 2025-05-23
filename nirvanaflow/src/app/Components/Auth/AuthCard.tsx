'use client';


import { motion } from 'framer-motion';
import SignUpButton from './SignUpbutton';
import AuthContextProvider from '@/lib/context/AuthContext';

export default function AuthCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-lg rounded-2xl p-8 shadow-lg w-full max-w-md"
    >
      <div className="mb-6 space-y-2 text-center">
        <h2 className="text-3xl font-semibold text-white">Create an account</h2>
        <p className="text-zinc-400 text-sm">
          Use your Google account to continue
        </p>
      </div>

      <AuthContextProvider>
        <SignUpButton />
      </AuthContextProvider>




      <div className="mt-6 text-xs text-center text-zinc-500">
        By continuing, you agree to our <span className="underline cursor-pointer hover:text-white">Terms</span> and <span className="underline cursor-pointer hover:text-white">Privacy</span>.
      </div>
    </motion.div>
  );
}
