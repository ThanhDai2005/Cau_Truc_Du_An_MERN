import api from "@/lib/axios";

export const productService = {
  getList: async (params?: {
    keyword?: string;
    categorySlug?: string;
    page?: number;
    limit?: number;
    sortKey?: string;
    sortValue?: string;
  }) => {
    const { data } = await api.get("/product", { params });
    return data;
  },

  getDetail: async (slug: string) => {
    const { data } = await api.get(`/product/${slug}`);
    return data;
  },

  getFeatured: async (limit: number = 8) => {
    const { data } = await api.get("/product", {
      params: { limit, sortKey: "createdAt", sortValue: "desc" },
    });
    return data;
  },
};
