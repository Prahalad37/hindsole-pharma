import { ShoppingBag, Search, Menu, X, User, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const { cart, setSearchQuery, user } = useShop(); // ✅ user context se aa raha hai
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName}! 👋`);
    } catch (error) {
      toast.error("Login Failed ❌");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      toast.success("Logged Out");
      navigate('/');
    } catch (error) {
      toast.error("Error Logging Out");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 text-white p-2 rounded-lg font-bold text-xl">H</div>
          <span className="text-2xl font-black tracking-tighter text-emerald-950">HINDSOLE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-500">
          <Link to="/shop" className="hover:text-emerald-600 transition-colors">SHOP</Link>
          <Link to="/consult" className="hover:text-emerald-600 transition-colors">CONSULT</Link>
          <Link to="/blogs" className="hover:text-emerald-600 transition-colors">BLOGS</Link>
          <Link to="/story" className="hover:text-emerald-600 transition-colors">STORY</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full border border-transparent focus-within:border-emerald-300">
            <Search size={18} className="text-gray-400"/>
            <input type="text" placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm ml-2 w-24 focus:w-40 transition-all" />
          </div>

          {/* ✅ User Section Fix: Photo aur Name dikhayega */}
          {user ? (
            <div className="relative">
                <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 bg-emerald-50 pl-1 pr-3 py-1 rounded-full border border-emerald-100 hover:shadow-md transition-all">
                    <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-xs font-bold text-emerald-900 hidden sm:block">Hi, {user.displayName?.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-emerald-100 animate-in fade-in zoom-in duration-200">
                    <Link to="/my-orders" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"><Package size={16} className="mr-2"/> My Orders</Link>
                    
                    {/* Admin Check: Gmail check fix kiya */}
                    {(user.email === "admin@hindsole.com" || user.email === "prahaladpal01@gmail.com") && (
                       <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"><ShieldCheck size={16} className="mr-2"/> Admin Panel</Link>
                    )}
                    
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50"><LogOut size={16} className="mr-2"/> Logout</button>
                  </div>
                )}
            </div>
          ) : (
            <button onClick={handleLogin} className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-200">Login</button>
          )}

          <button onClick={onCartClick} className="relative p-2 hover:bg-emerald-50 rounded-full group">
            <ShoppingBag size={24} className="text-emerald-900 group-hover:scale-110 transition-transform"/>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce shadow-sm">{cart.length}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};