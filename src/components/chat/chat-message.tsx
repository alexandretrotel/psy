"use client";

import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { Markdown } from "../wrappers/markdown";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <li className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg",
          isUser
            ? "bg-muted text-foreground p-3"
            : "text-foreground bg-transparent",
        )}
      >
        {isUser ? (
          <div className="text-sm">{message.content}</div>
        ) : (
          <Markdown text={message.content} />
        )}
      </div>
    </li>
  );
}
