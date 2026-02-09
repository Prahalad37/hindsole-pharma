import { useState, useMemo } from 'react';
import { X, Plus, Minus, ShoppingBag, ChevronRight, Gift, Tag } from 'lucide-react'; // Added icons
import { useShop } from '../context/ShopContext';
import { CheckoutModal } from './CheckoutModal';
import { useNavigate } from 'react-router-dom';

export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, products, addToCart } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  // Free Gift Logic
  const FREE_GIFT_THRESHOLD = 1149;
  const progress = Math.min((cartTotal / FREE_GIFT_THRESHOLD) * 100, 100);
  const remainingForGift = Math.max(0, FREE_GIFT_THRESHOLD - cartTotal);

  // Frequently Bought Together (Random 2 items not in cart)
  const recommendations = useMemo(() => {
    return products
      .filter(p => !cart.find(c => c.id === p.id))
      .slice(0, 2);
  }, [cart, products]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

      {/* Sidebar - Mobile Optimized Width */}
      <div className="relative w-full max-w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER: Title & Close */}
        <div className="p-4 flex justify-between items-center bg-white border-b border-gray-100 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-900" />
            <h2 className="text-lg font-black text-gray-900">Your Items <span className="text-gray-500 font-medium text-base">({cart.length} Item{cart.length !== 1 && 's'})</span></h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* PROGRESS BAR: Free Gift */}
        <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            {remainingForGift > 0 ? (
              <span className="text-emerald-800">You are only <span className="font-black">₹{remainingForGift}</span> away from a FREE Shilajit Lozenge</span>
            ) : (
              <span className="text-emerald-800 flex items-center gap-1">🎉 You've unlocked a <span className="font-black">FREE Shilajit Lozenge!</span></span>
            )}
            <span className="text-emerald-600">₹{FREE_GIFT_THRESHOLD}</span>
          </div>
          {/* Bar */}
          <div className="h-1.5 w-full bg-emerald-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 justify-center animate-pulse">
            <Gift size={12} />
            <span>Get FREE Shilajit Lozenges On Purchase Above Rs.1149 🎁</span>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">

          {/* CART ITEMS LIST */}
          <div className="p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-60">
                <ShoppingBag size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <button onClick={onClose} className="mt-4 text-emerald-600 font-bold text-sm hover:underline">Start Shopping</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1">
                            <X size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Size: Pack of 1</p>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        {/* Price */}
                        <div>
                          <span className="font-black text-gray-900 text-sm">₹{item.price}</span>
                          {item.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">Rs. {item.originalPrice}</span>}
                        </div>

                        {/* Quantity Wrapper */}
                        <div className="flex items-center bg-white border border-gray-200 rounded text-xs font-bold h-7">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="px-2 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 disabled:opacity-30 border-r border-gray-100"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 border-l border-gray-100"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">Remove</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FREQUENTLY BOUGHT TOGETHER */}
          {cart.length > 0 && recommendations.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400">✨</span>
                <h3 className="font-bold text-sm text-gray-700">Frequently Bought Together!</h3>
              </div>
              <div className="bg-white border border-emerald-100 rounded-xl p-3 shadow-sm bg-emerald-50/30">
                {recommendations.map(rec => (
                  <div key={rec.id} className="flex gap-3 mb-3 last:mb-0 border-b last:border-0 border-dashed border-emerald-100 pb-3 last:pb-0">
                    <div className="w-12 h-12 bg-white rounded-lg p-1 border border-emerald-100 flex-shrink-0">
                      <img src={rec.image} alt={rec.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{rec.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <span className="font-bold text-xs text-gray-900">₹{rec.price}</span>
                          {rec.originalPrice && <span className="text-[10px] text-gray-400 line-through ml-1">₹{rec.originalPrice}</span>}
                        </div>
                        <button
                          onClick={() => addToCart(rec, 1)}
                          className="bg-emerald-900 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-sm hover:bg-emerald-800 uppercase tracking-wide"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* STICKY FOOTER */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            {/* Savings Banner */}
            <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 mb-3 shadow-sm animate-pulse">
              <Tag size={12} className="fill-white" />
              <span>You saved ₹{cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.quantity, 0)} on this order</span>
            </div>

            {/* Price Summary Row */}
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through mr-2">₹{cart.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0)}</span>
                <span className="text-xl font-black text-gray-900">₹{cartTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-emerald-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-emerald-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
            >
              Checkout <ChevronRight size={16} />
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">Safe & Secure Payments | 100% Authentic</p>
          </div>
        )}
      </div>

      {/* Checkout Modal (Legacy support until full page switch) */}
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </div>
  );
};