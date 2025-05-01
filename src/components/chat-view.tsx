"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { addMessageToChat, getAllChats } from "@/lib/chat";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-chats";

interface ChatViewProps {
  onChatsUpdated: () => void;
}

export function ChatView({ onChatsUpdated }: ChatViewProps) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const { loading, setLoading } = useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { selectedChatId } = useChatStore();
  const { chats } = useChats();

  const chat = chats.find((chat) => chat.id === selectedChatId) || null;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleSubmit = async () => {
    if (!message) return;

    setLoading(true);
    try {
      const allChats = await getAllChats();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, chatHistory: allChats }),
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      let aiResponse = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          aiResponse += decoder.decode(value);
          setResponse(aiResponse);
        }
      }

      await addMessageToChat(message, aiResponse);

      setMessage("");
      setResponse("");
      onChatsUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
    setLoading(false);
  };

  return (
    <Card className="flex h-full flex-1 flex-col">
      <CardHeader>
        <CardTitle>{chat ? `Chat - ${chat.date}` : "Select a Chat"}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          {chat && chat.messages.length > 0 ? (
            <ul className="space-y-4 p-4">
              {chat.messages.map((msg, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2">
                    <strong className="text-primary">You:</strong> {msg.user}
                  </div>

                  <div className="text-muted-foreground">
                    <strong>AI:</strong> {msg.ai}
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground p-4">
              {chat ? "No messages yet." : "Please select a chat."}
            </p>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1"
            disabled={loading || !chat}
          />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSubmit}
              disabled={!message || loading || !chat}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </motion.div>
        </div>

        {response && (
          <motion.div
            className="text-muted-foreground mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <strong>AI (Preview):</strong> {response}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
