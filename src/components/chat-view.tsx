"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { addMessageToChat } from "@/lib/chat";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-chats";
import { Loader2Icon } from "lucide-react";
import { useChat } from "@ai-sdk/react";

interface ChatViewProps {
  onChatsUpdated: () => void;
}

export function ChatView({ onChatsUpdated }: ChatViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { chats } = useChats();
  const { selectedChatId } = useChatStore();
  const { messages, handleSubmit, status, input, handleInputChange } = useChat({
    id: selectedChatId,
    initialMessages:
      chats.find((chat) => chat.id === selectedChatId)?.messages || [],
    sendExtraMessageFields: true,
    onFinish: async (aiResponse) => {
      await addMessageToChat(input, aiResponse.content);
      onChatsUpdated();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    },
  });

  const chat = chats.find((chat) => chat.id === selectedChatId) || null;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg, idx) => {
              if (msg.role === "user") {
                return (
                  <li key={idx}>
                    <div className="text-muted-foreground">
                      <strong>You:</strong> {msg.content}
                    </div>
                  </li>
                );
              }

              return (
                <li key={idx}>
                  <div className="text-muted-foreground">
                    <strong>AI:</strong> {msg.content}
                  </div>
                </li>
              );
            })}
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
            value={input}
            onChange={handleInputChange}
            placeholder="Share your thoughts..."
            className="h-28 pr-20"
            disabled={status === "streaming" || !chat}
          />
          <Button
            type="submit"
            disabled={!input || status === "streaming" || !chat}
            className="absolute right-2 bottom-2"
          >
            {status === "streaming" && (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            )}
            {status === "streaming" ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
