import { create } from "zustand";

interface ChatState {
  canChat: boolean;
  loading: boolean;

  setCanChat: (canChat: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  canChat: true,
  loading: false,

  setCanChat: (canChat) => set({ canChat }),
  setLoading: (loading) => set({ loading }),
}));
