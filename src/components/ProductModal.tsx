import { X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface ProductModalProps {
  product: any;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const { addToCart } = useShop();

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/80 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-all">
          <X size={24}/>
        </button>

        {/* Image Section */}
        <div className="md:w-1/2 h-80 md:h-auto">
            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        </div>

        {/* Details Section */}
        <div className="p-10 md:w-1/2 flex flex-col justify-center space-y-6">
          <span className="text-emerald-600 font-black uppercase text-xs tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full">
            {product.category}
          </span>
          
          <h2 className="text-4xl font-black leading-none text-gray-900">{product.name}</h2>
          
          <p className="text-gray-500 leading-relaxed italic">
            Experience the purity of nature. This Ayurvedic formulation is designed to bring balance to your body and mind. 100% Natural.
          </p>

          <div className="flex items-center gap-4">
             <span className="text-4xl font-black text-emerald-800">₹{product.price}</span>
             <span className="text-sm text-green-600 font-bold bg-green-100 px-2 py-1 rounded">In Stock</span>
          </div>

          <button 
            onClick={() => { addToCart(product); onClose(); }} 
            className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
          >
            ADD TO BASKET
          </button>
        </div>
      </div>
    </div>
  );
};