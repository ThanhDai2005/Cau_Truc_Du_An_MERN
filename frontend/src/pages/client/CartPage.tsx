import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useCartStore } from "@/stores/useCartStore";
import { usePromotionStore } from "@/stores/usePromotionStore";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, getCart, updateQuantity, removeFromCart } =
    useCartStore();
  const { applyPromotion, appliedPromotion, clearPromotion } =
    usePromotionStore();

  const [promoCode, setPromoCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  useEffect(() => {
    getCart();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [getCart, navigate]);

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => {
      const product =
        typeof item.productId === "object" ? item.productId : null;
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const discount = appliedPromotion?.discountAmount || 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);

      if (appliedPromotion) {
        clearPromotion();
        setPromoCode("");
        toast.info(
          "Đơn hàng thay đổi, vui lòng áp dụng lại mã khuyến mãi nếu có.",
        );
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật số lượng");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
      if (appliedPromotion) {
        clearPromotion();
        setPromoCode("");
      }
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi");
      return;
    }
    if (subtotal === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    try {
      setApplyingPromo(true);
      await applyPromotion(promoCode.trim().toUpperCase(), subtotal);
      toast.success(`Đã áp dụng mã ${promoCode.toUpperCase()}`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Mã khuyến mãi không hợp lệ",
      );
    } finally {
      setApplyingPromo(false);
    }
  };

  // Skeleton
  if (loading && (!cart || cart.items.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#b51c00]">
          <span className="material-symbols-outlined text-[48px]">
            shopping_cart_off
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Giỏ hàng của bạn đang trống
        </h2>
        <p className="text-gray-500 mb-8">
          Hãy thêm món ăn ngon vào giỏ hàng ngay nhé!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-[#b51c00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#8e1400] transition shadow-md shadow-red-100"
        >
          Tiếp tục chọn món
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Giỏ hàng
        </h1>
        <span className="bg-[#b51c00] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          {cart.items.length} món
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product =
              typeof item.productId === "object" ? item.productId : null;
            if (!product) return null;

            return (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm"
              >
                <img
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg bg-gray-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </div>

                  <p className="text-[#b51c00] font-bold mt-1">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(product._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:text-[#b51c00] disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          remove
                        </span>
                      </button>
                      <span className="w-10 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(product._id, item.quantity + 1)
                        }
                        disabled={item.quantity >= product.stock}
                        className="p-1.5 hover:text-[#b51c00] disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          add
                        </span>
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">
                      {(product.price * item.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[#b51c00] font-bold hover:text-[#8e1400] transition-colors mt-4 px-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            Chọn thêm món khác
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">
              Chi tiết đơn hàng
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tạm tính</span>
                <span className="font-semibold">
                  {subtotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Phí vận chuyển</span>
                <span className="font-semibold">
                  {shippingFee.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Khuyến mãi</span>
                  <span className="font-semibold">
                    - {discount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-gray-900 font-bold">Tổng cộng</span>
                <span className="text-xl font-bold text-[#b51c00]">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6 relative">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã khuyến mãi"
                className="w-full h-12 pl-4 pr-24 rounded-xl border border-gray-200 bg-white focus:border-[#b51c00] focus:ring-1 focus:ring-[#b51c00] outline-none transition-colors text-sm"
                disabled={applyingPromo}
              />
              <button
                onClick={handleApplyPromo}
                disabled={applyingPromo || !promoCode.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {applyingPromo ? "Đang xử lý..." : "Áp dụng"}
              </button>
            </div>

            {appliedPromotion && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-[20px]">
                    confirmation_number
                  </span>
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      {appliedPromotion.title}
                    </p>
                    <p className="text-xs text-green-600">
                      Mã: {appliedPromotion.code}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearPromotion}
                  className="text-green-600 hover:text-green-800"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#b51c00] text-white py-3.5 rounded-xl font-bold hover:bg-[#8e1400] transition shadow-md shadow-red-100 active:scale-[0.98]"
            >
              Tiến hành thanh toán
            </button>

            <p className="text-[11px] text-gray-400 text-center mt-4 italic">
              * Giá đã bao gồm thuế VAT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
