import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { ShopProvider } from './context/ShopContext';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { FloatingNav } from './components/FloatingNav'; // ✅ Import check

// Pages
import { Home } from './pages/Home'; 
import { Shop } from './pages/Shop';
import { Consult } from './pages/Consult';
import { Blogs } from './pages/Blogs';
import { BlogPost } from './pages/BlogPost';
import { Story } from './pages/Story';
import { Admin } from './pages/Admin';
import { Policy } from './pages/Policy';
import { MyOrders } from './pages/MyOrders'; 

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ShopProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 relative">
          
          {/* ✅ Popup Notifications */}
          <Toaster position="top-center" reverseOrder={false} />

          {/* ✅ Navigation Components */}
          <Header onCartClick={() => setIsCartOpen(true)} />
          
          {/* ✅ Global Floating Menu (For all users on mobile) */}
          <FloatingNav onCartClick={() => setIsCartOpen(true)} /> 

          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/story" element={<Story />} />
              <Route path="/my-orders" element={<MyOrders />} /> 
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/policy/:type" element={<Policy />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;