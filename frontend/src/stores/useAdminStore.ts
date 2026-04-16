import { adminService } from "@/services/adminService";
import type { AdminState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => {
        set({ accessToken: accessToken });
      },

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
        localStorage.removeItem("adminStorage");
        sessionStorage.removeItem("adminStorage");
      },

      login: async (username, password) => {
        try {
          set({ loading: true });

          const res = await adminService.login(username, password);
          get().setAccessToken(res.accessToken);
          await get().getDetail();
          toast.success("Đăng nhập thành công");
          return res;
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          get().clearState();
          await adminService.logout();
          toast.success("Logout thành công!");
        } catch (error) {
          console.log(error);
        }
      },

      getDetail: async () => {
        try {
          set({ loading: true });
          const res = await adminService.getDetail();
          set({ user: res.user });
        } catch (error) {
          console.log(error);
        } finally {
          set({ loading: false });
        }
      },

      refreshToken: async () => {
        try {
          set({ loading: true });

          const res = await adminService.refreshToken();

          get().setAccessToken(res.accessToken);
        } catch (error) {
          console.log(error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "adminStorage",
      partialize: (state) => ({ user: state.user }), // chỉ persist user
    },
  ),
);
