import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';
import { Search, PackageSearch } from 'lucide-react'; // Visual help ke liye

export const Shop = () => {
  const { products } = useShop(); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // Local search filter

  const safeProducts = products || [];

  // 1. Categories logic
  const categories = ["All", ...new Set(safeProducts.map(p => p.category))];

  // 2. Multi-filter: Category + Search
  const filteredProducts = safeProducts.filter(p => {
    const matchesCategory = category === "All" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-emerald-950 mb-4 font-serif">Our Medicines</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto italic">
            Authentic Ayurvedic formulations for your holistic well-being.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Categories Tab */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 order-2 md:order-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  category === cat
                    ? "bg-emerald-800 text-white shadow-lg shadow-emerald-200 scale-105"
                    : "bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-100 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72 order-1 md:order-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search medicine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Products Grid */}
        {safeProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Checking inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <PackageSearch size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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

      {/* Product Modal Overlay */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};