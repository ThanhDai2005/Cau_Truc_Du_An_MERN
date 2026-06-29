import { create } from "zustand";
import type { AdminDashboardState } from "@/types/store";
import { adminDashboardService } from "@/services/adminDashboardService";

export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  stats: {
    overview: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalCategories: 0,
    },
    orderStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    revenueByDateRange: {
      totalRevenue: 0,
      totalOrders: 0,
    },
  },
  loading: false,

  fetchStats: async (startDate?: string, endDate?: string) => {
    try {
      set({ loading: true });
      const response = await adminDashboardService.getStats(startDate, endDate);
      set({ stats: response.data, loading: false });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
      throw error;
    }
  },
}));
