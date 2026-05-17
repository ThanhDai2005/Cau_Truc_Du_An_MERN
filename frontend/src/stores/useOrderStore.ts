import { create } from "zustand";
import { orderService } from "@/services/orderService";
import type { CreateOrderData } from "@/services/orderService";
import type { OrderState } from "@/types/store";

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalPages: 1,

  createOrder: async (data: CreateOrderData) => {
    try {
      set({ loading: true, error: null });
      const response = await orderService.create(data);
      set({ loading: false, currentOrder: response.data });
      return response.data;
    } catch (error: any) {
      console.error("Error creating order:", error);
      set({
        error: error.response?.data?.message || "Lỗi khi tạo đơn hàng",
        loading: false,
      });
      throw error;
    }
  },

  getMyOrders: async (page = 1, limit = 10, orderStatus?: string) => {
    try {
      set({ loading: true, error: null });
      const response = await orderService.getMyOrders(page, limit, orderStatus);
      set({
        orders: response.data,
        totalPages: response.totalPages || 1,
        loading: false,
      });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      set({
        error:
          error.response?.data?.message || "Lỗi khi tải danh sách đơn hàng",
        loading: false,
      });
    }
  },

  getOrderDetail: async (orderId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await orderService.getDetail(orderId);
      set({ currentOrder: response.data, loading: false });
    } catch (error: any) {
      console.error("Error fetching order detail:", error);
      set({
        error: error.response?.data?.message || "Lỗi khi tải chi tiết đơn hàng",
        loading: false,
      });
    }
  },

  clearCurrentOrder: () => {
    set({ currentOrder: null });
  },
}));
