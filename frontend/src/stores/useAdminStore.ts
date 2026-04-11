import { adminService } from "@/services/adminService";
import type { AdminState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.clear();
        sessionStorage.clear();
      },

      login: async (username, password) => {
        const res = await adminService.login(username, password);
        set({ accessToken: res.accessToken });
      },

      logout: async () => {
        await adminService.logout();
        get().clearState();
      },
    }),
    {
      name: "adminStorage",
      partialize: (state) => ({ user: state.user }), // chỉ persist user
    },
  ),
);
