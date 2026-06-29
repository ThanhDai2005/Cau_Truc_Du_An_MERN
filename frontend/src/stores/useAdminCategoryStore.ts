import { create } from "zustand";
import type { AdminCategoryState } from "@/types/store";
import { adminCategoryService } from "@/services/adminCategoryService";
import { toast } from "sonner";

export const useAdminCategoryStore = create<AdminCategoryState>((set) => ({
  categories: [],
  totalPages: 1,
  loading: false,

  fetchCategories: async (keyword = "", page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const response = await adminCategoryService.getList(keyword, page, limit);
      set({
        categories: response.data,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      set({ loading: false });
    }
  },

  createCategory: async (data: { name: string; status?: string }) => {
    try {
      set({ loading: true });
      await adminCategoryService.create(data);
      toast.success("Tạo danh mục thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      toast.error("Không thể tạo danh mục");
      set({ loading: false });
      throw error;
    }
  },

  updateCategory: async (
    categoryId: string,
    data: { name?: string; status?: string },
  ) => {
    try {
      set({ loading: true });
      await adminCategoryService.update(categoryId, data);
      toast.success("Cập nhật danh mục thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      toast.error("Không thể cập nhật danh mục");
      set({ loading: false });
      throw error;
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      set({ loading: true });
      await adminCategoryService.delete(categoryId);
      toast.success("Xóa danh mục thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Không thể xóa danh mục");
      set({ loading: false });
      throw error;
    }
  },

  deleteMultiple: async (categoryIds: string[]) => {
    try {
      set({ loading: true });
      await Promise.all(
        categoryIds.map((id) => adminCategoryService.delete(id)),
      );
      toast.success("Xóa các danh mục thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Không thể xóa một số danh mục");
      set({ loading: false });
      throw error;
    }
  },
}));
