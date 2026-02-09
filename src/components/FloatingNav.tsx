import { useState } from 'react';
import { Menu, X, ShoppingBag, Home, MessageSquare, BookOpen, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloatingNav = ({ onCartClick }: { onCartClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Menu Items for Users
  const navLinks = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/shop", icon: <ShoppingBag size={20} />, label: "Shop" },
    { to: "/consult", icon: <MessageSquare size={20} />, label: "Consult" },
    { to: "/blogs", icon: <BookOpen size={20} />, label: "Blogs" },
    { to: "/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] md:hidden">
      {/* 🟢 Main Floating Button */}
      <button
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-900 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-all flex items-center justify-center border-2 border-emerald-500/20"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🚀 Expanded Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-5 duration-200">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 bg-white text-emerald-900 px-4 py-3 rounded-2xl shadow-xl border border-emerald-100 font-bold text-sm whitespace-nowrap"
            >
              <span className="bg-emerald-50 p-2 rounded-lg text-emerald-600">{link.icon}</span>
              {link.label}
            </Link>
          ))}

          {/* Cart Shortcut in Floating Menu */}
          <button
            aria-label="Open cart"
            onClick={() => { onCartClick(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl font-bold text-sm"
          >
            <span className="bg-emerald-500/50 p-2 rounded-lg"><ShoppingBag size={20} /></span>
            My Cart
          </button>
        </div>
      )}
    </div>
  );
};