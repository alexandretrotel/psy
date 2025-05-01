import { create } from "zustand";

interface ChatState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
