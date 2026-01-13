import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Package, MapPin, Phone, CheckCircle, Stethoscope, Calendar, User, ShoppingBag, PenTool, Trash2, Plus } from 'lucide-react';

export const Admin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]); // Blog State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'appointments' | 'blogs'>('orders');

  // Blog Form State
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: '',
    image: '',
    excerpt: '',
    author: 'Dr. Sharma'
  });

  useEffect(() => {
    // 1. Fetch Orders
    const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Fetch Appointments
    const unsubAppointments = onSnapshot(query(collection(db, "appointments"), orderBy("createdAt", "desc")), (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. Fetch Blogs
    const unsubBlogs = onSnapshot(query(collection(db, "blogs"), orderBy("createdAt", "desc")), (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => { unsubOrders(); unsubAppointments(); unsubBlogs(); };
  }, []);

  // Actions
  const toggleOrderStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status: status === 'Pending' ? 'Delivered' : 'Pending' });
  };

  const toggleAppointmentStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'appointments', id), { status: status === 'Pending' ? 'Completed' : 'Pending' });
  };

  const handleDeleteBlog = async (id: string) => {
    if(confirm("Are you sure you want to delete this blog?")) {
        await deleteDoc(doc(db, 'blogs', id));
    }
  };

  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await addDoc(collection(db, "blogs"), {
            ...blogForm,
            createdAt: serverTimestamp(),
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        alert("Blog Published!");
        setBlogForm({ title: '', category: '', image: '', excerpt: '', author: 'Dr. Sharma' }); // Reset
    } catch (error) {
        console.error("Error", error);
        alert("Failed to publish");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-emerald-900">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 animate-in fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-black text-emerald-900">ADMIN PANEL</h1>
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex overflow-x-auto max-w-full">
                {['orders', 'appointments', 'blogs'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-emerald-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        {tab === 'orders' && <ShoppingBag size={18}/>}
                        {tab === 'appointments' && <Stethoscope size={18}/>}
                        {tab === 'blogs' && <PenTool size={18}/>}
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* --- ORDERS --- */}
        {activeTab === 'orders' && (
            <div className="grid gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-6">
                        <div>
                            <h3 className="font-black text-xl">{order.customer.name} <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">{order.status}</span></h3>
                            <p className="text-gray-500 text-sm">{order.customer.address}</p>
                            <p className="font-bold mt-2">Total: ₹{order.total}</p>
                        </div>
                        <button onClick={() => toggleOrderStatus(order.id, order.status)} className="bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold text-sm h-fit">Toggle Status</button>
                    </div>
                ))}
            </div>
        )}

        {/* --- APPOINTMENTS --- */}
        {activeTab === 'appointments' && (
            <div className="grid md:grid-cols-2 gap-6">
                {appointments.map((app) => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-2 h-full ${app.status === 'Completed' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                        <h3 className="font-black text-xl">{app.name}</h3>
                        <p className="text-gray-600 italic">"{app.problem}"</p>
                        <p className="text-sm font-bold text-emerald-700 mt-2">{app.date}</p>
                        <button onClick={() => toggleAppointmentStatus(app.id, app.status)} className="absolute bottom-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-green-100 hover:text-green-600"><CheckCircle size={20}/></button>
                    </div>
                ))}
            </div>
        )}

        {/* --- BLOGS (NEW) --- */}
        {activeTab === 'blogs' && (
            <div className="grid md:grid-cols-3 gap-8">
                
                {/* 1. Create Blog Form */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 md:col-span-1 h-fit">
                    <h2 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-2"><Plus size={20}/> Write New Blog</h2>
                    <form onSubmit={handlePublishBlog} className="space-y-3">
                        <input required placeholder="Title" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg text-sm font-bold outline-emerald-500"/>
                        <input required placeholder="Category (e.g. Wellness)" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg text-sm font-bold outline-emerald-500"/>
                        <input required placeholder="Image URL" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg text-sm font-bold outline-emerald-500"/>
                        <input required placeholder="Author Name" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg text-sm font-bold outline-emerald-500"/>
                        <textarea required placeholder="Short Description / Content..." rows={4} value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full bg-gray-50 border p-3 rounded-lg text-sm font-bold outline-emerald-500"></textarea>
                        <button className="w-full bg-emerald-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all">Publish Live</button>
                    </form>
                </div>

                {/* 2. Existing Blogs List */}
                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-xl font-black text-gray-400 uppercase">Live Articles ({blogs.length})</h2>
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 items-center group">
                            <img src={blog.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100"/>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 line-clamp-1">{blog.title}</h4>
                                <p className="text-xs text-gray-500">{blog.date} • {blog.author}</p>
                            </div>
                            <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-300 hover:text-red-500 p-2"><Trash2 size={20}/></button>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};