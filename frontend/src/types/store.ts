import type { User } from "./user";
import type { Category } from "./category";
import type { Product } from "./product";
import type { Cart } from "./cart";
import type { CreateOrderData, Order } from "./order";
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

export interface AdminDashboardState {
  stats: {
    overview: {
      totalUsers: number;
      totalProducts: number;
      totalOrders: number;
      totalCategories: number;
    };
    orderStatus: {
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
    revenueByDateRange: {
      totalRevenue: number;
      totalOrders: number;
    };
  };
  loading: boolean;

  fetchStats: (startDate?: string, endDate?: string) => Promise<void>;
}

export interface AdminCategoryState {
  categories: Category[];
  totalPages: number;
  loading: boolean;

  fetchCategories: (
    keyword?: string,
    status?: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  getCategoryDetail: (categoryId: string) => Promise<Category>;
  createCategory: (data: { name: string; status?: string }) => Promise<void>;
  updateCategory: (
    categoryId: string,
    data: { name?: string; status?: string },
  ) => Promise<void>;
  changeStatus: (
    categoryId: string,
    status: "active" | "inactive",
  ) => Promise<void>;
  changeMulti: (
    ids: string[],
    type: "active" | "inactive" | "delete-all",
  ) => Promise<void>;
  deleteItem: (categoryId: string) => Promise<void>;
}

export interface AdminProductState {
  products: Product[];
  totalPages: number;
  loading: boolean;

  fetchProducts: (
    keyword?: string,
    categorySlug?: string,
    status?: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  getProductDetail: (productId: string) => Promise<Product>;
  createProduct: (data: {
    name: string;
    description: string;
    ingredients: string;
    category: string;
    price: number;
    images?: string[];
    stock?: number;
    status?: string;
  }) => Promise<void>;
  updateProduct: (
    productId: string,
    data: {
      name?: string;
      description?: string;
      ingredients?: string;
      category?: string;
      price?: number;
      images?: string[];
      stock?: number;
      status?: string;
    },
  ) => Promise<void>;
  changeStatus: (
    productId: string,
    status: "active" | "inactive",
  ) => Promise<void>;
  changeMulti: (
    ids: string[],
    type: "active" | "inactive" | "delete-all",
  ) => Promise<void>;
  deleteItem: (productId: string) => Promise<void>;
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
  ) => Promise<void>;
  getDetail: (slug: string) => Promise<void>;
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

  createOrder: (
    data: CreateOrderData,
  ) => Promise<Order & { paymentUrl?: string }>;
  getMyOrders: (
    page?: number,
    limit?: number,
    orderStatus?: string,
  ) => Promise<void>;
  getOrderDetail: (orderId: string) => Promise<void>;
  getOrderReviews: (orderId: string) => Promise<void>;
  retryPayment: (orderId: string) => Promise<{ paymentUrl?: string }>;
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
  ) => Promise<void>;
  loadMoreReviews: (productId: string, limit?: number) => Promise<void>;
  resetReviews: () => void;
}
