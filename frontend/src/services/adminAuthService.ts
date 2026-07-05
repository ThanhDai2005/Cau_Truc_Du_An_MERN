import api from "@/lib/adminAxios";

export const adminAuthService = {
  login: async (phone: string, password: string) => {
    const res = await api.post("/admin/auth/login", { phone, password });
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/admin/auth/logout");
    return res.data;
  },

  getDetail: async () => {
    const res = await api.get("/admin/user/detail");
    return res.data;
  },

  refreshToken: async () => {
    const res = await api.post("/admin/auth/refresh");
    return res.data;
  },
};
