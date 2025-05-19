'use client';
import { FcGoogle } from 'react-icons/fc';

export default function SignUpButton(){
    return(
        
      <button className="flex items-center justify-center w-full gap-3 border border-zinc-700 py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-all hover:shadow-md">
        <FcGoogle className="text-2xl" />
        <span className="text-white font-medium">Sign up with Google</span>
      </button>
    )
}