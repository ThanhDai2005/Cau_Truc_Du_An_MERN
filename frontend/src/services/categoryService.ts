import api from "@/lib/axios";

export const categoryService = {
  getList: async (params?: { keyword?: string; status?: string }) => {
    const { data } = await api.get("/category", { params });
    return data;
  },

  getDetail: async (slug: string) => {
    const { data } = await api.get(`/category/${slug}`);
    return data;
  },
};
