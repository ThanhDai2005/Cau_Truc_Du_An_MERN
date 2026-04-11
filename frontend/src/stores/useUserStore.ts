import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

export const useUserStore = create<UserState>((set, get) => ({
  uploadAvatar: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();

      const res = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: res.avatarUrl,
        });
      }
    } catch (error) {
      console.log("Lỗi khi upload Avatar", error);
      toast.error(error?.response?.data?.message || "Upload Avatar không thành công!");
    }
  },

  updateInfo: async (displayName, username, email, phone) => {
    try {
      const { user, setUser } = useAuthStore.getState();

      const res = await userService.updateInfo(
        displayName,
        username,
        email,
        phone || "",
      );

      if (user) {
        setUser({
          ...user,
          displayName: res.user.displayName,
          username: res.user.username,
          email: res.user.email,
          phone: res.user.phone,
        });
      }

      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.log("Lỗi khi updateInfo", error);
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
    }
  },
}));
