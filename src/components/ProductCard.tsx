import { Plus, Star } from 'lucide-react';
// 👇 FIX: Added 'type' keyword here
import type { Product } from '../models'; 
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { addToCart } = useShop();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    addToCart(product);
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm">
          {product.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-500">4.8 (120)</span>
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-green-800 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-900">₹{product.price}</span>
          
          <button 
            onClick={handleAddToCart}
            className="bg-green-50 text-green-700 p-2 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95"
            title="Add to Cart"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};