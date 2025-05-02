"use client";

import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addMessageToChat, getIsTodayChat } from "@/lib/chat";
import { toast } from "sonner";
import { Send, SquareIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Markdown } from "./wrappers/markdown";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@/lib/db";

interface ChatViewProps {
  chat: Chat | null;
}

export function ChatView({ chat }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, handleSubmit, status, input, handleInputChange, stop } =
    useChat({
      id: chat?.id,
      initialMessages: chat?.messages || [],
      sendExtraMessageFields: true,
      onFinish: async (aiResponse) => {
        await addMessageToChat(input, aiResponse.content);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "An error occurred",
        );
      },
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex h-full items-center justify-center">
        Please select a chat.
      </div>
    );
  }

  const isTodayChat = getIsTodayChat(chat);

  const handleChatSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent,
  ) => {
    e.preventDefault();

    if (status === "streaming") {
      stop();
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative mx-auto flex h-full max-w-4xl flex-1 flex-col gap-4">
      <ScrollArea className="bg-background/50 flex-1">
        {messages.length > 0 ? (
          <ul className="space-y-4 pb-24">
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
      </ScrollArea>

      <div className="sticky inset-x-0 bottom-4 w-full max-w-4xl">
        <form
          onSubmit={handleChatSubmit}
          className="bg-muted flex w-full items-end gap-2 rounded-xl border p-4"
        >
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="min-h-[48px] flex-1 resize-none border-none bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
            disabled={!chat}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChatSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={
              (!input && status !== "streaming") || !chat || !isTodayChat
            }
            size="icon"
            className="shrink-0"
          >
            {status === "streaming" ? (
              <SquareIcon className="fill-primary-foreground h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
