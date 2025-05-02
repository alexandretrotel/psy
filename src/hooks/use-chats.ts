"use client";

import { getAllChats } from "@/lib/chat";
import { Chat } from "@/lib/db";
import { useEffect, useState } from "react";

export const useChats = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const allChats = await getAllChats();
      setChats(allChats);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch chats.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return {
    chats,
    setChats,
    currentChat,
    setCurrentChat,
    loading,
    error,
    fetchChats,
  };
};
