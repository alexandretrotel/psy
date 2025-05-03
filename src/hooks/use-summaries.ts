"use client";

import { getAllSummaries } from "@/lib/chat";
import { Summary } from "@/lib/db";
import { useEffect, useState } from "react";

export const useSummaries = () => {
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const allSummaries = await getAllSummaries();
      setSummaries(allSummaries);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch summaries.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return { summaries, setSummaries, loading, error, fetchSummaries };
};
