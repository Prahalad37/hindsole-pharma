import { useState } from 'react'; // 1. useState Import kiya
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CheckoutModal } from './CheckoutModal'; // 2. Modal Import kiya

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { cart, removeFromCart, addToCart, decreaseItem, cartTotal } = useShop();
  
  // 3. State banayi taaki pata chale Checkout form dikhana hai ya nahi
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      {/* 4. Agar state true hai, toh Checkout Modal dikhao */}
      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-900 text-white">
            <h2 className="text-xl font-black flex items-center gap-2">
                <ShoppingBag size={20}/> YOUR BASKET ({cart.length})
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
        </div>

        {/* Cart Items */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <ShoppingBag size={64} className="opacity-20"/>
                    <p className="font-bold">Your basket is empty</p>
                    <button onClick={onClose} className="text-emerald-600 font-bold hover:underline">Start Shopping</button>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex gap-4 animate-in slide-in-from-right duration-300">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-gray-100" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <p className="text-emerald-600 font-bold">₹{item.price}</p>
                            
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                                    <button onClick={() => decreaseItem(item.id)} className="p-1 hover:text-red-500"><Minus size={14}/></button>
                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="p-1 hover:text-emerald-600"><Plus size={14}/></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gray-50 border-t">
                <div className="flex justify-between items-center mb-4 text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span>₹{cartTotal}</span>
                </div>
                
                {/* 5. Button ab Checkout Modal open karega */}
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200"
                >
                    PROCEED TO CHECKOUT
                </button>
            </div>
        )}
      </div>
    </>
  );
};