import { ShoppingBag, Search, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const { cart, setSearchQuery, user, login, logout } = useShop();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <span className="font-bold text-xl">H</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-emerald-950">HINDSOLE</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm tracking-wide text-gray-500">
          <Link to="/" className="hover:text-emerald-600 transition-colors">SHOP</Link>
          <Link to="/consult" className="hover:text-emerald-600 transition-colors">CONSULT</Link>
          <Link to="/blogs" className="hover:text-emerald-600 transition-colors">BLOGS</Link>
          <Link to="/story" className="hover:text-emerald-600 transition-colors">STORY</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full">
            <Search size={18} className="text-gray-400"/>
            <input 
              type="text" 
              placeholder="Search..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-24 focus:w-40 transition-all"
            />
          </div>

          {/* User Login / Profile Section */}
          {user ? (
            <div className="flex items-center gap-3 bg-emerald-50 pl-1 pr-4 py-1 rounded-full border border-emerald-100">
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                <span className="text-xs font-bold text-emerald-900 hidden sm:block">Hi, {user.displayName?.split(' ')[0]}</span>
                <button onClick={logout} className="text-red-400 hover:text-red-600 ml-2" title="Logout">
                    <LogOut size={16}/>
                </button>
            </div>
          ) : (
            <button 
                onClick={login}
                className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
                Login
            </button>
          )}

          {/* Cart Button */}
          <button onClick={onCartClick} className="relative p-2 hover:bg-emerald-50 rounded-full transition-colors">
            <ShoppingBag size={24} className="text-emerald-900"/>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};