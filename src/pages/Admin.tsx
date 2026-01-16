import { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Users, Trash2, Edit, LogOut, CheckCircle, Plus, Activity, 
  Calendar, User, Lock, MessageCircle, Clock, RefreshCw, X, Image as ImageIcon, 
  Tag, IndianRupee, Layers, UploadCloud, MessageSquare, Mail, MapPin 
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc, query, orderBy, serverTimestamp, writeBatch, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { products as localProductsData } from '../data/products';

// Types
interface Order { id: string; customer?: any; total: number; status: string; paymentMethod?: string; }
interface Appointment { id: string; name: string; phone: string; email: string; date: string; time: string; mode: string; message: string; status: string; }
interface Product { id?: string; name: string; price: number; category: string; image: string; }
interface Review { id: string; productId: string; userName: string; rating: number; comment: string; }
interface Blog { id?: string; title: string; content: string; author: string; image: string; createdAt?: any; }
interface Subscriber { id: string; email: string; subscribedAt?: any; }

export const Admin = () => {
  const navigate = useNavigate();
  
  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]); 
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentProduct, setCurrentProduct] = useState<Product>({ name: '', price: 0, category: 'General', image: '' });
  const [currentBlog, setCurrentBlog] = useState<Blog>({ title: '', content: '', author: 'Admin', image: '' });

  // Auth & Listeners
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => { if (!user) navigate('/'); });

    const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snap) => setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]));
    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]));
    const unsubAppt = onSnapshot(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')), (snap) => setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]));
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snap) => setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[]));
    const unsubBlogs = onSnapshot(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')), (snap) => setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[]));
    const unsubSubs = onSnapshot(query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc')), (snap) => setSubscribers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Subscriber[]));

    return () => { unsubAuth(); unsubOrders(); unsubProducts(); unsubAppt(); unsubReviews(); unsubBlogs(); unsubSubs(); };
  }, [navigate]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const handlePinLogin = (e: React.FormEvent) => { e.preventDefault(); if (pin === "1234") { setIsAuthenticated(true); toast.success("Dashboard Unlocked 🔓"); } else { toast.error("Incorrect PIN ❌"); } };

  // Sync Data
  const handleSyncData = async () => {
    if(!confirm("⚠️ WARNING: This will overwrite Firebase data with local 'products.ts'. Continue?")) return;
    setIsSyncing(true);
    try {
      const batch = writeBatch(db);
      const oldProducts = await getDocs(collection(db, "products"));
      oldProducts.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      for (const product of localProductsData) {
        const { id, ...productData } = product; 
        await addDoc(collection(db, "products"), productData);
      }
      toast.success("Synced Successfully! 🚀");
    } catch (error) { console.error(error); toast.error("Sync Failed!"); } finally { setIsSyncing(false); }
  };

  // CRUD Functions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentProduct.id) {
      await updateDoc(doc(db, "products", currentProduct.id), { ...currentProduct });
      toast.success("Product Updated");
    } else {
      await addDoc(collection(db, "products"), currentProduct);
      toast.success("New Product Added");
    }
    setIsModalOpen(false);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = { ...currentBlog, createdAt: serverTimestamp() };
    if (isEditing && currentBlog.id) { await updateDoc(doc(db, "blogs", currentBlog.id), blogData); toast.success("Blog Updated"); } 
    else { await addDoc(collection(db, "blogs"), blogData); toast.success("Blog Published"); }
    setIsBlogModalOpen(false);
  };

  const deleteItem = async (col: string, id: string) => { if (confirm("Delete permanently?")) { await deleteDoc(doc(db, col, id)); toast.success("Item Deleted"); } };
  const openWhatsApp = (phone: string, name: string) => { window.open(`https://wa.me/91${phone}?text=Hello ${name}, regarding your appointment...`, '_blank'); };
  
  const updateStatus = async (col: string, id: string, currentStatus: string) => {
    let newStatus = '';
    if (col === 'orders') newStatus = currentStatus === 'Pending' ? 'Delivered' : 'Pending';
    else if (col === 'appointments') newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    else newStatus = 'Completed';
    await updateDoc(doc(db, col, id), { status: newStatus });
    toast.success(`Marked as ${newStatus}`);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // Lock Screen
  if (!isAuthenticated) return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="text-emerald-800" size={30} /></div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Hindsole Admin</h2>
        <form onSubmit={handlePinLogin} className="space-y-4 mt-6">
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full text-center text-2xl font-bold tracking-widest p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none" placeholder="••••" maxLength={4} />
          <button className="w-full bg-emerald-800 text-white py-3 rounded-xl font-bold hover:bg-emerald-900 transition-all shadow-lg">Unlock Dashboard</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">
      <aside className={`fixed md:relative z-[80] h-full w-64 bg-emerald-900 text-white transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 text-xl font-black border-b border-emerald-800">Hindsole Admin</div>
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Activity size={18}/> },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18}/> },
            { id: 'consults', label: 'Consultations', icon: <Users size={18}/> },
            { id: 'products', label: 'Products', icon: <Package size={18}/> },
            { id: 'blogs', label: 'Blogs', icon: <Clock size={18}/> }, 
            { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18}/> },
            { id: 'subscribers', label: 'Subscribers', icon: <Mail size={18}/> }
          ].map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-lg transition ${activeTab === item.id ? 'bg-emerald-700 font-bold' : 'hover:bg-emerald-800'}`}>
              {item.icon} <span className="ml-3 text-sm">{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-900/50 rounded-lg mt-10"><LogOut size={18} className="mr-3" /> Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full h-screen">
        <h2 className="text-2xl font-black mb-8 text-emerald-950 uppercase tracking-tight">{activeTab}</h2>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-emerald-500">
               <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Revenue</p>
               <h3 className="text-3xl font-black">₹{totalRevenue}</h3>
            </div>
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500"><p className="text-gray-400 text-[10px] font-bold uppercase">Orders</p><h3 className="text-3xl font-black">{orders.length}</h3></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-purple-500"><p className="text-gray-400 text-[10px] font-bold uppercase">Consults</p><h3 className="text-3xl font-black">{appointments.length}</h3></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-orange-500"><p className="text-gray-400 text-[10px] font-bold uppercase">Subscribers</p><h3 className="text-3xl font-black">{subscribers.length}</h3></div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold uppercase tracking-tight">Inventory</h3>
              <div className="flex gap-2">
                <button onClick={handleSyncData} disabled={isSyncing} className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 uppercase transition-all shadow-md ${isSyncing ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}>
                  <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Syncing...' : 'Reset Data'}
                </button>
                <button onClick={()=>{setIsEditing(false); setCurrentProduct({name:'', price:0, category:'General', image:''}); setIsModalOpen(true)}} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center transition-all shadow-md"><Plus className="w-4 h-4 mr-1" /> Add New</button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-shadow group relative">
                  <img src={product.image} className="h-32 object-contain mb-4 group-hover:scale-105 transition-transform" />
                  <h3 className="font-bold text-xs text-gray-900 text-center line-clamp-1 uppercase">{product.name}</h3>
                  <p className="text-emerald-700 font-black text-md">₹{product.price}</p>
                  <div className="flex gap-2 mt-4 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => {setIsEditing(true); setCurrentProduct(product); setIsModalOpen(true)}} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-[10px] font-bold uppercase">Edit</button>
                    <button onClick={() => deleteItem('products', product.id || '')} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-[10px] font-bold uppercase">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ ORDERS TAB (Details Fixed) */}
        {activeTab === 'orders' && (
             <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
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
                        </td>
                        {/* 👇 FIXED: Address and Phone details added back */}
                        <td className="px-6 py-4 text-gray-600 max-w-[200px]">
                           <div className="flex items-start gap-1">
                             <MapPin size={12} className="mt-0.5 text-gray-400 min-w-[12px]"/>
                             <div>
                                <p className="font-medium text-[11px] leading-tight">{order.customer?.address || 'No Address'}</p>
                                <p className="font-bold text-gray-400 mt-1 text-[10px]">{order.customer?.city} - {order.customer?.pincode}</p>
                             </div>
                           </div>
                           <p className="font-bold text-emerald-600 text-[10px] mt-1 pl-4">📞 {order.customer?.phone}</p>
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
        
        {/* CONSULTS TAB */}
        {activeTab === 'consults' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider ${app.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><User size={18} className="text-emerald-600"/> {app.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2 py-1 rounded-lg"><Clock size={12}/> {app.date} | {app.time} ({app.mode})</div>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl mb-4 text-xs text-gray-600">
                  <p className="font-medium italic">"{app.message || "No message provided"}"</p>
                  <div className="mt-2 flex gap-4 text-gray-400 font-bold uppercase text-[10px]"><span>📞 {app.phone}</span><span>👶 Age: {app.age || 'N/A'}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => openWhatsApp(app.phone, app.name)} className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg font-bold text-xs hover:bg-green-100 flex justify-center items-center gap-1 transition-colors"><MessageCircle size={14}/> Reply</button>
                  <button onClick={()=>updateStatus('appointments', app.id, app.status)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><CheckCircle size={16}/></button>
                  <button onClick={()=>deleteItem('appointments', app.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ BLOGS TAB (Restored) */}
        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between mb-6">
              <h3 className="font-bold uppercase tracking-tight">Wellness Journal</h3>
              <button onClick={()=>{setIsEditing(false); setCurrentBlog({title:'', content:'', author:'Admin', image:''}); setIsBlogModalOpen(true)}} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 uppercase shadow-md"><Plus size={16}/> New post</button>
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

        {/* ✅ REVIEWS TAB (Restored) */}
        {activeTab === 'reviews' && (
          <div className="grid gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-start border border-gray-100">
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-1">
                     <span className="text-sm font-bold text-gray-800 mr-2">{rev.rating}/5</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium italic mb-1">"{rev.comment}"</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">- {rev.userName}</p>
                </div>
                <button onClick={() => deleteItem('reviews', rev.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ SUBSCRIBERS TAB (Restored) */}
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

      {/* PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
             
             {/* Header */}
             <div className="bg-emerald-900 p-6 flex justify-between items-center">
                <h3 className="text-white text-lg font-black uppercase tracking-wider flex items-center gap-2">
                  {isEditing ? <Edit size={20}/> : <Plus size={20}/>} {isEditing ? 'Update Product' : 'Add New Item'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-emerald-300 hover:text-white hover:bg-emerald-800 p-2 rounded-full transition-colors">
                  <X size={20}/>
                </button>
             </div>

             <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
                  <div className="relative group">
                    <Tag className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-600" size={18}/>
                    <input placeholder="e.g. Ashwagandha Gold" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" required />
                  </div>
                </div>

                {/* Grid for Price & Category */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Price (₹)</label>
                      <div className="relative group">
                        <IndianRupee className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-600" size={18}/>
                        <input type="number" placeholder="499" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" required />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Category</label>
                      <div className="relative group">
                        <Layers className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-600" size={18}/>
                        <select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 p-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700 appearance-none cursor-pointer">
                          <option>General</option><option>Pain Relief</option><option>Digestion</option><option>Diabetes Care</option><option>Immunity</option><option>Women's Health</option>
                        </select>
                      </div>
                   </div>
                </div>

                {/* Image URL & Preview */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Image Link</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-emerald-600" size={18}/>
                    <input placeholder="https://..." value={currentProduct.image} onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 p-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-600" required />
                  </div>
                </div>

                {/* Live Image Preview */}
                {currentProduct.image && (
                  <div className="bg-gray-50 rounded-xl p-2 border border-dashed border-gray-300 flex justify-center items-center h-32 relative overflow-hidden">
                     <img src={currentProduct.image} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                     <p className="absolute text-xs text-gray-400 -z-10 flex items-center gap-1"><UploadCloud size={14}/> Image Preview</p>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-2">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                   <button type="submit" className="flex-1 bg-emerald-900 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-emerald-900/30 hover:bg-emerald-800 transition-all flex justify-center items-center gap-2">
                     <CheckCircle size={18}/> {isEditing ? 'Update Item' : 'Save Item'}
                   </button>
                </div>

             </form>
           </div>
        </div>
      )}

      {/* ✅ BLOG MODAL (Restored) */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
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