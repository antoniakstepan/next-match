import { messageDTO } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type MessageState = {
  messages: messageDTO[];
  unreadCount: number;
  add: (message: messageDTO) => void;
  remove: (id: string) => void;
  set: (messages: messageDTO[]) => void;
  updateUnreadCount: (amount: number) => void;
};

const useMessageStore = create<MessageState>()(
  devtools(
    (set) => ({
      messages: [],
      unreadCount: 0,
      add: (message: messageDTO) =>
        set((state) => ({ messages: [message, ...state.messages] })),
      remove: (id: string) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })),
      set: (messages: messageDTO[]) => set({ messages }),
      updateUnreadCount: (amount: number) =>
        set((state) => ({ unreadCount: state.unreadCount + amount })),
    }),
    { name: "messageStoreDemo" }
  )
);

export default useMessageStore;
