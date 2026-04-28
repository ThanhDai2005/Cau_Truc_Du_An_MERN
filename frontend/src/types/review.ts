export interface Review {
  _id: string;
  productId: string;
  userId: {
    _id: string;
    displayName: string;
    avatarUrl?: string;
  } | string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
