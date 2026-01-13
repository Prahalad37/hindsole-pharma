import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  createdAt?: any;
}

export const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Real-time fetch from Admin's 'blogs' collection
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
      setBlogs(blogsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-emerald-950 mb-4 font-serif">Health & Wellness Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto italic">Expert Ayurvedic tips, natural remedies, and lifestyle guidance for a balanced life.</p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-emerald-100">
            <p className="text-gray-400 font-bold">No articles published yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-emerald-50 group">
                <div className="relative h-56 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Ayurveda</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-bold">
                    <span className="flex items-center gap-1"><User size={14}/> {blog.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {blog.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                  </div>
                  
                  <h2 className="text-xl font-black text-emerald-900 mb-3 line-clamp-2 leading-tight">{blog.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">{blog.content}</p>
                  
                  <Link 
                    to={`/blog/${blog.id}`} 
                    className="flex items-center gap-2 text-emerald-600 font-black text-sm hover:gap-4 transition-all"
                  >
                    READ ARTICLE <ArrowRight size={16}/>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};