import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const AdminRouter = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // if (user.role != "admin") {
  //   return <Navigate to="/" />;
  // }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminRouter;
