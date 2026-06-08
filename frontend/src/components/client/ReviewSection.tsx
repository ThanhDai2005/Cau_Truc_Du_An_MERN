import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { useReviewStore } from "@/stores/useReviewStore";
import type { Review } from "@/types/review";

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  totalReviews: number;
}

export default function ReviewSection({
  productId,
  initialReviews,
  totalReviews,
}: ReviewSectionProps) {
  const { loadMoreReviews, loading } = useReviewStore();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(totalReviews / 5) || 1
  );

  // Viewer refs for each review
  const imageGalleryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    setReviews(initialReviews);
    setTotalPages(Math.ceil(totalReviews / 5) || 1);
  }, [initialReviews, totalReviews]);

  // Initialize viewer for each review's images
  useEffect(() => {
    const viewers: { [key: string]: Viewer } = {};

    reviews.forEach((review) => {
      if (review.images && review.images.length > 0) {
        const galleryElement = imageGalleryRefs.current[review._id];
        if (galleryElement) {
          viewers[review._id] = new Viewer(galleryElement, {
            toolbar: {
              zoomIn: 1,
              zoomOut: 1,
              reset: 1,
              rotateLeft: 1,
              rotateRight: 1,
            },
            navbar: false,
            title: false,
          });
        }
      }
    });

    return () => {
      Object.values(viewers).forEach((viewer) => viewer.destroy());
    };
  }, [reviews]);

  const handleLoadMore = async () => {
    if (loading || currentPage >= totalPages) return;

    try {
      const nextPage = currentPage + 1;
      const result = await loadMoreReviews(productId, nextPage, 5);

      if (result.data && result.data.length > 0) {
        setReviews([...reviews, ...result.data]);
        setCurrentPage(nextPage);
        setTotalPages(result.totalPages);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải thêm đánh giá");
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <>
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-6 last:border-none"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  {review.userId?.avatarUrl ? (
                    <img
                      src={review.userId.avatarUrl}
                      alt={review.userId.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {review.userId?.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">
                      {review.userId?.displayName || "Người dùng"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {/* Images */}
                  {review.images && review.images.length > 0 && (
                    <div
                      ref={(el) => (imageGalleryRefs.current[review._id] = el)}
                      className="flex gap-2 flex-wrap"
                    >
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-gray-200 hover:border-red-500 transition-colors"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-3 bg-white border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">
                      progress_activity
                    </span>
                    Đang tải...
                  </>
                ) : (
                  <>
                    Xem thêm đánh giá
                    <span className="material-symbols-outlined text-xl">
                      expand_more
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-3 block">
            rate_review
          </span>
          <p className="text-gray-500 text-lg">Chưa có đánh giá nào.</p>
          <p className="text-gray-400 text-sm mt-1">
            Sản phẩm này chưa được đánh giá
          </p>
        </div>
      )}
    </div>
  );
}
