import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50"
    >
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <div className="max-w-md w-full text-center">
        <div className="text-8xl sm:text-9xl font-black text-emerald-100 mb-4 select-none">404</div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all min-h-[48px]"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 border-2 border-emerald-200 px-6 py-3 rounded-full font-bold text-sm hover:border-emerald-400 active:scale-[0.98] transition-all min-h-[48px]"
          >
            <Search size={18} /> Browse Shop
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
