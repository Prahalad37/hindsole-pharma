import { useState, useEffect } from 'react';
import {
  ShoppingBag, Users, Trash2, Edit, CheckCircle, Plus,
  User, MessageCircle, Clock, RefreshCw, X, Image as ImageIcon,
  Tag, IndianRupee, Layers, UploadCloud, MapPin, ShieldCheck,
  Package, AlertTriangle, TrendingUp
} from 'lucide-react';
import { InvoiceButton } from '../components/Invoice';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, addDoc, query, orderBy, serverTimestamp, writeBatch, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { products as localProductsData } from '../data/products';
import { AdminLayout } from '../layouts/AdminLayout';
import { StatsCard } from '../components/admin/StatsCard';

// Types (Local Admin Types to match Firestore structure)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Order { id: string; userId?: string; customer?: { name?: string; address?: string; city?: string; pincode?: string; phone?: string }; total: number; status: string; paymentMethod?: string; createdAt?: any; items?: any[]; }
interface Appointment { id: string; name: string; phone: string; email: string; age?: string; date: string; time: string; mode: string; message: string; status: string; }
interface Product { id?: string; name: string; price: number; category: string; image: string; }
interface Review { id: string; productId: string; userName: string; rating: number; comment: string; }
interface Blog { id?: string; title: string; content: string; author: string; image: string; createdAt?: { toDate: () => Date } | null; }
interface Subscriber { id: string; email: string; subscribedAt?: { toDate: () => Date } | null; }

// 🔒 SECURITY: Enforce Email Check
const ALLOWED_ADMINS = ['ppandtech8998@gmail.com'];

export const Admin = () => {
  const navigate = useNavigate();

  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // Auth State
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Auth & Listeners
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // 🔒 SECURITY: Enforce Email Check
        const userEmail = (user.email || '').toLowerCase().trim();

        if (ALLOWED_ADMINS.some(admin => admin.toLowerCase() === userEmail)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          console.warn(`[Admin Auth] Access Denied for: ${userEmail}`);
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    if (isAuthenticated) {
      const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snap) => setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]));
      const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]));
      const unsubAppt = onSnapshot(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')), (snap) => setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[]));
      const unsubReviews = onSnapshot(collection(db, 'reviews'), (snap) => setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[]));
      const unsubBlogs = onSnapshot(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')), (snap) => setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[]));
      const unsubSubs = onSnapshot(query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc')), (snap) => setSubscribers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Subscriber[]));

      return () => { unsubAuth(); unsubOrders(); unsubProducts(); unsubAppt(); unsubReviews(); unsubBlogs(); unsubSubs(); };
    }

    return () => unsubAuth();
  }, [navigate, isAuthenticated]);

  const handleLogout = async () => { await signOut(auth); setTimeout(() => window.location.reload(), 500); };

  const handleGoogleLogin = async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged In!");
    } catch (error) {
      console.error(error);
      toast.error("Login Failed");
    }
  };

  const handleSyncData = async () => {
    if (!confirm("⚠️ DANGER: This will DELETE ALL current products in the database and replace them with the local catalog. Are you sure?")) return;
    setIsSyncing(true);
    try {
      const batch = writeBatch(db);
      const oldProducts = await getDocs(collection(db, "products"));
      oldProducts.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      for (const product of localProductsData) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const updateStatus = async (col: string, id: string, currentStatus: string, nextStatus?: string) => {
    let newStatus = '';
    if (col === 'orders') {
      const orderLifecycle = ['Pending', 'Processing', 'Shipped', 'Delivered'];
      if (nextStatus && orderLifecycle.includes(nextStatus)) {
        newStatus = nextStatus;
      } else {
        const currentIndex = orderLifecycle.indexOf(currentStatus) !== -1 ? orderLifecycle.indexOf(currentStatus) : 0;
        newStatus = orderLifecycle[(currentIndex + 1) % orderLifecycle.length];
      }
    } else if (col === 'appointments') {
      newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    } else {
      newStatus = 'Completed';
    }
    await updateDoc(doc(db, col, id), { status: newStatus });
    toast.success(`Marked as ${newStatus}`);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // 1. Loading State
  if (authLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="animate-spin text-emerald-600">
        <RefreshCw size={40} />
      </div>
      <p className="ml-4 font-bold text-slate-500">Checking Admin Access...</p>
    </div>
  );

  // 2. Not Logged In
  if (!currentUser) return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full mx-auto">
        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-700">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black text-emerald-950 mb-2">Admin Login</h2>
        <p className="text-slate-500 mb-8 font-medium">Secure area. Restricted access only.</p>
        <button onClick={handleGoogleLogin} className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 transition-all flex items-center justify-center gap-2">
          <User size={20} /> Login with Google
        </button>
        <button onClick={() => navigate('/')} className="mt-4 text-slate-400 font-bold text-sm hover:text-slate-600">Back to Shop</button>
      </div>
    </div>
  );

  // 3. Access Denied
  if (currentUser && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">Permission denied for this account.</p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left text-xs font-mono text-amber-900 mb-6 break-all">
            <p className="font-bold border-b border-amber-200 pb-2 mb-2">Debug Info:</p>
            <p>Email: <span className="font-bold md:select-all">{currentUser.email || 'No Email'}</span></p>
            <p className="truncate">UID: {currentUser.uid}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">Logout / Switch</button>
            <button onClick={() => navigate('/')} className="flex-1 bg-emerald-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors">Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated Admin Dashboard Layout
  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userEmail={currentUser?.email}
      onLogout={handleLogout}
    >

      {/* --- DASHBOARD VIEW --- */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Revenue" value={`₹${totalRevenue}`} icon={IndianRupee} trend="+12.5%" trendUp={true} color="emerald" />
            <StatsCard title="Total Orders" value={orders.length} icon={ShoppingBag} trend="+5.2%" trendUp={true} color="blue" />
            <StatsCard title="Active Consults" value={appointments.length} icon={Users} trend="-2.1%" trendUp={false} color="purple" />
            <StatsCard title="Subscribers" value={subscribers.length} icon={User} trend="+8.4%" trendUp={true} color="orange" />
          </div>

          {/* Dashboard Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 1. Recent Orders (Takes 2/3 width) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Recent Orders</h3>
                <button onClick={() => setActiveTab('orders')} className="text-emerald-600 text-sm font-bold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Customer</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-mono text-slate-500">#{order.id.slice(0, 6)}</td>
                        <td className="px-6 py-3 font-bold text-slate-700">{order.customer?.name || 'Guest'}</td>
                        <td className="px-6 py-3 font-bold text-emerald-700">₹{order.total}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Low Stock Alerts (Takes 1/3 width) - Mock Data */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Low Stock Alerts</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {/* Mocking low stock items for visual demo */}
                {products.slice(0, 3).map(product => (
                  <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-slate-50">
                    <img src={product.image} className="w-12 h-12 object-contain bg-slate-50 rounded-lg p-1" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-slate-500">Category: {product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-500 text-sm">{Math.floor(Math.random() * 5) + 1} left</p>
                      <p className="text-[10px] text-slate-400">Reorder</p>
                    </div>
                  </div>
                ))}
                {products.length === 0 && <div className="p-6 text-center text-slate-400 text-sm">No inventory alert</div>}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- ORDERS VIEW --- */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-slate-400" />
              <h3 className="font-bold text-slate-700">All Orders</h3>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">{orders.length} Records</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Shipping Details</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 text-sm transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{order.customer?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">Ref: {order.id.slice(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px]">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="mt-0.5 text-slate-300 min-w-[14px]" />
                        <div>
                          <p className="font-medium text-[12px] leading-tight text-slate-700">{order.customer?.address || 'No Address'}</p>
                          <p className="font-bold text-slate-400 mt-1 text-[10px] uppercase tracking-wide">{order.customer?.city} - {order.customer?.pincode}</p>
                        </div>
                      </div>
                      <p className="font-bold text-emerald-600 text-[10px] mt-2 pl-6">📞 {order.customer?.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded shadow-sm border uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <InvoiceButton order={order as any} />

                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => updateStatus('orders', order.id, order.status)}
                            className="bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1"
                          >
                            <RefreshCw size={12} /> Next Status
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- PRODUCTS VIEW --- */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-800">Product Inventory</h3>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{products.length} Items</span>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSyncData} disabled={isSyncing} className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 uppercase transition-all shadow-sm ${isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-white border border-red-200 text-red-600 hover:bg-red-50'}`}>
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> {isSyncing ? 'Syncing...' : 'Sync Catalog'}
              </button>
              <button onClick={() => { setIsEditing(false); setCurrentProduct({ name: '', price: 0, category: 'General', image: '' }); setIsModalOpen(true) }} className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"><Plus size={18} className="mr-1" /> Add Product</button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
                <div className="h-40 p-4 bg-slate-50 flex items-center justify-center relative">
                  <img src={product.image} className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setIsEditing(true); setCurrentProduct(product); setIsModalOpen(true) }} className="p-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-50"><Edit size={14} /></button>
                    <button onClick={() => deleteItem('products', product.id || '')} className="p-2 bg-white text-red-600 rounded-lg shadow-sm hover:bg-red-50"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{product.category}</div>
                  <h3 className="font-bold text-sm text-slate-800 leading-tight mb-2 line-clamp-2 min-h-[40px]">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-emerald-700 font-black text-lg">₹{product.price}</p>
                    {/* Mock Stock Status */}
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- BLOGS VIEW --- */}
      {activeTab === 'blogs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Content Management</h3>
            <button onClick={() => { setIsEditing(false); setCurrentBlog({ title: '', content: '', author: 'Admin', image: '' }); setIsBlogModalOpen(true) }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700"><Plus size={18} /> New Post</button>
          </div>
          <div className="grid gap-4">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-4">
                  <img src={blog.image} className="w-16 h-16 object-cover rounded-lg bg-slate-100" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{blog.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{blog.content.substring(0, 100)}...</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setIsEditing(true); setCurrentBlog(blog); setIsBlogModalOpen(true) }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                  <button onClick={() => deleteItem('blogs', blog.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBSCRIBERS VIEW --- */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-700">Newsletter Subscribers</h3>
            <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">{subscribers.length} total</span>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Date Joined</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-700">{sub.email}</td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{sub.subscribedAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => deleteItem('subscribers', sub.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- CONSULTS & REVIEWS (Simplified for brevity as standard lists) --- */}
      {activeTab === 'consults' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map(app => (
            <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-1 rounded ${app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{app.status}</span>
              <h3 className="font-bold text-slate-900">{app.name}</h3>
              <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-1"><Clock size={12} /> {app.date} • {app.time}</p>
              <div className="my-4 p-3 bg-slate-50 rounded-lg text-xs italic text-slate-600">"{app.message}"</div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button onClick={() => updateStatus('appointments', app.id, app.status)} className="flex-1 py-2 text-xs font-bold bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded transition-colors">Toggle Status</button>
                <button onClick={() => openWhatsApp(app.phone, app.name)} className="flex-1 py-2 text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors">WhatsApp</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals (Product/Blog) - Reused Logic */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Package size={20} /> {isEditing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Price</label>
                  <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500" value={currentProduct.category} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}>
                    <option>General</option><option>Pain Relief</option><option>Diabetes Care</option><option>Digestive Health</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" value={currentProduct.image} onChange={e => setCurrentProduct({ ...currentProduct, image: e.target.value })} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-3 font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-900/20">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 p-8">
            <h3 className="text-2xl font-black text-slate-800 mb-6">{isEditing ? 'Edit Post' : 'New Blog Post'}</h3>
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <input placeholder="Post Title" className="w-full text-xl font-bold border-b border-slate-200 p-2 outline-none focus:border-emerald-500" value={currentBlog.title} onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value })} />
              <textarea placeholder="Write something amazing..." rows={8} className="w-full p-4 bg-slate-50 rounded-xl outline-none resize-none" value={currentBlog.content} onChange={e => setCurrentBlog({ ...currentBlog, content: e.target.value })} />
              <input placeholder="Image Cover URL" className="w-full p-3 bg-slate-50 rounded-xl text-sm" value={currentBlog.image} onChange={e => setCurrentBlog({ ...currentBlog, image: e.target.value })} />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsBlogModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-black text-white hover:bg-slate-800">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};