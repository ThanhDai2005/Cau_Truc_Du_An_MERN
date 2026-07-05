import api from "@/lib/adminAxios";

export const adminService = {
  getList: async (keyword = "", page = 1, limit = 10) => {
    const res = await api.get(
      `/admin/users?keyword=${keyword}&page=${page}&limit=${limit}`,
    );
    return res.data;
  },
};
