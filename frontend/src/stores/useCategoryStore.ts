import type { CategoryState } from "@/types/store";
import { create } from "zustand";

export const useCategoryStore = create<CategoryState>((set, get) => ({
  category: [],

  getList: async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  },
}));
