import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import type { Product } from "@/types/product";

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { product, loading, getList } = useProductStore();
  const { category, getList: getCategoryList } = useCategoryStore();

  const keyword = searchParams.get("keyword") || "";
  const selectedCategory = searchParams.get("category") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortKey = searchParams.get("sortKey") || "averageRating";
  const sortValue = searchParams.get("sortValue") || "-1";
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getCategoryList();
  }, [getCategoryList]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getList(
          keyword,
          selectedCategory,
          currentPage,
          12,
          sortKey,
          sortValue,
        );
        if (response) {
          setTotalPages(response.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword, selectedCategory, currentPage, sortKey, sortValue, getList]);

  const updateURL = (newParams: Record<string, string>) => {
    const params = Object.fromEntries(searchParams.entries());
    const mergedParams = { ...params, ...newParams };

    Object.keys(mergedParams).forEach((key) => {
      if (!mergedParams[key] || (key === "page" && mergedParams[key] === "1")) {
        delete mergedParams[key];
      }
    });

    setSearchParams(mergedParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    updateURL({ keyword: input.value, page: "1" });
  };

  const handleCategoryChange = (slug: string) => {
    updateURL({ category: slug, page: "1" });
  };

  const handleSortChange = (key: string, value: string) => {
    updateURL({ sortKey: key, sortValue: value, page: "1" });
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Mobile Search Bar */}
      <div className="md:hidden w-full mb-4">
        <form onSubmit={handleSearch} className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            defaultValue={keyword}
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#b51c00] focus:ring-1 focus:ring-[#b51c00] shadow-sm text-sm"
            placeholder="Tìm kiếm món ăn..."
            type="text"
          />
        </form>
      </div>

      {/* Sidebar Filters */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Danh mục
          </h2>
          <ul className="space-y-2 mb-8">
            <li>
              <button
                onClick={() => handleCategoryChange("")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === ""
                    ? "bg-red-50 text-[#b51c00] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Tất cả món ăn
              </button>
            </li>
            {category.map((cat) => (
              <li key={cat._id}>
                <button
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-red-50 text-[#b51c00] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Sắp xếp
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleSortChange("createdAt", "-1")}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                  (sortKey === "createdAt" || sortKey === "") &&
                  sortValue === "-1"
                    ? "bg-red-50 text-[#b51c00] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Mới nhất
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSortChange("price", "1")}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                  sortKey === "price" && sortValue === "1"
                    ? "bg-red-50 text-[#b51c00] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Giá thấp đến cao
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSortChange("price", "-1")}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                  sortKey === "price" && sortValue === "-1"
                    ? "bg-red-50 text-[#b51c00] font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Giá cao xuống thấp
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">
            Hiển thị{" "}
            <strong className="text-gray-900 font-semibold">
              {product.length}
            </strong>{" "}
            sản phẩm
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline-block">
              Sắp xếp:
            </span>
            <select
              className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 py-0 text-sm focus:outline-none focus:border-[#b51c00] text-gray-700 cursor-pointer"
              value={`${sortKey}|${sortValue}`}
              onChange={(e) => {
                const [k, v] = e.target.value.split("|");
                handleSortChange(k, v);
              }}
            >
              <option value="|">Phổ biến nhất</option>
              <option value="createdAt|-1">Mới nhất</option>
              <option value="price|1">Giá thấp đến cao</option>
              <option value="price|-1">Giá cao xuống thấp</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-2 shadow-sm animate-pulse border border-gray-100"
              >
                <div className="w-full h-[140px] md:h-[160px] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              </div>
            ))}
          </div>
        ) : product.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-gray-300 mb-4">
              search_off
            </span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500">
              Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {product.map((item: Product) => (
              <article
                key={item._id}
                onClick={() => navigate(`/product/${item.slug}`)}
                className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col group border border-transparent hover:border-[#b51c00]/30 transition-all duration-300 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.images[0] || "/placeholder.png"}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span
                      className="material-symbols-outlined text-yellow-500"
                      style={{
                        fontSize: "14px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      star
                    </span>
                    <span className="text-xs font-semibold text-gray-800">
                      {item.averageRating.toFixed(1)}
                    </span>
                  </div>
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-grow gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {item.name}
                  </h3>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="text-base font-bold text-[#b51c00]">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.slug}`);
                      }}
                      disabled={item.stock === 0}
                      className="w-8 h-8 rounded-full bg-[#b51c00] text-white flex items-center justify-center hover:bg-[#8e1400] active:scale-90 transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-300"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "18px" }}
                      >
                        add
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => {
                updateURL({ page: (currentPage - 1).toString() });
              }}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                chevron_left
              </span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  updateURL({ page: page.toString() });
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#b51c00] text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => {
                updateURL({ page: (currentPage + 1).toString() });
              }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                chevron_right
              </span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
