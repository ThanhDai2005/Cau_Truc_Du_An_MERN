import adminAxios from "@/lib/adminAxios";

export const adminChatService = {
  list: async (
    keyword: string,
    status: string,
    page: number,
    limit: number,
  ) => {
    const response = await adminAxios.get(
      `/admin/chat?keyword=${keyword}&status=${status}&page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  detail: async (conversationId: string) => {
    const response = await adminAxios.get(`/admin/chat/${conversationId}`);
    return response.data;
  },

  closeConversation: async (conversationId: string) => {
    const response = await adminAxios.patch(
      `/admin/chat/${conversationId}/close`,
    );
    return response.data;
  },
};
