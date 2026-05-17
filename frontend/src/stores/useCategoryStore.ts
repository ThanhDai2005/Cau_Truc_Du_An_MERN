import type { CategoryState } from "@/types/store";
import { create } from "zustand";
import { categoryService } from "@/services/categoryService";

export const useCategoryStore = create<CategoryState>((set, get) => ({
  category: [],
  loading: false,
  error: null,

  getList: async () => {
    try {
      set({ loading: true, error: null });
      const response = await categoryService.getList();
      set({ category: response.data, loading: false });
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      set({
        error: error.response?.data?.message || "Lỗi khi tải danh mục",
        loading: false,
      });
    }
  },
}));
