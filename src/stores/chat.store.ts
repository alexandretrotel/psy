import { create } from "zustand";

interface ChatState {
  selectedChatId: string | undefined;
  setSelectedChatId: (chatId: string | undefined) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedChatId: undefined,
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
}));
