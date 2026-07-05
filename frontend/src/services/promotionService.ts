import adminApi from "@/lib/adminAxios";

export const promotionService = {
  list: async (keyword = "", status = "", page = 1, limit = 10) => {
    const res = await adminApi.get(
      `/admin/promotion?keyword=${keyword}&status=${status}&page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  getDetail: async (promotionId: string) => {
    const res = await adminApi.get(`/admin/promotion/${promotionId}`);
    return res.data;
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
    const res = await adminApi.post("/admin/promotion", data);
    return res.data;
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
    const res = await adminApi.patch(
      `/admin/promotion/update/${promotionId}`,
      data,
    );
    return res.data;
  },

  changeStatus: async (promotionId: string, status: string) => {
    const res = await adminApi.patch(
      `/admin/promotion/change-status/${promotionId}`,
      {
        status,
      },
    );
    return res.data;
  },

  changeMulti: async (ids: string[], type: string) => {
    const res = await adminApi.patch("/admin/promotion/change-multi", {
      ids,
      type,
    });
    return res.data;
  },

  deleteItem: async (promotionId: string) => {
    const res = await adminApi.delete(`/admin/promotion/delete/${promotionId}`);
    return res.data;
  },
};
