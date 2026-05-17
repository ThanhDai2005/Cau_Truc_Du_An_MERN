import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { productService } from "@/services/productService";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Product } from "@/types/product";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useCartStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getDetail(slug!);
      setProduct(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải sản phẩm");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/signin");
      return;
    }

    if (!product) return;

    if (quantity > product.stock) {
      toast.error("Số lượng vượt quá tồn kho");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
      toast.success("Đã thêm vào giỏ hàng");
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-gray-200 animate-pulse rounded-2xl h-[400px] md:h-[500px]"></div>
          <div className="space-y-6 mt-4 md:mt-0">
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-3/4"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded-xl w-1/3"></div>
            <div className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
            <div className="h-14 bg-gray-200 animate-pulse rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 bg-white">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm relative">
            <img
              src={product.images[activeImage] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider">
                  Hết hàng
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`bg-gray-50 rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${
                    activeImage === idx ? "border-[#b51c00]" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wide">
              {product.categoryId?.name || "Món ăn"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold text-gray-900">{product.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500 text-sm">{product.numReviews} Đánh giá</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-sm">Đã bán: 1.2k+</span>
            </div>
          </div>

          <div className="my-8 py-6 border-y border-gray-100">
            <div className="text-4xl font-black text-[#b51c00]">
              {product.price.toLocaleString("vi-VN")}đ
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Mô tả món ăn</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Thành phần</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{product.ingredients}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900">Số lượng</span>
              <span className="text-sm text-gray-500">Kho: <strong className="text-gray-900">{product.stock}</strong></span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl h-14 w-full sm:w-auto">
                <button
                  onClick={decreaseQuantity}
                  className="w-14 h-full flex items-center justify-center hover:text-[#b51c00] hover:bg-gray-50 rounded-l-xl transition disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-14 h-full flex items-center justify-center hover:text-[#b51c00] hover:bg-gray-50 rounded-r-xl transition disabled:opacity-30"
                  disabled={quantity >= product.stock}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="flex-1 w-full h-14 bg-[#b51c00] text-white rounded-xl font-bold text-lg hover:bg-[#8e1400] transition-all shadow-md shadow-red-100 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {addingToCart ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Đang thêm...
                  </>
                ) : product.stock === 0 ? (
                  "HẾT HÀNG"
                ) : (
                  <>
                    <span className="material-symbols-outlined">shopping_bag</span>
                    Thêm vào giỏ
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
