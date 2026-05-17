import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoryStore } from "@/stores/useCategoryStore";
import type { Product } from "@/types/product";

const ProductList = () => {
  const navigate = useNavigate();
  const { product, loading, getList } = useProductStore();
  const { category, getList: getCategoryList } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getCategoryList();
  }, [getCategoryList]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getList("", selectedCategory, 1, 8, "averageRating", "-1"); // Chỉ lấy 8 items cho HomePage
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [selectedCategory, getList]);

  return (
    <div className="max-w-7xl mx-auto w-full flex-grow mb-16">
      {/* Categories (Horizontal Scroll) */}
      <section className="mt-8 px-4 md:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Danh mục</h2>
          <Link
            to="/products"
            className="text-sm text-[#b51c00] hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {/* Item "Tất cả" */}
          <div
            onClick={() => setSelectedCategory("")}
            className="flex-none w-[72px] md:w-[88px] flex flex-col items-center gap-1 snap-start cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-sm flex items-center justify-center transition-colors ${
                selectedCategory === ""
                  ? "bg-[#b51c00] text-white"
                  : "bg-gray-100"
              }`}
            >
              <span className="material-symbols-outlined text-[32px]">
                restaurant
              </span>
            </div>
            <span
              className={`text-xs text-center font-medium mt-1 ${
                selectedCategory === "" ? "text-[#b51c00]" : "text-gray-700"
              }`}
            >
              Tất cả
            </span>
          </div>

          {/* Render từ API */}
          {category.map((cat) => (
            <div
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className="flex-none w-[72px] md:w-[88px] flex flex-col items-center gap-1 snap-start cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shadow-sm flex items-center justify-center transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-[#b51c00] text-white"
                    : "bg-gray-100"
                }`}
              >
                {/* Fallback to icon if no image provided */}
                <span className="material-symbols-outlined text-[32px]">
                  fastfood
                </span>
              </div>
              <span
                className={`text-xs text-center font-medium mt-1 truncate w-full ${
                  selectedCategory === cat.slug
                    ? "text-[#b51c00]"
                    : "text-gray-700"
                }`}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="mt-12 px-4 md:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Món ăn phổ biến</h2>
        </div>

        {loading && product.length === 0 ? (
          /* Skeleton Loading State Section */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-2 shadow-sm flex flex-col animate-pulse border border-gray-100"
              >
                <div className="w-full h-[140px] md:h-[160px] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-end mt-auto">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : product.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy sản phẩm nào
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {product.map((item: Product) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item.slug}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col group cursor-pointer border border-gray-100 hover:border-gray-300 transition-all duration-300"
              >
                <div className="relative h-[140px] md:h-[160px] overflow-hidden bg-gray-50">
                  <img
                    src={item.images[0] || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
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
                <div className="p-3 flex flex-col grow">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-3">
                    {item.categoryId?.name || "Danh mục chung"}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-base font-bold text-[#b51c00]">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.slug}`);
                      }}
                      disabled={item.stock === 0}
                      className="w-8 h-8 rounded-full bg-[#b51c00]/10 text-[#b51c00] flex items-center justify-center hover:bg-[#b51c00] hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        add
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link
            to="/products"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Xem tất cả món ăn
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductList;
