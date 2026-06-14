import type { Product } from "./product";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  blogCategoryId: {
    _id: string;
    name: string;
    slug: string;
  } | null;
  featured: boolean;
  relatedProducts?: Product[];
  publishedAt: string;
  authorId: {
    displayName: string;
    avatarUrl?: string;
  };
}
