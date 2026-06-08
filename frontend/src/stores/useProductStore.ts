import type { ProductState } from "@/types/store";
import { create } from "zustand";
import { productService } from "@/services/productService";

export const useProductStore = create<ProductState>((set, get) => ({
  product: [],
  currentProduct: null,
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
      set({ loading: false });
      throw error;
    }
  },

  getDetail: async (slug: string) => {
    try {
      set({ loading: true });
      const res = await productService.getDetail(slug);
      set({ currentProduct: res.data, loading: false });
      return res;
    } catch (error) {
      console.error("Error fetching product detail:", error);
      set({ loading: false, currentProduct: null });
      throw error;
    }
  },
}));
