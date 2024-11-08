import { create } from "zustand";
import { NotificationStore } from "../interface/NotificationStore.tsx";
import { apiRequest } from "./apiRequest.tsx";

export const useNotificationStore = create<NotificationStore>((set) => ({
  number: 0,
  fetch: async () => {
    const res = await apiRequest("/users/notification");
    set({ number: res.data });
  },
  decrease: () => {
    set((prev) => ({ number: prev.number - 1 }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));