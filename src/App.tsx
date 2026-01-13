import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Shop } from './pages/Shop';
import { Consult } from './pages/Consult';
import { Blogs } from './pages/Blogs';
import { Story } from './pages/Story'; // ✅ Sirf ek baar import hai
import { Admin } from './pages/Admin';
import { Policy } from './pages/Policy';
import { BlogPost } from './pages/BlogPost';
import { useState } from 'react';

function App() {
  // State to handle Cart Open/Close
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ShopProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
          
          {/* Header ko bola: Jab button dabe, toh Cart khol dena */}
          <Header onCartClick={() => setIsCartOpen(true)} />
          
          {/* Cart ko bola: Tum khule ho ya band, state se poocho */}
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          <main className="flex-grow">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Shop />} />
              <Route path="/consult" element={<Consult />} />
              <Route path="/story" element={<Story />} /> {/* ✅ Sirf ek baar route hai */}
              
              {/* Blog System */}
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              
              {/* Admin & Policy */}
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