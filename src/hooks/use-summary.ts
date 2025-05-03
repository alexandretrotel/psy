"use client";

import { getLatestSummary } from "@/lib/chat";
import { useEffect, useState } from "react";

export const useSummary = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      setSummary((await getLatestSummary()) || "No summary yet.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch summary.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, setSummary, loading, error, fetchSummary };
};
