import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogData } from '../data/blogs';

const BlogPost = () => {
  const { slug } = useParams();
  // 🔍 Find blog by slug from local data
  const blog = blogData.find(b => b.slug === slug);



  if (!blog) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Article not found.</h2>
      <Link to="/blogs" className="text-emerald-600 font-bold hover:underline flex items-center gap-2">
        <ArrowLeft size={20} /> Back to Blogs
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Article Hero */}
      <div className="h-[50vh] relative">
        <img
          src={blog.image || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800"}
          className="w-full h-full object-cover"
          alt={blog.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="max-w-4xl mx-auto w-full p-8">
            <Link to="/blogs" className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold mb-6 w-fit hover:bg-white/10 px-3 py-1 rounded-full transition-all">
              <ArrowLeft size={16} /> BACK TO BLOGS
            </Link>
            <span className="bg-emerald-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight font-serif">{blog.title}</h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-sm font-bold pb-4">
              <span className="flex items-center gap-2"><User size={16} /> Admin</span>
              <span className="flex items-center gap-2"><Calendar size={16} /> {blog.date}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> {blog.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-stone-100">
          <div className="prose prose-emerald lg:prose-xl max-w-none text-gray-700">
            <p className="lead text-xl font-medium text-emerald-900 mb-8 border-l-4 border-emerald-500 pl-4 italic">
              {blog.excerpt}
            </p>
            {/* Since we don't have full content yet, we repeat the excerpt or add placeholder text for realism */}
            <p>
              Ayurveda teaches us that true wellness comes from balance. {blog.excerpt}
              Incorporating these habits into your daily routine can significantly improve your quality of life.
            </p>
            <h3>Why Natural Remedies Work</h3>
            <p>
              Unlike synthetic alternatives, natural remedies work in harmony with your body's innate healing mechanisms.
              Whether it's {blog.title.toLowerCase()}, the key is consistency and patience.
            </p>
            <h3>Expert Tip</h3>
            <p>
              Always consult with a qualified Ayurvedic practitioner before starting any new regimen, especially if you have existing health conditions.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">#Ayurveda</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">#{blog.category.replace(/\s+/g, '')}</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!") }}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition-all font-bold text-sm"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlogPost;