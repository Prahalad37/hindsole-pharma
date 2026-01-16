import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Loader2, Clock, Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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

  // 🕒 Helper: Calculate Read Time (CRASH FIX HERE 👇)
  const getReadTime = (content: string) => {
    if (!content) return "1 min read"; // ✅ Safety Check: Agar content nahi hai toh crash mat hona
    
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // 🔍 Filter Logic (CRASH FIX HERE TOO 👇)
  const filteredBlogs = blogs.filter(blog => {
    const titleMatch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = blog.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      
      {/* 🌿 Hero Header */}
      <section className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="bg-emerald-800 text-emerald-200 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
            Wellness Journal
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 font-serif">
            Ayurvedic Wisdom
          </h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Explore natural remedies, lifestyle tips, and expert guidance for a balanced and healthy life.
          </p>

          {/* Search Input */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles (e.g., Digestion, Skin)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-xl transition-all"
            />
          </div>
        </div>
      </section>

      {/* 📄 Content Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 font-bold text-lg">No articles found matching your search.</p>
            <button onClick={() => setSearchQuery("")} className="text-emerald-600 font-bold mt-2 hover:underline">Clear Search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full animate-in fade-in zoom-in-95">
                
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={blog.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800"} // Fallback image if missing 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Ayurveda
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-1 text-emerald-600"><User size={14}/> {blog.author || "Admin"}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {getReadTime(blog.content || "")}</span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                    {blog.title || "Untitled Post"}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                    {blog.content || "No preview available."}
                  </p>
                  
                  {/* Button */}
                  <div className="mt-auto border-t border-gray-100 pt-6 flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Calendar size={14}/> {blog.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                     </span>
                     <Link 
                        to={`/blog/${blog.id}`} 
                        className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-wider hover:gap-3 transition-all"
                      >
                        Read Full <ArrowRight size={16}/>
                      </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};