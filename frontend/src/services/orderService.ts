import api from "@/lib/axios";

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: {
    recipient: string;
    phone: string;
    address: string;
  };
  paymentMethod: "COD" | "VNPAY" | "MOMO" | "STRIPE";
  shippingFee: number;
  promotionId?: string;
  discountAmount?: number;
}

export const orderService = {
  create: async (data: CreateOrderData) => {
    const response = await api.post("/order", data);
    return response.data;
  },

  getMyOrders: async (page = 1, limit = 10, orderStatus?: string) => {
    let url = `/order/my?page=${page}&limit=${limit}`;
    if (orderStatus) {
      url += `&orderStatus=${orderStatus}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getDetail: async (orderId: string) => {
    const response = await api.get(`/order/detail/${orderId}`);
    return response.data;
  },
};
