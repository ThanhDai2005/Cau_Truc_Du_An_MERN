import { create } from "zustand";
import { adminUserService } from "@/services/adminUserService";
import { toast } from "sonner";
import type { AdminUserStore } from "@/types/store";

export const useAdminUserStore = create<AdminUserStore>((set) => ({
  users: [],
  currentUser: null,
  loading: false,
  totalPages: 1,

  fetchUsers: async (
    keyword = "",
    roleId = "",
    status = "",
    page = 1,
    limit = 10,
  ) => {
    try {
      set({ loading: true });
      const response = await adminUserService.list(
        keyword,
        roleId,
        status,
        page,
        limit,
      );
      set({
        users: response.data,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài khoản:", error);
      set({ loading: false });
      throw error;
    }
  },

  getUserDetail: async (userId) => {
    try {
      set({ loading: true });
      const response = await adminUserService.getDetail(userId);
      set({ currentUser: response.data, loading: false });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải chi tiết tài khoản:", error);
      set({ loading: false });
      toast.error("Không thể tải chi tiết tài khoản");
      throw error;
    }
  },

  createUser: async (data) => {
    try {
      set({ loading: true });
      await adminUserService.create(data);
      set({ loading: false });
      toast.success("Tạo tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      set({ loading: false });
      toast.error("Tạo tài khoản thất bại");
      throw error;
    }
  },

  updateUser: async (userId, data) => {
    try {
      set({ loading: true });
      await adminUserService.update(userId, data);
      set({ loading: false });
      toast.success("Cập nhật tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật tài khoản:", error);
      set({ loading: false });
      toast.error("Cập nhật tài khoản thất bại");
      throw error;
    }
  },

  changeStatus: async (userId, status) => {
    try {
      await adminUserService.changeStatus(userId, status);
      const message =
        status === "active"
          ? "Khôi phục tài khoản thành công"
          : "Khóa tài khoản thành công";
      toast.success(message);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái tài khoản:", error);
      toast.error("Thay đổi trạng thái thất bại");
      throw error;
    }
  },

  changeMulti: async (ids, type) => {
    try {
      await adminUserService.changeMulti(ids, type);
      const messages = {
        active: "Khôi phục các tài khoản thành công",
        inactive: "Khóa các tài khoản thành công",
        "delete-all": "Xóa vĩnh viễn các tài khoản thành công",
      };
      toast.success(messages[type]);
    } catch (error) {
      console.error("Lỗi khi thao tác nhiều tài khoản:", error);
      toast.error("Thao tác thất bại");
      throw error;
    }
  },

  deleteItem: async (userId) => {
    try {
      await adminUserService.deleteItem(userId);
      toast.success("Xóa vĩnh viễn tài khoản thành công");
    } catch (error) {
      console.error("Lỗi khi xóa vĩnh viễn tài khoản:", error);
      toast.error("Xóa vĩnh viễn thất bại");
      throw error;
    }
  },
}));
