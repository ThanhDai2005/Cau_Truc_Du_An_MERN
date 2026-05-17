import { useNavigate } from "react-router";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/product/${product.slug}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
        {/* Rating badge */}
        {product.numReviews > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-800">
              {product.averageRating.toFixed(1)}
            </span>
          </div>
        )}
        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
              Het hang
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow gap-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug min-h-[40px]">
          {product.name}
        </h3>
        {product.categoryId && typeof product.categoryId === "object" && (
          <p className="text-xs text-gray-400 truncate">{product.categoryId.name}</p>
        )}
        <div className="mt-auto flex items-end justify-between">
          <span className="text-base font-bold text-[#b51c00]">
            {product.price.toLocaleString("vi-VN")}
            <span className="text-xs font-normal ml-0.5">d</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) {
                onAddToCart(product._id);
              } else {
                navigate(`/product/${product.slug}`);
              }
            }}
            disabled={product.stock === 0}
            className="w-8 h-8 rounded-full bg-[#b51c00] text-white flex items-center justify-center hover:bg-[#8e1400] active:scale-90 transition-all shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
