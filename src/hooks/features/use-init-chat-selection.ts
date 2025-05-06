import { Chat } from "@/lib/db";
import { useChatStore } from "@/stores/chat.store";
import { useEffect } from "react";

export function useInitChatSelection(chats: Chat[]) {
  const { selectedChatId, setSelectedChatId } = useChatStore();

  useEffect(() => {
    const chatExists = chats.some((chat) => chat.id === selectedChatId);

    if (!selectedChatId && chats.length > 0) {
      setSelectedChatId(chats[0].id!);
    } else if (selectedChatId && !chatExists) {
      setSelectedChatId(chats[0]?.id);
    }
  }, [chats, selectedChatId, setSelectedChatId]);
}
