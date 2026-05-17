import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";
import LogOut from "@/components/auth/LogOut";

const profileSchema = z.object({
  displayName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().regex(/^(03|05|07|08|09)\d{8}$/, "Số điện thoại không hợp lệ"),
  address: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  const { uploadAvatar, updateInfo } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập");
      navigate("/signin");
      return;
    }

    if (user) {
      setValue("displayName", user.displayName);
      setValue("email", user.email);
      setValue("phone", user.phone);
      setValue("address", user.address || "");
    }
  }, [user, accessToken, setValue, navigate]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadAvatar(formData);
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setUpdating(true);
      await updateInfo(data.displayName, data.email, data.phone, data.address || "");
      toast.success("Cập nhật thông tin thành công");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Avatar & Logout */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md ring-1 ring-gray-100">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#b51c00] flex items-center justify-center text-white text-4xl font-black">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:text-[#b51c00] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined animate-spin text-[#b51c00]">progress_activity</span>
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <h2 className="font-bold text-gray-900 text-lg">{user.displayName}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="w-full pt-6 mt-6 border-t border-gray-50">
              <LogOut />
            </div>
          </div>
        </div>

        {/* Right: Info Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-gray-50">
              <span className="material-symbols-outlined text-[#b51c00]">edit_note</span>
              <h2 className="text-lg font-bold text-gray-900">Cập nhật thông tin</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên</label>
                  <input
                    {...register("displayName")}
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                  />
                  {errors.displayName && <p className="text-red-500 text-xs mt-1.5">{errors.displayName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại</label>
                  <input
                    {...register("phone")}
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  {...register("email")}
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ</label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] outline-none text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                  placeholder="Nhập địa chỉ giao hàng của bạn..."
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full h-12 bg-[#b51c00] text-white rounded-xl font-bold hover:bg-[#8e1400] transition shadow-md shadow-red-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
