import { useState, useEffect } from 'react';
import { ArrowRight, Filter, Star, Quote, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';

export const Shop = () => {
  const { addToCart, searchQuery } = useShop();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Data Logic
  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (selectedCategory === "All" || p.category === selectedCategory)
  );

  // Hero Slider Data
  const slides = [
    { image: "https://images.unsplash.com/photo-1540439868363-9ad897bc19b8?auto=format&fit=crop&q=80&w=1600", title: "Authentic Wellness", subtitle: "Up to 30% Off" },
    { image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1600", title: "Pure Skincare", subtitle: "Flat 20% Off" }
  ];

  // Dummy Reviews Data
  const reviews = [
    { name: "Aditi Rao", text: "My skin feels so alive after using the Neem Face Wash. Absolutely love the natural fragrance!", rating: 5 },
    { name: "Rahul Sharma", text: "Triphala Churna has fixed my digestion issues in just 2 weeks. Highly recommended.", rating: 5 },
    { name: "Priya Singh", text: "The consultation was very professional, and the medicines reached on time.", rating: 4 }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="animate-in fade-in duration-500 bg-gray-50/50">
      
      {/* 1. HERO SLIDER */}
      <div className="relative h-[500px] w-full overflow-hidden bg-emerald-900">
          {slides.map((s, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={s.image} className="w-full h-full object-cover opacity-50" alt="" />
              <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white space-y-4">
                  <span className="bg-emerald-500 w-fit px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">{s.subtitle}</span>
                  <h1 className="text-5xl md:text-7xl font-black max-w-3xl leading-none drop-shadow-lg">{s.title}</h1>
                  <button onClick={() => document.getElementById('shop-section')?.scrollIntoView({behavior: 'smooth'})} className="bg-white text-emerald-900 w-fit px-8 py-3 rounded-full font-black hover:bg-emerald-100 transition-all flex items-center gap-2">
                    SHOP NOW <ArrowRight size={18}/>
                  </button>
              </div>
            </div>
          ))}
      </div>

      {/* 2. SCROLLING TICKER (Marquee Effect) */}
      <div className="bg-emerald-800 text-white overflow-hidden py-3">
        <div className="flex gap-10 whitespace-nowrap animate-marquee text-sm font-bold uppercase tracking-widest">
            <span>🌿 100% Organic Ingredients</span>
            <span>🚚 Free Shipping on Orders above ₹999</span>
            <span>👨‍⚕️ Free Doctor Consultation</span>
            <span>🌿 100% Organic Ingredients</span>
            <span>🚚 Free Shipping on Orders above ₹999</span>
            <span>👨‍⚕️ Free Doctor Consultation</span>
            <span>🌿 100% Organic Ingredients</span>
            <span>🚚 Free Shipping on Orders above ₹999</span>
        </div>
      </div>

      {/* 3. FEATURED COLLECTIONS */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Nature's Best</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Immunity Boosters', 'Skin Glow', 'Digestive Health'].map((title, i) => (
            <div key={i} className="relative h-72 rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg">
              <img src={`https://images.unsplash.com/photo-${i===0?'1611073123041-860d1d3ee59e':i===1?'1544367567-0f2fcb009e0b':'1596755389378-c31d21fd1273'}?auto=format&fit=crop&q=80&w=600`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-black mb-1">{title}</h3>
                  <p className="text-sm font-medium opacity-80 underline underline-offset-4 group-hover:text-emerald-300 transition-colors">Explore Collection</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ANIMATED OFFER SECTION (New Addition) */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-20 px-4 my-12 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20"></div>

         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-6 text-center md:text-left">
                <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Limited Time Offer</span>
                <h2 className="text-4xl md:text-6xl font-black leading-tight">Winter Wellness <br/><span className="text-emerald-400">Sale is Live!</span></h2>
                <p className="text-xl opacity-80 max-w-lg">Get flat 25% off on our Immunity Kit. Boost your health naturally this season.</p>
                <div className="flex gap-4 justify-center md:justify-start pt-4">
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm text-center min-w-[80px]"><span className="block text-2xl font-black">02</span><span className="text-xs uppercase opacity-60">Days</span></div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm text-center min-w-[80px]"><span className="block text-2xl font-black">14</span><span className="text-xs uppercase opacity-60">Hours</span></div>
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm text-center min-w-[80px]"><span className="block text-2xl font-black">45</span><span className="text-xs uppercase opacity-60">Mins</span></div>
                </div>
            </div>
            <div className="relative">
                <img src="https://images.unsplash.com/photo-1515023115689-589c33041697?auto=format&fit=crop&q=80&w=600" className="rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500 w-full max-w-sm border-4 border-white/20" alt="Offer" />
                <div className="absolute -bottom-6 -right-6 bg-yellow-400 text-black p-6 rounded-full font-black text-xl shadow-lg rotate-12">
                    -25%
                </div>
            </div>
         </div>
      </div>

      {/* 5. MAIN SHOP LAYOUT */}
      <div id="shop-section" className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 h-fit">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Filter size={20}/> Categories</h3>
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>{cat}</button>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
            <div className="md:hidden sticky top-20 z-40 bg-white/90 backdrop-blur-md py-4 mb-6 border-b">
              <div className="flex gap-3 overflow-x-auto no-scrollbar px-2">
                  {categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{cat}</button>))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8"><h2 className="text-2xl md:text-3xl font-black">{selectedCategory}</h2><span className="text-gray-400 font-bold">{filteredProducts.length} Items</span></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                  <ProductCard product={p} onAddToCart={(e:any) => {e.stopPropagation(); addToCart(p);}} />
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* 6. REVIEWS & TRUST (New Addition) */}
      <div className="bg-white py-20 mt-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-4xl font-black text-center mb-16 text-gray-900">What People Are Saying</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {reviews.map((r, i) => (
                      <div key={i} className="bg-gray-50 p-8 rounded-[2rem] hover:shadow-xl transition-shadow relative">
                          <Quote className="text-emerald-200 absolute top-6 right-6" size={40} />
                          <div className="flex text-yellow-400 mb-4">{[...Array(r.rating)].map((_,x)=><Star key={x} fill="currentColor" size={18}/>)}</div>
                          <p className="text-gray-600 font-medium italic mb-6 leading-relaxed">"{r.text}"</p>
                          <div className="font-bold text-emerald-900 flex items-center gap-2">
                              <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-800 text-xs">{r.name[0]}</div>
                              {r.name}
                          </div>
                      </div>
                  ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-gray-100 text-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex flex-col items-center gap-3"><Truck size={40}/><span className="font-bold">Fast Shipping</span></div>
                  <div className="flex flex-col items-center gap-3"><ShieldCheck size={40}/><span className="font-bold">Secure Payment</span></div>
                  <div className="flex flex-col items-center gap-3"><Leaf size={40}/><span className="font-bold">100% Organic</span></div>
                  <div className="flex flex-col items-center gap-3"><Star size={40}/><span className="font-bold">Top Rated</span></div>
              </div>
          </div>
      </div>

      {/* Modal */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};