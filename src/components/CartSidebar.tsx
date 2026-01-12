import { X, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom'; // 1. Import added

export const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate(); // 2. Hook initialized

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className="relative w-full max-w-md bg-white h-full p-10 flex flex-col animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black tracking-tighter">Your Bag</h3>
            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-50 rounded-full"><X/></button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {cartItems.length === 0 ? <p className="text-center py-20 opacity-20 font-black text-2xl uppercase">Empty Bag</p> : cartItems.map(item => (
            <div key={item.product.id} className="flex gap-6 animate-in slide-in-from-bottom-2">
              <img src={item.product.image} className="w-20 h-20 rounded-2xl object-cover" />
              <div className="flex-grow space-y-1">
                  <h4 className="font-bold text-gray-800 text-lg leading-tight">{item.product.name}</h4>
                  <p className="text-emerald-600 font-bold">₹{item.product.price} x {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="pt-10 border-t border-gray-100">
            <div className="flex justify-between text-3xl font-black mb-8 text-emerald-950"><span>Total</span><span>₹{cartTotal}</span></div>
            {/* 3. Button Updated with Navigation Logic */}
            <button 
              onClick={() => { 
                setIsCartOpen(false); 
                navigate('/checkout'); 
              }} 
              className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};