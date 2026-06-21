import type { User } from "./user";
import type { Category } from "./category";
import type { Product } from "./product";
import type { Cart } from "./cart";
import type { Order } from "./order";
import type { CreateOrderData } from "../services/orderService";
import type { ApplyPromotionResponse } from "./promotion";
import type { Review } from "./review";
import type { BlogCategory } from "./blogCategory";
import type { Blog } from "./blog";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  forgotPasswordLoading: boolean;

  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearState: () => void;
  signUp: (
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signIn: (phone: string, password: string) => Promise<void>;
  googleSignIn: (credential: string) => Promise<void>;
  signOut: () => Promise<void>;
  getDetail: () => Promise<void>;
  refresh: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (
    resetToken: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
}

export interface AdminState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getDetail: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export interface UserState {
  loading: boolean;

  uploadAvatar: (formData: FormData) => Promise<void>;
  updateInfo: (
    displayName: string,
    email: string,
    phone: string,
    address: string,
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => Promise<void>;
}

export interface CategoryState {
  category: Category[];
  loading: boolean;

  getList: () => Promise<void>;
}

export interface ProductState {
  product: Product[];
  currentProduct: Product | null;
  loading: boolean;

  getList: (
    keyword: string,
    categorySlug: string,
    page: number,
    limit: number,
    sortKey: string,
    sortValue: string,
  ) => Promise<any>;
  getDetail: (slug: string) => Promise<any>;
}

export interface BlogCategoryState {
  blogCategory: BlogCategory[];
  loading: boolean;

  fetchBlogCategories: () => Promise<void>;
}

export interface BlogState {
  blog: Blog[];
  currentBlog: Blog | null;
  loading: boolean;

  getList: (
    keyword?: string,
    blogCategorySlug?: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  getDetail: (slug: string) => Promise<void>;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;

  getCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  orderReviews: {
    order: Order | null;
    reviews: Review[];
  } | null;
  loading: boolean;
  totalPages: number;

  createOrder: (data: CreateOrderData) => Promise<Order>;
  getMyOrders: (
    page?: number,
    limit?: number,
    orderStatus?: string,
  ) => Promise<void>;
  getOrderDetail: (orderId: string) => Promise<void>;
  getOrderReviews: (orderId: string) => Promise<void>;
  clearCurrentOrder: () => void;
}

export interface PromotionState {
  appliedPromotion: ApplyPromotionResponse | null;
  loading: boolean;
  applyPromotion: (
    code: string,
    orderValue: number,
  ) => Promise<ApplyPromotionResponse>;
  clearPromotion: () => void;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  createReview: (
    productId: string,
    rating: number,
    comment: string,
    images?: File[],
  ) => Promise<void>;
  getReviewsByProduct: (
    productId: string,
    page?: number,
    limit?: number,
  ) => Promise<{ data: Review[]; totalItems: number; totalPages: number }>;
  loadMoreReviews: (
    productId: string,
    limit?: number,
  ) => Promise<{ data: Review[]; totalItems: number; totalPages: number } | undefined>;
  resetReviews: () => void;
}
