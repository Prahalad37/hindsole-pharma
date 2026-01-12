import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const { cartItems, cartTotal, setCartItems } = useShop();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerData, setCustomerData] = useState({ name: "", email: "", phone: "", pincode: "", city: "", address: "" });

  const handleFinalOrder = (e: any) => {
    e.preventDefault();
    setOrderPlaced(true);
  };

  if (orderPlaced) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"><CheckCircle size={60} className="text-emerald-600" /></div>
      <h1 className="text-4xl font-black mb-2 text-emerald-950">Order Placed!</h1>
      <p className="text-gray-500 mb-10">Confirmation sent to <span className="font-bold text-emerald-700">{customerData.email}</span></p>
      <button onClick={() => {setCartItems([]); navigate('/');}} className="bg-emerald-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl">Back to Home</button>
    </div>
  );

  if (cartItems.length === 0) return (
     <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-400">Cart is Empty</h2>
        <Link to="/" className="text-emerald-600 font-bold mt-4">Go Shopping</Link>
     </div>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 animate-in fade-in">
        <Link to="/" className="flex items-center gap-2 text-gray-400 mb-10 hover:text-emerald-600 font-bold"><ArrowLeft size={20}/> Back to Shop</Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handleFinalOrder} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3"><Truck className="text-emerald-600" /> Shipping Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Full Name" value={customerData.name} onChange={(e)=>setCustomerData({...customerData, name: e.target.value})} className="p-4 bg-gray-50 border rounded-2xl outline-none" />
                <input required type="email" placeholder="Email" value={customerData.email} onChange={(e)=>setCustomerData({...customerData, email: e.target.value})} className="p-4 bg-gray-50 border rounded-2xl outline-none" />
                <input required type="tel" placeholder="Phone" value={customerData.phone} onChange={(e)=>setCustomerData({...customerData, phone: e.target.value})} className="p-4 bg-gray-50 border rounded-2xl outline-none" />
                <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Pincode" value={customerData.pincode} onChange={(e)=>setCustomerData({...customerData, pincode: e.target.value})} className="p-4 bg-gray-50 border rounded-2xl outline-none" />
                    <input required placeholder="City" value={customerData.city} onChange={(e)=>setCustomerData({...customerData, city: e.target.value})} className="p-4 bg-gray-50 border rounded-2xl outline-none" />
                </div>
                <textarea required rows={3} placeholder="Full Address" value={customerData.address} onChange={(e)=>setCustomerData({...customerData, address: e.target.value})} className="md:col-span-2 p-4 bg-gray-50 border rounded-2xl outline-none" />
                </div>
            </form>
            <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                <div className="bg-white p-3 rounded-full text-emerald-600 shadow-sm"><CreditCard/></div>
                <div><h3 className="font-bold text-emerald-900">Payment Method</h3><p className="text-sm text-emerald-700">Cash on Delivery (COD) selected.</p></div>
            </div>
            </div>

            <div className="lg:col-span-1">
            <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] sticky top-32 shadow-2xl">
                <h3 className="text-2xl font-black mb-8">Summary</h3>
                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm"><span>{item.product.name} x {item.quantity}</span><span className="font-bold">₹{item.product.price * item.quantity}</span></div>
                ))}
                </div>
                <div className="border-t border-emerald-800 pt-6 flex justify-between text-3xl font-black"><span>Total</span><span>₹{cartTotal}</span></div>
                <button form="checkout-form" className="w-full bg-emerald-500 mt-10 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl hover:bg-emerald-400">PLACE ORDER</button>
            </div>
            </div>
        </div>
    </main>
  );
};