import { Leaf, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-50 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Leaf className="text-emerald-400" size={24} />
                <span className="text-3xl font-black tracking-tighter text-white">HINDSOLE</span>
            </div>
            <p className="opacity-70 text-sm leading-relaxed max-w-xs">
              Ancient Ayurvedic wisdom meets modern science. Purity sourced directly from the Himalayas.
            </p>
            <div className="flex gap-4 pt-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors"><Instagram size={20}/></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors"><Facebook size={20}/></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-emerald-900 p-2 rounded-full hover:bg-emerald-800 transition-colors"><Twitter size={20}/></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4 font-medium opacity-80">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Shop All</Link></li>
                <li><Link to="/consult" className="hover:text-emerald-400 transition-colors">Doctor Consultation</Link></li>
                <li><Link to="/story" className="hover:text-emerald-400 transition-colors">Our Story</Link></li>
                <li><Link to="/blogs" className="hover:text-emerald-400 transition-colors">Wellness Journal</Link></li>
            </ul>
          </div>

          {/* Column 3: Support (AB ACTIVE HAIN) */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Support</h4>
            <ul className="space-y-4 font-medium opacity-80">
                <li><Link to="/policy/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                <li><Link to="/policy/shipping" className="hover:text-emerald-400 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/policy/returns" className="hover:text-emerald-400 transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/policy/faq" className="hover:text-emerald-400 transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider">Stay Updated</h4>
            <p className="opacity-70 text-sm mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="bg-emerald-900 text-white px-4 py-3 rounded-l-xl outline-none w-full focus:ring-2 ring-emerald-600 placeholder:text-emerald-700/50" />
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-r-xl transition-colors"><Mail/></button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900 pt-8 text-center">
            <p className="text-xs opacity-40 font-bold tracking-widest uppercase">
                © 2026 Hindsole Pharma. All rights reserved. Crafted with <span className="text-red-500">❤</span> in India.
            </p>
        </div>
    </footer>
  );
};