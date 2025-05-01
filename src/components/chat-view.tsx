"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { addMessageToChat, getAllChats } from "@/lib/chat";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-chats";
import { Loader2Icon } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <div className="flex h-full flex-1 flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {chat && chat.messages.length > 0 ? (
          <ul className="space-y-4">
            {chat.messages.map((msg, idx) => (
              <li key={idx}>
                <div className="mb-2">
                  <strong className="text-primary">You:</strong> {msg.user}
                </div>

                <div className="text-muted-foreground">
                  <strong>AI:</strong> {msg.ai}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            {chat ? "No messages yet." : "Please select a chat."}
          </p>
        )}
      </ScrollArea>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="h-28 pr-20"
            disabled={loading || !chat}
          />
          <Button
            type="submit"
            disabled={!message || loading || !chat}
            className="absolute right-2 bottom-2"
          >
            {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>

      {response && (
        <div className="text-muted-foreground mt-4">
          <strong>AI (Preview):</strong> {response}
        </div>
      )}
    </div>
  );
}
