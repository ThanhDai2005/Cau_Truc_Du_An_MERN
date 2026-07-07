import { create } from "zustand";
import { roleService } from "@/services/roleService";
import type { RoleStore } from "@/types/store";

export const useRoleStore = create<RoleStore>((set) => ({
  roles: [],
  loading: false,

  fetchRoles: async () => {
    try {
      set({ loading: true });
      const response = await roleService.list();
      set({ roles: response.data, loading: false });
    } catch (error) {
      console.error("Lỗi khi tải danh sách vai trò:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
