'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { IEvent } from '@/models/Events';

interface EventFilterContextType {
  // Event selection
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedEventTitle: string;
  
  // Events data
  events: IEvent[];
  isLoadingEvents: boolean;
  
  // Actions
  fetchEvents: () => Promise<void>;
  addEvent: (eventData: { title: string; description: string; deadline: string }) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  // Refresh triggers for dependent components
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const EventFilterContext = createContext<EventFilterContextType | undefined>(undefined);

export function EventFilterProvider({ children }: { children: ReactNode }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("All Events");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
      
      // Update selected title if current event still exists
      if (selectedEventId) {
        const currentEvent = response.data.find((e: IEvent) => e._id === selectedEventId);
        if (currentEvent) {
          setSelectedEventTitle(currentEvent.title);
        } else {
          // Event was deleted, reset selection
          setSelectedEventId(null);
          setSelectedEventTitle("All Events");
        }
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const addEvent = async (eventData: { title: string; description: string; deadline: string }) => {
    try {
      const response = await axios.post("/api/events", {
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        deadline: eventData.deadline,
      });
      
      // Add the new event to local state
      const newEvent = response.data;
      setEvents(prev => [...prev, newEvent]);
      
      toast.success('Event created successfully');
      triggerRefresh(); // Notify dependent components
      
      return response.data;
    } catch (error) {
      console.error("Error adding event", error);
      toast.error('Failed to create event');
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await axios.delete(`/api/events/${eventId}`);
      
      // Remove from local state
      setEvents(prev => prev.filter(e => e._id !== eventId));
      
      // If deleted event was selected, reset selection
      if (selectedEventId === eventId) {
        setSelectedEventId(null);
        setSelectedEventTitle("All Events");
      }
      
      toast.success("Event deleted successfully");
      triggerRefresh(); // Notify dependent components
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error('Failed to delete event');
      throw error;
    }
  };

  // Handle event selection changes
  const handleSetSelectedEventId = (id: string | null) => {
    setSelectedEventId(id);
    if (id) {
      const event = events.find(e => e._id === id);
      setSelectedEventTitle(event?.title || "Unknown Event");
    } else {
      setSelectedEventTitle("All Events");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  const value: EventFilterContextType = {
    selectedEventId,
    setSelectedEventId: handleSetSelectedEventId,
    selectedEventTitle,
    events,
    isLoadingEvents,
    fetchEvents,
    addEvent,
    deleteEvent,
    refreshTrigger,
    triggerRefresh,
  };

  return (
    <EventFilterContext.Provider value={value}>
      {children}
    </EventFilterContext.Provider>
  );
}

export function useEventFilter() {
  const context = useContext(EventFilterContext);
  if (context === undefined) {
    throw new Error('useEventFilter must be used within an EventFilterProvider');
  }
  return context;
}