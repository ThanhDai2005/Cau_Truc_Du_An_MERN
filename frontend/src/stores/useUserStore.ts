import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";

export const useUserStore = create<UserState>()(() => ({
  uploadAvatar: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const res = await userService.uploadAvatar(formData);
      if (user) {
        setUser({ ...user, avatarUrl: res.avatarUrl });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Upload Avatar that bai!");
      throw err;
    }
  },

  updateInfo: async (displayName, email, phone, address) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const res = await userService.updateInfo(
        displayName,
        email,
        phone,
        address,
      );
      if (user) {
        setUser({
          ...user,
          displayName: res.user.displayName,
          email: res.user.email,
          phone: res.user.phone,
          address: res.user.address,
        });
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.log("Error updateInfo", error);
      throw err;
    }
  },

  changePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      const res = await userService.changePassword(
        currentPassword,
        newPassword,
        confirmNewPassword,
      );
      return res;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.log("Error changePassword", error);
      throw err;
    }
  },
}));
