import { useState } from 'react';
import { ArrowRight, Truck, ShieldCheck, Leaf, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { products } from '../data/products';
import type { Product } from '../types';

export const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Featured products: Oil (1), Syrup (2), Diabetes Powder (6)
  const featuredProducts = products.filter(p => [1, 2, 6].includes(p.id));

  return (
    <div className="bg-stone-50">
      
      {/* 🌿 HERO SECTION */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/products/hero.jpg"   
            alt="Ayurvedic Medicine Collection" 
            className="w-full h-full object-cover"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-white px-4 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-5 py-2 rounded-full text-sm font-bold tracking-wider mb-8 text-emerald-100">
              <Sparkles size={16} className="text-yellow-400 fill-yellow-400" /> 
              TRUSTED BY 10,000+ CUSTOMERS
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 font-serif tracking-tight leading-tight drop-shadow-2xl">
              Relief from Pain, <br/> 
              <span className="text-emerald-400">Naturally.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light leading-relaxed">
              Discover the power of Dr. Arthovita & Dr. Gasovita. <br className="hidden md:block"/>
              100% Ayurvedic formulations for a healthier life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/shop"
                className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 transition-all transform hover:scale-105 shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-2"
              >
                Shop Medicines <ArrowRight size={20} />
              </Link>
              <Link 
                to="/consult"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
              >
                Consult Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🚚 FEATURES STRIP */}
      <div className="bg-emerald-950 text-white py-6 overflow-hidden border-b border-emerald-900">
        <div className="flex flex-wrap justify-center md:justify-around gap-6 max-w-7xl mx-auto px-4 text-xs md:text-sm font-bold tracking-wider uppercase">
          <div className="flex items-center gap-3"><Truck size={20} className="text-emerald-400"/> Free Shipping &gt; ₹999</div>
          <div className="flex items-center gap-3"><ShieldCheck size={20} className="text-emerald-400"/> GMP Certified</div>
          <div className="flex items-center gap-3"><Leaf size={20} className="text-emerald-400"/> 100% Herbal</div>
          <div className="flex items-center gap-3"><Star size={20} className="text-emerald-400"/> 4.9/5 Rating</div>
        </div>
      </div>

      {/* 🔥 BEST SELLERS SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-emerald-950 mb-4 font-serif">Our Best Sellers</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Most loved medicines by our customers for joint pain, digestion, and diabetes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => setSelectedProduct(product)} 
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop" className="inline-block border-b-2 border-emerald-600 text-emerald-800 font-bold pb-1 hover:text-emerald-600 transition-colors">
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* 🌱 SHOP BY CATEGORY (UPDATED IMAGES) */}
      <section className="py-20 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-950 font-serif">Shop by Concern</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Joint Pain */}
            <Link to="/shop" className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img 
                src="/products/jointpain.jpg"   // ✅ Updated
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Joint & Muscle Pain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Joint & Muscle Pain</h3>
                <span className="text-emerald-300 font-bold text-sm tracking-wide group-hover:text-emerald-200">VIEW PRODUCTS &rarr;</span>
              </div>
            </Link>

            {/* 2. Diabetes Care */}
            <Link to="/shop" className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img 
                src="/products/daibetic.jpg"   // ✅ Updated (checked spelling)
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Diabetes Care"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Diabetes Care</h3>
                <span className="text-emerald-300 font-bold text-sm tracking-wide group-hover:text-emerald-200">VIEW PRODUCTS &rarr;</span>
              </div>
            </Link>

            {/* 3. Digestive Health */}
            <Link to="/shop" className="group relative h-80 rounded-[2rem] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500">
              <img 
                src="/products/digestive.jpg"  // ✅ Updated
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Digestive Health"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Digestive Health</h3>
                <span className="text-emerald-300 font-bold text-sm tracking-wide group-hover:text-emerald-200">VIEW PRODUCTS &rarr;</span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 🩺 CONSULT BANNER */}
      <section className="bg-emerald-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
             <span className="text-emerald-400 font-bold tracking-wider text-sm uppercase mb-2 block">Doctor Consultation</span>
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">Not sure what you need?</h2>
             <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-xl">
               Talk to our certified Ayurvedic doctors. Get a personalized health plan and diet chart absolutely free with your first consultation.
             </p>
             <Link to="/consult" className="bg-white text-emerald-900 px-10 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg inline-flex items-center gap-2">
               Book Free Consultation <ArrowRight size={18}/>
             </Link>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10 border-4 border-emerald-800/50" alt="Doctor"/>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
};