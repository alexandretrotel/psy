"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { addMessageToChat, getIsTodayChat } from "@/lib/chat";
import { Chat } from "@/lib/db";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";

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

  return (
    <div className="relative mx-auto flex h-full max-w-4xl flex-1 flex-col">
      <ScrollArea className="bg-background/50 flex-1">
        {messages.length > 0 ? (
          <ul className="space-y-4 pb-24">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </ul>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Start the conversation!
          </div>
        )}
      </ScrollArea>

      <div className="sticky inset-x-0 bottom-4 w-full max-w-4xl">
        <ChatInput
          input={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onStop={stop}
          status={status}
          disabled={!chat || !isTodayChat}
        />
      </div>
    </div>
  );
}
