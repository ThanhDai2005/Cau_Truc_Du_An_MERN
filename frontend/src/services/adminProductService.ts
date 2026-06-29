import adminApi from "@/lib/adminAxios";
import type { Product } from "@/types/product";

export const adminProductService = {
  getList: async (keyword = "", categorySlug = "", page = 1, limit = 10) => {
    const res = await adminApi.get<{
      message: string;
      data: Product[];
      totalItems: number;
      totalPages: number;
    }>(
      `/admin/product?keyword=${keyword}&categorySlug=${categorySlug}&page=${page}&limit=${limit}`,
    );
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
    const res = await adminApi.post<{
      message: string;
      data: Product;
    }>("/admin/product", data, {
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
    const res = await adminApi.patch<{
      message: string;
      data: Product;
    }>(`/admin/product/update/${productId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (productId: string) => {
    const res = await adminApi.patch<{ message: string }>(
      `/admin/product/delete/${productId}`,
    );
    return res.data;
  },

  deleteMultiple: async (productIds: string[]) => {
    const res = await adminApi.patch<{ message: string }>(
      `/admin/product/delete-multiple`,
      { productIds },
    );
    return res.data;
  },
};
