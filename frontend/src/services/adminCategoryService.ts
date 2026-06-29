import adminApi from "@/lib/adminAxios";
import type { Category } from "@/types/category";

export const adminCategoryService = {
  getList: async (keyword = "", page = 1, limit = 10) => {
    const res = await adminApi.get<{
      message: string;
      data: Category[];
      totalItems: number;
      totalPages: number;
    }>(`/admin/category?keyword=${keyword}&page=${page}&limit=${limit}`);
    return res.data;
  },

  create: async (data: { name: string; status?: string }) => {
    const res = await adminApi.post<{
      message: string;
      data: Category;
    }>("/admin/category", data);
    return res.data;
  },

  update: async (
    categoryId: string,
    data: { name?: string; status?: string },
  ) => {
    const res = await adminApi.patch<{
      message: string;
      data: Category;
    }>(`/admin/category/update/${categoryId}`, data);
    return res.data;
  },

  delete: async (categoryId: string) => {
    const res = await adminApi.patch<{ message: string }>(
      `/admin/category/delete/${categoryId}`,
    );
    return res.data;
  },
};
