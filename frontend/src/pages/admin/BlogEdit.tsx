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
import { useAdminBlogStore } from "@/stores/useAdminBlogStore";
import { useAdminBlogCategoryStore } from "@/stores/useAdminBlogCategoryStore";
import { toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

const BlogEdit = () => {
  const navigate = useNavigate();
  const { blogId } = useParams<{ blogId: string }>();
  const { loading, getBlogDetail, updateBlog } = useAdminBlogStore();
  const { blogCategories, fetchBlogCategories } = useAdminBlogCategoryStore();
  const { accessToken } = useAdminAuthStore();
  console.log(accessToken);
  const editorRef = useRef<any>(null);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    blogCategory: "",
    status: "active",
  });

  useEffect(() => {
    fetchBlogCategories("", "active", 1, 100);
    loadBlog();
  }, [blogId]);

  const loadBlog = async () => {
    try {
      setFetching(true);
      if (blogId) {
        const blog = await getBlogDetail(blogId);
        setFormData({
          title: blog.title,
          content: blog.content,
          blogCategory: blog.blogCategoryId?._id || "",
          status: blog.status,
        });
        setImagePreview(blog.imageUrl);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin bài viết");
      navigate("/admin/blogs");
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Vui lòng nhập nội dung bài viết");
      return;
    }

    if (!imagePreview) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      if (imageFile) {
        submitData.append("imageUrl", imageFile);
      }
      if (formData.blogCategory) {
        submitData.append("blogCategory", formData.blogCategory);
      }
      submitData.append("status", formData.status);

      await updateBlog(blogId!, submitData);
      navigate("/admin/blogs");
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
                href="/admin/blogs"
                className="font-medium text-gray-500"
              >
                Quản lý bài viết
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-[#b51c00]">
                Chỉnh sửa bài viết
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
        {/* TITLE */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/blogs")}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
              Chỉnh sửa bài viết
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin bài viết
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[18px] font-bold text-gray-900">
                Thông tin bài viết
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Danh mục */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={formData.blogCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, blogCategory: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b51c00] focus:border-transparent text-gray-900 cursor-pointer"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {blogCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hình ảnh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình ảnh <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Nội dung */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <Editor
                  apiKey="6zf850rtn9cn61onukfwj5whpbpwri2c4v6v0kstyv23ag13"
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  value={formData.content}
                  onEditorChange={(content) => {
                    setFormData({ ...formData, content });
                  }}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
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
                      "link image | removeformat | help",
                    content_style:
                      "body { font-family:Inter,Arial,sans-serif; font-size:14px } " +
                      "img { max-width: 100%; height: auto; border-radius: 1rem; margin: 2.5rem 0; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }",
                    images_upload_handler: (blobInfo) => {
                      return new Promise(async (resolve, reject) => {
                        try {
                          const formData = new FormData();
                          formData.append(
                            "file",
                            blobInfo.blob(),
                            blobInfo.filename(),
                          );

                          const response = await axios.post(
                            `${import.meta.env.VITE_API_URL}/admin/upload`,
                            formData,
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${accessToken}`,
                              },
                            },
                          );

                          // Trả về URL cho TinyMCE
                          resolve(response.data.location);
                        } catch (error) {
                          console.error("Upload error:", error);
                          reject("Upload hình ảnh thất bại. Vui lòng thử lại.");
                        }
                      });
                    },
                  }}
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
                      className="w-4 h-4 accent-[#b51c00] cursor-pointer"
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
                      className="w-4 h-4 accent-[#b51c00] cursor-pointer"
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
                onClick={() => navigate("/admin/blogs")}
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
                    Cập nhật bài viết
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

export default BlogEdit;
