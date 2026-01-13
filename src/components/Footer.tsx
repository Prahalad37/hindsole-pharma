import { useState } from 'react';
import { Leaf, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // 📧 Newsletter Logic (Active)
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // ✅ Saves to 'subscribers' collection in Firebase
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: serverTimestamp()
      });
      toast.success("Subscribed! Wellness tips are on the way. 🌿");
      setEmail('');
    } catch (error) {
      console.error(error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-emerald-950 text-emerald-50 py-16 mt-auto border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Leaf className="text-emerald-400" size={24} />
                <span className="text-3xl font-black tracking-tighter text-white">HINDSOLE</span>
            </div>
            <p className="opacity-70 text-sm leading-relaxed max-w-xs">
              Ancient Ayurvedic wisdom meets modern science. Purity sourced directly from the Himalayas.
            </p>
            {/* ✅ Active Social Links */}
            <div className="flex gap-4 pt-4">
                <a href="https://instagram.com/hindsole" target="_blank" rel="noreferrer" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors">
                    <Instagram size={20}/>
                </a>
                <a href="https://facebook.com/hindsole" target="_blank" rel="noreferrer" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors">
                    <Facebook size={20}/>
                </a>
                <a href="https://twitter.com/hindsole" target="_blank" rel="noreferrer" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors">
                    <Twitter size={20}/>
                </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4 font-medium opacity-80">
                <li><Link to="/shop" className="hover:text-emerald-400 transition-colors">Shop All</Link></li>
                <li><Link to="/consult" className="hover:text-emerald-400 transition-colors">Doctor Consultation</Link></li>
                <li><Link to="/story" className="hover:text-emerald-400 transition-colors">Our Story</Link></li>
                <li><Link to="/blogs" className="hover:text-emerald-400 transition-colors">Wellness Journal</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-4 font-medium opacity-80">
                <li><Link to="/policy/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/policy/shipping" className="hover:text-emerald-400 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/policy/returns" className="hover:text-emerald-400 transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/policy/faq" className="hover:text-emerald-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter (Active Form) */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Stay Updated</h4>
            <p className="opacity-70 text-sm mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form onSubmit={handleSubscribe} className="flex gap-0 shadow-lg">
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="bg-emerald-900 text-white px-4 py-3 rounded-l-xl outline-none w-full focus:ring-2 ring-emerald-600 placeholder:text-emerald-700/50" 
                />
                <button 
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-r-xl transition-colors disabled:opacity-50"
                >
                  {loading ? <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"/> : <Mail/>}
                </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900 pt-8 text-center px-4">
            <p className="text-[10px] md:text-xs opacity-40 font-bold tracking-widest uppercase">
                © 2026 Hindsole Pharma. All rights reserved. Crafted with <span className="text-red-500">❤</span> in India.
            </p>
        </div>
    </footer>
  );
};