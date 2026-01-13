import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      // Wait for Auth to initialize
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          navigate('/login'); 
          return;
        }

        try {
          // Query: Get orders where userId matches current logged-in user
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          const userOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
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

  if (loading) return <div className="p-10 text-center">Loading your orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-green-900">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/shop')} className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order ID: #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === 'delivered' ? (
                      <span className="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckCircle size={16} className="mr-1" /> Delivered
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                        <Clock size={16} className="mr-1" /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  {order.cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-2 last:mb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="h-10 w-10 object-contain" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <p className="text-gray-500 text-sm">Payment Mode: {order.paymentMethod || 'COD'}</p>
                    <p className="text-xl font-bold text-green-800">Total: ₹{order.totalAmount}</p>
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