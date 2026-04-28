export interface OrderItem {
  productId: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
  } | string;
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
  paymentMethod: "COD" | "VNPAY" | "MOMO" | "STRIPE";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}
