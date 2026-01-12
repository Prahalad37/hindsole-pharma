import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Shop } from './pages/Shop';
import { Consult } from './pages/Consult';
import { Story } from './pages/Story';
import { Blogs } from './pages/Blogs';
import { Checkout } from './pages/Checkout'; // Import Checkout

function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      <Header />
      <CartSidebar />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/story" element={<Story />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/checkout" element={<Checkout />} /> {/* Route Added */}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;