import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ShopProvider } from './context/ShopContext';

// Components (keep these eager - needed for layout)
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { FloatingNav } from './components/FloatingNav';
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
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

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

          {/* ✅ Global Floating Menu (For all users on mobile) */}
          <FloatingNav onCartClick={() => setIsCartOpen(true)} />

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
                <Route path="/shop" element={<Shop />} />
                <Route path="/consult" element={<Consult />} />
                <Route path="/story" element={<Story />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />

                {/* Nested/Dynamic Routes */}
                <Route path="/policy/:type" element={<Policy />} />

                {/* Product Details Route */}
                <Route path="/product/:id" element={<ProductDetails />} />

                {/* 👇 FIXED: Ab ye Slug read karega (e.g. ayurvita.com/joint-pain-relief) */}
                <Route path="/:slug" element={<BlogPost />} />

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