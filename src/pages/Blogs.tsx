import { useState } from 'react'; // Import useState
import { blogs } from '../data/blogs';
import { BlogModal } from '../components/BlogModal'; // Import Modal

export const Blogs = () => {
  const [selectedBlog, setSelectedBlog] = useState<any>(null); // State

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 animate-in fade-in">
      <h1 className="text-5xl font-black mb-16 text-center">Wellness Journal</h1>
      {blogs.map(blog => (
        // Add onClick
        <div key={blog.id} onClick={() => setSelectedBlog(blog)} className="flex flex-col md:flex-row gap-12 items-center mb-20 group cursor-pointer hover:bg-gray-50 p-6 rounded-[3rem] transition-colors">
          <img src={blog.image} className="w-full md:w-2/5 h-72 rounded-[2.5rem] object-cover shadow-lg" alt="" />
          <div className="md:w-3/5 space-y-4">
            <span className="text-emerald-600 font-bold text-sm uppercase">{blog.category}</span>
            <h2 className="text-4xl font-black group-hover:text-emerald-700 transition-colors leading-tight">{blog.title}</h2>
            <p className="text-gray-500 text-lg italic">{blog.excerpt}...</p>
            <button className="font-bold border-b-2 border-black pb-1 hover:border-emerald-600 hover:text-emerald-600 transition-all">Read Article</button>
          </div>
        </div>
      ))}
      
      {/* Add Modal */}
      {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}
    </div>
  );
};