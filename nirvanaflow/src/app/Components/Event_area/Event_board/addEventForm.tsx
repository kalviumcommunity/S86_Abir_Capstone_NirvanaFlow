'use client';

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Type, FileText } from "lucide-react";
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
      
      // Reset form and close dialog
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
        <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          + Add Event
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md border-zinc-800 bg-zinc-950 shadow-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Create New Event
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Type className="w-4 h-4" />
                <span>Title</span>
              </div>
              <Input
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-800 transition-all duration-200 focus:ring-1 focus:ring-zinc-500/20"
                autoFocus
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </div>
              <Textarea
                placeholder="Add a description "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-800 transition-all duration-200 focus:ring-1 focus:ring-zinc-500/20 resize-none min-h-[80px]"
                rows={3}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Calendar className="w-4 h-4 " />
                <span>Deadline</span>
              </div>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-zinc-800/50 border-zinc-700 text-white focus:border-zinc-500 focus:bg-zinc-800 transition-all duration-200 focus:ring-1 focus:ring-zinc-500/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              className="flex justify-end gap-3 pt-6 border-t border-zinc-800"
            >
              <Button 
                type="button" 
                variant="ghost" 
                onClick={resetForm}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  disabled={!title.trim() || isSubmitting}
                  className="bg-white text-zinc-900 hover:bg-zinc-800/50 hover:text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-800 rounded-full bg-zinc-800 text-white"
                        />
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
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}