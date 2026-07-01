import React, { useState } from "react";
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
import { Plus, Trash2, Search } from "lucide-react";

// --- MOCK DATA khớp BE ---
const mockPromotions = [
  {
    _id: "1",
    title: "Flash sale cuối năm",
    code: "1WQ",
    description: "Giảm cực sâu cho đơn online",
    discountType: "percentage",
    discountValue: 99,
    minOrderValue: 50000,
    maxDiscountAmount: 200000,
    usageLimit: 5,
    usedCount: 2,
    startDate: "2024-12-22T09:32:00.000Z",
    endDate: "2024-12-23T09:31:00.000Z",
    status: "active",
  },
  {
    _id: "2",
    title: "Mừng Giáng sinh",
    code: "MUNGGIANGSINH",
    description: "Áp dụng cho đơn từ 100k",
    discountType: "percentage",
    discountValue: 25,
    minOrderValue: 100000,
    maxDiscountAmount: 50000,
    usageLimit: 100,
    usedCount: 17,
    startDate: "2024-12-18T20:15:00.000Z",
    endDate: "2024-12-20T23:15:00.000Z",
    status: "active",
  },
  {
    _id: "3",
    title: "Sinh nhật FoodieVN",
    code: "SINHNHAT",
    description: "Chương trình sinh nhật tháng 12",
    discountType: "percentage",
    discountValue: 30,
    minOrderValue: 80000,
    maxDiscountAmount: null,
    usageLimit: null,
    usedCount: 97,
    startDate: "2024-12-08T11:22:00.000Z",
    endDate: "2025-01-05T14:00:00.000Z",
    status: "active",
  },
  {
    _id: "4",
    title: "Happy New Year 2025",
    code: "HPNY2025",
    description: "Chào năm mới",
    discountType: "percentage",
    discountValue: 25,
    minOrderValue: 0,
    maxDiscountAmount: 30000,
    usageLimit: 50,
    usedCount: 10,
    startDate: "2024-12-08T11:21:00.000Z",
    endDate: "2024-12-10T19:00:00.000Z",
    status: "inactive",
  },
  {
    _id: "5",
    title: "Freeship nội thành",
    code: "FREESHIP50K",
    description: "Giảm cố định 50k cho ship",
    discountType: "fixed",
    discountValue: 50000,
    minOrderValue: 150000,
    maxDiscountAmount: null,
    usageLimit: 200,
    usedCount: 45,
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: "2025-01-31T23:59:00.000Z",
    status: "active",
  },
];

// --- HELPERS ---
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
    second: "2-digit",
  });
  return { date, time };
};

const formatDiscount = (item) => {
  if (item.discountType === "percentage") {
    return `${item.discountValue}%`;
  }
  return formatCurrency(item.discountValue);
};

const discountTypeLabel: Record<DiscountType, string> = {
  percentage: "Phần trăm",
  fixed: "Cố định",
};

const statusLabel = {
  active: "Hoạt động",
  inactive: "Tạm dừng",
};

const PromotionManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredData = mockPromotions.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      discountTypeLabel[item.discountType].toLowerCase().includes(q)
    );
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredData.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="bg-[#f7f9fb] min-h-screen pb-12 font-['Inter']">
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
              Quản lý khuyến mãi
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              FoodieVN Admin Dashboard
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              disabled={selectedItems.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#ffdad6] text-[#ba1a1a] rounded-[20px] font-semibold text-sm hover:bg-[#ffb4a5] transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Xóa mục đã chọn
            </button>

            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#b51c00] text-white rounded-[20px] font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Thêm khuyến mãi
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden flex flex-col mt-4">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-[18px] font-bold text-gray-900">Danh sách</h2>

            <div className="relative w-full sm:w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm mã, tiêu đề, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] bg-white transition-shadow"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[12px] text-gray-500 bg-[#f1f5f9] uppercase font-bold border-b border-gray-200 tracking-wider">
                <tr>
                  <th scope="col" className="p-4 w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-2 border-gray-300 cursor-pointer accent-[#b51c00]"
                      onChange={handleSelectAll}
                      checked={
                        selectedItems.length === filteredData.length &&
                        filteredData.length > 0
                      }
                    />
                  </th>
                  <th scope="col" className="px-4 py-4 text-center">
                    STT
                  </th>
                  <th scope="col" className="px-4 py-4 text-center">
                    Mã
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center leading-tight"
                  >
                    Giảm
                    <br />
                    giá
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center leading-tight"
                  >
                    Loại
                    <br />
                    giảm
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center leading-tight"
                  >
                    Số lần
                    <br />
                    dùng
                  </th>
                  <th scope="col" className="px-4 py-4 text-center">
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center leading-tight"
                  >
                    Ngày bắt
                    <br />
                    đầu
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-4 text-center leading-tight"
                  >
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
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => {
                    const start = formatDateTime(item.startDate);
                    const end = formatDateTime(item.endDate);
                    const isPercentage = item.discountType === "percentage";

                    return (
                      <tr
                        key={item._id}
                        className="bg-white border-b border-gray-50 hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded-sm border-2 border-gray-300 cursor-pointer accent-[#b51c00]"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                          />
                        </td>

                        <td className="px-4 py-5 font-bold text-gray-900 text-center">
                          {index + 1}
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
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.status === "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {statusLabel[item.status]}
                          </span>
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
                            <button className="px-3 py-1.5 border border-[#22c55e] text-[#16a34a] rounded-[6px] text-[13px] font-bold hover:bg-[#f0fdf4] transition-colors whitespace-nowrap">
                              Sửa
                            </button>
                            <button className="px-3 py-1.5 border border-[#ef4444] text-[#dc2626] rounded-[6px] text-[13px] font-bold hover:bg-[#fef2f2] transition-colors whitespace-nowrap">
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy khuyến mãi nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination giữ nguyên */}
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-sm text-gray-500">Số lượng mục</span>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#b51c00] focus:border-[#b51c00] px-3 py-1.5 outline-none cursor-pointer">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-[#b51c00] hover:border-[#b51c00] transition-colors disabled:opacity-50">
                &lt;
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#b51c00] bg-[#b51c00] text-white font-semibold text-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:text-[#b51c00] hover:border-[#b51c00] font-semibold text-sm transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-[#b51c00] hover:border-[#b51c00] transition-colors disabled:opacity-50">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionManagement;
