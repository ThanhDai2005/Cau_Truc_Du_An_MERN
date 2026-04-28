import { SignupForm } from "@/components/auth/signup-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const SignUpPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center min-h-screen p-6 bg-muted md:p-10 bg-gradient-purple">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignupForm />
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
