import api from "@/lib/adminAxios";

export const adminService = {
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

  getDashboard: async () => {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },

  // Users Management
  getUsers: async (page = 1, limit = 10, keyword = "") => {
    const res = await api.get(
      `/admin/users?page=${page}&limit=${limit}&keyword=${keyword}`,
    );
    return res.data;
  },

  createUser: async (data: {
    displayName: string;
    phone: string;
    email: string;
    password: string;
    roleId?: string;
  }) => {
    const res = await api.post("/admin/users", data);
    return res.data;
  },

  updateUser: async (
    userId: string,
    data: {
      displayName?: string;
      phone?: string;
      email?: string;
      status?: string;
      roleId?: string;
    },
  ) => {
    const res = await api.patch(`/admin/users/update/${userId}`, data);
    return res.data;
  },

  deleteUser: async (userId: string) => {
    const res = await api.patch(`/admin/users/delete/${userId}`);
    return res.data;
  },

  // Roles (for user form dropdown)
  getRoles: async () => {
    const res = await api.get("/admin/role");
    return res.data;
  },
};
