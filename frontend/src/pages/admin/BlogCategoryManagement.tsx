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

// --- MOCK DATA DỰA THEO HÌNH ẢNH ---
const mockBlogCategories = [
  {
    id: "1",
    name: "Bài thuốc hay",
    status: "active",
  },
  {
    id: "2",
    name: "Dụng cụ nhà bếp",
    status: "active",
  },
  {
    id: "3",
    name: "Món ngon mỗi ngày",
    status: "active",
  },
  {
    id: "4",
    name: "Ẩm thực ngon Việt Nam",
    status: "active",
  },
  {
    id: "5",
    name: "Mẹo vặt nấu nướng",
    status: "active",
  },
];

const CategoryBlogManagement = () => {
  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // --- LOGIC: LỌC DỮ LIỆU ---
  const filteredData = mockBlogCategories.filter((item) => {
    const matchName = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchName && matchStatus;
  });

  // --- LOGIC: CHECKBOX ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredData.map((item) => item.id));
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

  return (
    <div className="bg-[#f7f9fb] min-h-screen pb-12 font-['Inter']">
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
                Quản lý danh mục bài viết
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* TITLE & FILTERS */}
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 mb-6 tracking-tight">
            Quản lý danh mục bài viết
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Left: Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tên danh mục..."
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

            {/* Right: Actions - NÚT XÓA LUÔN HIỆN */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 px-5 py-2 bg-[#ffdad6] text-[#ba1a1a] rounded-[20px] font-semibold text-sm hover:bg-[#ffb4a5] transition-colors active:scale-95 whitespace-nowrap">
                <Trash2 className="w-4 h-4" />
                Xóa mục đã chọn
              </button>

              <button className="flex items-center justify-center gap-2 px-5 py-2 bg-[#b51c00] text-white rounded-[20px] font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                Thêm danh mục
              </button>
            </div>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[18px] font-bold text-gray-900">Danh sách</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[12px] text-gray-500 bg-[#f1f5f9] uppercase font-bold border-b border-gray-200 tracking-wider">
                <tr>
                  <th scope="col" className="p-4 w-12">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#b51c00] bg-white border-gray-300 rounded focus:ring-[#b51c00] cursor-pointer"
                        onChange={handleSelectAll}
                        checked={
                          selectedItems.length === filteredData.length &&
                          filteredData.length > 0
                        }
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4">
                    STT
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tên danh mục
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="bg-white border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#b51c00] bg-white border-gray-300 rounded focus:ring-[#b51c00] cursor-pointer"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-center">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="px-3 py-1.5 border border-[#22c55e] text-[#16a34a] rounded-[6px] text-xs font-bold hover:bg-[#f0fdf4] transition-colors flex items-center gap-1">
                            Sửa
                          </button>
                          <button className="px-3 py-1.5 border border-[#ef4444] text-[#dc2626] rounded-[6px] text-xs font-bold hover:bg-[#fef2f2] transition-colors flex items-center gap-1">
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy danh mục nào.
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
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-[#b51c00] focus:border-[#b51c00] px-3 py-1.5 outline-none cursor-pointer">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
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

export default CategoryBlogManagement;
