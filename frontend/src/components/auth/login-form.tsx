import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminStore } from "@/stores/useAdminStore";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type loginForm = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAdminStore();
  const navigate = useNavigate();

  const onSubmit = async (data: loginForm) => {
    const { phone, password } = data;

    const res = await login(phone, password);
    if (res?.accessToken) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="p-0 overflow-hidden border border-[#E0D9E3]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a className="inline-block mx-auto" href="/signin">
                  <img
                    className="object-contain w-12 h-12"
                    src="/logo.png"
                    alt=""
                  />
                </a>
                <h2 className="text-2xl font-bold">Chào mừng quay lại</h2>
                <p className="text-[#6C6C93]">
                  Đăng nhập vào tài khoản PingMe của bạn
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Label className="block text-sm font-semibold" htmlFor="phone">
                  Số điện thoại
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="0909123456"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-[#EF4444]">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  className="block text-sm font-semibold"
                  htmlFor="password"
                >
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-[#EF4444]">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button disabled={isSubmitting} className="w-full" type="submit">
                Đăng nhập
              </Button>
              <p className="text-sm text-center">
                Chưa có tài khoản?{" "}
                <a className="underline underline-offset-4" href="/signup">
                  Đăng ký
                </a>
              </p>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/Login.png"
              alt="Image"
              className="absolute object-cover -translate-y-1/2 top-1/2"
            />
          </div>
        </CardContent>
      </Card>
      <p className="px-6 text-xs text-[#6C6C93] text-center">
        Bằng cách tiếp tục, bạn đồng ý với{" "}
        <a className="underline" href="#">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a className="underline" href="#">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </p>
    </div>
  );
}
