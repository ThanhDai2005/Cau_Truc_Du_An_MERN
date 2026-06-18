import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOrderStore } from "@/stores/useOrderStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const statusConfig = {
  Pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-800",
    icon: "pending_actions",
    step: 1,
  },
  Processing: {
    label: "Đang chế biến",
    color: "bg-blue-100 text-blue-800",
    icon: "restaurant",
    step: 2,
  },
  Shipped: {
    label: "Đang giao hàng",
    color: "bg-purple-100 text-purple-800",
    icon: "local_shipping",
    step: 3,
  },
  Delivered: {
    label: "Đã hoàn thành",
    color: "bg-green-100 text-green-800",
    icon: "task_alt",
    step: 4,
  },
  Cancelled: {
    label: "Đã hủy đơn",
    color: "bg-red-100 text-red-800",
    icon: "cancel",
    step: 0,
  },
};

const paymentLabels = {
  COD: "Thanh toán tiền mặt khi nhận hàng (COD)",
  VNPAY: "Ví VNPAY",
  MOMO: "Ví MoMo",
  STRIPE: "Thẻ tín dụng/Ghi nợ",
};

const paymentStatusLabels = {
  Pending: { label: "Chưa thanh toán", color: "text-yellow-600 bg-yellow-50" },
  Paid: { label: "Đã thanh toán", color: "text-green-600 bg-green-50" },
  Failed: { label: "Thất bại", color: "text-red-600 bg-red-50" },
  Refunded: { label: "Đã hoàn tiền", color: "text-gray-600 bg-gray-50" },
};

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentOrder, loading, getOrderDetail } = useOrderStore();

  const fetchOrder = async () => {
    try {
      await getOrderDetail(orderId!);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải đơn hàng");
      navigate("/orders");
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading || !currentOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const config = statusConfig[order.orderStatus as keyof typeof statusConfig];
  const currentStep = config.step;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 bg-[#f9f9f9] min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#b51c00] transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Quay lại danh sách đơn hàng
        </button>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">tag</span>
              #{order._id.toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">
              Trạng thái:
            </span>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${config.color}`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {config.icon}
              </span>
              {config.label}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Tracking (Show only if not cancelled) */}
          {order.orderStatus !== "Cancelled" && (
            <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-6">
                Tiến trình đơn hàng
              </h2>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b51c00] transition-all duration-1000 ease-out"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="relative flex justify-between">
                  {[1, 2, 3, 4].map((step) => {
                    const isActive = step <= currentStep;
                    const isCurrent = step === currentStep;
                    const labels = [
                      "Chờ xác nhận",
                      "Đang chế biến",
                      "Đang giao",
                      "Hoàn thành",
                    ];
                    const icons = [
                      "pending_actions",
                      "restaurant",
                      "local_shipping",
                      "task_alt",
                    ];

                    return (
                      <div
                        key={step}
                        className="flex flex-col items-center gap-2 w-20 relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                            isActive
                              ? "bg-[#b51c00] text-white shadow-md shadow-red-100"
                              : "bg-white border-2 border-gray-200 text-gray-300"
                          } ${isCurrent ? "ring-4 ring-red-50" : ""}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {icons[step - 1]}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider text-center ${
                            isActive ? "text-[#b51c00]" : "text-gray-400"
                          }`}
                        >
                          {labels[step - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
              <span className="material-symbols-outlined text-[#b51c00]">
                restaurant_menu
              </span>
              Món ăn đã đặt
            </h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => {
                const product =
                  typeof item.productId === "object" ? item.productId : null;
                if (!product) return null;
                return (
                  <div
                    key={idx}
                    className="flex gap-4 pb-4 border-b border-gray-50 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col">
                          <p className="text-xs text-gray-500 font-medium">
                            Đơn giá: {item.price.toLocaleString("vi-VN")}đ
                          </p>
                          <p className="text-xs font-bold text-[#b51c00] mt-1 bg-red-50 px-2 py-0.5 rounded inline-block w-max">
                            SL: x{item.quantity}
                          </p>
                        </div>
                        <p className="font-black text-gray-900 text-lg">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b51c00]">
                location_on
              </span>
              Thông tin nhận hàng
            </h2>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">
                  person
                </span>
                <p className="font-bold text-gray-900 text-sm">
                  {order.shippingAddress.recipient}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">
                  call
                </span>
                <p className="text-sm text-gray-700 font-medium">
                  {order.shippingAddress.phone}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0 mt-0.5">
                  home_pin
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.shippingAddress.address}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-4">
              <span className="material-symbols-outlined text-[#b51c00]">
                receipt_long
              </span>
              Thanh toán
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Tạm tính</span>
                <span className="font-bold text-gray-900">
                  {(order.totalAmount - order.shippingFee).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Phí giao hàng</span>
                <span className="font-bold text-gray-900">
                  {order.shippingFee.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="text-gray-900 font-black">Tổng cộng</span>
                <span className="text-2xl font-black text-[#b51c00]">
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-50">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Phương thức
                </span>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-gray-400">
                    payments
                  </span>
                  {
                    paymentLabels[
                      order.paymentMethod as keyof typeof paymentLabels
                    ]
                  }
                </p>
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Trạng thái
                </span>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${paymentStatusLabels[order.paymentStatus as keyof typeof paymentStatusLabels].color}`}
                  >
                    {
                      paymentStatusLabels[
                        order.paymentStatus as keyof typeof paymentStatusLabels
                      ].label
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-center">
              <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
