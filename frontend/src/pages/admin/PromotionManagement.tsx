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
import { Search, Plus, Trash2, Loader2, Pencil, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminPromotionStore } from "@/stores/useAdminPromotionStore";
import { toast } from "sonner";

const PromotionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    promotions,
    totalPages,
    loading,
    fetchPromotions,
    changeStatus,
    changeMulti,
    deleteItem,
  } = useAdminPromotionStore();

  useEffect(() => {
    const status = statusFilter !== "all" ? statusFilter : "";
    fetchPromotions(searchTerm, status, currentPage, limit);
  }, [currentPage, limit, searchTerm, statusFilter, fetchPromotions]);

  const refetchPromotions = async () => {
    const status = statusFilter !== "all" ? statusFilter : "";
    await fetchPromotions(searchTerm, status, currentPage, limit);
  };

  const handleChangeStatus = async (
    promotionId: string,
    status: "active" | "inactive",
  ) => {
    const action = status === "active" ? "khôi phục" : "ngưng hoạt động";
    if (!confirm(`Bạn có chắc chắn muốn ${action} khuyến mãi này?`)) return;

    try {
      await changeStatus(promotionId, status);
      await refetchPromotions();
      setSelectedItems(selectedItems.filter((id) => id !== promotionId));
    } catch (error) {
      // Error already handled in store
    }
  };

  const handleDeleteItem = async (promotionId: string) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn XÓA VĨNH VIỄN khuyến mãi này? Hành động này không thể hoàn tác!",
      )
    )
      return;

    try {
      await deleteItem(promotionId);
      await refetchPromotions();
      setSelectedItems(selectedItems.filter((id) => id !== promotionId));
    } catch (error) {
      // Error already handled in store
    }
  };

  const handleBulkAction = async (
    type: "active" | "inactive" | "delete-all",
  ) => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một khuyến mãi");
      return;
    }

    const messages = {
      active: `khôi phục ${selectedItems.length} khuyến mãi`,
      inactive: `chuyển sang ngưng hoạt động ${selectedItems.length} khuyến mãi`,
      "delete-all": `XÓA VĨNH VIỄN ${selectedItems.length} khuyến mãi`,
    };

    if (!confirm(`Bạn có chắc chắn muốn ${messages[type]}?`)) return;

    try {
      await changeMulti(selectedItems, type);
      await refetchPromotions();
      setSelectedItems([]);
    } catch (error) {
      // Error already handled in store
    }
  };

  const selectedPromotions = promotions.filter((p) =>
    selectedItems.includes(p._id),
  );
  const hasActiveSelected = selectedPromotions.some((p) => p.status === "active");
  const hasInactiveSelected = selectedPromotions.some(
    (p) => p.status === "inactive",
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(promotions.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString("vi-VN");
    const time = d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const formatDiscount = (item: any) => {
    if (item.discountType === "percentage") {
      return `${item.discountValue}%`;
    }
    return formatCurrency(item.discountValue);
  };

  const discountTypeLabel: Record<string, string> = {
    percentage: "Phần trăm",
    fixed: "Cố định",
  };

  const statusLabel: Record<string, string> = {
    active: "Hoạt động",
    inactive: "Tạm dừng",
  };

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
              <BreadcrumbPage className="font-bold text-[#b51c00]">
                Quản lý khuyến mãi
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* TITLE & FILTERS */}
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 mb-6 tracking-tight">
            Quản lý khuyến mãi
          </h1>

          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            {/* Left: Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm mã, tiêu đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] bg-white transition-shadow"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] bg-white cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              {hasInactiveSelected && (
                <button
                  onClick={() => handleBulkAction("active")}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#ffc1cc] text-[#c2185b] rounded-[20px] font-semibold text-sm hover:bg-[#ffadc0] transition-colors active:scale-95 whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  Khôi phục mục đã chọn
                </button>
              )}

              {hasActiveSelected && (
                <button
                  onClick={() => handleBulkAction("inactive")}
                  disabled={selectedItems.length === 0}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#ffdad6] text-[#ba1a1a] rounded-[20px] font-semibold text-sm hover:bg-[#ffb4a5] transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa mục đã chọn
                </button>
              )}

              {hasInactiveSelected && (
                <button
                  onClick={() => handleBulkAction("delete-all")}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#fee2e2] text-[#991b1b] rounded-[20px] font-semibold text-sm hover:bg-[#fecaca] transition-colors active:scale-95 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa vĩnh viễn đã chọn
                </button>
              )}

              <button
                onClick={() => navigate("/admin/promotion/create")}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#b51c00] text-white rounded-[20px] font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Thêm khuyến mãi
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[18px] font-bold text-gray-900">Danh sách</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#b51c00]" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[12px] text-gray-500 bg-[#f1f5f9] uppercase font-bold border-b border-gray-200 tracking-wider">
                    <tr>
                      <th scope="col" className="p-4 w-12">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                            onChange={handleSelectAll}
                            checked={
                              selectedItems.length === promotions.length &&
                              promotions.length > 0
                            }
                          />
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-4 text-center">
                        STT
                      </th>
                      <th scope="col" className="px-4 py-4 text-center">
                        Mã
                      </th>
                      <th scope="col" className="px-4 py-4 text-center leading-tight">
                        Giảm
                        <br />
                        giá
                      </th>
                      <th scope="col" className="px-4 py-4 text-center leading-tight">
                        Loại
                        <br />
                        giảm
                      </th>
                      <th scope="col" className="px-4 py-4 text-center leading-tight">
                        Số lần
                        <br />
                        dùng
                      </th>
                      <th scope="col" className="px-4 py-4 text-center">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-4 py-4 text-center leading-tight">
                        Ngày bắt
                        <br />
                        đầu
                      </th>
                      <th scope="col" className="px-4 py-4 text-center leading-tight">
                        Ngày kết
                        <br />
                        thúc
                      </th>
                      <th scope="col" className="px-4 py-4 text-center">
                        Thao tác
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {promotions.length > 0 ? (
                      promotions.map((item, index) => {
                        const start = formatDateTime(item.startDate);
                        const end = formatDateTime(item.endDate);
                        const isPercentage = item.discountType === "percentage";

                        return (
                          <tr
                            key={item._id}
                            className="bg-white border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group"
                          >
                            <td className="p-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                                  checked={selectedItems.includes(item._id)}
                                  onChange={() => handleSelectItem(item._id)}
                                />
                              </div>
                            </td>

                            <td className="px-4 py-5 font-bold text-gray-900 text-center">
                              {(currentPage - 1) * limit + index + 1}
                            </td>

                            <td className="px-4 py-5 font-semibold text-gray-900 text-center">
                              {item.code}
                            </td>

                            <td className="px-4 py-5 text-center">
                              <span
                                className={`inline-flex items-center justify-center px-2 py-1 rounded-[4px] text-[12px] font-bold text-white min-w-[36px] ${
                                  isPercentage ? "bg-[#22c55e]" : "bg-[#3b82f6]"
                                }`}
                              >
                                {formatDiscount(item)}
                              </span>
                              {isPercentage && item.maxDiscountAmount && (
                                <div className="text-[11px] text-gray-400 mt-1">
                                  Tối đa {formatCurrency(item.maxDiscountAmount)}
                                </div>
                              )}
                              {item.minOrderValue > 0 && (
                                <div className="text-[11px] text-gray-400 mt-1">
                                  ĐH tối thiểu {formatCurrency(item.minOrderValue)}
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-5 font-medium text-gray-700 text-center whitespace-nowrap">
                              {discountTypeLabel[item.discountType]}
                            </td>

                            <td className="px-4 py-5 font-bold text-gray-700 text-center">
                              {item.usedCount}
                              {item.usageLimit !== null && (
                                <span className="text-gray-400 font-medium">
                                  {" "}
                                  / {item.usageLimit}
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-5 text-center">
                              {item.status === "active" ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-[#d1fae5] text-[#15803d]">
                                  Hoạt động
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-[#fee2e2] text-[#b91c1c]">
                                  Ngưng hoạt động
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-5 text-gray-500 font-medium text-center whitespace-nowrap">
                              {start.date}
                              <br />
                              {start.time}
                            </td>

                            <td className="px-4 py-5 text-gray-500 font-medium text-center whitespace-nowrap">
                              {end.date}
                              <br />
                              {end.time}
                            </td>

                            <td className="px-4 py-5">
                              <div className="flex items-center justify-center gap-2">
                                {item.status === "active" ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/admin/promotion/edit/${item._id}`,
                                        )
                                      }
                                      className="px-3 py-1.5 border border-[#22c55e] text-[#16a34a] rounded-[6px] text-xs font-bold hover:bg-[#f0fdf4] transition-colors flex items-center gap-1"
                                    >
                                      <Pencil className="w-3 h-3" />
                                      Sửa
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleChangeStatus(item._id, "inactive")
                                      }
                                      className="px-3 py-1.5 border border-[#ef4444] text-[#dc2626] rounded-[6px] text-xs font-bold hover:bg-[#fef2f2] transition-colors flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Xóa
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleChangeStatus(item._id, "active")
                                      }
                                      className="px-3 py-1.5 border border-[#ec4899] text-[#db2777] rounded-[6px] text-xs font-bold hover:bg-[#fdf2f8] transition-colors flex items-center gap-1"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      Khôi phục
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item._id)}
                                      className="px-3 py-1.5 border border-[#ef4444] text-[#dc2626] rounded-[6px] text-xs font-bold hover:bg-[#fef2f2] transition-colors flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Xóa vĩnh viễn
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={10}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          Không tìm thấy khuyến mãi nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                  <span className="text-sm text-gray-500">Số lượng mục</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#b51c00] focus:border-[#b51c00] px-3 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-[#b51c00] hover:border-[#b51c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border font-semibold text-sm transition-colors ${
                          currentPage === page
                            ? "border-[#b51c00] bg-[#b51c00] text-white"
                            : "border-gray-200 text-gray-600 hover:text-[#b51c00] hover:border-[#b51c00]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-[#b51c00] hover:border-[#b51c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionManagement;
