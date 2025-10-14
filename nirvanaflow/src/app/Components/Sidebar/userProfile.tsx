'use client';

import { User, LogOut, Settings } from "lucide-react";
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
  
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 pt-4 border-t border-white/5"
      >
        <div className="flex items-center gap-3 p-3 rounded-xl ">
          <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-24 bg-white/10 rounded-md animate-pulse" />
            <div className="h-3 w-32 bg-white/5 rounded-md animate-pulse" />
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
        className="mt-6 pt-4 border-t border-white/5"
      >
        <div className="text-red-400 text-sm p-3 bg-red-500/5 rounded-xl border border-red-500/10 ">
          <span className="font-medium">Auth Error:</span> {error}
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        className="mt-6 pt-4 border-t border-white/5"
      >
        <button
          onClick={handleSignIn}
          className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
            <User size={18} className="text-zinc-300" />
          </div>
          <span className="text-white font-medium">Sign In</span>
        </button>
      </motion.div>
    );
  }

  const userEmail = user.email || "user@example.com";
  const userName = user.displayName || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      className="mt-6 pt-4 border-t border-white/5"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] group focus:outline-none focus:ring-2 focus:ring-white/20">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-200 cursor-pointer">
              <User size={18} className="text-white" />
            </div>
            <div className="flex flex-col items-start overflow-hidden flex-1 min-w-0">
              <span className="text-white font-semibold truncate w-full text-sm">
                {userName}
              </span>
              <span className="text-xs text-zinc-400 truncate w-full font-medium">
                {userEmail}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="bg-black/90 backdrop-blur-xl border-white/10 shadow-2xl w-64 rounded-2xl p-2"
          sideOffset={8}
        >
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <div className="text-white font-semibold text-sm truncate">
              {userName}
            </div>
            <div className="text-zinc-400 text-xs truncate">
              {userEmail}
            </div>
          </div>
          
          <DropdownMenuItem className="text-zinc-300 hover:bg-white/10 focus:bg-white/10 hover:text-white focus:text-white cursor-pointer rounded-lg mx-1 my-0.5 transition-colors">
            <Settings className="mr-3 h-4 w-4" />
            <span className="font-medium">Profile Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/5 my-2" />
          
          <DropdownMenuItem
            onClick={handleLogOut}
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer focus:bg-red-500/10 focus:text-red-300 rounded-lg mx-1 my-0.5 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}