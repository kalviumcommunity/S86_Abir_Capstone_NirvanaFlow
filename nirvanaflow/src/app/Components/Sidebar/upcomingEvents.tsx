'use client';

import { CalendarDays, Clock, Loader2, RefreshCw, AlertCircle } from "lucide-react";
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
        timeout: 10000,
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
    const now = new Date();
    return events.find(event => new Date(event.start) > now);
  };

  const nextEvent = getNextEvent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-zinc-400" />
          <span className="text-sm font-medium text-white">Upcoming Events</span>
          {events.length > 0 && (
            <span className="text-xs text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-full">
              {events.length}
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all duration-200 disabled:opacity-40 hover:bg-white/5 px-2 py-1 rounded-lg active:scale-95"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          <span className="font-medium">{refreshing ? 'Syncing' : 'Refresh'}</span>
        </button>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] cursor-pointer rounded-2xl">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              <span className="ml-3 text-sm text-zinc-400 font-medium">
                Loading...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-sm text-red-400 py-2">
              <AlertCircle size={16} />
              <span className="font-medium">{error}</span>
            </div>
          ) : !nextEvent ? (
            <div className="text-sm text-zinc-500 text-center py-4 font-medium">
              No upcoming events
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-white font-semibold text-sm leading-tight flex-1 line-clamp-2">
                  {nextEvent.title}
                </h3>
                {isEventSoon(nextEvent.start) && (
                  <div className="flex items-center gap-1 bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/20 shrink-0">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold">Soon</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  <Clock size={11} />
                  <span className="text-xs font-semibold">
                    {formatTime(nextEvent.start)}
                  </span>
                </div>
                <span className="text-zinc-500 text-xs">→</span>
                <span className="text-zinc-300 text-xs font-medium">
                  {formatTime(nextEvent.end)}
                </span>
                <span className="text-zinc-500 text-xs ml-auto">
                  {formatDuration(nextEvent.start, nextEvent.end)}
                </span>
              </div>

              {events.length > 1 && (
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-zinc-500 font-medium">
                    +{events.length - 1} more today
                  </span>
                  {dateInfo && (
                    <span className="text-xs text-zinc-600 bg-zinc-800/40 px-2 py-0.5 rounded-md">
                      {dateInfo}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}