import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Leaf } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Header = () => {
  const { cartItems, setIsCartOpen } = useShop(); // Getting data from "Brain"
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path ? 'text-emerald-600 border-b-2 border-emerald-600' : 'hover:text-emerald-600';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-emerald-600 p-2 rounded-lg"><Leaf className="text-white" size={24} /></div>
          <span className="text-2xl font-black text-emerald-800 tracking-tighter">HINDSOLE</span>
        </Link>

        {/* Navigation Links (Real Routing) */}
        <div className="hidden lg:flex items-center gap-8 font-bold text-gray-500">
          <Link to="/" className={isActive('/')}>SHOP</Link>
          <Link to="/consult" className={isActive('/consult')}>CONSULT</Link>
          <Link to="/blogs" className={isActive('/blogs')}>BLOGS</Link>
          <Link to="/story" className={isActive('/story')}>STORY</Link>
        </div>

        {/* Cart Trigger */}
        <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-emerald-50 rounded-full text-emerald-700 hover:bg-emerald-100 transition-all">
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full ring-2 ring-white">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};