import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Truck, MessageCircle, User, Phone, MapPin, Loader2, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// 👇 Updated Import: 'auth' add kiya hai
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const { cart, cartTotal, clearCart } = useShop(); 
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ Auto-fill form agar user logged in hai
  const [customerData, setCustomerData] = useState({ 
    name: auth.currentUser?.displayName || "", 
    email: auth.currentUser?.email || "", 
    phone: "", 
    pincode: "", 
    city: "", 
    address: "" 
  });

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!customerData.name || !customerData.phone || !customerData.address || !customerData.pincode) {
        toast.error("Please fill all required fields");
        return;
    }

    if (customerData.phone.length < 10) {
        toast.error("Please enter a valid phone number");
        return;
    }

    setIsSubmitting(true);

    // 1. Prepare WhatsApp Message
    const productDetails = cart.map(item => 
      `- ${item.name} (x${item.quantity}) : ₹${item.price * item.quantity}`
    ).join('\n');

    const message = `*NEW ORDER - HINDSOLE PHARMA*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${customerData.name}\n` +
      `Phone: ${customerData.phone}\n` +
      `Email: ${customerData.email || "Not Provided"}\n` +
      `Address: ${customerData.address}, ${customerData.city} - ${customerData.pincode}\n\n` +
      `*Order Summary:*\n${productDetails}\n\n` +
      `*Total Amount: ₹${cartTotal}*\n\n` +
      `-----------------------------\n` +
      `Please confirm my order and share payment details.`;

    try {
      // ✅ FIX: Check karo user logged in hai ya nahi
      const user = auth.currentUser;
      const currentUserId = user ? user.uid : 'guest_whatsapp';

      // 2. 🔥 SAVE TO FIREBASE DATABASE WITH CORRECT USER ID
      await addDoc(collection(db, "orders"), {
        customer: customerData,
        items: cart,
        total: cartTotal,
        status: 'Pending',
        paymentMethod: 'WhatsApp Checkout',
        createdAt: serverTimestamp(),
        userId: currentUserId // 👈 Ye line sabse zaroori hai "My Orders" ke liye
      });

      // 3. Open WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = "917236875967"; 
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const whatsappUrl = isMobile 
        ? `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');

      // 4. Success State
      clearCart();
      setOrderPlaced(true);
      toast.success("Order Saved! Opening WhatsApp... 🚀");

    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Network issue. Opening WhatsApp directly.");
      
      // Fallback
      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = "917236875967"; 
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      
      setOrderPlaced(true);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Order Success Screen
  if (orderPlaced) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <MessageCircle size={50} className="text-green-600" />
      </div>
      <h1 className="text-4xl font-black mb-2 text-emerald-950">Order Initiated!</h1>
      <p className="text-gray-500 mb-8 max-w-md text-lg">
        We have saved your details. WhatsApp should have opened with your order summary. 
        <br/><br/>
        <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold border border-green-200">
          👉 Just click SEND on WhatsApp
        </span>
      </p>
      <div className="flex gap-4">
        <button onClick={() => navigate('/')} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
            Back Home
        </button>
        <button onClick={() => navigate('/my-orders')} className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg">
            Track Order
        </button>
      </div>
    </div>
  );

  // 🛒 Empty Cart Screen
  if (cart.length === 0) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={40} className="text-gray-400"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any medicines yet.</p>
            <Link to="/shop" className="block w-full bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                Browse Medicines
            </Link>
        </div>
     </div>
  );

  // 📝 Checkout Form
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 animate-in fade-in bg-gray-50 min-h-screen">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-500 mb-8 hover:text-emerald-600 font-bold transition-colors">
          <ArrowLeft size={20}/> Back to Shop
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-100/50 border border-gray-100 relative overflow-hidden">
                  
                  {/* Decorative Header Background */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-500"></div>

                  <h2 className="text-3xl font-black mb-2 flex items-center gap-3 text-emerald-950">
                    <Truck className="text-emerald-600" /> Shipping Details
                  </h2>
                  <p className="text-gray-500 mb-8 ml-9">Where should we deliver your order?</p>
                  
                  <form id="checkout-form" onSubmit={handleWhatsAppOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="relative group">
                      <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20}/>
                      <input required placeholder="Full Name" value={customerData.name} onChange={(e)=>setCustomerData({...customerData, name: e.target.value})} className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    
                    <div className="relative group">
                      <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20}/>
                      <input required type="tel" maxLength={10} placeholder="Phone Number" value={customerData.phone} onChange={(e)=>setCustomerData({...customerData, phone: e.target.value})} className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium" />
                    </div>

                    <div className="md:col-span-2 relative group">
                       <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20}/>
                       <input 
                         type="email" 
                         placeholder="Email Address (Optional)" 
                         value={customerData.email} 
                         onChange={(e)=>setCustomerData({...customerData, email: e.target.value})} 
                         className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium" 
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                        <input required type="text" maxLength={6} placeholder="Pincode" value={customerData.pincode} onChange={(e)=>setCustomerData({...customerData, pincode: e.target.value})} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium" />
                        <input required placeholder="City" value={customerData.city} onChange={(e)=>setCustomerData({...customerData, city: e.target.value})} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium" />
                    </div>
                    
                    <div className="md:col-span-2 relative group">
                      <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20}/>
                      <textarea required rows={3} placeholder="Full Address (House No, Street, Landmark)" value={customerData.address} onChange={(e)=>setCustomerData({...customerData, address: e.target.value})} className="w-full pl-12 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 font-medium resize-none" />
                    </div>

                  </form>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-emerald-950 text-white p-8 rounded-[2.5rem] sticky top-8 shadow-2xl shadow-emerald-900/30">
                  <h3 className="text-2xl font-black mb-6 font-serif">Order Summary</h3>
                  
                  <div className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4 text-sm py-3 border-b border-emerald-800/50 last:border-0 items-center">
                          <div className="w-12 h-12 bg-white rounded-lg p-1 flex-shrink-0">
                             <img src={item.image} alt="prod" className="w-full h-full object-contain"/>
                          </div>
                          <div className="flex-1">
                             <p className="font-medium opacity-90 line-clamp-1">{item.name}</p>
                             <p className="text-xs text-emerald-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-emerald-800 pt-6 flex justify-between items-end mb-8">
                    <span className="text-emerald-400 font-medium text-sm uppercase tracking-widest">Total to Pay</span>
                    <span className="text-4xl font-black">₹{cartTotal}</span>
                  </div>

                  <button 
                    form="checkout-form" 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group bg-green-500 hover:bg-green-400 text-emerald-950 py-5 rounded-[2rem] font-black text-lg shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {isSubmitting ? (
                        <> <Loader2 className="animate-spin" /> saving... </>
                    ) : (
                        <> <MessageCircle className="group-hover:scale-110 transition-transform"/> Place on WhatsApp </>
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-emerald-400/60 mt-4">
                    Secure order via WhatsApp Business
                  </p>
              </div>
            </div>
        </div>
    </main>
  );
};