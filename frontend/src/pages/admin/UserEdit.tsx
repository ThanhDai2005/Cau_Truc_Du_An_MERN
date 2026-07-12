import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAdminUserStore } from "@/stores/useAdminUserStore";
import { useRoleStore } from "@/stores/useRoleStore";
import { toast } from "sonner";

const userEditSchema = z
  .object({
    displayName: z.string().min(1, "Tên đầy đủ là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    roleId: z.string().optional(),
    status: z.enum(["active", "inactive"]),
    address: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Mật khẩu xác nhận không khớp",
      path: ["confirmPassword"],
    },
  );

type UserEditFormData = z.infer<typeof userEditSchema>;

const UserEdit = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { getUserDetail, updateUser, loading } = useAdminUserStore();
  const { roles, fetchRoles } = useRoleStore();
  const [submitting, setSubmitting] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId) return;
      try {
        setLoadingDetail(true);
        const user = await getUserDetail(userId);
        reset({
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          password: "",
          confirmPassword: "",
          roleId: user?.roleId?._id,
          status: user.status,
          address: user.address || "",
        });
      } catch (error) {
        console.error("Error fetching user detail:", error);
        toast.error("Không thể tải thông tin tài khoản");
        navigate("/admin/users");
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchUserDetail();
  }, [userId, getUserDetail, reset, navigate]);

  const onSubmit = async (data: UserEditFormData) => {
    if (!userId) return;

    try {
      setSubmitting(true);
      const updateData: {
        displayName: string;
        email: string;
        phone: string;
        password?: string;
        roleId: string | null;
        status: "active" | "inactive";
        address: string;
      } = {
        displayName: data.displayName,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId || null,
        status: data.status,
        address: data.address || "",
      };

      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      await updateUser(userId, updateData);
      toast.success("Cập nhật tài khoản thành công");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDetail) {
    return (
      <div className="bg-[#f7f9fb] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b51c00]" />
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fb] min-h-screen pb-12">
      {/* HEADER */}
      <header className="flex items-center h-16 gap-2 bg-white border-b border-gray-100 px-4 sticky top-0 z-10">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/admin/dashboard"
                className="font-medium text-gray-500"
              >
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/admin/users"
                className="font-medium text-gray-500"
              >
                Quản lý tài khoản
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-[#b51c00]">
                Chỉnh sửa tài khoản
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1000px] mx-auto space-y-6">
        {/* BACK BUTTON & TITLE */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
            Chỉnh sửa tài khoản
          </h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 p-6 space-y-6">
            {/* Tên đầy đủ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tên đầy đủ <span className="text-red-500">*</span>
              </label>
              <input
                {...register("displayName")}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white transition-shadow"
                placeholder="Nhập tên đầy đủ"
              />
              {errors.displayName && (
                <p className="text-xs text-red-500">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white transition-shadow"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phone")}
                type="text"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white transition-shadow"
                placeholder="0123456789"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Mật khẩu (Optional for edit) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Mật khẩu mới (để trống nếu không đổi)
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white transition-shadow"
                  placeholder="Nhập mật khẩu mới"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white transition-shadow"
                  placeholder="Nhập lại mật khẩu mới"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Vai trò */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Vai trò
              </label>
              <select
                {...register("roleId")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white cursor-pointer"
              >
                <option value="">Khách hàng (Không có vai trò)</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.title}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-xs text-red-500">{errors.roleId.message}</p>
              )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white cursor-pointer"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Khóa</option>
              </select>
              {errors.status && (
                <p className="text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>

            {/* Địa chỉ */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Địa chỉ
              </label>
              <textarea
                {...register("address")}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent bg-white transition-shadow resize-none"
                placeholder="Nhập địa chỉ"
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting || loading}
                className="px-6 py-2.5 bg-[#b51c00] text-white rounded-lg font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting || loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
