import { useState, useEffect } from 'react';
import { Star, Send, User } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const ProductModal = ({ product, onClose }: { product: any, onClose: () => void }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Reviews for this product
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", product.id),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [product.id]);

  // 2. Submit Review
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
      toast.success("Review added!");
    } catch (err) {
      toast.error("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto flex flex-col md:flex-row shadow-2xl">
        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-gray-50">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-8" />
        </div>

        {/* Right: Info & Reviews */}
        <div className="md:w-1/2 p-8 overflow-y-auto">
          <button onClick={onClose} className="float-right text-gray-400 hover:text-black">✕</button>
          <h2 className="text-3xl font-black text-emerald-900 mb-2">{product.name}</h2>
          <p className="text-2xl font-bold text-emerald-600 mb-6">₹{product.price}</p>
          
          <hr className="my-6" />

          {/* Review List */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-gray-800">Customer Reviews ({reviews.length})</h3>
            
            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {reviews.length === 0 ? (
                <p className="text-gray-400 italic text-sm">No reviews yet. Be the first!</p>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm flex items-center gap-2"><User size={14}/> {r.userName}</span>
                      <div className="flex text-yellow-400"><Star size={12} fill="currentColor" /> {r.rating}</div>
                    </div>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            {auth.currentUser ? (
              <form onSubmit={handleReviewSubmit} className="mt-6 pt-6 border-t">
                <div className="flex gap-2 mb-3">
                  {[1,2,3,4,5].map(num => (
                    <button key={num} type="button" onClick={() => setRating(num)}>
                      <Star size={20} className={num <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    value={newComment} 
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a review..." 
                    className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm pr-12 focus:ring-2 focus:ring-emerald-500"
                  />
                  <button disabled={loading} className="absolute right-2 top-2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    <Send size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-gray-400 text-center mt-4">Please login to write a review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};