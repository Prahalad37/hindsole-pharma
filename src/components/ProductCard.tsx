import { Plus, Eye, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useShop();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Parent click rokne ke liye
    addToCart(product);
    toast.success("Added to Cart 🛒");
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
    >
      
      {/* 🖼️ Image Section (Full Width & Fill) */}
      <div className="relative w-full h-64 bg-gray-50 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Floating Category Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-emerald-100">
          {product.category}
        </div>
      </div>

      {/* 📝 Content Section (Padding ab yahan hai) */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {/* Rating (Optional Visual) */}
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-400">{product.rating || 4.8}</span>
          </div>
        </div>

        {/* Description Snippet (Optional) */}
        <p className="text-xs text-gray-500 font-medium line-clamp-2">
           {product.description || product.type}
        </p>

        {/* Price & Buttons */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-black text-emerald-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through font-bold">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
            >
              <Eye size={18} />
            </button>
            <button 
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center shadow-lg shadow-emerald-200 hover:bg-emerald-800 hover:scale-110 active:scale-95 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};