"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Chat } from "@/lib/db";
import { useChatStore } from "@/stores/chat.store";
import { motion } from "motion/react";

interface ChatSidebarProps {
  chats: Chat[];
}

export function ChatSidebar({ chats }: ChatSidebarProps) {
  const { selectedChatId, setSelectedChatId } = useChatStore();

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id!);
    }
  }, [chats, selectedChatId, setSelectedChatId]);

  return (
    <Sidebar className="w-64 border-r">
      <ScrollArea className="h-full p-4">
        <h2 className="mb-4 text-lg font-semibold">Chat History</h2>

        {chats.length === 0 ? (
          <p className="text-muted-foreground">No chats yet.</p>
        ) : (
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li key={chat.id}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedChatId === chat.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedChatId(chat.id!)}
                  >
                    {format(new Date(chat.date), "MMM d, yyyy")}
                  </Button>
                </motion.div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </Sidebar>
  );
}
