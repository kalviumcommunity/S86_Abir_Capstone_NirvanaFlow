'use client';

import { motion } from "framer-motion";
import { ProjectDropdown } from "../Dropdown/projectdropdown"; 
import { PriorityEmail } from "./priorityEmail";
import { UpcomingEvents } from "./upcomingEvents"; 
import { UserProfile } from "./userProfile";



export function Sidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 bg-zinc-950 p-6 border-l border-zinc-800 flex flex-col justify-between"
    >
      <div>
        <ProjectDropdown  />
        <PriorityEmail />
        <UpcomingEvents />
      </div>
      <UserProfile />
    </motion.aside>
  );
}