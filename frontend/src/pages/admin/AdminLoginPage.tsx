import { LoginForm } from "@/components/auth/login-form";
import { useAdminStore } from "@/stores/useAdminStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const AdminLoginPage = () => {
  const { user } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user?.roleId?.title === "Super Admin" ||
      user?.roleId?.title === "Nhân viên kho" ||
      user?.roleId?.title === "Nhân viên marketing"
    ) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('/banner.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-[420px] relative z-10 rounded-3xl border-2 border-white bg-black/10 backdrop-blur-sm shadow-2xl py-10 px-6 sm:py-16 sm:px-12 mx-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default AdminLoginPage;
