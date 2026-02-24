import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PackageCheck, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { PageFadeLayout } from '../components/PageFadeLayout';

const PRODUCT_OPTIONS = [
  "Arthovita Oil", "Gasovita Syrup", "Gynevita Tonic", "Varunalka Syrup",
  "Gasovita Powder", "Diabvita Powder", "Mayoplex Syrup", "Arthovita Tablets",
  "Arthovedh", "Diabvita Tablets", "Stonevita Syrup", "Livovita DS Tablet",
  "Pilovita Capsules", "Keshvita Hair Oil", "Chyawanprash", "Kofvita Syrup",
  "Ashwagandha", "Massvita Granules", "All Products",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  business: string;
  product: string;
  quantity: string;
  message: string;
}

const INITIAL_FORM: FormData = { name: '', email: '', phone: '', business: '', product: '', quantity: '', message: '' };

export const BulkEnquiry = () => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.product) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "bulk_enquiries"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      toast.success("Enquiry submitted successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-emerald-100 text-center">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Enquiry Received!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Thank you for your interest. Our team will contact you within 24 hours with pricing and availability details.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all min-h-[48px]">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Bulk Enquiry" description="Request bulk pricing for AyurVita Ayurvedic products. Special rates for retailers and distributors." />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white px-4 py-12 sm:py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-white transition-colors mb-8 min-h-[44px]">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Bulk Enquiry</h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto">
            Get special pricing for bulk and wholesale orders. Fill the form below and our team will get back to you within 24 hours.
          </p>
        </div>
      </motion.section>

      {/* Form */}
      <section className="px-4 py-10 sm:py-14">
        <PageFadeLayout className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-100 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[48px]" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[48px]" placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[48px]" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Business Name</label>
                <input name="business" value={form.business} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[48px]" placeholder="Your business name" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Interest *</label>
                <select name="product" value={form.product} onChange={handleChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[48px] bg-white">
                  <option value="">Select product</option>
                  {PRODUCT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Estimated Quantity</label>
                <input name="quantity" value={form.quantity} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all min-h-[48px]" placeholder="e.g. 500 units" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Additional Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none" placeholder="Any specific requirements..." />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm sm:text-base hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 min-h-[52px]"
            >
              {loading ? 'Submitting...' : <><Send size={18} /> Submit Enquiry</>}
            </button>
          </form>
        </PageFadeLayout>
      </section>
    </div>
  );
};

export default BulkEnquiry;
