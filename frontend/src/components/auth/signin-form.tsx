import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

const signInSchema = z.object({
  phone: z
    .string()
    .regex(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type signInForm = z.infer<typeof signInSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInForm>({
    resolver: zodResolver(signInSchema),
  });

  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: signInForm) => {
    const { phone, password } = data;
    const res = await signIn(phone, password);
    if (res?.accessToken) {
      navigate("/");
    }
  };

  return (
    <div className={cn("w-full max-w-md", className)} {...props}>
      <Card className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
        <CardContent className="p-6 md:p-8 flex flex-col gap-6">
          {/* Header */}
          <header className="text-center flex flex-col items-center gap-2">
            <h1 className="font-bold text-4xl tracking-tight text-[#b51c00]">
              FoodieVN
            </h1>
            <p className="text-lg text-gray-600 mt-1">Đăng nhập để tiếp tục</p>
          </header>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <Label
                className="font-medium text-sm text-gray-700"
                htmlFor="phone"
              >
                Số điện thoại
              </Label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  phone
                </span>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="0909123456"
                  className="pl-11 h-12 rounded-xl"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label
                  className="font-medium text-sm text-gray-700"
                  htmlFor="password"
                >
                  Mật khẩu
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#b51c00] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  lock
                </span>
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Nhập mật khẩu"
                  className="pl-11 pr-11 h-12 rounded-xl"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              disabled={isSubmitting}
              className="w-full h-12 bg-[#b51c00] hover:bg-[#8e1400] text-white rounded-xl text-base font-semibold mt-2"
              type="submit"
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">hoặc</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
            >
              <img
                alt="Google"
                className="w-5 h-5"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA477ABBnqm8NA0dxlWlCsXtx0EvaDLdyzPj9AensRCO-MQVs4OVufXJAyXPFQgoWUch4tZd39rEbXSfXgzRQVQip3MPY2Dede7JnvQANbH-pY4mar_Vzn7e_yn3HMksqnq8WTDnWAcz8e0DDAgnBVc8mRK6_CLBt8FDdWrYwpaYRrMo7Ntii088eVcm53iAiPp4XQ4nGhvjDCPgf1g1ZUMhY6rq9ME3-OCGb5DyVA_QJpTa7haZjEX08Ibv8o1IlIZmnzoLWM2L04"
              />
              Đăng nhập với Google
            </Button>

            <Button
              type="button"
              className="h-12 bg-[#1877F2] hover:bg-[#1666d4] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
            >
              <img
                alt="Facebook"
                className="w-5 h-5 brightness-0 invert"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx2MvKg9vH2nFcVUV3v9Mc94Etr2mS__6q_4ILJ5NWpCf6qf-0ZrbKEhJFJe14tGXyd8EN5rxCLpY6k46DjYazB3lovphm3pAEASpFtqKjHKqscCjYgkktSBd9dIeUCBCDtTdIPdxKtMvxmrqQzAnOts9gxV8cKhKZhpQn0TPRMO1hztwsiOQ4LgRcfZW9PYYfKxedAdCmffhzeZ8wZtexCd7lxU1u4CqYptfZCBl7Qy15cWVcIoB3LpLjTBGG7qWfXj-mnpmhLfc"
              />
              Đăng nhập với Facebook
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-2">
            Chưa có tài khoản?{" "}
            <Link
              to="/signup"
              className="text-[#b51c00] font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Policy Text */}
      <p className="text-center text-xs text-gray-500 mt-6 px-4">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a href="#" className="underline hover:text-gray-700">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="underline hover:text-gray-700">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </p>
    </div>
  );
}
