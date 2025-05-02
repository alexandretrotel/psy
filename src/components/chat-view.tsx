"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat.store";
import { addMessageToChat, getIsTodayChat } from "@/lib/chat";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-chats";
import { Loader2Icon, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Markdown } from "./wrappers/markdown";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatViewProps {
  onChatsUpdated: () => void;
}

export function ChatView({ onChatsUpdated }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chat = chats.find((chat) => chat.id === selectedChatId) || null;

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center">
        Please select a chat.
      </div>
    );
  }

  const isTodayChat = getIsTodayChat(chat);

  return (
    <div className="flex h-full flex-1 flex-col gap-4 p-4">
      <ScrollArea className="bg-background/50 flex-1">
        <div className="p-4">
          {messages.length > 0 ? (
            <ul className="space-y-4">
              {messages.map((msg, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg",
                      msg.role === "user"
                        ? "bg-muted text-foreground p-3"
                        : "text-foreground bg-transparent",
                    )}
                  >
                    {msg.role === "user" ? (
                      <div className="text-sm">{msg.content}</div>
                    ) : (
                      <Markdown text={msg.content} />
                    )}
                  </div>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              {chat ? "Start the conversation!" : "Please select a chat."}
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="bg-muted flex w-full items-end gap-2 rounded-md border p-2"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="min-h-[48px] flex-1 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
          disabled={status === "streaming" || !chat}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={!input || status === "streaming" || !chat || !isTodayChat}
          size="icon"
          className="shrink-0"
        >
          {status === "streaming" ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
