import adminApi from "@/lib/adminAxios";

export const adminPromotionService = {
  list: async (keyword: string = "", status: string = "", page: number = 1, limit: number = 10) => {
    const response = await adminApi.get(
      `/admin/promotion?keyword=${keyword}&status=${status}&page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getDetail: async (promotionId: string) => {
    const response = await adminApi.get(`/admin/promotion/${promotionId}`);
    return response.data;
  },

  create: async (
    data:
      | FormData
      | {
          title: string;
          code: string;
          description?: string;
          discountType: "percentage" | "fixed";
          discountValue: number;
          minOrderValue?: number;
          maxDiscountAmount?: number | null;
          usageLimit?: number | null;
          startDate: string;
          endDate: string;
          status?: "active" | "inactive";
        },
  ) => {
    const response = await adminApi.post("/admin/promotion", data);
    return response.data;
  },

  update: async (
    promotionId: string,
    data:
      | FormData
      | {
          title: string;
          code: string;
          description?: string;
          discountType: "percentage" | "fixed";
          discountValue: number;
          minOrderValue?: number;
          maxDiscountAmount?: number | null;
          usageLimit?: number | null;
          startDate: string;
          endDate: string;
          status?: "active" | "inactive";
        },
  ) => {
    const response = await adminApi.patch(
      `/admin/promotion/update/${promotionId}`,
      data,
    );
    return response.data;
  },

  changeStatus: async (promotionId: string, status: string) => {
    const response = await adminApi.patch(
      `/admin/promotion/change-status/${promotionId}`,
      {
        status,
      },
    );
    return response.data;
  },

  changeMulti: async (ids: string[], type: string) => {
    const response = await adminApi.patch("/admin/promotion/change-multi", {
      ids,
      type,
    });
    return response.data;
  },

  deleteItem: async (promotionId: string) => {
    const response = await adminApi.delete(`/admin/promotion/delete/${promotionId}`);
    return response.data;
  },
};
