import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminRouter from "@/components/auth/AdminRouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Navigate } from "react-router";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProductCategoryManagement from "@/pages/admin/ProductCategoryManagement";
import ProductCategoryCreate from "@/pages/admin/ProductCategoryCreate";
import ProductCategoryEdit from "@/pages/admin/ProductCategoryEdit";
import ProductManagement from "@/pages/admin/ProductManagement";
import ProductCreate from "@/pages/admin/ProductCreate";
import ProductEdit from "@/pages/admin/ProductEdit";
import BlogCategoryManagement from "@/pages/admin/BlogCategoryManagement";
import BlogCategoryCreate from "@/pages/admin/BlogCategoryCreate";
import BlogCategoryEdit from "@/pages/admin/BlogCategoryEdit";
import BlogManagement from "@/pages/admin/BlogManagement";
import BlogCreate from "@/pages/admin/BlogCreate";
import BlogEdit from "@/pages/admin/BlogEdit";
import PromotionManagement from "@/pages/admin/PromotionManagement";
import PromotionCreate from "@/pages/admin/PromotionCreate";
import PromotionEdit from "@/pages/admin/PromotionEdit";
import UserManagement from "@/pages/admin/UserManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import PermissionManagement from "@/pages/admin/PermissionManagement";
import RoleManagement from "@/pages/admin/RoleManagement";

const adminRoute = {
  path: "/admin",
  children: [
    {
      index: true,
      element: <Navigate to="login" replace />,
    },
    {
      path: "login",
      element: <AdminLoginPage />,
    },
    {
      element: <AdminRouter />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              path: "dashboard",
              element: <DashboardPage />,
            },
            {
              path: "product-categories",
              element: <ProductCategoryManagement />,
            },
            {
              path: "product-category/create",
              element: <ProductCategoryCreate />,
            },
            {
              path: "product-category/edit/:categoryId",
              element: <ProductCategoryEdit />,
            },
            {
              path: "products",
              element: <ProductManagement />,
            },
            {
              path: "product/create",
              element: <ProductCreate />,
            },
            {
              path: "product/edit/:productId",
              element: <ProductEdit />,
            },
            {
              path: "blog-categories",
              element: <BlogCategoryManagement />,
            },
            {
              path: "blog-category/create",
              element: <BlogCategoryCreate />,
            },
            {
              path: "blog-category/edit/:blogCategoryId",
              element: <BlogCategoryEdit />,
            },
            {
              path: "blogs",
              element: <BlogManagement />,
            },
            {
              path: "blog/create",
              element: <BlogCreate />,
            },
            {
              path: "blog/edit/:blogId",
              element: <BlogEdit />,
            },
            {
              path: "promotions",
              element: <PromotionManagement />,
            },
            {
              path: "promotion/create",
              element: <PromotionCreate />,
            },
            {
              path: "promotion/edit/:promotionId",
              element: <PromotionEdit />,
            },
            {
              path: "users",
              element: <UserManagement />,
            },
            {
              path: "orders",
              element: <OrderManagement />,
            },
            {
              path: "permissions",
              element: <PermissionManagement />,
            },
            {
              path: "roles",
              element: <RoleManagement />,
            },
          ],
        },
      ],
    },
  ],
};

export default adminRoute;
