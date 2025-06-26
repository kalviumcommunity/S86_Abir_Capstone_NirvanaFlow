'use client';


import { ProjectDropdown } from "../Dropdown/projectdropdown"; 
import GoogleConnect from "./connectButton";
import { UserProfile } from "./userProfile";
import AuthContextProvider from '@/lib/context/AuthContext';



export function Sidebar() {
  return (
    <aside
      
      className="w-64 bg-gradient-to-bl to-zinc-950  via-zinc-900 to-zinc-950 p-6 border-l border-zinc-800 flex flex-col justify-between pb-5 pt-5  overflow-x-hidden "
    >
    
      <div className=" flex flex-col gap-2">
        <ProjectDropdown   />
        <GoogleConnect />
      </div>
      <AuthContextProvider >
        <UserProfile />
      </AuthContextProvider>
    </aside>
  );
}