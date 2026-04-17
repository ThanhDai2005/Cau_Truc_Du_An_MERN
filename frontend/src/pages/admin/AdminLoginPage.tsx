import { LoginForm } from "@/components/auth/login-form";
import { useAdminStore } from "@/stores/useAdminStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const AdminLoginPage = () => {
  const { user } = useAdminStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role == "admin" || user?.role == "staff") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 bg-muted min-h-svh md:p-10 bg-gradient-purple">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
