"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, SquareIcon } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) => void;
  onStop: () => void;
  status: "streaming" | "submitted" | "ready" | "error";
  disabled?: boolean;
}

export function ChatInput({
  input,
  onChange,
  onSubmit,
  onStop,
  status,
  disabled = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const isStreaming = status === "streaming";

  return (
    <form
      onSubmit={(e) => {
        if (isStreaming) {
          onStop();
        } else {
          onSubmit(e);
        }
      }}
      className="bg-muted flex w-full items-end gap-2 rounded-xl border p-4"
    >
      <Textarea
        value={input}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[48px] flex-1 resize-none border-none bg-transparent shadow-none focus-visible:ring-0"
        disabled={disabled}
      />

      <Button
        type="submit"
        disabled={(!input && !isStreaming) || disabled}
        size="icon"
        className="shrink-0"
      >
        {isStreaming ? (
          <SquareIcon className="fill-primary-foreground h-4 w-4" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
