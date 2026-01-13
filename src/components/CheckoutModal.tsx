import { useState } from 'react';
import { X, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal = ({ onClose }: CheckoutModalProps) => {
  const { cart, cartTotal, user, clearCart } = useShop(); // 'clearCart' context se lene ke liye
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  // Updated Form Data
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    secondaryPhone: '',
    pincode: '',
    address: '',
    landmark: '',
    mapLink: ''
  });

  // Feature: Auto Detect Location (FIXED LINK FORMAT) 📍
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // ✅ FIXED: Sahi Google Maps Link format aur '$' sign laga diya
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        setFormData(prev => ({ ...prev, mapLink: mapsUrl }));
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch location. Please enable GPS.");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: formData,
        items: cart,
        total: cartTotal,
        status: 'Pending',
        paymentMethod: 'COD',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);
      
      // Order lagne ke baad cart khali karo (Agar context mein clearCart banaya hai toh)
      if (clearCart) clearCart(); 
      
      setSuccess(true);
      
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500">Thank you, {formData.name}. We'll call you shortly for confirmation.</p>
          <button 
            onClick={() => {
              window.location.reload(); // Fallback agar clearCart nahi chala toh
            }} 
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
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

        <h2 className="text-2xl font-black mb-6 text-emerald-900">Delivery Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="text-xs font-bold text-gray-500 uppercase">Alt Mobile (Opt)</label>
                    <input type="tel" maxLength={10} placeholder="Backup No..." value={formData.secondaryPhone} onChange={e => setFormData({...formData, secondaryPhone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500"/>
                </div>
            </div>

            {/* Address Section */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                    <input required type="text" maxLength={6} placeholder="1100XX" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500"/>
                </div>
                <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                    <button 
                        type="button" 
                        onClick={detectLocation}
                        className={`w-full flex items-center justify-center gap-2 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-3 rounded-xl font-bold transition-all ${formData.mapLink ? 'ring-2 ring-emerald-500' : ''}`}
                    >
                        {locationLoading ? <Loader2 className="animate-spin" size={18}/> : <MapPin size={18}/>}
                        {formData.mapLink ? "Location Saved" : "Detect Location"}
                    </button>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Complete Address</label>
                <textarea required rows={2} placeholder="House No, Building, Street Area..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500 resize-none"></textarea>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nearby Landmark</label>
                <input required type="text" placeholder="Near Temple, Opposite Bank etc." value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500"/>
            </div>

            {/* Summary */}
            <div className="bg-emerald-900/5 p-4 rounded-xl flex justify-between items-center text-emerald-900 font-bold border border-emerald-900/10 mt-4">
                <span>Total to Pay (COD)</span>
                <span className="text-xl">₹{cartTotal}</span>
            </div>

            <button disabled={loading} className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200/50 flex justify-center items-center gap-2">
                {loading ? <><Loader2 className="animate-spin"/> Processing...</> : 'Confirm Order'}
            </button>
        </form>
      </div>
    </div>
  );
};