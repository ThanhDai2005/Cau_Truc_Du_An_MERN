import { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminProductStore } from "@/stores/useAdminProductStore";
import { useAdminCategoryStore } from "@/stores/useAdminCategoryStore";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [fetching, setFetching] = useState(true);
  const { products, loading, fetchProducts, updateProduct } =
    useAdminProductStore();
  const { categories, fetchCategories } = useAdminCategoryStore();
  const editorRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
    existingImages: [] as string[],
  });
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setFetching(true);
      await Promise.all([
        fetchCategories("", 1, 100),
        fetchProducts("", "", 1, 100),
      ]);
    } catch (error) {
      toast.error("Không thể tải thông tin sản phẩm");
      navigate("/admin/products");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && productId) {
      const product = products.find((p) => p._id === productId);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          ingredients: product.ingredients,
          category: product.categoryId?._id || "",
          price: product.price.toString(),
          stock: product.stock.toString(),
          status: product.status,
          existingImages: product.images,
        });
      } else if (!fetching) {
        toast.error("Không tìm thấy sản phẩm");
        navigate("/admin/products");
      }
    }
  }, [products, productId, fetching, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...newFiles]);

    // Create previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("ingredients", formData.ingredients);
      submitData.append("category", formData.category);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock || "0");
      submitData.append("status", formData.status);

      // Send existing images as JSON string
      submitData.append(
        "existingImages",
        JSON.stringify(formData.existingImages),
      );

      // Append new image files
      newImageFiles.forEach((file) => {
        submitData.append("images", file);
      });

      await updateProduct(productId!, submitData);
      navigate("/admin/products");
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
    <div className="bg-[#f7f9fb] min-h-screen pb-12 font-['Inter']">
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
                href="/admin/products"
                className="font-medium text-gray-500"
              >
                Quản lý sản phẩm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-[#b51c00]">
                Chỉnh sửa sản phẩm
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
        {/* TITLE */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin sản phẩm
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[18px] font-bold text-gray-900">
                Thông tin sản phẩm
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                  required
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả sản phẩm..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow resize-none"
                  required
                />
              </div>

              {/* Nguyên liệu */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nguyên liệu <span className="text-red-500">*</span>
                </label>
                <Editor
                  apiKey="6zf850rtn9cn61onukfwj5whpbpwri2c4v6v0kstyv23ag13"
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  value={formData.ingredients}
                  onEditorChange={(content) => {
                    setFormData({ ...formData, ingredients: content });
                  }}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "charmap",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Inter,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>

              {/* Danh mục & Giá */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 cursor-pointer"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                    required
                  />
                </div>
              </div>

              {/* Số lượng & Trạng thái */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số lượng trong kho
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <div className="flex gap-4 h-[50px] items-center">
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

              {/* Hình ảnh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình ảnh sản phẩm
                </label>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#b51c00] transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">
                        Tải ảnh lên
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Existing Images Preview */}
                  {formData.existingImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Ảnh hiện tại:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.existingImages.map((url, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative group rounded-lg overflow-hidden border border-gray-200"
                          >
                            <img
                              src={url}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {newImagePreviews.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Ảnh mới:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {newImagePreviews.map((url, index) => (
                          <div
                            key={`new-${index}`}
                            className="relative group rounded-lg overflow-hidden border border-green-200"
                          >
                            <img
                              src={url}
                              alt={`New ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
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
                    Cập nhật sản phẩm
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

export default ProductEdit;
