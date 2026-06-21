import api from "@/lib/axios";

export const reviewService = {
  create: async (formData: FormData) => {
    const res = await api.post("/review", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  getList: async (productId: string, page = 1, limit = 5) => {
    const res = await api.get(
      `/review/${productId}?page=${page}&limit=${limit}`,
    );
    return res.data;
  },
};
