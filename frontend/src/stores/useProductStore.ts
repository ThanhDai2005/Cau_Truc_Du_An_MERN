import type { ProductState } from "@/types/store";
import { create } from "zustand";
import { productService } from "@/services/productService";

export const useProductStore = create<ProductState>((set, get) => ({
  product: [],
  loading: false,

  getList: async (
    keyword = "",
    categorySlug = "",
    page = 1,
    limit = 12,
    sortKey = "",
    sortValue = "",
  ) => {
    try {
      set({ loading: true });
      const res = await productService.getList(
        keyword,
        categorySlug,
        page,
        limit,
        sortKey,
        sortValue,
      );
      set({ product: res.data, loading: false });
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
}));
