import { useState } from 'react';
import { Menu, X, ArrowUp, ShoppingBag, Home, MessageSquare, BookOpen, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { WHATSAPP_CONFIG } from '../config';
import { WhatsAppIcon } from './WhatsAppFloat';

export const FloatingActions = ({ onCartClick }: { onCartClick: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    const message = [
      'Hello AyurVita Team,',
      '',
      'I am interested in your Ayurvedic products and would like to know more.',
      'Could you please share product information and pricing?',
      '',
      'Thank you.',
    ].join('\n');
    window.open(`https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('WhatsApp opened.');
  };

  const navLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/shop', icon: <ShoppingBag size={20} />, label: 'Shop' },
    { to: '/consult', icon: <MessageSquare size={20} />, label: 'Consult' },
    { to: '/blogs', icon: <BookOpen size={20} />, label: 'Blogs' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-auto z-[100]">
      {/* Pill-shaped glassmorphism bar - mobile: full width, desktop: compact right-aligned */}
      <div className="flex items-center justify-between md:justify-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-stone-200/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)] md:shadow-[0_8px_30px_-8px_rgba(5,150,105,0.25)] md:border-emerald-200/50">
        {/* WhatsApp - brand green */}
        <button
          onClick={openWhatsApp}
          aria-label="Chat on WhatsApp"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <WhatsAppIcon size={18} />
        </button>

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>

        {/* Menu toggle - mobile only */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-emerald-700 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          {isMenuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
        </button>
      </div>

      {/* Expanded menu overlay - mobile only */}
      {isMenuOpen && (
        <div className="absolute bottom-full right-0 left-0 md:left-auto md:right-0 mb-2 space-y-2 animate-in slide-in-from-bottom-2 duration-200 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 bg-white text-emerald-900 px-4 py-3 rounded-2xl shadow-xl border border-emerald-100 font-bold text-sm"
            >
              <span className="bg-emerald-50 p-2 rounded-lg text-emerald-600">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { onCartClick(); setIsMenuOpen(false); }}
            aria-label="Open cart"
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
