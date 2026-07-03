import adminApi from "@/lib/adminAxios";

export const adminBlogCategoryService = {
  getList: async (keyword = "", status = "", page = 1, limit = 10) => {
    const res = await adminApi.get(
      `/admin/blog-category?keyword=${keyword}&status=${status}&page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  getDetail: async (blogCategoryId: string) => {
    const res = await adminApi.get(`/admin/blog-category/${blogCategoryId}`);
    return res.data;
  },

  create: async (data: { name: string; status?: string }) => {
    const res = await adminApi.post("/admin/blog-category", data);
    return res.data;
  },

  update: async (
    blogCategoryId: string,
    data: { name?: string; status?: string },
  ) => {
    const res = await adminApi.patch(
      `/admin/blog-category/update/${blogCategoryId}`,
      data,
    );
    return res.data;
  },

  changeStatus: async (
    blogCategoryId: string,
    status: "active" | "inactive",
  ) => {
    const res = await adminApi.patch(
      `/admin/blog-category/change-status/${status}/${blogCategoryId}`,
    );
    return res.data;
  },

  changeMulti: async (
    ids: string[],
    type: "active" | "inactive" | "delete-all",
  ) => {
    const res = await adminApi.patch(`/admin/blog-category/change-multi`, {
      ids,
      type,
    });
    return res.data;
  },

  deleteItem: async (blogCategoryId: string) => {
    const res = await adminApi.delete(
      `/admin/blog-category/delete/${blogCategoryId}`,
    );
    return res.data;
  },
};
