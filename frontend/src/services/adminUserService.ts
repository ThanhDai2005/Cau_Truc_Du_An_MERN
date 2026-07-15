import adminAxios from "@/lib/adminAxios";

export const adminUserService = {
  list: async (
    keyword = "",
    roleId = "",
    status = "",
    page = 1,
    limit = 10,
  ) => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (roleId) params.append("roleId", roleId);
    if (status) params.append("status", status);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await adminAxios.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getDetail: async (userId: string) => {
    const response = await adminAxios.get(`/admin/users/${userId}`);
    return response.data;
  },

  create: async (data: {
    displayName: string;
    email: string;
    password: string;
    phone?: string;
    roleId: string;
    status?: string;
  }) => {
    const response = await adminAxios.post("/admin/users", data);
    return response.data;
  },

  update: async (
    userId: string,
    data: {
      displayName?: string;
      email?: string;
      password?: string;
      phone?: string;
      roleId?: string;
      status?: string;
    },
  ) => {
    const response = await adminAxios.patch(
      `/admin/users/update/${userId}`,
      data,
    );
    return response.data;
  },

  changeStatus: async (userId: string, status: string) => {
    const response = await adminAxios.patch(
      `/admin/users/change-status/${userId}`,
      {
        status,
      },
    );
    return response.data;
  },

  changeMulti: async (ids: string[], type: string) => {
    const response = await adminAxios.patch("/admin/users/change-multi", {
      ids,
      type,
    });
    return response.data;
  },

  deleteItem: async (userId: string) => {
    const response = await adminAxios.delete(
      `/admin/users/delete-item/${userId}`,
    );
    return response.data;
  },
};
