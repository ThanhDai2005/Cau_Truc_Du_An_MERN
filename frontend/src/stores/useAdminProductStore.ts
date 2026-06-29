import { create } from "zustand";
import type { AdminProductState } from "@/types/store";
import { adminProductService } from "@/services/adminProductService";
import { toast } from "sonner";

export const useAdminProductStore = create<AdminProductState>((set) => ({
  products: [],
  totalPages: 1,
  loading: false,

  fetchProducts: async (
    keyword = "",
    categorySlug = "",
    page = 1,
    limit = 10,
  ) => {
    try {
      set({ loading: true });
      const response = await adminProductService.getList(
        keyword,
        categorySlug,
        page,
        limit,
      );
      set({
        products: response.data,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      set({ loading: false });
    }
  },

  createProduct: async (data: FormData | {
    name: string;
    description: string;
    ingredients: string;
    category: string;
    price: number;
    images?: string[];
    stock?: number;
    status?: string;
  }) => {
    try {
      set({ loading: true });
      await adminProductService.create(data);
      toast.success("Tạo sản phẩm thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      toast.error("Không thể tạo sản phẩm");
      set({ loading: false });
      throw error;
    }
  },

  updateProduct: async (
    productId: string,
    data: FormData | {
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
    try {
      set({ loading: true });
      await adminProductService.update(productId, data);
      toast.success("Cập nhật sản phẩm thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast.error("Không thể cập nhật sản phẩm");
      set({ loading: false });
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      set({ loading: true });
      await adminProductService.delete(productId);
      toast.success("Xóa sản phẩm thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
      set({ loading: false });
      throw error;
    }
  },

  deleteMultiple: async (productIds: string[]) => {
    try {
      set({ loading: true });
      await adminProductService.deleteMultiple(productIds);
      toast.success("Xóa các sản phẩm thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa một số sản phẩm");
      set({ loading: false });
      throw error;
    }
  },
}));
