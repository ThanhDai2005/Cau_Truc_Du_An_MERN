import adminApi from "@/lib/adminAxios";

export const adminDashboardService = {
  getStats: async (startDate?: string, endDate?: string) => {
    let url = "/admin/dashboard";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const res = await adminApi.get<{
      message: string;
      data: {
        overview: {
          totalUsers: number;
          totalProducts: number;
          totalOrders: number;
          totalCategories: number;
        };
        orderStatus: {
          pending: number;
          processing: number;
          shipped: number;
          delivered: number;
          cancelled: number;
        };
        revenueByDateRange: {
          totalRevenue: number;
          totalOrders: number;
        };
      };
    }>(url);
    return res.data;
  },
};
