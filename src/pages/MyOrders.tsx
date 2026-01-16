import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Package, Clock, CheckCircle, Loader2, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Check Auth State properly
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          // Agar user login nahi hai, login page par bhejo
          navigate('/login'); 
          return;
        }

        try {
          // 2. Query: Sirf logged-in user ke orders
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
          );
          
          const querySnapshot = await getDocs(q);
          const userOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // 3. Sorting (Client side better hai small apps ke liye)
          // Newest order sabse upar
          userOrders.sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds);

          setOrders(userOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      });
    };

    fetchOrders();
  }, [navigate]);

  // ⏳ Loading State
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-12 animate-in fade-in">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-8 text-emerald-950 font-serif">My Orders</h1>

        {orders.length === 0 ? (
          // 🛒 Empty State
          <div className="bg-white p-12 rounded-[2rem] shadow-sm text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Looks like you haven't experienced the healing power of Ayurveda yet.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          // 📦 Orders List
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                
                {/* Order Header */}
                <div className="bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order ID</p>
                    <p className="text-sm font-mono text-gray-700">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                     <p className="text-xs text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                        <Calendar size={12}/> Date
                     </p>
                     <p className="text-sm text-gray-700">
                        {order.createdAt?.seconds 
                            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' }) 
                            : 'Just now'}
                     </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'Delivered' ? (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        <CheckCircle size={14} /> Delivered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        <Clock size={14} /> {order.status || 'Pending'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    {order.items && order.items.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4 items-center">
                            <div className="h-14 w-14 bg-gray-50 rounded-xl border border-gray-100 p-2 flex items-center justify-center shrink-0">
                            <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm md:text-base truncate">{item.name}</p>
                            <p className="text-xs text-emerald-600 font-medium">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                    ))}
                  </div>
                  
                  {/* Footer Info */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0"/>
                        <span className="max-w-xs">
                            {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
                        </span>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="text-sm font-medium text-gray-800">{order.paymentMethod || 'COD'}</p>
                        </div>
                        <div className="text-right pl-4 border-l border-gray-200">
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="text-xl font-black text-emerald-900">₹{order.total}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};