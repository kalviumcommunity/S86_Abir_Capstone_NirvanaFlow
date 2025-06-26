'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { UpcomingEvents } from "./upcomingEvents";
import { PriorityEmail } from "./priorityEmail";


export default function GoogleConnect() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get("/api/auth/google/status");
        setConnected(res.data.connected); // e.g., true/false
      } catch {
        setConnected(false);
      }
    };

    checkStatus();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/auth/google");
      window.location.href = res.data.url;
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (connected === null) {
    return <div className="text-sm text-zinc-400">Checking status...</div>;
  }

  if (!connected) {
    return (
      <Button
        onClick={handleConnect}
        className="w-full flex gap-2 items-center justify-center"
        disabled={loading}
      >
        {loading && <Loader2 className="animate-spin h-4 w-4" />}
        {loading ? "Connecting..." : "Connect Gmail & Calendar"}
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <PriorityEmail />
      <UpcomingEvents />
    </div>
  );
}
