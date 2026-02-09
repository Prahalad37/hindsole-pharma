import { useState } from 'react';
import { Star } from 'lucide-react'; // Removed Plus, Eye, ShoppingBag as they are not used in V2 footer
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useShop();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
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

  // Generate subtitle from benefits or category
  const subtitle = product.benefits && product.benefits.length >= 2
    ? `${product.benefits[0].slice(0, 15)}... | ${product.benefits[1].slice(0, 15)}...`
    : product.category;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 border border-stone-100 group cursor-pointer flex flex-col h-full relative font-sans"
    >
      {/* 🏷️ Discount Badge (Green Pill) */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm tracking-wide">
          {discountPercentage}% OFF
        </div>
      )}

      {/* 🖼️ Image Section */}
      <div className="relative h-64 bg-stone-50 overflow-hidden p-6 flex items-center justify-center group-hover:bg-opacity-80 transition-colors">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Product'; }}
        />
      </div>

      {/* 📝 Content Section */}
      <div className="p-5 pb-6 flex flex-col flex-1 bg-white text-center">

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-1 group-hover:text-emerald-800 transition-colors">
          {product.name}
        </h3>

        {/* Subtitle (Benefits) */}
        <p className="text-xs text-stone-500 font-medium mb-3 line-clamp-1 h-5">
          {subtitle}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 5) ? "" : "text-stone-200"} />
            ))}
          </div>
          <div className="h-3 w-[1px] bg-stone-300"></div>
          <span className="text-xs font-bold text-stone-500">{product.reviews || 100}+ reviews</span>
        </div>

        {/* Divider */}
        <hr className="border-stone-100 mb-4 w-full" />

        {/* Price & Pack Info */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-stone-400 line-through font-medium">Rs. {product.originalPrice}</span>
            )}
          </div>

          {/* Visual Pack Selector */}
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={e => e.stopPropagation()}>
            <span className="text-xs font-bold text-emerald-900">PACK OF 1</span>
            <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Footer: Controls */}
        <div className="mt-auto flex items-center justify-between gap-3">
          {/* Quantity */}
          <div className="flex items-center bg-stone-100 rounded-lg p-1 w-28 h-11" onClick={e => e.stopPropagation()}>
            <button
              onClick={(e) => handleQuantityChange(e, -1)}
              className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-black transition-colors text-lg font-bold"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="flex-1 text-center font-bold text-stone-900">{quantity}</span>
            <button
              onClick={(e) => handleQuantityChange(e, 1)}
              className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-black transition-colors text-lg font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider rounded-lg h-11 shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};