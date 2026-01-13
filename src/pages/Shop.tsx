import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useShop } from '../context/ShopContext';
// 👇 FIX: Added 'type' here
import type { Product } from '../models';

export const Shop = () => {
  const { products } = useShop(); 
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = category === "All" 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Our Medicines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Authentic Ayurvedic formulations for your holistic well-being.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category === cat
                  ? "bg-green-800 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-800 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading medicines from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => setSelectedProduct(product)} 
              />
            ))}
          </div>
        )}

      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};