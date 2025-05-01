"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { Sidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Chat } from "@/lib/db";
import { useChatStore } from "@/stores/chat.store";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface ChatSidebarProps {
  chats: Chat[];
}

export function ChatSidebar({ chats }: ChatSidebarProps) {
  const { selectedChatId, setSelectedChatId } = useChatStore();
  const pathname = usePathname();

  useEffect(() => {
    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id!);
    }
  }, [chats, selectedChatId, setSelectedChatId]);

  const isAnotherPage = pathname !== "/";

  return (
    <Sidebar className="w-64 border-r">
      <ScrollArea className="h-full p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <ModeToggle />
        </div>

        {chats.length === 0 ? (
          <p className="text-muted-foreground">No chats yet.</p>
        ) : (
          <ul className="space-y-2">
            <li>
              <Button
                variant={isAnotherPage ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/summary">Summary</Link>
              </Button>
            </li>

            {chats.map(({ id, date }) => {
              const formattedDate = format(new Date(date), "MMM d, yyyy");

              return (
                <li key={id}>
                  {isAnotherPage ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/">{formattedDate}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant={selectedChatId === id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedChatId(id!)}
                    >
                      {formattedDate}
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </Sidebar>
  );
}
