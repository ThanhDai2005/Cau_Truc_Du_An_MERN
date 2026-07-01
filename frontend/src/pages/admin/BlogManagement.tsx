"use client";

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
import { Plus, Trash2, Search, Image as ImageIcon } from "lucide-react";

// --- MOCK DATA DỰA THEO HÌNH ẢNH ---
const mockBlogs = [
  {
    id: "1",
    title: "Nướng cá khô bằng nồi chiên không dầu, lò vi sóng hay lò nướng?",
    author: "long",
    image: "", // Trống theo hình
  },
  {
    id: "2",
    title: "Rau nhíp là gì? Những món ăn ngon từ rau nhíp",
    author: "long",
    image: "",
  },
  {
    id: "3",
    title: "Bánh cuốn tôm chua -đặc sản bình dị xứ Huế",
    author: "long",
    image: "",
  },
  {
    id: "4",
    title: "Độc đáo Bánh xèo cá kình làng Chuồn, thử là mê",
    author: "long",
    image: "",
  },
];

const BlogManagement = () => {
  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // --- LOGIC: LỌC DỮ LIỆU ---
  const filteredData = mockBlogs.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchLower) ||
      item.author.toLowerCase().includes(searchLower)
    );
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
                Quản lý bài viết
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* TITLE & GLOBAL ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
            Quản lý bài viết
          </h1>

          {/* Right: Actions - NÚT XÓA LUÔN HIỆN */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-5 py-2 bg-[#ffdad6] text-[#ba1a1a] rounded-[20px] font-semibold text-sm hover:bg-[#ffb4a5] transition-colors active:scale-95 whitespace-nowrap">
              <Trash2 className="w-4 h-4" />
              Xóa mục đã chọn
            </button>

            <button className="flex items-center justify-center gap-2 px-5 py-2 bg-[#b51c00] text-white rounded-[20px] font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all active:scale-95 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Thêm bài viết
            </button>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200 overflow-hidden flex flex-col">
          {/* Table Header & Search (Giống hệt hình ảnh) */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-[18px] font-bold text-gray-900">Danh sách</h2>

            {/* Search Bar nằm trong Table Card */}
            <div className="relative w-full sm:w-[350px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết hoặc tác giả ở đây!"
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
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
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
                  <th scope="col" className="px-6 py-4 text-center">
                    Tiêu đề
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Tác giả
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Hình ảnh
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
                            className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-5 font-semibold text-gray-900 text-center max-w-xs">
                        {item.title}
                      </td>
                      <td className="px-6 py-5 font-medium text-gray-600 text-center">
                        {item.author}
                      </td>
                      <td className="px-6 py-5 flex justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-12 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-50 border border-gray-100 border-dashed rounded-md flex items-center justify-center text-gray-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
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
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy bài viết nào.
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

export default BlogManagement;
