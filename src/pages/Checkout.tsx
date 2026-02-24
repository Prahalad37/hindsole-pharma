import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  ChevronLeft, ShieldCheck, Banknote, CheckCircle2,
  ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageFadeLayout } from '../components/PageFadeLayout';

export const Checkout = () => {
  const { cart, cartTotal, clearCart, user } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Delivery Details, 2: Payment
  const [showSummary, setShowSummary] = useState(false);

  const [formData, setFormData] = useState({
    mobile: user?.phoneNumber?.replace('+91', '') ?? '',
    pincode: '',
    city: '',
    state: '',
    name: user?.displayName ?? '',
    street: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    if (cart.length === 0) navigate('/shop');
  }, [cart, navigate]);

  const handleDeliveryDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = formData.mobile.replace(/\D/g, '');
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit number');
      return;
    }
    if (!formData.pincode || !formData.name || !formData.street) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const orderPayload = {
        items: cart,
        total: cartTotal,
        status: 'Pending',
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI',
        createdAt: serverTimestamp(),
        userId: user ? user.uid : null,
        customer: {
          name: formData.name,
          phone: formData.mobile.replace(/\D/g, ''),
          address: formData.street,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state
        }
      };

      await addDoc(collection(db, 'orders'), orderPayload);

      // Success UI
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">Order Placed Successfully!</p>
                <p className="mt-1 text-sm text-gray-500">Order ID: #{orderId}</p>
              </div>
            </div>
          </div>
        </div>
      ));

      setTimeout(() => {
        clearCart();
        navigate(user ? '/my-orders' : '/');
      }, 2000);

    } catch (error) {
      console.error("Order Error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20">

      <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2.5 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ChevronLeft size={22} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Secure Checkout</h1>
          <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-0.5">
            <ShieldCheck size={12} /> 100% Safe & Secure
          </div>
        </div>
        <div className="w-11"></div>
      </div>

      <PageFadeLayout className="max-w-md mx-auto p-4 space-y-6">

        {/* ORDER SUMMARY TOGGLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors min-h-[52px]"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <ShoppingBagIcon /> Order Summary
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">₹{cartTotal}</span>
            </div>
            {showSummary ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
          </button>

          {showSummary && (
            <div className="p-4 bg-white border-t border-gray-100 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-10 h-10 border rounded bg-gray-50 p-1 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} x ₹{item.price}</p>
                  </div>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-bold text-emerald-800">
                <span>To Pay</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: DELIVERY DETAILS */}
        <div className={`transition-all duration-300 ${step > 1 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-emerald-900 text-white' : 'bg-gray-200'}`}>1</span>
            Delivery Details
            {step > 1 && <CheckCircle2 size={16} className="text-emerald-500 ml-auto" />}
          </h3>

          {step === 1 && (
            <form onSubmit={handleDeliveryDetails} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number *</label>
                <div className="mt-1 flex items-center border-b-2 border-gray-100 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 rounded-t px-3 py-2 transition-all">
                  <span className="text-gray-500 font-bold border-r pr-3 mr-3 text-sm">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit number"
                    className="flex-1 outline-none font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-400 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Full Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 border-b-2 border-gray-100 focus:border-emerald-500 outline-none py-2 text-sm font-bold"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Pincode *</label>
                  <input
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    maxLength={6}
                    className="w-full mt-1 border-b-2 border-gray-100 focus:border-emerald-500 outline-none py-2 text-sm font-bold"
                    placeholder="110001"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">City</label>
                  <input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full mt-1 border-b-2 border-gray-100 focus:border-emerald-500 outline-none py-2 text-sm"
                    placeholder="City"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Address / Street *</label>
                <textarea
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  rows={2}
                  className="w-full mt-1 border-b-2 border-gray-100 focus:border-emerald-500 outline-none py-2 text-sm resize-none"
                  placeholder="House No, Building, Street Area"
                />
              </div>
              <button type="submit" className="w-full mt-2 bg-emerald-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-800 active:scale-[0.98] transition-all">
                PROCEED TO PAY
              </button>
              <p className="mt-3 text-xs text-center text-gray-400">
                By continuing, you agree to our Terms of Service & Privacy Policy
              </p>
            </form>
          )}
        </div>

        {/* STEP 2: PAYMENT */}
        <div className={`transition-all duration-300 ${step !== 2 ? 'opacity-40 pointer-events-none' : ''}`}>
          <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-emerald-900 text-white' : 'bg-gray-200'}`}>2</span>
            Payment
          </h3>

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">

              <label className={`flex items-center gap-4 p-4 sm:p-5 border-b border-gray-100 cursor-pointer transition-colors min-h-[60px] ${paymentMethod === 'upi' ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="w-6 h-6 accent-emerald-600 shrink-0"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">UPI (GPay / PhonePe) <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Fastest</span></p>
                  <p className="text-xs sm:text-sm text-gray-500">Pay directly from your bank account</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white border border-gray-200 p-1 shrink-0">
                  <img src="/upi-icon.png" alt="UPI" className="w-full h-full object-contain" />
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 sm:p-5 cursor-pointer transition-colors min-h-[60px] ${paymentMethod === 'cod' ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-6 h-6 accent-emerald-600 shrink-0"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm sm:text-base">Cash on Delivery</p>
                  <p className="text-xs sm:text-sm text-gray-500">Pay with cash upon delivery</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white border border-gray-200 p-1 flex items-center justify-center text-emerald-800 shrink-0">
                  <Banknote size={18} />
                </div>
              </label>

              {/* Pay Button */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button onClick={handlePayment} className="w-full bg-emerald-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex justify-between items-center px-6 min-h-[52px]">
                  <span className="text-sm sm:text-base">PAY ₹{cartTotal}</span>
                  <span className="flex items-center gap-2 text-xs font-normal opacity-80"><Lock size={14} /> SSL Encrypted</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </PageFadeLayout>

      <p className="text-center mt-8 text-sm text-gray-500 px-4">Secure payment via UPI & COD</p>

    </div>
  );
};

// Helper Icon
const ShoppingBagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
)