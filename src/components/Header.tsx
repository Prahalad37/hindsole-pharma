import { ShoppingBag, Search, LogOut, Package, ShieldCheck, ChevronDown, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import AnnouncementBar from './AnnouncementBar';

export const Header = ({ onCartClick }: { onCartClick: () => void }) => {
  const { cart, setSearchQuery, user } = useShop();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConcernDropdown, setShowConcernDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    navigate('/shop');
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome, ${result.user.displayName}! 👋`);
    } catch {
      toast.error("Login Failed ❌");
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

  // BONUS: Scroll Shrink Header
  useEffect(() => {
    const onScroll = () => {
      setShrink(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const concernCategories = [
    'Joint & Muscle Pain',
    'Diabetes Care',
    'Digestive Health',
    'Women\'s Wellness',
    'Urinary Care'
  ];

  const productTypes = [
    'Oils & Balms',
    'Tablets & Capsules',
    'Syrups & Tonics',
    'Powders'
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />

      <header className={`
        sticky top-0 z-50 backdrop-blur-md border-b border-emerald-800 font-sans shadow-lg 
        transition-all duration-500 ease-in-out bg-emerald-900
        ${shrink ? "py-2" : "py-3"}
      `}>
        <div className="w-[95%] max-w-[1600px] mx-auto px-3 md:px-6 flex items-center justify-between transition-all duration-500 ease-in-out">

          {/* LOGO SECTION - Inverted for Dark Mode */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.svg"
              alt="Ayurvita Pharma"
              className={`
                w-auto object-contain brightness-0 invert
                transition-all duration-500 ease-in-out
                ${shrink
                  ? "h-8 sm:h-10 md:h-12 lg:h-14"
                  : "h-10 sm:h-12 md:h-16 lg:h-20"}`}
            />
          </Link>

          {/* NAVIGATION - White text with Gold Hover */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-emerald-50 tracking-wide">
            {/* Shop by Concern Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setShowConcernDropdown(true)}
              onMouseLeave={() => setShowConcernDropdown(false)}
            >
              <button aria-label="Shop by concern dropdown" className="flex items-center gap-1 hover:text-amber-400 transition-all py-4 whitespace-nowrap">
                Shop By Concern <ChevronDown size={16} />
              </button>
              {showConcernDropdown && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    {concernCategories.map((category, idx) => (
                      <Link
                        key={idx}
                        to={`/shop?category=${encodeURIComponent(category)}`}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shop by Product Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setShowProductDropdown(true)}
              onMouseLeave={() => setShowProductDropdown(false)}
            >
              <button aria-label="Shop by product dropdown" className="flex items-center gap-1 hover:text-amber-400 transition-all py-4 whitespace-nowrap">
                Shop by Product <ChevronDown size={16} />
              </button>
              {showProductDropdown && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                    {productTypes.map((type, idx) => (
                      <Link
                        key={idx}
                        to={`/shop?category=${encodeURIComponent(type)}`}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        {type}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/shop" className="hover:text-amber-400 hover:underline underline-offset-4 decoration-2 decoration-amber-400 transition-all whitespace-nowrap">Sale</Link>
            <Link to="/consult" className="hover:text-amber-400 hover:underline underline-offset-4 decoration-2 decoration-amber-400 transition-all whitespace-nowrap">FREE Consultation</Link>
            <Link to="/blogs" className="hover:text-amber-400 hover:underline underline-offset-4 decoration-2 decoration-amber-400 transition-all whitespace-nowrap">Blog</Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-5 md:gap-6">

            {/* SEARCH - Royal Dark with Gold Focus */}
            <div className="hidden md:flex items-center bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-800 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all w-56">
              <Search size={18} className="text-amber-400" />
              <input
                type="text"
                placeholder="Search medicines..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-emerald-50 placeholder-emerald-400/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              />
            </div>

            {/* LOGIN BUTTON - Gold Button for Royal Look */}
            {user ? (
              <div className="relative">
                <button aria-label="User menu" onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 bg-emerald-900 pl-1 pr-3 py-1 rounded-full border border-emerald-800 hover:border-amber-400 hover:shadow-md transition-all">
                  <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-emerald-700" />
                  <span className="text-xs font-bold text-emerald-100 hidden sm:block">Hi, {user.displayName?.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-in fade-in zoom-in duration-200 ring-1 ring-black/5 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-2">
                      <p className="text-xs text-gray-400 font-semibold">ACCOUNT</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.displayName}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"><User size={16} className="mr-2" /> My Profile</Link>
                    <Link to="/my-orders" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"><Package size={16} className="mr-2" /> My Orders</Link>

                    {['ppandtech8998@gmail.com'].includes((user.email || '').toLowerCase()) && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center px-4 py-2.5 text-sm text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100"><ShieldCheck size={16} className="mr-2" /> Admin Panel</Link>
                    )}

                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"><LogOut size={16} className="mr-2" /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={handleLogin} className="bg-emerald-700 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-md shadow-emerald-200 hover:bg-emerald-800 hover:-translate-y-0.5 transition-all">Login</button>
            )}

            {/* CART */}
            <button aria-label="Open cart" onClick={onCartClick} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <ShoppingBag size={22} className="text-gray-700 group-hover:text-emerald-700 transition-colors" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border-2 border-white">{cart.length}</span>}
            </button>

          </div>
        </div>
      </header>
    </>
  );
};