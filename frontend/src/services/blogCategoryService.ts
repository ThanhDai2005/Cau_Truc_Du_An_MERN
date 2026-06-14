import api from "@/lib/axios";

export const blogCategoryService = {
  getList: async () => {
    const res = await api.get("/blog-category");
    return res.data;
  },
};
