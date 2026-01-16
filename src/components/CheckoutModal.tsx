import { useState } from 'react';
import { X, CheckCircle, MapPin, Loader2, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import toast from 'react-hot-toast';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal = ({ onClose }: CheckoutModalProps) => {
  const { cart, cartTotal, clearCart } = useShop();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'ONLINE' | 'COD'>('ONLINE');
  
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    phone: '',
    pincode: '',
    address: '',
    mapLink: ''
  });

  // 📍 Auto Detect Location (Updated URL)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // ✅ Standard Google Maps URL
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setFormData(prev => ({ ...prev, mapLink: mapsUrl }));
        toast.success("Location Detected!");
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Unable to fetch location. Please enter manually.");
        setLocationLoading(false);
      }
    );
  };

  // 🚀 Handle Order
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
        toast.error("Please fill all details");
        return;
    }

    if (formData.phone.length < 10) {
        toast.error("Please enter a valid phone number");
        return;
    }

    setLoading(true);

    // 🎭 SIMULATE PAYMENT DELAY
    setTimeout(async () => {
        try {
            const orderData = {
                customer: formData,
                items: cart,
                total: cartTotal,
                status: 'Pending', // Order Status
                paymentMethod: paymentMode === 'ONLINE' ? 'Online (Paid)' : 'Cash on Delivery',
                paymentId: paymentMode === 'ONLINE' ? `PAY_${Math.floor(Math.random() * 1000000)}` : 'COD',
                userId: auth.currentUser?.uid || 'guest',
                createdAt: serverTimestamp(),
            };

            // 🔥 Firestore mein save
            await addDoc(collection(db, "orders"), orderData);
            
            if (clearCart) clearCart();
            setSuccess(true);
            toast.success(paymentMode === 'ONLINE' ? "Payment Successful!" : "Order Placed Successfully!");

        } catch (error) {
            console.error("Order Error:", error);
            toast.error("Failed to place order. Try again.");
        } finally {
            setLoading(false);
        }
    }, 2000); 
  };

  // ✅ Success Screen
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500 text-sm">
            Thank you, <b>{formData.name}</b>. <br/>
            We have received your order.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
            <p>Order Total: <span className="font-bold">₹{cartTotal}</span></p>
            <p>Mode: <span className="font-bold">{paymentMode === 'ONLINE' ? 'Online' : 'COD'}</span></p>
          </div>
          <button onClick={() => window.location.reload()} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // 📝 Form Screen
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
            <X size={24} className="text-gray-400"/>
        </button>

        <h2 className="text-2xl font-black mb-1 text-emerald-900">Checkout</h2>
        <p className="text-gray-500 text-sm mb-6">Complete your order details</p>
        
        <form onSubmit={handleOrder} className="space-y-4">
            {/* Personal Info */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input required type="text" placeholder="Enter your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500 focus:bg-white transition-all"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone</label>
                    <input required type="tel" maxLength={10} placeholder="98765..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500 focus:bg-white transition-all"/>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pincode</label>
                    <input required type="text" maxLength={6} placeholder="1100XX" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500 focus:bg-white transition-all"/>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Address</label>
                <div className="relative">
                    <textarea required rows={2} placeholder="House no, Street, Area..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 font-medium outline-emerald-500 resize-none focus:bg-white transition-all"></textarea>
                    
                    {/* Location Button inside textarea */}
                    <button type="button" onClick={detectLocation} title="Detect My Location" className={`absolute right-2 top-2 p-2 rounded-lg transition-all ${formData.mapLink ? 'text-emerald-600 bg-emerald-100' : 'text-gray-400 hover:text-emerald-600 hover:bg-gray-100'}`}>
                         {locationLoading ? <Loader2 size={20} className="animate-spin"/> : <MapPin size={20}/>}
                    </button>
                </div>
                {formData.mapLink && <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><CheckCircle size={10}/> Location captured</p>}
            </div>

            {/* Order Summary Box */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <ShoppingBag size={20} className="text-emerald-600"/>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">Total to Pay</p>
                        <p className="text-lg font-black text-emerald-900">₹{cartTotal}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">{cart.length} Items</p>
                </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        type="button" 
                        onClick={() => setPaymentMode('ONLINE')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-bold transition-all ${paymentMode === 'ONLINE' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 text-gray-400 bg-white'}`}
                    >
                        <CreditCard size={24} className={paymentMode === 'ONLINE' ? 'text-emerald-600' : 'text-gray-300'}/>
                        <span className="text-sm">UPI / Card</span>
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setPaymentMode('COD')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-bold transition-all ${paymentMode === 'COD' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 text-gray-400 bg-white'}`}
                    >
                        <Truck size={24} className={paymentMode === 'COD' ? 'text-emerald-600' : 'text-gray-300'}/>
                        <span className="text-sm">Cash on Delivery</span>
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 mt-2 active:scale-95">
                {loading ? <Loader2 className="animate-spin"/> : 
                    paymentMode === 'ONLINE' ? `Pay ₹${cartTotal} securely` : `Confirm Order`
                }
            </button>
            
        </form>
      </div>
    </div>
  );
};