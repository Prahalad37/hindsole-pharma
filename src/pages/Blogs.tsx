import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Link Import kiya
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Calendar, User, ArrowRight, Tag, Loader2 } from 'lucide-react';

export const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Fetch from Firebase
  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={40}/></div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 animate-in fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm bg-emerald-50 px-4 py-2 rounded-full">Our Blog</span>
            <h1 className="text-4xl md:text-5xl font-black text-emerald-900">Wellness Journal</h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Expert advice on Ayurveda, healthy living, and natural remedies.
            </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
                <div className="col-span-3 text-center text-gray-400 py-10">
                    <p>No articles published yet. Stay tuned!</p>
                </div>
            ) : (
                blogs.map((blog) => (
                    <div key={blog.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={blog.image} 
                                alt={blog.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-100"
                                onError={(e: any) => e.target.src = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800"} // Fallback Image
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-800 flex items-center gap-1 shadow-sm">
                                <Tag size={12}/> {blog.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium">
                                <span className="flex items-center gap-1"><Calendar size={14}/> {blog.date}</span>
                                <span className="flex items-center gap-1"><User size={14}/> {blog.author}</span>
                            </div>
                            
                            <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                {blog.title}
                            </h3>
                            
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                {blog.excerpt}
                            </p>

                            {/* 2. Button ko Link se replace kiya */}
                            <Link 
                                to={`/blog/${blog.id}`} 
                                className="text-emerald-600 font-bold text-sm flex items-center gap-2 group/btn mt-auto"
                            >
                                Read Article 
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
};