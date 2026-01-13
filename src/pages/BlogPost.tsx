import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Calendar, User, Tag, Loader2 } from 'lucide-react';

export const BlogPost = () => {
  const { id } = useParams(); // URL se ID nikalo
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setBlog(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={40}/></div>;
  
  if (!blog) return <div className="text-center py-20 text-xl font-bold text-gray-400">Article not found.</div>;

  return (
    <div className="min-h-screen bg-white animate-in fade-in">
      
      {/* Hero Image */}
      <div className="h-[400px] w-full relative">
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white max-w-4xl mx-auto">
            <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">{blog.category}</span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{blog.title}</h1>
            <div className="flex items-center gap-6 text-sm font-medium opacity-90">
                <span className="flex items-center gap-2"><User size={16}/> {blog.author}</span>
                <span className="flex items-center gap-2"><Calendar size={16}/> {blog.date}</span>
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold mb-8 transition-colors">
            <ArrowLeft size={20}/> Back to Journal
        </Link>
        
        {/* Main Text */}
        <div className="prose prose-lg prose-emerald text-gray-600 leading-relaxed whitespace-pre-line">
            {blog.excerpt} 
            {/* Note: Abhi hum 'excerpt' hi dikha rahe hain kyunki Admin mein wahi field hai. 
                Baad mein aap Admin mein 'Content' field bhi add kar sakte ho. */}
        </div>

        {/* Share / Tags */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-400">
            <Tag size={16}/>
            <span>Tags: Ayurveda, Health, {blog.category}</span>
        </div>
      </div>

    </div>
  );
};