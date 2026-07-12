import { create } from "zustand";
import { promotionService } from "@/services/promotionService";
import type { PromotionState } from "@/types/store";

export const usePromotionStore = create<PromotionState>((set) => ({
  appliedPromotion: null,
  loading: false,

  applyPromotion: async (code, orderValue) => {
    set({ loading: true });
    try {
      const response = await promotionService.apply(code, orderValue);
      const promotionData = response.data;
      set({ appliedPromotion: promotionData, loading: false });
      return promotionData;
    } catch (error) {
      console.error("Lỗi khi áp dụng khuyến mãi:", error);
      set({ loading: false });
      throw error;
    }
  },

  clearPromotion: () => {
    set({ appliedPromotion: null });
  },
}));
