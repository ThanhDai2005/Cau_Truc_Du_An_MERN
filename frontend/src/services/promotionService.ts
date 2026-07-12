import api from "@/lib/axios";

export const promotionService = {
  apply: async (code: string, orderValue: number) => {
    const response = await api.post("/promotion/apply", {
      code,
      orderValue,
    });
    return response.data;
  },
};
