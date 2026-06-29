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
import {
  Users,
  Utensils,
  LayoutList,
  DollarSign,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useAdminDashboardStore } from "@/stores/useAdminDashboardStore";

// Import Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { stats, loading, fetchStats } = useAdminDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFilterRevenue = () => {
    if (startDate && endDate) {
      fetchStats(startDate, endDate);
    }
  };

  const orderPieData = [
    { name: "Chờ xử lý", value: stats.orderStatus.pending, color: "#F59E0B" },
    { name: "Đang xử lý", value: stats.orderStatus.processing, color: "#10B981" },
    { name: "Đang giao", value: stats.orderStatus.shipped, color: "#3B82F6" },
    { name: "Hoàn thành", value: stats.orderStatus.delivered, color: "#06B6D4" },
    { name: "Đã hủy", value: stats.orderStatus.cancelled, color: "#EF4444" },
  ];

  return (
    <div className="bg-[#f7f9fb] min-h-screen pb-12">
      {/* HEADER */}
      <header className="flex items-center h-16 gap-2 px-4">
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
              <BreadcrumbPage className="font-bold text-[#b51c00]">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            FoodieVN Admin Dashboard
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#b51c00]" />
          </div>
        ) : (
          <>
            {/* 4 STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 hover:border-[#b51c00]/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <Users size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Số lượng tài khoản
                  </p>
                  <h3 className="text-2xl font-black text-gray-900">
                    {stats.overview.totalUsers}
                  </h3>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 hover:border-[#b51c00]/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                  <ShoppingCart size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Tổng đơn hàng
                  </p>
                  <h3 className="text-2xl font-black text-gray-900">
                    {stats.overview.totalOrders}
                  </h3>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 hover:border-[#b51c00]/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[#06B6D4] text-white flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                  <Utensils size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Số lượng món ăn
                  </p>
                  <h3 className="text-2xl font-black text-gray-900">
                    {stats.overview.totalProducts}
                  </h3>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-4 hover:border-[#b51c00]/30 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                  <LayoutList size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">
                    Số lượng danh mục
                  </p>
                  <h3 className="text-2xl font-black text-gray-900">
                    {stats.overview.totalCategories}
                  </h3>
                </div>
              </div>
            </div>

            {/* SECTION: THỐNG KÊ HÓA ĐƠN (PIE CHART) */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Thống Kê Hóa Đơn
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center h-[350px]">
                {/* Custom Legend (Bên trái) */}
                <div className="col-span-1 flex flex-col gap-3">
                  {orderPieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-md shrink-0 shadow-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium text-gray-600">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pie Chart (Bên phải) */}
                <div className="col-span-1 lg:col-span-2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={0}
                        dataKey="value"
                        label={({
                          cx,
                          cy,
                          midAngle,
                          outerRadius,
                          value,
                        }) => {
                          if (value === 0) return null;
                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius * 1.1;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#4b5563"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              fontSize="12"
                              fontWeight="500"
                            >
                              {value}
                            </text>
                          );
                        }}
                      >
                        {orderPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        }}
                        itemStyle={{ fontWeight: "bold", color: "#191c1e" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* SECTION: BỘ LỌC TÙY CHỈNH (THỐNG KÊ DOANH THU) */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Thống Kê Doanh Thu
              </h2>

              <div className="flex flex-col md:flex-row gap-4 items-end mb-8 border-b border-gray-100 pb-8">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] outline-none text-gray-700 bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>

                <button
                  onClick={handleFilterRevenue}
                  className="h-11 px-8 bg-[#3B82F6] hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-blue-500/20 active:scale-95 whitespace-nowrap w-full md:w-auto"
                >
                  Thống Kê
                </button>
              </div>

              {/* 2 Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tổng doanh thu */}
                <div className="flex items-center gap-5 p-2">
                  <div className="w-20 h-20 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                    <DollarSign size={36} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                      Tổng Doanh Thu
                    </p>
                    <h3 className="text-3xl font-black text-gray-900">
                      {stats.revenueByDateRange.totalRevenue.toLocaleString("vi-VN")} đ
                    </h3>
                  </div>
                </div>

                {/* Số lượng đơn hàng */}
                <div className="flex items-center gap-5 p-2">
                  <div className="w-20 h-20 rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <ShoppingCart size={36} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                      Số Lượng Đơn Hàng
                    </p>
                    <h3 className="text-3xl font-black text-gray-900">
                      {stats.revenueByDateRange.totalOrders}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
