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
    status = "",
    page = 1,
    limit = 10,
  ) => {
    try {
      set({ loading: true });
      const response = await adminProductService.getList(
        keyword,
        categorySlug,
        status,
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

  getProductDetail: async (productId: string) => {
    try {
      set({ loading: true });
      const response = await adminProductService.getDetail(productId);
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      toast.error("Không thể tải thông tin sản phẩm");
      set({ loading: false });
      throw error;
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

  changeStatus: async (productId: string, status: "active" | "inactive") => {
    try {
      set({ loading: true });
      await adminProductService.changeStatus(productId, status);
      toast.success("Cập nhật trạng thái thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
      set({ loading: false });
      throw error;
    }
  },

  changeMulti: async (ids: string[], type: "active" | "inactive" | "delete-all") => {
    try {
      set({ loading: true });
      await adminProductService.changeMulti(ids, type);
      const messages = {
        active: "Cập nhật trạng thái thành công",
        inactive: "Cập nhật trạng thái thành công",
        "delete-all": "Xóa các sản phẩm thành công",
      };
      toast.success(messages[type]);
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi thay đổi nhiều sản phẩm:", error);
      toast.error("Không thể thực hiện thao tác");
      set({ loading: false });
      throw error;
    }
  },

  deleteItem: async (productId: string) => {
    try {
      set({ loading: true });
      await adminProductService.deleteItem(productId);
      toast.success("Xóa sản phẩm thành công");
      set({ loading: false });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể xóa sản phẩm");
      set({ loading: false });
      throw error;
    }
  },
}));
