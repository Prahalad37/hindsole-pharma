import { X, Clock, Calendar } from 'lucide-react';

interface Blog { image: string; category: string; title: string; readTime: string; date: string; excerpt: string; }

interface BlogModalProps {
   blog: Blog | null;
   onClose: () => void;
}

export const BlogModal = ({ blog, onClose }: BlogModalProps) => {
   if (!blog) return null;

   return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4">
         <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm" onClick={onClose} />

         <div className="relative bg-white w-full max-w-5xl h-full md:h-[90vh] overflow-y-auto md:rounded-[3rem] animate-in slide-in-from-bottom duration-500 shadow-2xl">

            {/* Close Button */}
            <button onClick={onClose} className="absolute top-8 right-8 z-50 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all">
               <X size={32} />
            </button>

            {/* Hero Image */}
            <div className="relative h-[40vh] md:h-[50vh] w-full">
               <img src={blog.image} className="w-full h-full object-cover" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 md:p-16">
                  <div className="max-w-3xl animate-in slide-in-from-left duration-700">
                     <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block uppercase tracking-widest shadow-lg">
                        {blog.category}
                     </span>
                     <h2 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                        {blog.title}
                     </h2>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-20 max-w-4xl mx-auto">
               {/* Meta Data */}
               <div className="flex items-center gap-6 mb-12 border-b border-gray-100 pb-8 text-gray-500 font-bold text-sm">
                  <div className="flex items-center gap-2"><Clock size={18} className="text-emerald-600" /> {blog.readTime}</div>
                  <div className="flex items-center gap-2"><Calendar size={18} className="text-emerald-600" /> {blog.date}</div>
               </div>

               {/* Text Body */}
               <div className="prose prose-lg text-gray-600 space-y-8">
                  <p className="text-2xl font-medium text-gray-800 leading-relaxed italic">
                     "{blog.excerpt}"
                  </p>
                  <p className="text-lg leading-relaxed">
                     Ayurveda is not just a system of medicine; it is a way of life. It teaches us how to maintain a balance between our body, mind, and spirit. In today's fast-paced world, these ancient practices are more relevant than ever.
                  </p>
                  <div className="bg-emerald-50 p-8 rounded-[2rem] border-l-8 border-emerald-500 my-10">
                     <h4 className="text-xl font-bold text-emerald-900 mb-2">Did You Know?</h4>
                     <p className="text-emerald-800">Natural herbs used in Hindsole products are sourced directly from the foothills of Himalayas to ensure maximum potency.</p>
                  </div>
                  <p className="text-lg leading-relaxed">
                     We believe in sustainable wellness. Our packaging is eco-friendly, and our processes are designed to minimize environmental impact while maximizing potency.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};