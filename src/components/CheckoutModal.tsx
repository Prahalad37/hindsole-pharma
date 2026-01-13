import { useState } from 'react';
import { X, CheckCircle, MapPin, Loader2, CreditCard, Truck, Smartphone } from 'lucide-react';
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
  const [paymentMode, setPaymentMode] = useState<'ONLINE' | 'COD'>('ONLINE'); // Toggle Mode
  
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    phone: '',
    secondaryPhone: '',
    pincode: '',
    address: '',
    landmark: '',
    mapLink: ''
  });

  // 📍 Auto Detect Location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `http://maps.google.com/?q=${latitude},${longitude}`;
        setFormData(prev => ({ ...prev, mapLink: mapsUrl }));
        toast.success("Location Detected!");
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Unable to fetch location");
        setLocationLoading(false);
      }
    );
  };

  // 🚀 Handle Order (Fake Payment Logic)
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.address || !formData.pincode) {
        toast.error("Please fill all details");
        return;
    }

    setLoading(true);

    // 🎭 SIMULATE PAYMENT DELAY (2 Seconds)
    // Asli payment gateway ki tarah feel aayega
    setTimeout(async () => {
        try {
            const orderData = {
                customer: formData,
                items: cart,
                total: cartTotal,
                status: 'Pending',
                paymentMethod: paymentMode === 'ONLINE' ? 'Online (Demo)' : 'Cash on Delivery',
                paymentId: paymentMode === 'ONLINE' ? `PAY_${Math.floor(Math.random() * 1000000)}` : 'COD',
                userId: auth.currentUser?.uid || 'guest',
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, "orders"), orderData);
            
            if (clearCart) clearCart();
            setSuccess(true);
            toast.success(paymentMode === 'ONLINE' ? "Payment Successful!" : "Order Placed!");

        } catch (error) {
            console.error("Order Error:", error);
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    }, 2000); // 2 second ka wait
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500">
            {paymentMode === 'ONLINE' ? 'Payment Received.' : 'Pay on Delivery.'} <br/>
            Thank you, {formData.name}.
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-gray-400"/>
        </button>

        <h2 className="text-2xl font-black mb-6 text-emerald-900 flex items-center gap-2">
            Checkout
        </h2>
        
        <form onSubmit={handleOrder} className="space-y-4">
            {/* Personal Info */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500"/>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mobile No</label>
                    <input required type="tel" maxLength={10} placeholder="98765..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500"/>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                    <input required type="text" maxLength={6} placeholder="1100XX" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500"/>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Address & Location</label>
                <div className="flex gap-2">
                    <textarea required rows={1} placeholder="Full Address..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500 resize-none"></textarea>
                    <button type="button" onClick={detectLocation} className={`px-4 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center justify-center ${formData.mapLink ? 'bg-emerald-100 ring-2 ring-emerald-500' : ''}`}>
                         {locationLoading ? <Loader2 className="animate-spin"/> : <MapPin/>}
                    </button>
                </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        type="button" 
                        onClick={() => setPaymentMode('ONLINE')}
                        className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMode === 'ONLINE' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 text-gray-400'}`}
                    >
                        <CreditCard size={20}/> UPI / Card
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setPaymentMode('COD')}
                        className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${paymentMode === 'COD' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 text-gray-400'}`}
                    >
                        <Truck size={20}/> Cash on Delivery
                    </button>
                </div>
            </div>

            {/* Summary Button */}
            <button disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg flex justify-center items-center gap-2 mt-4">
                {loading ? <><Loader2 className="animate-spin"/> Processing...</> : 
                    paymentMode === 'ONLINE' ? `Pay ₹${cartTotal} Now` : `Place COD Order (₹${cartTotal})`
                }
            </button>
            
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <CheckCircle size={12}/> {paymentMode === 'ONLINE' ? 'Secure Payment Simulator' : 'Pay when you receive'}
            </p>
        </form>
      </div>
    </div>
  );
};