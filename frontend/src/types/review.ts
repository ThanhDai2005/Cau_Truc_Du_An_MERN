export interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    displayName: string;
    avatarUrl?: string;
  };
  orderId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}
