import { create } from "zustand";

interface ChatState {
  loading: boolean;
  selectedChatId: number | null;
  setLoading: (loading: boolean) => void;
  setSelectedChatId: (chatId: number | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  loading: false,
  selectedChatId: null,
  setLoading: (loading) => set({ loading }),
  setSelectedChatId: (chatId) => set({ selectedChatId: chatId }),
}));
