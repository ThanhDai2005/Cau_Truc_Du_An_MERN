import { useState, useEffect } from "react";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminCategoryStore } from "@/stores/useAdminCategoryStore";
import { toast } from "sonner";

const ProductCategoryEdit = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { loading, getCategoryDetail, updateCategory } =
    useAdminCategoryStore();
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setFetching(true);
      if (categoryId) {
        const category = await getCategoryDetail(categoryId);
        setFormData({
          name: category.name,
          status: category.status,
        });
      }
    } catch (error) {
      toast.error("Không thể tải thông tin danh mục");
      navigate("/admin/product-categories");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      await updateCategory(categoryId!, formData);
      navigate("/admin/product-categories");
    } catch (error) {
      // Error already handled in store
    }
  };

  if (fetching) {
    return (
      <div className="bg-[#f7f9fb] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#b51c00]" />
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fb] min-h-screen pb-12">
      {/* HEADER BREADCRUMB */}
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
                href="/admin/product-categories"
                className="font-medium text-gray-500"
              >
                Quản lý danh mục
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-[#b51c00]">
                Chỉnh sửa danh mục
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1000px] mx-auto space-y-6">
        {/* TITLE */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/product-categories")}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
              Chỉnh sửa danh mục
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin danh mục sản phẩm
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[18px] font-bold text-gray-900">
                Thông tin danh mục
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Tên danh mục */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên danh mục..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                  required
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-4 h-4 text-[#b51c00] border-gray-300 focus:ring-[#b51c00] cursor-pointer accent-[#b51c00]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Hoạt động
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === "inactive"}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-4 h-4 text-[#b51c00] border-gray-300 focus:ring-[#b51c00] cursor-pointer accent-[#b51c00]"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Ngưng hoạt động
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/product-categories")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#b51c00] text-white rounded-lg font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Cập nhật danh mục
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCategoryEdit;
