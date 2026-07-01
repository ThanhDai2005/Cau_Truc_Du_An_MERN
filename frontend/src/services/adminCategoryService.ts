import adminApi from "@/lib/adminAxios";

export const adminCategoryService = {
  getList: async (keyword = "", status = "", page = 1, limit = 10) => {
    const res = await adminApi.get(
      `/admin/category?keyword=${keyword}&status=${status}&page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  getDetail: async (categoryId: string) => {
    const res = await adminApi.get(`/admin/category/${categoryId}`);
    return res.data;
  },

  create: async (data: { name: string; status?: string }) => {
    const res = await adminApi.post("/admin/category", data);
    return res.data;
  },

  update: async (
    categoryId: string,
    data: { name?: string; status?: string },
  ) => {
    const res = await adminApi.patch(
      `/admin/category/update/${categoryId}`,
      data,
    );
    return res.data;
  },

  changeStatus: async (categoryId: string, status: "active" | "inactive") => {
    const res = await adminApi.patch(
      `/admin/category/change-status/${status}/${categoryId}`,
    );
    return res.data;
  },

  changeMulti: async (
    ids: string[],
    type: "active" | "inactive" | "delete-all",
  ) => {
    const res = await adminApi.patch("/admin/category/change-multi", {
      ids,
      type,
    });
    return res.data;
  },

  deleteItem: async (categoryId: string) => {
    const res = await adminApi.delete(`/admin/category/delete/${categoryId}`);
    return res.data;
  },
};
