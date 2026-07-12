import { create } from "zustand";
import { adminPromotionService } from "@/services/adminPromotionService";
import { toast } from "sonner";
import type { AdminPromotionStore } from "@/types/store";

export const useAdminPromotionStore = create<AdminPromotionStore>(
  (set) => ({
    promotions: [],
    currentPromotion: null,
    loading: false,
    totalPages: 1,

    fetchPromotions: async (keyword = "", status = "", page = 1, limit = 10) => {
      try {
        set({ loading: true });
        const response = await adminPromotionService.list(
          keyword,
          status,
          page,
          limit,
        );
        set({
          promotions: response.data,
          totalPages: response.totalPages,
          loading: false,
        });
      } catch (error) {
        console.error("Lỗi khi tải danh sách khuyến mãi:", error);
        set({ loading: false });
        throw error;
      }
    },

    getDetail: async (promotionId) => {
      try {
        set({ loading: true });
        const response = await adminPromotionService.getDetail(promotionId);
        set({ currentPromotion: response.data, loading: false });
      } catch (error) {
        console.error("Lỗi khi tải chi tiết khuyến mãi:", error);
        set({ loading: false });
        toast.error("Không thể tải chi tiết khuyến mãi");
        throw error;
      }
    },

    createPromotion: async (data) => {
      try {
        set({ loading: true });
        await adminPromotionService.create(data);
        set({ loading: false });
        toast.success("Tạo khuyến mãi thành công");
      } catch (error) {
        console.error("Lỗi khi tạo khuyến mãi:", error);
        set({ loading: false });
        toast.error("Tạo khuyến mãi thất bại");
        throw error;
      }
    },

    updatePromotion: async (promotionId, data) => {
      try {
        set({ loading: true });
        await adminPromotionService.update(promotionId, data);
        set({ loading: false });
        toast.success("Cập nhật khuyến mãi thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật khuyến mãi:", error);
        set({ loading: false });
        toast.error("Cập nhật khuyến mãi thất bại");
        throw error;
      }
    },

    changeStatus: async (promotionId, status) => {
      try {
        await adminPromotionService.changeStatus(promotionId, status);
        const message =
          status === "active"
            ? "Khôi phục khuyến mãi thành công"
            : "Ngưng hoạt động khuyến mãi thành công";
        toast.success(message);
      } catch (error) {
        console.error("Lỗi khi thay đổi trạng thái khuyến mãi:", error);
        toast.error("Thay đổi trạng thái thất bại");
        throw error;
      }
    },

    changeMulti: async (ids, type) => {
      try {
        await adminPromotionService.changeMulti(ids, type);
        const messages = {
          active: "Khôi phục các khuyến mãi thành công",
          inactive: "Ngưng hoạt động các khuyến mãi thành công",
          "delete-all": "Xóa vĩnh viễn các khuyến mãi thành công",
        };
        toast.success(messages[type]);
      } catch (error) {
        console.error("Lỗi khi thao tác nhiều khuyến mãi:", error);
        toast.error("Thao tác thất bại");
        throw error;
      }
    },

    deleteItem: async (promotionId) => {
      try {
        await adminPromotionService.deleteItem(promotionId);
        toast.success("Xóa vĩnh viễn khuyến mãi thành công");
      } catch (error) {
        console.error("Lỗi khi xóa vĩnh viễn khuyến mãi:", error);
        toast.error("Xóa vĩnh viễn thất bại");
        throw error;
      }
    },
  }),
);
