import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const AdminLoginPage = () => {
  const { accessToken, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && user?.role == "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [accessToken, user, navigate]);

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
