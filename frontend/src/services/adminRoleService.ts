import adminAxios from "@/lib/adminAxios";

export const adminRoleService = {
  list: async (keyword: string, page: number, limit: number) => {
    const response = await adminAxios.get(
      `/admin/role?keyword=${keyword}&page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getDetail: async (roleId: string) => {
    const response = await adminAxios.get(`/admin/role/detail/${roleId}`);
    return response.data;
  },

  create: async (data: { title: string; description?: string }) => {
    const response = await adminAxios.post("/admin/role", data);
    return response.data;
  },

  update: async (
    roleId: string,
    data: { title?: string; description?: string },
  ) => {
    const response = await adminAxios.patch(
      `/admin/role/update/${roleId}`,
      data,
    );
    return response.data;
  },

  deleteItem: async (roleId: string) => {
    const response = await adminAxios.patch(`/admin/role/delete/${roleId}`);
    return response.data;
  },

  getPermissions: async () => {
    const response = await adminAxios.get("/admin/role/permissions");
    return response.data;
  },

  updatePermissions: async (roleId: string, permissions: string[]) => {
    const response = await adminAxios.patch(
      `/admin/role/${roleId}/permissions`,
      { permissions },
    );
    return response.data;
  },
};
