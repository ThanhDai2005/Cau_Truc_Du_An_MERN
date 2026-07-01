import adminApi from "@/lib/adminAxios";

export const adminDashboardService = {
  getStats: async (startDate?: string, endDate?: string) => {
    let url = "/admin/dashboard";
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const res = await adminApi.get(url);
    return res.data;
  },
};
