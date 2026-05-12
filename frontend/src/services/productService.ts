import api from "@/lib/axios";

export const productService = {
  getList: async (
    keyword = "",
    categorySlug = "",
    page = 1,
    limit = 10,
    sortKey = "",
    sortValue = "",
  ) => {
    const res = await api.get(
      `/product?keyword=${keyword}&categorySlug=${categorySlug}&page=${page}&limit=${limit}&sortKey=${sortKey}&sortValue=${sortValue}`,
    );
    return res.data;
  },

  getDetail: async (slug: string) => {
    const { data } = await api.get(`/product/${slug}`);
    return data;
  },
};
