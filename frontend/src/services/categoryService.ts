import api from "@/lib/axios";

export const categoryService = {
  getList: async () => {
    const res = await api.get("/category");
    return res.data;
  },
};
