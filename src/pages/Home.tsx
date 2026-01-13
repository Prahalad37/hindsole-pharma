import { ArrowRight, Truck, ShieldCheck, Leaf, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="bg-stone-50">
      
      {/* 🌿 HERO SECTION (Wo bada banner) */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2084&auto=format&fit=crop" 
            alt="Ayurveda Background" 
            className="w-full h-full object-cover opacity-90 brightness-75"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-green-600/80 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold tracking-wide mb-6 animate-fade-in-up">
            FLAT 20% OFF ON FIRST ORDER
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif tracking-tight leading-tight drop-shadow-lg">
            Pure Skincare <br/> & Natural Healing
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto drop-shadow-md">
            Ancient Ayurvedic wisdom meets modern science. 100% Organic & Chemical Free.
          </p>
          <Link 
            to="/shop"
            className="bg-white text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl inline-flex items-center gap-2"
          >
            SHOP NOW <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* 🚚 FEATURES STRIP */}
      <div className="bg-green-900 text-white py-4 overflow-hidden">
        <div className="flex justify-around items-center max-w-7xl mx-auto px-4 text-xs md:text-sm font-bold tracking-wider">
          <div className="flex items-center gap-2"><Truck size={18} className="text-yellow-400"/> FREE SHIPPING ABOVE ₹999</div>
          <div className="hidden md:flex items-center gap-2"><ShieldCheck size={18} className="text-yellow-400"/> CERTIFIED AYURVEDIC</div>
          <div className="flex items-center gap-2"><Leaf size={18} className="text-yellow-400"/> 100% ORGANIC</div>
          <div className="hidden md:flex items-center gap-2"><Star size={18} className="text-yellow-400"/> RATED 4.9/5</div>
        </div>
      </div>

      {/* 🌱 CATEGORIES (Nature's Best) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 font-serif">Nature's Best</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Immunity */}
          <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Immunity"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Immunity Boosters</h3>
              <Link to="/shop" className="text-green-300 font-bold underline hover:text-green-200">Explore Collection</Link>
            </div>
          </div>

          {/* Card 2: Skin Care */}
          <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Skin Care"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Skin Glow</h3>
              <Link to="/shop" className="text-green-300 font-bold underline hover:text-green-200">Explore Collection</Link>
            </div>
          </div>

          {/* Card 3: Digestion */}
          <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1000&auto=format&fit=crop" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Digestion"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Digestive Health</h3>
              <Link to="/shop" className="text-green-300 font-bold underline hover:text-green-200">Explore Collection</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🩺 CONSULT BANNER */}
      <section className="bg-green-50 py-16 mb-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
             <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6 font-serif">Not sure what you need?</h2>
             <p className="text-lg text-gray-600 mb-8 leading-relaxed">
               Talk to our certified Ayurvedic doctors. Get a personalized health plan and diet chart absolutely free with your first consultation.
             </p>
             <Link to="/consult" className="bg-green-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-900 transition-colors shadow-lg">
               Book Free Consultation
             </Link>
          </div>
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" alt="Doctor"/>
          </div>
        </div>
      </section>

    </div>
  );
};