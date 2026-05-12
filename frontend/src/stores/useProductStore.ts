import type { ProductState } from "@/types/store";
import { create } from "zustand";

export const useProductStore = create<ProductState>((set, get) => ({
  product: [],

  getList: async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  },
}));
