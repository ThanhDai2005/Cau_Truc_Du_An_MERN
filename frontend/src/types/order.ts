export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  recipient: string;
  phone: string;
  address: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "COD" | "VNPAY" | "MOMO";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingFee: number;
  promotionId?: string | null;
  discountAmount: number;
  totalAmount: number;
  hasReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  paymentMethod: "COD" | "VNPAY" | "MOMO";
  promotionId?: string;
}
