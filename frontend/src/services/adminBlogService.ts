import adminApi from "@/lib/adminAxios";

export const adminBlogService = {
  getList: async (
    keyword = "",
    blogCategorySlug = "",
    status = "",
    page = 1,
    limit = 10,
  ) => {
    const res = await adminApi.get(
      `/admin/blog?keyword=${keyword}&blogCategorySlug=${blogCategorySlug}&status=${status}&page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  getDetail: async (blogId: string) => {
    const res = await adminApi.get(`/admin/blog/${blogId}`);
    return res.data;
  },

  create: async (
    data:
      | FormData
      | {
          title: string;
          content: string;
          imageUrl: string;
          blogCategory?: string;
          featured?: boolean;
          relatedProducts?: string[];
          status?: string;
        },
  ) => {
    const res = await adminApi.post("/admin/blog", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (
    blogId: string,
    data:
      | FormData
      | {
          title?: string;
          content?: string;
          imageUrl?: string;
          blogCategory?: string;
          featured?: boolean;
          relatedProducts?: string[];
          status?: string;
        },
  ) => {
    const res = await adminApi.patch(`/admin/blog/update/${blogId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  changeStatus: async (blogId: string, status: "active" | "inactive") => {
    const res = await adminApi.patch(
      `/admin/blog/change-status/${status}/${blogId}`,
    );
    return res.data;
  },

  changeMulti: async (
    ids: string[],
    type: "active" | "inactive" | "delete-all",
  ) => {
    const res = await adminApi.patch(`/admin/blog/change-multi`, {
      ids,
      type,
    });
    return res.data;
  },

  deleteItem: async (blogId: string) => {
    const res = await adminApi.delete(`/admin/blog/delete/${blogId}`);
    return res.data;
  },
};
