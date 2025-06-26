'use client';

import { useState } from "react";
import { ChevronDown, Trash2, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEventFilter } from "@/lib/context/EventFilterContext";
import { IEvent } from "@/models/Events";

export function ProjectDropdown() {
  const { 
    selectedEventId, 
    setSelectedEventId, 
    selectedEventTitle,
    events, 
    isLoadingEvents,
    deleteEvent 
  } = useEventFilter();
  
  const [open, setOpen] = useState(false);

  const handleEventChange = (event: IEvent | null) => {
    if (event) {
      setSelectedEventId(event._id);
    } else {
      // Handle "All Events" selection
      setSelectedEventId(null);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="text-xl font-semibold mb-4 flex items-center justify-between w-full overflow-x-hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            disabled={isLoadingEvents}
            className={`justify-between text-xl font-semibold text-white bg-transparent border-none hover:bg-transparent p-0 h-auto ${
              isLoadingEvents ? 'opacity-50 cursor-not-allowed' : 'hover:text-zinc-200'
            } transition-colors duration-200 focus:outline-none`}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <span>{isLoadingEvents ? 'Loading...' : selectedEventTitle}</span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-zinc-400" />
              </motion.div>
            </motion.div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-zinc-900 border-zinc-700 shadow-xl">
          <Command className="bg-zinc-900">
            <CommandInput 
              placeholder="Search events..." 
              className="text-white placeholder:text-zinc-400 border-none bg-zinc-900"
            />
            <CommandEmpty className="text-zinc-400 p-4 text-center">
              {isLoadingEvents ? "Loading events..." : "No events found."}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {/* Add "All Events" option */}
              <CommandItem
                value="all-events"
                onSelect={() => handleEventChange(null)}
                className={`group cursor-pointer transition-colors duration-200 text-white hover:!bg-zinc-800 hover:!text-white focus:!bg-zinc-800 focus:!text-white flex items-center justify-between w-full ${
                  selectedEventId === null ? "bg-zinc-800" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Check
                    className={`h-4 w-4 ${
                      selectedEventId === null ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span>All Events</span>
                </div>
              </CommandItem>
              
              {events.map((event) => (
                <CommandItem
                  key={event._id}
                  value={event.title}
                  onSelect={() => handleEventChange(event)}
                  className={`group cursor-pointer transition-colors duration-200 text-white hover:!bg-zinc-800 hover:!text-white focus:!bg-zinc-800 focus:!text-white flex items-center justify-between w-full ${
                    selectedEventId === event._id ? "bg-zinc-800" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={`h-4 w-4 ${
                        selectedEventId === event._id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span>{event.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(event._id, e)}
                    className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete event"
                  >
                    <Trash2 size={16} className="text-red-500 hover:text-red-400" />
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}