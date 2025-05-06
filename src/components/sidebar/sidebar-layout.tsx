"use client";

import { SidebarMain } from "@/components/sidebar/sidebar-main";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useTodayChat } from "@/hooks/features/use-today-chat";
import { useChats } from "@/hooks/use-chats";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chats } = useChats();
  useTodayChat(chats);

  return (
    <SidebarProvider>
      <div className="flex h-screen flex-1 flex-col">
        <div className="flex flex-1">
          <SidebarMain chats={chats} />

          <main className="relative flex h-full max-w-full flex-1 flex-col">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
