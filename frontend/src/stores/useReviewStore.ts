import { create } from "zustand";
import api from "@/lib/axios";
import type { ReviewState } from "@/types/store";

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  loading: false,
  totalPages: 1,

  createReview: async (
    productId: string,
    rating: number,
    comment: string,
    images?: File[]
  ) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await api.post("/review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  getReviewsByProduct: async (productId: string, page = 1, limit = 5) => {
    set({ loading: true });
    try {
      const response = await api.get(`/review/${productId}`, {
        params: { page, limit },
      });
      set({
        reviews: response.data.data,
        totalPages: response.data.totalPages,
        loading: false,
      });
      return response.data;
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  loadMoreReviews: async (productId: string, page: number, limit = 5) => {
    set({ loading: true });
    try {
      const response = await api.get(`/review/${productId}`, {
        params: { page, limit },
      });

      const currentReviews = get().reviews;
      set({
        reviews: [...currentReviews, ...response.data.data],
        totalPages: response.data.totalPages,
        loading: false,
      });
      return response.data;
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },
}));
