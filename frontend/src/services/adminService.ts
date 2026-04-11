import api from "@/lib/axios";

export const adminService = {
  login: async (username: string, password: string) => {
    const res = await api.post("/admin/auth/login", {
      username: username,
      password: password,
    });
    return res.data;
  },
  logout: async () => {
    const res = await api.post("/admin/auth/logout");
    return res.data;
  },
};
