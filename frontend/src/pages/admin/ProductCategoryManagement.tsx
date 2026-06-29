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
import { Search, Plus, Trash2, Loader2, Pencil } from "lucide-react";
import { useAdminCategoryStore } from "@/stores/useAdminCategoryStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductCategoryManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    categories,
    totalPages,
    loading,
    fetchCategories,
    deleteCategory,
    deleteMultiple,
  } = useAdminCategoryStore();

  useEffect(() => {
    fetchCategories(searchTerm, currentPage, limit);
  }, [currentPage, limit, searchTerm, fetchCategories]);

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await deleteCategory(categoryId);
      await fetchCategories(searchTerm, currentPage, limit);
      setSelectedItems(selectedItems.filter((id) => id !== categoryId));
    } catch (error) {
      // Error already handled in store
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedItems.length} danh mục đã chọn?`)) return;

    try {
      await deleteMultiple(selectedItems);
      await fetchCategories(searchTerm, currentPage, limit);
      setSelectedItems([]);
    } catch (error) {
      // Error already handled in store
    }
  };

  const filteredData = categories.filter((item) => {
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredData.map((item) => item._id));
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
                Quản lý danh mục sản phẩm
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
        {/* TITLE & FILTERS */}
        <div>
          <h1 className="text-[24px] font-bold text-gray-900 mb-6 tracking-tight">
            Quản lý danh mục sản phẩm
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Left: Filters */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
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
                className="w-full md:w-40 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#b51c00] focus:border-[#b51c00] bg-white cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] rounded-lg font-semibold text-sm hover:bg-[#ffb4a5] transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Xóa mục đã chọn
              </button>

              <button
                onClick={() => navigate("/admin/product-category/create")}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#b51c00] text-white rounded-lg font-semibold text-sm hover:bg-[#8e1400] shadow-sm shadow-red-500/20 transition-all active:scale-95"
              >
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
                            className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-[#b51c00] cursor-pointer accent-[#b51c00]"
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
                        Ngày tạo
                      </th>
                      <th scope="col" className="px-6 py-4 text-center">
                        Ngày cập nhật
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
                          key={item._id}
                          className="bg-white border-b border-gray-50 hover:bg-[#f8fafc] transition-colors group"
                        >
                          <td className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 bg-white border-gray-300 rounded focus:ring-[#b51c00] cursor-pointer accent-[#b51c00]"
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleSelectItem(item._id)}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {(currentPage - 1) * limit + index + 1}
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
                          <td className="px-6 py-4 text-gray-500 text-center">
                            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-center">
                            {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  navigate(`/admin/product-category/edit/${item._id}`)
                                }
                                className="px-3 py-1.5 border border-[#22c55e] text-[#16a34a] rounded-[6px] text-xs font-bold hover:bg-[#f0fdf4] transition-colors flex items-center gap-1"
                              >
                                <Pencil className="w-3 h-3" />
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="px-3 py-1.5 border border-[#ef4444] text-[#dc2626] rounded-[6px] text-xs font-bold hover:bg-[#fef2f2] transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
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

export default ProductCategoryManagement;
