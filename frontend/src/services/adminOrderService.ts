import adminAxios from "@/lib/adminAxios";

export const adminOrderService = {
  list: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters.orderStatus && { orderStatus: filters.orderStatus }),
      ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
      ...(filters.search && { search: filters.search }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
    });
    const response = await adminAxios.get(`/admin/order?${params}`);
    return response.data;
  },

  getDetail: async (orderId) => {
    const response = await adminAxios.get(`/admin/order/detail/${orderId}`);
    return response.data;
  },

  updateStatus: async (orderId, data) => {
    const response = await adminAxios.patch(`/admin/order/update/${orderId}`, data);
    return response.data;
  },
};
