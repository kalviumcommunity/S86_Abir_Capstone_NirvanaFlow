'use client';

import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function PriorityEmail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
        <Mail size={16} />
        <span>Priority Email</span>
      </div>
      <Card className="bg-zinc-900 border-none hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
        <CardContent className="p-4 text-sm text-white">
          Reply to investors feedback.
        </CardContent>
      </Card>
    </motion.div>
  );
}