'use client';

import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";


export function UpcomingEvents() {
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <CalendarDays size={16} />
          <span>Upcoming Event</span>
        </div>
      </div>
      <Card className="bg-zinc-900 border-none hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
        <CardContent className="p-4 text-sm text-white">
          3:00 PM – Product Review Call
        </CardContent>
      </Card>
    </motion.div>
  );
}