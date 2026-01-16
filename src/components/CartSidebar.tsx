import { useState } from 'react'; // ✅ useState import kiya
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CheckoutModal } from './CheckoutModal'; // ✅ CheckoutModal import kiya

export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const [showCheckout, setShowCheckout] = useState(false); // ✅ State banaya modal ke liye

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" />
      
      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
            <ShoppingBag className="text-emerald-600"/> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={60} className="text-gray-300"/>
              <p className="text-gray-400 font-medium">Your cart is feeling light.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-xl p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                  <p className="text-emerald-600 font-bold text-sm">₹{item.price * item.quantity}</p>
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-emerald-600 disabled:opacity-30">
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-emerald-600">
                    <Plus size={14} />
                  </button>
                </div>
                
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <span className="text-3xl font-black text-emerald-950">₹{cartTotal}</span>
            </div>
            
            {/* 👇 Button ab Modal trigger karega */}
            <button 
              onClick={() => setShowCheckout(true)} 
              className="w-full py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-800 active:scale-95 transition-all flex justify-center items-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* 👇 Checkout Modal yahan render hoga */}
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
};