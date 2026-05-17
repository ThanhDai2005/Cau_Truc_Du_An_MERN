import { useEffect, useState } from "react";
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
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  ordersByStatus: { status: string; count: number }[];
  revenueByDate: { date: string; revenue: number }[];
}

const statusLabels: Record<string, string> = {
  Pending: "Cho xac nhan",
  Processing: "Dang xu ly",
  Shipped: "Dang giao",
  Delivered: "Da giao",
  Cancelled: "Da huy",
};

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      setStats(res.data);
    } catch {
      toast.error("Loi khi tai dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          label: "Nguoi dung",
          value: stats.totalUsers,
          icon: "group",
          color: "bg-blue-50 text-blue-600",
        },
        {
          label: "San pham",
          value: stats.totalProducts,
          icon: "restaurant_menu",
          color: "bg-orange-50 text-orange-600",
        },
        {
          label: "Don hang",
          value: stats.totalOrders,
          icon: "receipt_long",
          color: "bg-green-50 text-green-600",
        },
        {
          label: "Danh muc",
          value: stats.totalCategories,
          icon: "category",
          color: "bg-purple-50 text-purple-600",
        },
      ]
    : [];

  return (
    <>
      <header className="flex items-center h-16 gap-2 px-4 border-b">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Tong quan he thong</h1>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders by Status */}
        {!loading && stats && stats.ordersByStatus?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Don hang theo trang thai</h2>
            <div className="flex flex-wrap gap-3">
              {stats.ordersByStatus.map((item) => (
                <div
                  key={item.status}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    statusColors[item.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="font-bold text-lg">{item.count}</span>
                  <span className="text-sm">{statusLabels[item.status] || item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue by Date */}
        {!loading && stats && stats.revenueByDate?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Doanh thu 7 ngay gan nhat</h2>
            <div className="space-y-2">
              {stats.revenueByDate.map((item) => {
                const maxRevenue = Math.max(...stats.revenueByDate.map((d) => d.revenue));
                const pct = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={item.date} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-28 shrink-0">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 bg-[#b51c00] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-32 text-right shrink-0">
                      {item.revenue.toLocaleString("vi-VN")}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
