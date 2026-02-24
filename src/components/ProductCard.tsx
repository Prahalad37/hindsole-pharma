import { useState } from 'react';
import { Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { toSlug } from '../utils/slug';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useShop();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleCardClick = () => {
    navigate(`/product/${toSlug(product.name)}`);
    if (onClick) onClick();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to Cart 🛒`);
  };

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Generate subtitle from benefits or category (2-line fit)
  const subtitle = product.benefits && product.benefits.length >= 2
    ? [product.benefits[0], product.benefits[1]].join(' • ')
    : product.category;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-stone-100 group cursor-pointer flex flex-col h-full relative font-sans"
    >
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-emerald-500 text-white px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-sm tracking-wide">
          {discountPercentage}% OFF
        </div>
      )}

      <div className="relative h-28 sm:h-48 md:h-64 bg-stone-50 overflow-hidden p-2 sm:p-4 md:p-6 flex items-center justify-center group-hover:bg-opacity-80 transition-colors">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Product'; }}
        />
      </div>

      {/* 📝 Content Section */}
      <div className="p-2 pb-3 sm:p-5 sm:pb-6 flex flex-col flex-1 bg-white text-center">

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm sm:text-lg leading-tight mb-1 sm:mb-2 line-clamp-1 group-hover:text-emerald-800 transition-colors">
          {product.name}
        </h3>

        {/* Subtitle (Benefits/Category) - small, 2 lines */}
        <p className="text-[9px] sm:text-[10px] text-stone-500 font-medium mb-1 sm:mb-3 line-clamp-2 leading-tight">
          {subtitle}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-4">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 5) ? "" : "text-stone-200"} />
            ))}
          </div>
          <div className="hidden sm:block h-3 w-[1px] bg-stone-300"></div>
          <span className="text-[10px] sm:text-xs font-bold text-stone-500">{product.reviews || 100}+</span>
        </div>

        <hr className="border-stone-100 mb-1 sm:mb-4 w-full" />

        {/* Price & Pack Info */}
        <div className="mb-1 sm:mb-4">
          <div className="flex items-center justify-center gap-1 sm:gap-3 mb-1 sm:mb-3">
            <span className="text-base sm:text-2xl font-black text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through font-medium">₹{product.originalPrice}</span>
            )}
          </div>

        </div>

        <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center bg-stone-100 border border-stone-200 rounded-md sm:rounded-lg p-0.5 flex-1 min-w-0 justify-center" onClick={e => e.stopPropagation()}>
            <button
              onClick={(e) => handleQuantityChange(e, -1)}
              className="min-w-[26px] min-h-[26px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center text-stone-500 hover:text-black transition-colors text-xs sm:text-sm font-bold"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold text-stone-900">{quantity}</span>
            <button
              onClick={(e) => handleQuantityChange(e, 1)}
              className="min-w-[26px] min-h-[26px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center text-stone-500 hover:text-black transition-colors text-xs sm:text-sm font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 min-w-0 bg-emerald-800 hover:bg-emerald-700 text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide rounded-md sm:rounded-lg py-2 sm:py-2.5 px-2 sm:px-3 transition-colors active:scale-[0.98] whitespace-nowrap"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};