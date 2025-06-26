'use client';

import { User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from '@/lib/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function UserProfile() {
  const { user, loading, error, handleLogOut, handleSignIn } = useAuth();
  
  
  console.log('UserProfile Debug:', {
    user,
    loading,
    error,
    userExists: !!user,
    userEmail: user?.email,
    userName: user?.displayName
  });
  
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 pt-4 border-t border-zinc-800"
      >
        <div className="flex items-center gap-3 text-sm text-zinc-400 p-2">
          <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-zinc-700 rounded animate-pulse" />
            <div className="h-3 w-32 bg-zinc-700 rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 pt-4 border-t border-zinc-800"
      >
        <div className="text-red-400 text-sm p-2">
          Auth Error: {error}
        </div>
      </motion.div>
    );
  }

  
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 pt-4 border-t border-zinc-800"
      >
        <button
          onClick={handleSignIn}
          className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors duration-200 w-full p-2 rounded-lg hover:bg-zinc-800/50 focus:outline-none"
        >
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
            <User size={16} className="text-zinc-300" />
          </div>
          <span className="text-zinc-200">Sign In</span>
        </button>
      </motion.div>
    );
  }

  const userEmail = user.email || "user@example.com";
  const userName = user.displayName || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 pt-4 border-t border-zinc-800"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors duration-200 w-full p-2 rounded-lg hover:bg-zinc-800/50 focus:outline-none"
          >
            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
              <User size={16} className="text-zinc-300" />
            </div>
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-zinc-200 font-medium truncate w-full">
                {userName}
              </span>
              <span className="text-xs text-zinc-500 truncate w-full">
                {userEmail}
              </span>
            </div>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="bg-zinc-900 border-zinc-700 shadow-xl w-56"
        >
          <DropdownMenuItem className="text-zinc-300  focus:bg-zinc-800/80 focus:text-white cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-700" />
          <DropdownMenuItem
            onClick={handleLogOut}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer focus:bg-red-500/10 focus:text-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}