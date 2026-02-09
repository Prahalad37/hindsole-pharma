import { useState, useEffect } from 'react';
import {
  Star, Send, User, CheckCircle2, FlaskConical, Clock, X,
  ShoppingCart, Minus, Plus, MessageSquare, Info
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const { addToCart } = useShop();

  // 🛒 Cart Logic States
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // ⭐ Review Logic States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Review { id: string; productId: string; userId: string; userName: string; rating: number; comment: string; createdAt: any; }
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // Fetch Reviews
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", product.id),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Review[]);
    });
    return () => unsub();
  }, [product.id]);

  // Submit Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("Please login to review");
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId: product.id,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "Anonymous",
        rating,
        comment: newComment,
        createdAt: serverTimestamp()
      });
      setNewComment('');
      toast.success("Review added! 🌟");
    } catch {
      toast.error("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${product.name} to cart 🛒`);
    onClose();
  };

  // Helper for Benefits (Support both array or string split)
  const benefitsList = Array.isArray(product.benefits)
    ? product.benefits
    : (product.description?.includes('•') ? product.description.split('•').filter(b => b.trim().length > 0) : [product.description]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[85vh] relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
        >
          <X size={24} className="text-gray-500" />
        </button>

        {/* 🖼️ Left Side: Product Image / Poster (40%) */}
        <div className="w-full md:w-5/12 bg-gray-50 flex items-center justify-center p-8 relative">
          <div className="absolute top-6 left-6 z-10">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200">
              {product.category}
            </span>
          </div>

          {/* 👇 UPDATE: Check for Poster OR Image */}
          <img
            src={product.poster || product.image}
            alt={product.name}
            className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-xl"
          />
        </div>

        {/* 📝 Right Side: Details & Reviews (60%) */}
        <div className="w-full md:w-7/12 flex flex-col h-full bg-white">

          {/* Header Area */}
          <div className="p-6 md:p-8 pb-0">
            <h2 className="text-3xl font-black text-emerald-950 mb-2 leading-tight">{product.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < (product.rating || 4.5) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-gray-400 text-sm font-bold">({reviews.length} Reviews)</span>
            </div>

            {/* 🔘 Tabs Switcher */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-4 w-fit">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'details' ? 'bg-white shadow text-emerald-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Info size={16} /> Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-white shadow text-emerald-800' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare size={16} /> Reviews
              </button>
            </div>
          </div>

          {/* 📜 Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 pb-6">

            {/* TAB 1: PRODUCT DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

                {/* Benefits Box */}
                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                  <h4 className="flex items-center gap-2 font-bold text-emerald-900 mb-3 text-sm uppercase tracking-wider">
                    <CheckCircle2 size={16} /> Key Benefits
                  </h4>
                  <ul className="space-y-2">
                    {benefitsList.map((benefit, i) => (
                      <li key={i} className="text-sm font-medium text-emerald-800 flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Grid for Indication & Dosage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-2">
                      <FlaskConical size={16} /> Indications
                    </div>
                    <p className="text-sm text-blue-900 leading-tight">{product.indications || "General Wellness"}</p>
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase mb-2">
                      <Clock size={16} /> Dosage
                    </div>
                    <p className="text-sm text-orange-900 leading-tight">{product.dosage || "As directed by physician"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                {/* List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-400 italic text-sm">No reviews yet. Share your story!</p>
                    </div>
                  ) : (
                    reviews.map(r => (
                      <div key={r.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-gray-800 flex items-center gap-2"><User size={14} /> {r.userName}</span>
                          <div className="flex text-yellow-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Form */}
                {auth.currentUser ? (
                  <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Write a review</p>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button key={num} type="button" onClick={() => setRating(num)} className="transition-transform active:scale-90 hover:scale-110">
                          <Star size={24} className={num <= rating ? "text-yellow-400 fill-current" : "text-gray-200"} />
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <button disabled={loading} className="absolute right-2 bottom-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-700 font-bold">Login to write a review</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 👇 Bottom Sticky Action Bar */}
          <div className="mt-auto p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-4 items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10">

            {/* Price */}
            <div className="flex-1">
              <span className="text-3xl font-black text-emerald-900">₹{product.price * quantity}</span>
              {product.originalPrice && <span className="text-sm text-gray-400 line-through ml-2 font-bold">₹{product.originalPrice * quantity}</span>}
            </div>

            {/* Quantity */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-emerald-600 active:scale-95"><Minus size={18} /></button>
              <span className="w-12 text-center font-black text-gray-800">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-emerald-600 active:scale-95"><Plus size={18} /></button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-8 h-12 bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 hover:bg-emerald-800 hover:-translate-y-1 transition-all active:scale-95"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};