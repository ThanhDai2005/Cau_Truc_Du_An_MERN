export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string;
  price: number;
  images: string[];
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  stock: number;
  averageRating: number;
  numReviews: number;
  status: string;
  deleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
