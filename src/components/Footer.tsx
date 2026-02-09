import { useState } from 'react';
import { Facebook, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: serverTimestamp()
      });
      toast.success("Subscribed to the tribe! 🌿");
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#024E32] text-white pt-16 pb-6 font-sans border-t border-emerald-900/30 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP ROW: Logo & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-emerald-800 pb-12 mb-12">
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="h-10 w-10 object-contain brightness-0 invert"
                />
              </div>
              <div>
                <h2 className="font-black text-xl tracking-wide uppercase leading-none">HINDSole</h2>
                <p className="text-[10px] tracking-[0.2em] opacity-80 uppercase">New Age Ayurved</p>
              </div>
            </Link>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              Hindsole is an online Ayurvedic store that brings traditional Indian Ayurved to modern consumers. With 150 years of heritage, the formulations have treated thousands of patients.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">Social</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-amber-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-amber-400 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT: Newsletter (Left) + Links (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Newsletter Section (Left - 4 cols) */}
          <div className="lg:col-span-4 pr-0 lg:pr-12">
            <h3 className="text-2xl font-serif font-medium mb-4">Sign-up for our newsletter</h3>
            <p className="text-sm text-emerald-100/70 mb-6 leading-relaxed">
              Find out all about our latest offers, new products, the science of Ayurved and a lot more in our newsletters!
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#036040] border border-[#04754e] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-emerald-300/50 transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-[#024E32] px-6 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-50 transition-colors disabled:opacity-70"
              >
                {loading ? '...' : 'SUBSCRIBE'}
              </button>
            </form>
          </div>

          {/* Links Grid (Right - 8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 opacity-60">Shop</h4>
              <ul className="space-y-3 text-xs md:text-sm text-emerald-100/80">
                <li><Link to="/shop?category=Fitness" className="hover:text-white hover:translate-x-1 transition-all inline-block">Fitness</Link></li>
                <li><Link to="/shop?category=Sexual%20Wellness" className="hover:text-white hover:translate-x-1 transition-all inline-block">Sexual Wellness</Link></li>
                <li><Link to="/shop?category=Immunity" className="hover:text-white hover:translate-x-1 transition-all inline-block">Immunity And Wellness</Link></li>
                <li><Link to="/shop?category=Womens%20Health" className="hover:text-white hover:translate-x-1 transition-all inline-block">Women's Health</Link></li>
                <li><Link to="/shop?category=Piles%20Care" className="hover:text-white hover:translate-x-1 transition-all inline-block">Piles Care</Link></li>
                <li><Link to="/shop?category=Liver" className="hover:text-white hover:translate-x-1 transition-all inline-block">Liver Care</Link></li>
                <li><Link to="/shop?category=Diabetes" className="hover:text-white hover:translate-x-1 transition-all inline-block">Diabetes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 opacity-60">Help</h4>
              <ul className="space-y-3 text-xs md:text-sm text-emerald-100/80">
                <li><Link to="/policy/returns" className="hover:text-white hover:translate-x-1 transition-all inline-block">Refunds & Returns</Link></li>
                <li><Link to="/my-orders" className="hover:text-white hover:translate-x-1 transition-all inline-block">Track Your Order</Link></li>
                <li><Link to="/policy/faq" className="hover:text-white hover:translate-x-1 transition-all inline-block">FAQs</Link></li>
                <li><Link to="/story" className="hover:text-white hover:translate-x-1 transition-all inline-block">About Us</Link></li>
                <li><Link to="/policy/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 opacity-60">Important Pages</h4>
              <ul className="space-y-3 text-xs md:text-sm text-emerald-100/80">
                <li><Link to="/my-orders" className="hover:text-white hover:translate-x-1 transition-all inline-block">Order Tracking</Link></li>
                <li><Link to="/story" className="hover:text-white hover:translate-x-1 transition-all inline-block">Our Story</Link></li>
                <li><Link to="/partner" className="hover:text-white hover:translate-x-1 transition-all inline-block">Partner</Link></li>
                <li><Link to="/manufacturing" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contract Manufacturing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-6 opacity-60">General</h4>
              <ul className="space-y-3 text-xs md:text-sm text-emerald-100/80">
                <li><Link to="/policy/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms and Conditions</Link></li>
                <li><Link to="/policy/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                <li><Link to="/policy/shipping" className="hover:text-white hover:translate-x-1 transition-all inline-block">Shipping Policy</Link></li>
                <li><Link to="/bulk" className="hover:text-white hover:translate-x-1 transition-all inline-block">Bulk Enquiry</Link></li>
                <li><Link to="/fraud" className="hover:text-white hover:translate-x-1 transition-all inline-block">Beware of Fraud</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-emerald-800 text-[10px] md:text-xs">
          <p className="opacity-60 font-medium">Copyright © 2026 Hindsole | All rights reserved.</p>

          {/* Scroll to Top Arrow (Absolute positioning on large screens to match design) */}
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-[#036040] hover:bg-emerald-600 p-2 rounded-full shadow-lg transition-all z-40 group"
            title="Scroll to Top"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};