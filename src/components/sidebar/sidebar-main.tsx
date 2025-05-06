"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Chat } from "@/lib/db";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { BotMessageSquareIcon } from "lucide-react";
import { SidebarControls } from "./sidebar-controls";
import { useChats } from "@/hooks/use-chats";
import { useSummary } from "@/hooks/use-summary";
import { SidebarChatButton } from "./sidebar-chat-button";
import { useInitChatSelection } from "@/hooks/features/use-init-chat-selection";

interface SidebarMainProps {
  chats: Chat[];
}

export function SidebarMain({ chats }: SidebarMainProps) {
  const pathname = usePathname();
  const isOnHomePage = pathname === "/";

  const { fetchChats } = useChats();
  const { fetchSummary } = useSummary();

  useInitChatSelection(chats);

  const handleDataImport = async () => {
    await fetchChats();
    await fetchSummary();
  };

  return (
    <Sidebar className="w-64 border-r">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="h-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <ModeToggle />
          </div>

          <ScrollArea>
            {chats.length === 0 ? (
              <p className="text-muted-foreground">No chats yet.</p>
            ) : (
              <ul className="space-y-2">
                <li>
                  <Button
                    variant={isOnHomePage ? "ghost" : "secondary"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/summary">
                      <BotMessageSquareIcon className="h-4 w-4" />
                      Summary
                    </Link>
                  </Button>
                </li>

                {chats.map(({ id, date }) => (
                  <li key={id}>
                    <SidebarChatButton id={id!} date={date} />
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>

        <SidebarControls onDataImported={handleDataImport} />
      </div>
    </Sidebar>
  );
}
