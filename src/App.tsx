import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ShopProvider } from './context/ShopContext';

// Components (keep these eager - needed for layout)
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { FloatingActions } from './components/FloatingActions';
import { ScrollToTop } from './components/ScrollToTop';

// Eager load Admin to prevent routing issues
import { Admin } from './pages/Admin';

// Pages - Lazy loaded for code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const Consult = lazy(() => import('./pages/Consult').then(m => ({ default: m.Consult })));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Story = lazy(() => import('./pages/Story').then(m => ({ default: m.Story })));
// Admin is eager loaded
const Policy = lazy(() => import('./pages/Policy').then(m => ({ default: m.Policy })));
const MyOrders = lazy(() => import('./pages/MyOrders').then(m => ({ default: m.MyOrders })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Order = lazy(() => import('./pages/Order').then(m => ({ default: m.Order })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Partner = lazy(() => import('./pages/Partner').then(m => ({ default: m.Partner })));
const ContractManufacturing = lazy(() => import('./pages/ContractManufacturing').then(m => ({ default: m.ContractManufacturing })));
const BulkEnquiry = lazy(() => import('./pages/BulkEnquiry').then(m => ({ default: m.BulkEnquiry })));
const BewareOfFraud = lazy(() => import('./pages/BewareOfFraud').then(m => ({ default: m.BewareOfFraud })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function ShopRoute() {
  const location = useLocation();
  return <Shop key={location.search} />;
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 relative">

          {/* ✅ Popup Notifications */}
          <Toaster position="top-center" reverseOrder={false} />

          {/* ✅ Navigation Components */}
          <Header onCartClick={() => setIsCartOpen(true)} />

          {/* ✅ Floating Actions: WhatsApp + Scroll Up + Menu (pill bar, mobile-first) */}
          <FloatingActions onCartClick={() => setIsCartOpen(true)} />

          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

          <main className="flex-grow">
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading...</p>
                </div>
              </div>
            }>
              <Routes>
                {/* 🔒 Admin Route (Top Priority) */}
                <Route path="/admin" element={<Admin />} />

                {/* Static Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopRoute />} />
                <Route path="/consult" element={<Consult />} />
                <Route path="/story" element={<Story />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order" element={<Order />} />
                <Route path="/profile" element={<Profile />} />

                {/* Nested/Dynamic Routes */}
                <Route path="/policy/:type" element={<Policy />} />

                {/* Product Details Route (slug-based) */}
                <Route path="/product/:slug" element={<ProductDetails />} />

                {/* Footer Pages */}
                <Route path="/partner" element={<Partner />} />
                <Route path="/manufacturing" element={<ContractManufacturing />} />
                <Route path="/bulk" element={<BulkEnquiry />} />
                <Route path="/fraud" element={<BewareOfFraud />} />

                {/* Blog Post (slug-based) */}
                <Route path="/:slug" element={<BlogPost />} />

                {/* 404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />

              </Routes>
            </Suspense>
          </main>

          <Footer />
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;