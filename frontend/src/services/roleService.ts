import adminAxios from "@/lib/adminAxios";

export const roleService = {
  list: async () => {
    const response = await adminAxios.get("/admin/role");
    return response.data;
  },
};
