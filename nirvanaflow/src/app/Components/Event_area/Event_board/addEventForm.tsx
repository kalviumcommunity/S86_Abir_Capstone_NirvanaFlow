'use client';

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Type, FileText, Plus, Loader2 } from "lucide-react";
import { useEventFilter } from "@/lib/context/EventFilterContext";

export default function AddEventForm() {
  const { addEvent } = useEventFilter();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addEvent({
        title: title.trim(),
        description: description.trim(),
        deadline,
      });
      
      setOpen(false);
      setTitle("");
      setDescription("");
      setDeadline("");
    } catch (err) {
      console.error("Error adding event", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="bg-white/5 backdrop-blur-sm border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] rounded-xl font-medium "
        >
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl p-0 overflow-hidden rounded-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="bg-gradient-to-br from-white/5 to-white/0 p-6 pb-4 border-b border-white/5">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Create New Event
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                <Type className="w-4 h-4" />
                <span>Title</span>
              </div>
              <Input
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-zinc-500 focus:border-white/20 focus:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/10 rounded-xl h-12 font-medium"
                autoFocus
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </div>
              <Textarea
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-zinc-500 focus:border-white/20 focus:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/10 resize-none min-h-[90px] rounded-xl font-medium"
                rows={3}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span>Deadline</span>
              </div>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-white/5 backdrop-blur-sm border-white/10 text-white focus:border-white/20 focus:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/10 rounded-xl h-12 font-medium [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                min={new Date().toISOString().slice(0, 16)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex justify-end gap-3 pt-6 border-t border-white/5"
            >
              <Button 
                type="button" 
                variant="ghost" 
                onClick={resetForm}
                className="text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-xl font-medium px-6 h-11"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                disabled={!title.trim() || isSubmitting}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/15 hover:border-white/30 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-6 h-11 hover:scale-[1.02] active:scale-[0.98]"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="create"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      Create Event
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}