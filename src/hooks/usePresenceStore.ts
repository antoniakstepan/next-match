import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PresentState = {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

const usePresenceStore = create<PresentState>()(
  devtools(
    (set) => ({
      members: [],
      add: (id) => set((state) => ({ members: [...state.members, id] })),
      remove: (id) =>
        set((state) => ({ members: state.members.filter((m) => m !== id) })),
      set: (ids) => set({ members: ids }),
    }),
    {
      name: "PresentStoreDemo",
      serialize: {
        options: {
          date: true,
          undefined: true,
        },
      },
    }
  )
);

export default usePresenceStore;
