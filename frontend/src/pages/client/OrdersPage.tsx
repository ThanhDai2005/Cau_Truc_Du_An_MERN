import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "@/stores/useOrderStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const statusConfig = {
  Pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: "pending_actions" },
  Processing: { label: "Đang chế biến", color: "bg-blue-100 text-blue-800", icon: "restaurant" },
  Shipped: { label: "Đang giao hàng", color: "bg-purple-100 text-purple-800", icon: "local_shipping" },
  Delivered: { label: "Đã hoàn thành", color: "bg-green-100 text-green-800", icon: "task_alt" },
  Cancelled: { label: "Đã hủy đơn", color: "bg-red-100 text-red-800", icon: "cancel" },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, totalPages, getMyOrders } = useOrderStore();
  const { accessToken } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      navigate("/signin");
      return;
    }
    fetchOrders();
  }, [accessToken, currentPage, filterStatus]);

  const fetchOrders = async () => {
    try {
      await getMyOrders(currentPage, 10, filterStatus || undefined);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đơn hàng");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-48 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 bg-[#f9f9f9] min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>

      {/* Status Filter Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setFilterStatus("")}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            filterStatus === ""
              ? "bg-[#b51c00] text-white shadow-md shadow-red-100"
              : "bg-white text-gray-600 border border-gray-200 hover:border-[#b51c00]/30"
          }`}
        >
          Tất cả
        </button>
        {Object.entries(statusConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterStatus === key
                ? "bg-[#b51c00] text-white shadow-md shadow-red-100"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#b51c00]/30"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{config.icon}</span>
            {config.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[40px] text-gray-300">receipt_long</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-500 mb-8">Bạn chưa thực hiện đơn đặt hàng nào trong trạng thái này</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#b51c00] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#8e1400] transition"
          >
            Khám phá món ngon ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const config = statusConfig[order.orderStatus as keyof typeof statusConfig];
            return (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color.split(" ")[0]}`}>
                      <span className={`material-symbols-outlined ${config.color.split(" ")[1]}`}>
                        {config.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mã đơn hàng</p>
                      <p className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wide ${config.color}`}>
                      {config.label}
                    </span>
                    <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {order.items.slice(0, 2).map((item, idx) => {
                    const product = typeof item.productId === "object" ? item.productId : null;
                    if (!product) return null;
                    return (
                      <div key={idx} className="flex gap-4">
                        <img
                          src={product.images[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl bg-gray-50 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm md:text-base line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500 font-medium mt-1">Số lượng: x{item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    );
                  })}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-400 font-bold bg-gray-50 inline-block px-3 py-1 rounded-full">
                      + {order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 font-medium">Tổng thanh toán:</span>
                    <span className="text-xl font-black text-[#b51c00]">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#b51c00] font-bold text-sm group-hover:gap-2 transition-all">
                    Chi tiết
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                currentPage === page
                  ? "bg-[#b51c00] text-white shadow-md shadow-red-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#b51c00]/30"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
