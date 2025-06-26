"use client";

import { Mail, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

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

      const response = await axios.get<EmailApiResponse>("/api/sync/mail");

      const data = response.data;

      setEmailData(data.mostImportantEmail);
      setTotalEmails(data.totalEmails);
    } catch (err) {
      let errorMessage = "Failed to fetch priority email";

      if (axios.isAxiosError(err)) {
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

    return from.length > 30 ? from.substring(0, 30) + "..." : from;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6 shadow-2xs"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Mail size={16} />
          <span>Priority Email</span>
          {totalEmails > 0 && (
            <span className="text-xs text-zinc-500">{totalEmails} total</span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Syncing..." : "Refresh"}
        </button>
      </div>

      <Card className="bg-zinc-900 border-none hover:bg-zinc-800/50 transition-colors duration-200 cursor-pointer">
        <CardContent className="p-3">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              <span className="ml-2 text-sm text-zinc-400">
                Loading priority email...
              </span>
            </div>
          ) : error ? (
            <div className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          ) : !emailData ? (
            <div className="text-sm text-zinc-400 text-center py-2">
              No priority emails found
            </div>
          ) : (
            <div
              className="relative pl-2 border-l-4"
              style={{
                borderColor:
                  emailData.importanceScore >= 50
                    ? "#f87171"
                    : emailData.importanceScore >= 30
                    ? "#fb923c"
                    : "transparent",
              }}
            >
              <div className="text-white text-sm font-medium leading-snug">
                {emailData.subject}
              </div>
              <div className="text-zinc-400 text-xs mt-0.5">
                From: {formatSender(emailData.from)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
