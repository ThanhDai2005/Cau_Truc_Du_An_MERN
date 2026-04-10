import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminRouter from "@/components/auth/AdminRouter";
import AdminLayout from "@/components/admin/AdminLayout";

import DashboardPage from "@/pages/admin/DashboardPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";

const adminRoute = {
  path: "/admin",
  children: [
    {
      path: "/login",
      element: <AdminLoginPage />,
    },

    {
      element: <AdminRouter />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              path: "/dashboard",
              element: <DashboardPage />,
            },
            {
              path: "/users",
              element: <UserManagementPage />,
            },
          ],
        },
      ],
    },
  ],
};

export default adminRoute;
