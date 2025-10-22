"use client";

import { Mail, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api-config";

interface PriorityEmailData {
  id: string;
  subject: string;
  from: string;
  importanceScore: number;
  isUnread: boolean;
}

interface EmailApiResponse {
  mostImportantEmail: PriorityEmailData | null;
  totalEmails: number;
  lastUpdated: string;
  nextUpdate?: string;
  importanceThreshold?: number;
  message?: string;
}

export function PriorityEmail() {
  const [emailData, setEmailData] = useState<PriorityEmailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmails, setTotalEmails] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPriorityEmail = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await api.get<EmailApiResponse>("/api/sync/mail");
      const data = response.data;

      setEmailData(data.mostImportantEmail);
      setTotalEmails(data.totalEmails);
    } catch (err) {
      let errorMessage = "Failed to fetch priority email";

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          errorMessage = "Authentication required";
        } else if (err.response?.status === 403) {
          errorMessage = "Insufficient permissions";
        } else if (err.response?.status === 429) {
          errorMessage = "Rate limit exceeded";
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.code === "ECONNABORTED") {
          errorMessage = "Request timeout";
        }
      }

      setError(errorMessage);
      console.error("Priority email fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPriorityEmail();
  }, []);

  const handleRefresh = () => {
    fetchPriorityEmail(true);
  };

  const formatSender = (from: string) => {
    const match = from.match(/^(.+?)\s*<.*>$/);
    if (match) {
      return match[1].replace(/"/g, "").trim();
    }
    return from.length > 25 ? from.substring(0, 25) + "…" : from;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-zinc-400" />
          <span className="text-sm font-medium text-white">Priority Email</span>
          {totalEmails > 0 && (
            <span className="text-xs text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded-full">
              {totalEmails}
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-all duration-200 disabled:opacity-40 hover:bg-white/5 px-2 py-1 rounded-lg active:scale-95"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          <span className="font-medium">
            {refreshing ? "Syncing" : "Refresh"}
          </span>
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
            <div className="text-sm text-red-400 flex items-center gap-2 py-2">
              <AlertCircle size={16} />
              <span className="font-medium">{error}</span>
            </div>
          ) : !emailData ? (
            <div className="text-sm text-zinc-500 text-center py-4 font-medium">
              No priority emails
            </div>
          ) : (
            <div className="relative pl-3  rounded-sm">
              <h4 className="text-white text-sm font-semibold leading-tight line-clamp-2">
                {emailData.subject}
              </h4>
              <p className="text-zinc-400 text-xs mt-1 font-medium">
                {formatSender(emailData.from)}
              </p>
              {emailData.isUnread && (
                <div className="inline-flex mt-2">
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full font-medium border border-blue-500/20">
                    Unread
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
