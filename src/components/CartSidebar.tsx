import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { WhatsAppIcon as WAIcon } from './WhatsAppFloat';

export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const navigate = useNavigate();

  const handleOrderViaWhatsApp = () => {
    onClose();
    navigate('/order');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      <div className="relative w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-900" />
            <h2 className="text-lg font-black text-gray-900">Your Items <span className="text-gray-500 font-medium text-base">({cart.length} Item{cart.length !== 1 && 's'})</span></h2>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <ShoppingBag size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <button onClick={onClose} className="mt-4 text-emerald-600 font-bold text-sm hover:underline">Start Shopping</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <span className="font-black text-gray-900 text-sm">₹{item.price}</span>
                        <div className="flex items-center bg-white border border-gray-200 rounded text-xs font-bold">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-gray-50 text-gray-500 disabled:opacity-30 border-r border-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-gray-50 text-gray-500 border-l border-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button onClick={() => removeFromCart(item.id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded font-bold min-h-[32px] hover:bg-red-100 transition-colors">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-xl font-black text-gray-900">₹{cartTotal}</span>
            </div>
            <button
              onClick={handleOrderViaWhatsApp}
              className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-emerald-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2 min-h-[52px]"
            >
              <WAIcon size={20} />
              Order via WhatsApp
            </button>
            <p className="text-xs text-center text-gray-500 mt-2 font-medium">Safe, Discreet & Easy | 100% Authentic Ayurvedic Products</p>
          </div>
        )}
      </div>
    </div>
  );
};
