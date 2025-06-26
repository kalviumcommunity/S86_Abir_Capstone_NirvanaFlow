'use client';

import { CalendarDays, Clock,  Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
}

interface CalendarApiResponse {
  events: CalendarEvent[];
  date: string;
  total: number;
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateInfo, setDateInfo] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get<CalendarApiResponse>('/api/sync/calendar', {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      setEvents(data.events);
      setDateInfo(data.date);
      
    } catch (err) {
      let errorMessage = 'Failed to fetch calendar events';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Authentication required';
        } else if (err.response?.status === 403) {
          errorMessage = 'Insufficient calendar permissions';
        } else if (err.response?.status === 429) {
          errorMessage = 'Rate limit exceeded';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout';
        }
      }
      
      setError(errorMessage);
      console.error('Calendar events fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = () => {
    fetchEvents(true);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}min`;
    }
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  };

  const isEventSoon = (startTime: string) => {
    const eventStart = new Date(startTime);
    const now = new Date();
    const timeDiff = eventStart.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    return minutesDiff > 0 && minutesDiff <= 30; 
  };

  const getNextEvent = () => {
    console.log(events)
    const now = new Date();
    return events.find(event => new Date(event.start) > now);
  };

  const nextEvent = getNextEvent();

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
          <span>Upcoming Events</span>
          
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      <Card className="bg-zinc-900 border-none hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              <span className="ml-2 text-sm text-zinc-400">Loading events...</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={16} />
              <span>Error: {error}</span>
            </div>
          ) : !nextEvent ? (
            <div className="text-sm text-zinc-400 text-center py-2">
              No upcoming events today
            </div>
          ) : (
            <div className="space-y-3">
              {/* Event Title */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-medium text-sm leading-tight flex-1">
                  {nextEvent.title}
                </h3>
                {isEventSoon(nextEvent.start) && (
                  <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                    <AlertCircle size={10} />
                    <span className="text-xs font-medium">Soon</span>
                  </div>
                )}
              </div>

              {/* Event Time */}
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-zinc-400" />
                <span className="text-zinc-300 text-xs font-medium">
                  {formatTime(nextEvent.start)} – {formatTime(nextEvent.end)}
                </span>
                <span className="text-zinc-500 text-xs">
                  ({formatDuration(nextEvent.start, nextEvent.end)})
                </span>
              </div>

              
              
             

              {/* Additional Events Indicator */}
              {events.length > 1 && (
                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500">
                    +{events.length - 1} more event{events.length > 2 ? 's' : ''} today
                  </span>
                  <span className="text-zinc-500">
                    {dateInfo}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}