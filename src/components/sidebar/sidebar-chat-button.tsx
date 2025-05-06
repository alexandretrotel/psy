"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/stores/chat.store";

interface SidebarChatButtonProps {
  id: string;
  date: string;
}

export function SidebarChatButton({ id, date }: SidebarChatButtonProps) {
  const pathname = usePathname();
  const isOnHomePage = pathname === "/";
  const { selectedChatId, setSelectedChatId } = useChatStore();

  const formattedDate = format(new Date(date), "MMM d, yyyy");
  const isSelected = selectedChatId === id;

  if (!isOnHomePage) {
    return (
      <Button variant="ghost" className="w-full justify-start" asChild>
        <Link href="/">{formattedDate}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      className="w-full justify-start"
      onClick={() => setSelectedChatId(id)}
    >
      {formattedDate}
    </Button>
  );
}
