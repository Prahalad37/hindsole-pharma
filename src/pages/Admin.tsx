import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Users, Trash2, Edit, LogOut, CheckCircle, XCircle, Plus, Activity, Calendar, User, MapPin, Phone, Menu, X, Star, FileText, MessageSquare, Mail 
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

// ✅ Types Definitions
interface Order { id: string; customer?: any; total: number; status: string; paymentMethod?: string; }
interface Appointment { id: string; name: string; phone: string; email: string; date: string; time: string; mode: string; message: string; status: string; }
interface Product { id?: string; name: string; price: number; category: string; image: string; }
interface Review { id: string; productId: string; userName: string; rating: number; comment: string; }
interface Blog { id?: string; title: string; content: string; author: string; image: string; createdAt?: any; }
interface Subscriber { id: string; email: string; subscribedAt?: any; }

export const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]); 
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState<Product>({ name: '', price: 0, category: 'General', image: '' });
  const [currentBlog, setCurrentBlog] = useState<Blog>({ title: '', content: '', author: 'Admin', image: '' });

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => { if (!user) navigate('/'); });

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    });
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
    });
    const unsubAppt = onSnapshot(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')), (snap) => {
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]);
    });
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snap) => {
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[]);
    });
    const unsubBlogs = onSnapshot(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')), (snap) => {
      setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[]);
    });
    const unsubSubs = onSnapshot(query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc')), (snap) => {
      setSubscribers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Subscriber[]);
    });

    return () => { unsubAuth(); unsubOrders(); unsubProducts(); unsubAppt(); unsubReviews(); unsubBlogs(); unsubSubs(); };
  }, [navigate]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  // --- Functions ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentProduct.id) {
      await updateDoc(doc(db, "products", currentProduct.id), { ...currentProduct });
    } else {
      await addDoc(collection(db, "products"), currentProduct);
    }
    setIsModalOpen(false);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = { ...currentBlog, createdAt: serverTimestamp() };
    if (isEditing && currentBlog.id) {
      await updateDoc(doc(db, "blogs", currentBlog.id), blogData);
    } else {
      await addDoc(collection(db, "blogs"), blogData);
    }
    setIsBlogModalOpen(false);
  };

  const deleteItem = async (col: string, id: string) => {
    if (confirm("Delete permanently?")) await deleteDoc(doc(db, col, id));
  };

  const updateStatus = async (col: string, id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';
    await updateDoc(doc(db, col, id), { status: newStatus });
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">
      <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden fixed bottom-6 right-6 z-[60] bg-emerald-900 text-white p-4 rounded-full shadow-2xl active:scale-95"><Menu size={24} /></button>

      <aside className={`fixed md:relative z-[80] h-full w-64 bg-emerald-900 text-white transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 text-xl font-black border-b border-emerald-800 flex justify-between items-center">
            Hindsole Admin <X className="md:hidden" onClick={()=>setIsMobileMenuOpen(false)}/>
        </div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Activity size={18}/> },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18}/> },
            { id: 'products', label: 'Products', icon: <Package size={18}/> },
            { id: 'blogs', label: 'Blogs', icon: <FileText size={18}/> },
            { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18}/> },
            { id: 'consults', label: 'Consults', icon: <Users size={18}/> },
            { id: 'subscribers', label: 'Subscribers', icon: <Mail size={18}/> }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === item.id ? 'bg-emerald-700 font-bold' : 'hover:bg-emerald-800'}`}>
              {item.icon} <span className="ml-3 text-sm">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-900/50 rounded-lg mt-10"><LogOut size={18} className="mr-3" /> Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">
        <h2 className="text-2xl font-black mb-8 text-emerald-950 uppercase tracking-tight">{activeTab}</h2>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
               <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Revenue</p>
               <h3 className="text-3xl font-black">₹{totalRevenue}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
               <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Orders</p>
               <h3 className="text-3xl font-black">{orders.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-purple-500">
               <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Consults</p>
               <h3 className="text-3xl font-black">{appointments.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500">
               <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Subscribers</p>
               <h3 className="text-3xl font-black">{subscribers.length}</h3>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer & ID</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shipping Details</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 text-xs transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{order.customer?.name}</div>
                            <div className="text-[10px] text-gray-400">#{order.id.slice(0,6)}</div>
                            <div className="text-[10px] text-emerald-600 font-bold">{order.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 max-w-[200px]">
                            <p className="font-medium">{order.customer?.address}</p>
                            <p className="font-bold text-gray-400 mt-1">PIN: {order.customer?.pincode} | {order.customer?.phone}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-800">₹{order.total}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4">
                            <button onClick={() => updateStatus('orders', order.id, order.status)} className="text-blue-600 underline font-bold uppercase text-[10px]">Toggle</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold uppercase tracking-tight">Inventory</h3>
              <button onClick={()=>{setIsEditing(false); setCurrentProduct({name:'', price:0, category:'General', image:''}); setIsModalOpen(true)}} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center transition-all active:scale-95"><Plus className="w-4 h-4 mr-1" /> Add New</button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                  <img src={product.image} className="h-24 object-contain mb-4" />
                  <h3 className="font-bold text-xs text-gray-900 text-center line-clamp-1 uppercase">{product.name}</h3>
                  <p className="text-emerald-700 font-black text-md">₹{product.price}</p>
                  <div className="flex gap-2 mt-4 w-full">
                    <button onClick={() => {setIsEditing(true); setCurrentProduct(product); setIsModalOpen(true)}} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-[10px] font-bold flex justify-center items-center gap-1 uppercase">Edit</button>
                    <button onClick={() => deleteItem('products', product.id || '')} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-[10px] font-bold flex justify-center items-center gap-1 uppercase">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-start border border-gray-100">
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 font-medium italic mb-1">"{rev.comment}"</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">- {rev.userName}</p>
                </div>
                <button onClick={() => deleteItem('reviews', rev.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'consults' && (
          <div className="grid gap-4">
            {appointments.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase"><User size={18} className="text-emerald-600"/> {app.name}</h3>
                    <div className="text-[11px] text-gray-500 mt-2 space-y-1">
                        <p>📞 {app.phone} | 📧 {app.email}</p>
                        <p className="font-bold text-emerald-700 uppercase tracking-tighter">📅 {app.date} | {app.time} ({app.mode})</p>
                        <p className="italic bg-gray-50 p-2 rounded-lg mt-2 border border-gray-100 text-[10px]">"{app.message}"</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${app.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span>
                    <button onClick={()=>updateStatus('appointments', app.id, app.status)} className="text-[10px] font-bold text-blue-600 underline uppercase">Toggle</button>
                    <button onClick={()=>deleteItem('appointments', app.id)} className="text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between mb-6">
              <h3 className="font-bold uppercase tracking-tight">Wellness Journal</h3>
              <button onClick={()=>{setIsEditing(false); setCurrentBlog({title:'', content:'', author:'Admin', image:''}); setIsBlogModalOpen(true)}} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 uppercase"><Plus size={16}/> New post</button>
            </div>
            <div className="grid gap-4">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-4">
                    <img src={blog.image} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
                    <h4 className="font-bold text-xs uppercase tracking-tighter">{blog.title}</h4>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={()=>{setIsEditing(true); setCurrentBlog(blog); setIsBlogModalOpen(true)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg uppercase"><Edit size={16}/></button>
                    <button onClick={()=>deleteItem('blogs', blog.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg uppercase"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50 uppercase tracking-tight">
                <h3 className="font-black text-emerald-950">Newsletter leads</h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{subscribers.length} Emails</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Email Address</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-400 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-emerald-900 text-sm">{sub.email}</td>
                        <td className="px-6 py-4 text-gray-400 text-[10px] uppercase">{sub.subscribedAt?.toDate().toLocaleDateString() || 'Recent'}</td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={()=>deleteItem('subscribers', sub.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALS remain same as your logic */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{isEditing ? 'Modify' : 'New Item'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <input placeholder="Name" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full p-3 border-b-2 outline-none focus:border-emerald-500 bg-gray-50 text-sm uppercase" required />
              <input placeholder="Price" type="number" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full p-3 border-b-2 outline-none focus:border-emerald-500 bg-gray-50 text-sm uppercase" required />
              <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full p-3 border-b-2 outline-none bg-gray-50 text-sm uppercase font-bold text-emerald-900">
                <option>General</option><option>Skin Care</option><option>Immunity</option><option>Digestion</option>
              </select>
              <input placeholder="Image URL" value={currentProduct.image} onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} className="w-full p-3 border-b-2 outline-none bg-gray-50 text-sm" required />
              <div className="flex gap-3 pt-4 font-bold text-xs uppercase">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 text-gray-400">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-900 text-white rounded-xl shadow-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">{isEditing ? 'Edit Blog' : 'New post'}</h3>
            <form onSubmit={handleSaveBlog} className="space-y-4 font-bold text-xs uppercase">
              <input placeholder="Title" value={currentBlog.title} onChange={e=>setCurrentBlog({...currentBlog, title: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-emerald-500" required />
              <input placeholder="Image URL" value={currentBlog.image} onChange={e=>setCurrentBlog({...currentBlog, image: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100" required />
              <textarea placeholder="Content..." rows={5} value={currentBlog.content} onChange={e=>setCurrentBlog({...currentBlog, content: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100 resize-none" required />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={()=>setIsBlogModalOpen(false)} className="flex-1 text-gray-400">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl shadow-xl">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};