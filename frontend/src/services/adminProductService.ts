import adminApi from "@/lib/adminAxios";

export const adminProductService = {
  getList: async (
    keyword = "",
    categorySlug = "",
    status = "",
    page = 1,
    limit = 10,
  ) => {
    const res = await adminApi.get(
      `/admin/product?keyword=${keyword}&categorySlug=${categorySlug}&status=${status}&page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  getDetail: async (productId: string) => {
    const res = await adminApi.get(`/admin/product/${productId}`);
    return res.data;
  },

  create: async (
    data:
      | FormData
      | {
          name: string;
          description: string;
          ingredients: string;
          category: string;
          price: number;
          images?: string[];
          stock?: number;
          status?: string;
        },
  ) => {
    const res = await adminApi.post("/admin/product", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (
    productId: string,
    data:
      | FormData
      | {
          name?: string;
          description?: string;
          ingredients?: string;
          category?: string;
          price?: number;
          images?: string[];
          stock?: number;
          status?: string;
        },
  ) => {
    const res = await adminApi.patch(
      `/admin/product/update/${productId}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  },

  changeStatus: async (productId: string, status: "active" | "inactive") => {
    const res = await adminApi.patch(
      `/admin/product/change-status/${status}/${productId}`,
    );
    return res.data;
  },

  changeMulti: async (
    ids: string[],
    type: "active" | "inactive" | "delete-all",
  ) => {
    const res = await adminApi.patch(`/admin/product/change-multi`, {
      ids,
      type,
    });
    return res.data;
  },

  deleteItem: async (productId: string) => {
    const res = await adminApi.delete(`/admin/product/delete/${productId}`);
    return res.data;
  },
};
