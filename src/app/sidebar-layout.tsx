"use client";

import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chats } = useChats();

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar chats={chats} />

          <main className="flex flex-1 flex-col gap-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
