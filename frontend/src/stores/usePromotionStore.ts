import { create } from "zustand";
import api from "@/lib/axios";
import type { PromotionState } from "@/types/store";

export const usePromotionStore = create<PromotionState>((set) => ({
  appliedPromotion: null,
  loading: false,

  applyPromotion: async (code: string, orderValue: number) => {
    set({ loading: true });
    try {
      const response = await api.post("/promotion/apply", { code, orderValue });
      const promotionData = response.data.data;
      set({ appliedPromotion: promotionData, loading: false });
      return promotionData;
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  clearPromotion: () => {
    set({ appliedPromotion: null });
  },
}));
