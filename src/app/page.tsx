"use client";

import { ChatView } from "@/components/chat/chat-view";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChats } from "@/hooks/use-chats";
import { useInitChat } from "@/hooks/features/use-init-chat";

export default function Home() {
  const { currentChat } = useChats();
  const { clear } = useInitChat();

  return (
    <div className="transition-width relative h-screen min-h-screen w-full">
      <header className="bg-background sticky top-0 z-50 flex h-16 items-center justify-between border-b p-4">
        <SidebarTrigger />
        <Button variant="outline" size="sm" onClick={clear}>
          Clear Chat
        </Button>
      </header>

      <div className="p-4" style={{ height: "calc(100vh - 64px)" }}>
        <ChatView chat={currentChat} />
      </div>
    </div>
  );
}
