import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading wisdom...</div>;
  if (!blog) return <div className="h-screen flex items-center justify-center font-bold">Article not found.</div>;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Article Hero */}
      <div className="h-[50vh] relative">
        <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-4xl mx-auto w-full p-8">
            <Link to="/blogs" className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold mb-6">
              <ArrowLeft size={16}/> BACK TO BLOGS
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight font-serif">{blog.title}</h1>
            <div className="flex gap-6 text-white/90 text-sm font-bold pb-8">
               <span className="flex items-center gap-2"><User size={16}/> {blog.author}</span>
               <span className="flex items-center gap-2"><Calendar size={16}/> {blog.createdAt?.toDate().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-emerald-50">
          <div className="prose prose-emerald lg:prose-xl max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:text-emerald-700 first-letter:mr-3 first-letter:float-left">
              {blog.content}
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t flex justify-between items-center">
             <div className="flex gap-2">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">#Ayurveda</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">#HolisticHealth</span>
             </div>
             <button 
                onClick={() => {navigator.clipboard.writeText(window.location.href); toast.success("Link copied!")}} 
                className="p-3 bg-gray-50 rounded-full hover:bg-emerald-50 transition-colors"
             >
                <Share2 size={20} className="text-emerald-700"/>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};