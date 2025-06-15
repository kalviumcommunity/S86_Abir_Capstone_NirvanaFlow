'use client';

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import axios from "axios";
import { IEvent } from '@/models/Events';

export function ProjectDropdown(
) {
  const [selectedEvent, setSelectedEvent] = useState<string>("Select Event");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (event: IEvent) => {
    setSelectedEvent(event.title);
  };

  return (
    <div className="text-xl font-semibold mb-4 flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.02 }}
            disabled={loading}
            className={`flex items-center gap-2 text-white ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:text-zinc-200'
            } transition-colors duration-200 focus:outline-none`}
          >
            <span>{loading ? 'Loading...' : selectedEvent}</span>
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-zinc-400" />
            </motion.div>
          </motion.button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start"
          className="bg-zinc-900 border-zinc-700 shadow-xl"
        >
          {loading ? (
            <DropdownMenuItem className="text-zinc-300 cursor-default">
              Fetching events...
            </DropdownMenuItem>
          ) : (
            events.map((event) => (
              <DropdownMenuItem
                key={event._id || event.createdAt.toString()}
                onClick={() => handleEventChange(event)}
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedEvent === event.title 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {event.title}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      
    </div>
  );
}
