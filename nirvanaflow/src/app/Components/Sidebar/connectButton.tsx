"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import api from "@/lib/api-config";
import { UpcomingEvents } from "./upcomingEvents";
import { PriorityEmail } from "./priorityEmail";

export default function GoogleConnect() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/api/auth/google/status");
        setConnected(res.data.connected);
      } catch {
        setConnected(false);
      }
    };

    checkStatus();
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/google");
      window.location.href = res.data.url;
    } catch (err) {
      console.error("OAuth error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (connected === null) {
    return (
      <div className="text-sm text-zinc-500 px-4 py-2">
        Checking connection...
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-white font-medium text-lg">Connect Google</h3>
              <p className="text-zinc-400 text-sm">
                Sync your Gmail and Calendar
              </p>
            </div>

            <Button
              onClick={handleConnect}
              disabled={loading}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white border-0 h-12 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Connecting
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PriorityEmail />
      <UpcomingEvents />
    </div>
  );
}
