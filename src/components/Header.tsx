import { ShoppingBag, Search, LogOut, Package, ShieldCheck, ChevronDown, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { ALLOWED_ADMIN_EMAILS } from '../config';
import { useState, useEffect, useRef } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import AnnouncementBar from './AnnouncementBar';
import { concernCategories, productForms } from '../data/shopCategories';

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const { cart, setSearchQuery, user } = useShop();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConcernDropdown, setShowConcernDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const concernRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    navigate('/shop');
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName}!`);
    } catch {
      toast.error("Login Failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      toast.success("Logged Out");
      navigate('/');
    } catch {
      toast.error("Error Logging Out");
    }
  };

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (concernRef.current && !concernRef.current.contains(target)) setShowConcernDropdown(false);
      if (productRef.current && !productRef.current.contains(target)) setShowProductDropdown(false);
      if (userRef.current && !userRef.current.contains(target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setShowConcernDropdown(false);
    setShowProductDropdown(false);
  };

  return (
    <>
      <AnnouncementBar />

      <header className={`
        sticky top-0 z-50 border-b border-gray-200 font-sans shadow-md 
        transition-all duration-500 ease-in-out bg-white
        ${shrink ? "py-2" : "py-3"}
      `}>
        <div className="w-[95%] max-w-[1600px] mx-auto px-3 md:px-6 flex items-center justify-between transition-all duration-500 ease-in-out">

          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/logo.svg"
              alt="AyurVita Pharma"
              className={`w-auto object-contain transition-all duration-500 ease-in-out ${shrink ? "h-8 sm:h-10 md:h-12 lg:h-14" : "h-10 sm:h-12 md:h-16 lg:h-20"}`}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm text-gray-700 tracking-wide">
            <div ref={concernRef} className="relative h-full flex items-center">
              <button
                aria-label="Shop by concern dropdown"
                onClick={() => { setShowConcernDropdown(p => !p); setShowProductDropdown(false); }}
                className="flex items-center gap-1 hover:text-emerald-600 transition-all py-4 whitespace-nowrap min-h-[44px]"
              >
                Shop By Concern <ChevronDown size={16} className={`transition-transform ${showConcernDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showConcernDropdown && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    {concernCategories.map((category, idx) => (
                      <Link key={idx} to={`/shop?category=${encodeURIComponent(category)}`} onClick={closeAll} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors min-h-[44px]">
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div ref={productRef} className="relative h-full flex items-center">
              <button
                aria-label="Shop by product dropdown"
                onClick={() => { setShowProductDropdown(p => !p); setShowConcernDropdown(false); }}
                className="flex items-center gap-1 hover:text-emerald-600 transition-all py-4 whitespace-nowrap min-h-[44px]"
              >
                Shop by Product <ChevronDown size={16} className={`transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showProductDropdown && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    {productForms.map((type, idx) => (
                      <Link key={idx} to={`/shop?category=${encodeURIComponent(type)}`} onClick={closeAll} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors min-h-[44px]">
                        {type}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/shop" className="hover:text-emerald-600 hover:underline underline-offset-4 decoration-2 decoration-emerald-600 transition-all whitespace-nowrap min-h-[44px] flex items-center">Sale</Link>
            <Link to="/consult" className="hover:text-emerald-600 hover:underline underline-offset-4 decoration-2 decoration-emerald-600 transition-all whitespace-nowrap min-h-[44px] flex items-center">FREE Consultation</Link>
            <Link to="/blogs" className="hover:text-emerald-600 hover:underline underline-offset-4 decoration-2 decoration-emerald-600 transition-all whitespace-nowrap min-h-[44px] flex items-center">Blog</Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full border border-gray-200 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all w-56">
              <Search size={18} className="text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              />
            </div>

            {user ? (
              <div ref={userRef} className="relative">
                <button aria-label="User menu" onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 bg-gray-100 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-emerald-600 hover:shadow-md transition-all min-h-[44px]">
                  <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
                  <span className="text-xs font-bold text-gray-700 hidden sm:block">Hi, {user.displayName?.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-in fade-in zoom-in duration-200 ring-1 ring-black/5 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-xs text-gray-400 font-semibold">ACCOUNT</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.displayName}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors min-h-[44px]"><User size={16} className="mr-2" /> My Profile</Link>
                    <Link to="/my-orders" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors min-h-[44px]"><Package size={16} className="mr-2" /> My Orders</Link>

                    {ALLOWED_ADMIN_EMAILS.includes((user.email || '').toLowerCase()) && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-3 text-sm text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 min-h-[44px]"><ShieldCheck size={16} className="mr-2" /> Admin Panel</Link>
                    )}

                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors min-h-[44px]"><LogOut size={16} className="mr-2" /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleLogin} className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all">Login</button>
            )}

            <button aria-label="Open cart" onClick={onCartClick} className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ShoppingBag size={22} className="text-gray-700 group-hover:text-emerald-600 transition-colors" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};