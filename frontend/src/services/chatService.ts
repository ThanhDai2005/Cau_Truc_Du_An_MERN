import api from "@/lib/axios";

export const chatService = {
  getMyConversations: async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
  },

  getMessages: async (conversationId: string) => {
    const response = await api.get(
      `/chat/conversations/${conversationId}/messages`,
    );
    return response.data;
  },
};
