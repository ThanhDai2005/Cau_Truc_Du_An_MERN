import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useOrderStore } from "@/stores/useOrderStore";
import { useReviewStore } from "@/stores/useReviewStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface ReviewData {
  rating: number;
  comment: string;
  images: File[];
  imagePreviews: string[];
}

export default function OrderReviewPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, getMyOrders } = useOrderStore();
  const { createReview } = useReviewStore();
  const { accessToken } = useAuthStore();

  const [order, setOrder] = useState<any>(null);
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [submitting, setSubmitting] = useState(false);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập");
      navigate("/signin");
      return;
    }

    if (orders.length === 0) {
      getMyOrders(1, 100);
    }
  }, [accessToken, navigate, orders.length, getMyOrders]);

  useEffect(() => {
    if (orders.length > 0 && orderId) {
      const foundOrder = orders.find((o) => o._id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        // Initialize review state for each product
        const initialReviews: Record<string, ReviewData> = {};
        foundOrder.items.forEach((item: any) => {
          const product =
            typeof item.productId === "object" ? item.productId : null;
          if (product) {
            initialReviews[product._id] = {
              rating: 5,
              comment: "",
              images: [],
              imagePreviews: [],
            };
          }
        });
        setReviews(initialReviews);
      }
    }
  }, [orders, orderId]);

  const handleRatingChange = (productId: string, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  const handleImageSelect = (
    productId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const currentImages = reviews[productId]?.images || [];

    if (files.length + currentImages.length > 5) {
      toast.error("Tối đa 5 ảnh cho mỗi sản phẩm");
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Chỉ chấp nhận jpg, jpeg, png, webp`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Kích thước tối đa 5MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const newImages = [...currentImages, ...validFiles];
    const newPreviews = [...(reviews[productId]?.imagePreviews || [])];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setReviews((prev) => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            images: newImages,
            imagePreviews: newPreviews,
          },
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (productId: string, index: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: prev[productId].images.filter((_, i) => i !== index),
        imagePreviews: prev[productId].imagePreviews.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleSubmit = async () => {
    if (!order) return;

    // Validate all products have ratings (comment is optional)
    const incompleteReviews = Object.entries(reviews).filter(
      ([_, review]) => !review.rating || review.rating < 1,
    );

    if (incompleteReviews.length > 0) {
      toast.error("Vui lòng chọn số sao đánh giá cho tất cả sản phẩm");
      return;
    }

    try {
      setSubmitting(true);
      const promises = Object.entries(reviews).map(([productId, review]) =>
        createReview(
          productId,
          review.rating,
          review.comment || "",
          review.images
        )
      );

      await Promise.all(promises);
      toast.success("Đánh giá sản phẩm thành công!");
      navigate("/orders");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi đánh giá sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/orders")}
          className="text-gray-600 hover:text-gray-900"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <p className="text-sm text-gray-500 mb-2">
          Mã đơn hàng: #{order._id.slice(-8).toUpperCase()}
        </p>
        <p className="text-sm text-gray-500">
          Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
        </p>
      </div>

      <div className="space-y-6">
        {order.items.map((item: any) => {
          const product =
            typeof item.productId === "object" ? item.productId : null;
          if (!product) return null;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex gap-4 mb-6">
                <img
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Số lượng: x{item.quantity}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá của bạn <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(product._id, star)}
                        className="text-3xl transition hover:scale-110"
                      >
                        <span
                          className={`material-symbols-outlined ${
                            star <= (reviews[product._id]?.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét của bạn <span className="text-gray-400 text-xs">(Không bắt buộc)</span>
                  </label>
                  <textarea
                    value={reviews[product._id]?.comment || ""}
                    onChange={(e) =>
                      handleCommentChange(product._id, e.target.value)
                    }
                    rows={4}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#b51c00] focus:ring-1 focus:ring-[#b51c00] outline-none resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thêm ảnh (Tối đa 5 ảnh, mỗi ảnh tối đa 5MB)
                  </label>

                  <input
                    ref={(el) => (fileInputRefs.current[product._id] = el)}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handleImageSelect(product._id, e)}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-3">
                    {(reviews[product._id]?.imagePreviews || []).map(
                      (preview, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 group"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(product._id, index)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-white text-2xl">
                              close
                            </span>
                          </button>
                        </div>
                      )
                    )}

                    {(reviews[product._id]?.images?.length || 0) < 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRefs.current[product._id]?.click()
                        }
                        className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-gray-400 text-3xl">
                          add_photo_alternate
                        </span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    JPG, JPEG, PNG, WEBP • Tối đa 5MB/ảnh
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="flex-1 h-12 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 h-12 bg-[#b51c00] text-white font-bold rounded-xl hover:bg-[#8e1400] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </div>
  );
}
