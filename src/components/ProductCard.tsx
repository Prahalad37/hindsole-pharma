import { Star, Plus } from 'lucide-react';

interface ProductType {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
}

// 1. onAddToCart prop add karein
interface ProductCardProps {
  product: ProductType;
  onAddToCart: () => void; 
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full border border-emerald-100">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <h3 className="text-gray-900 font-bold text-lg mb-1 line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              {product.originalPrice ? `₹${product.originalPrice}` : ''}
            </span>
            <span className="text-emerald-700 font-bold text-xl">
              ₹{product.price}
            </span>
          </div>
          
          {/* 2. Button par onClick lagayein */}
          <button 
            onClick={onAddToCart}
            className="bg-emerald-50 text-emerald-600 p-2 rounded-full hover:bg-emerald-600 hover:text-white active:scale-90 transition-all duration-200"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};