import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';
import { Search, PackageSearch, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Shop = () => {
  const { products } = useShop();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // Sync category with URL directly
  const category = searchParams.get("category") || "All";

  const setCategory = (newCategory: string) => {
    if (newCategory === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: newCategory });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Sidebar States
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    tags: true,
    collections: true
  });

  const safeProducts = products || [];
  // const uniqueCategories = new Set(safeProducts.map(p => p.category));
  // const categories = ["All", ...uniqueCategories];

  // Mock Tags based on Image
  const tags = ["Inhaler", "Capsule", "Tablet", "Ayurvedic kadha", "Oil", "Chyawanprash", "Ointment"];
  const collections = ["Fitness", "Mens Health", "Immunity And Wellness", "Womens Health", "Piles Care", "Liver Care", "Livitup", "Diabetes", "Digestive Care", "Pain Management"];

  // Multi-filter logic
  const filteredProducts = safeProducts.filter(p => {
    const matchesCategory = category === "All" || p.category === category || p.form === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-white min-h-screen pt-4 pb-20">
      {/* Header / Breadcrumb Placeholder */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 mb-8 text-center">
        <SEO
          title="Shop"
          description="Browse our extensive collection of healthcare products. Filter by category, price, and find the best deals on medicines and wellness items."
        />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-sm text-gray-500">Home / All Products</p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR FILTERS (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          </div>

          {/* Tags Section */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('tags')}
              className="w-full flex items-center justify-between text-left font-bold text-gray-700 hover:text-emerald-700 mb-4"
            >
              <span>Tags</span>
              {openSections.tags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.tags && (
              <div className="space-y-2 pl-1 animate-in slide-in-from-top-2 duration-200">
                {tags.map(tag => (
                  <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                      {/* Fake Checkbox for visual only since data doesn't map 1:1 yet */}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-emerald-700 transition-colors">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Collections Section */}
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between text-left font-bold text-gray-700 hover:text-emerald-700 mb-4"
            >
              <span>Collections</span>
              {openSections.collections ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.collections && (
              <div className="space-y-2 pl-1 animate-in slide-in-from-top-2 duration-200">
                {collections.map(col => (
                  <button
                    key={col}
                    onClick={() => setCategory(col === "Immunity And Wellness" ? "Immunity" : col)} // Mapping example
                    className={`block w-full text-left text-sm transition-colors ${category === col ? 'font-bold text-emerald-700' : 'text-gray-600 hover:text-emerald-700'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* MOBILE FILTER TOGGLE */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-2 rounded-lg font-bold text-sm border border-emerald-100"
          >
            <Filter size={16} /> Filters
          </button>

          <div className="relative flex-1 ml-4 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="flex-1">

          {/* Top Bar (Desktop Search + Sort) */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Sort by:</span>
              <select className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer">
                <option>Best selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {safeProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-900 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <PackageSearch size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No products found</h3>
              <p className="text-gray-500 text-sm">Try changing filters or search term.</p>
              <button onClick={() => { setCategory('All'); setSearchTerm(''); }} className="mt-4 text-emerald-600 font-bold hover:underline text-sm">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>

      {/* Product Modal Overlay */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Mobile Filter Drawer (Simple Overlay for now) */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-80 h-full bg-white p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}><X size={24} /></button>
            </div>
            {/* Re-use content or simplified version for mobile */}
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-3">Collections</h3>
                <div className="space-y-2">
                  {collections.map(col => (
                    <button
                      key={col}
                      onClick={() => { setCategory(col === "Immunity And Wellness" ? "Immunity" : col); setIsMobileFiltersOpen(false); }}
                      className={`block w-full text-left py-1 text-sm ${category === col ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};