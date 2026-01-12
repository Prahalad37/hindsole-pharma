import { useState, useEffect } from 'react';
import { ArrowRight, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal'; // 1. Import

export const Shop = () => {
  const { addToCart, searchQuery } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // 2. State added

  // ... Logic same rahega ...
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (selectedCategory === "All" || p.category === selectedCategory)
  );
  
  const slides = [
    { image: "https://images.unsplash.com/photo-1540439868363-9ad897bc19b8?auto=format&fit=crop&q=80&w=1600", title: "Authentic Wellness", subtitle: "Up to 30% Off" },
    { image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600", title: "Pure Skincare", subtitle: "Flat 20% Off" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="animate-in fade-in duration-500">
      {/* ... Slider & Showcase Code SAME ... */}
      <div className="relative h-[450px] w-full overflow-hidden bg-emerald-900">
          {slides.map((s, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={s.image} className="w-full h-full object-cover opacity-40" alt="" />
              <div className="absolute inset-0 flex items-center px-10 md:px-20 text-white"><h1 className="text-5xl md:text-7xl font-black max-w-3xl leading-none">{s.title}</h1></div>
            </div>
          ))}
      </div>

      <div className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8"><div><span className="text-emerald-600 font-bold uppercase text-xs">Handpicked</span><h2 className="text-3xl md:text-4xl font-black text-gray-900">Featured</h2></div><button className="hidden md:flex items-center gap-2 font-bold text-gray-500 hover:text-emerald-600">View All <ArrowRight size={18}/></button></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Winter Care', 'Stress Relief', 'Daily Detox'].map((title, i) => (
              <div key={i} className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg"><img src={`https://images.unsplash.com/photo-${i===0?'1611073123041-860d1d3ee59e':i===1?'1544367567-0f2fcb009e0b':'1596755389378-c31d21fd1273'}?auto=format&fit=crop&q=80&w=600`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} /><div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" /><div className="absolute bottom-0 left-0 p-6 text-white"><h3 className="text-2xl font-black">{title}</h3></div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
            <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 h-fit">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Filter size={20}/> Categories</h3>
              <div className="flex flex-col gap-2">{categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{cat}</button>))}</div>
            </aside>
            <div className="flex-1">
                <div className="md:hidden sticky top-20 z-40 bg-white py-4 mb-6 border-b"><div className="flex gap-3 overflow-x-auto no-scrollbar">{categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{cat}</button>))}</div></div>
                <div className="flex items-center justify-between mb-8"><h2 className="text-2xl md:text-3xl font-black">{selectedCategory}</h2><span className="text-gray-400 font-bold">{filteredProducts.length} Items</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(p => (
                    // 3. Update onClick to set selectedProduct
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                      <ProductCard product={p} onAddToCart={(e:any) => {e.stopPropagation(); addToCart(p);}} />
                    </div>
                  ))}
                </div>
            </div>
          </div>
      </div>

      {/* 4. Add Modal Component */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};