import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, HelpCircle, Mail } from 'lucide-react';

import type { ReactNode } from 'react';
export const Policy = () => {
  const { type } = useParams();

  interface PolicyContent { title: string; icon: ReactNode; text: string; }
  const content: Record<string, PolicyContent> = {
    'shipping': {
      title: "Shipping Policy",
      icon: <Truck size={48} className="text-emerald-600" />,
      text: "We ship all orders within 24-48 hours. Delivery usually takes 3-5 business days depending on your location. We use eco-friendly packaging for all our products."
    },
    'returns': {
      title: "Returns & Refunds",
      icon: <ShieldCheck size={48} className="text-emerald-600" />,
      text: "If you are not satisfied with the product, you can return it within 7 days of delivery. The product must be unused. Refund will be initiated to your original payment mode."
    },
    'contact': {
      title: "Contact Us",
      icon: <Mail size={48} className="text-emerald-600" />,
      text: "Have questions? Email us at support@hindsole.com or call us at +91-9876543210 (Mon-Fri, 10am - 6pm)."
    },
    'faq': {
      title: "Frequently Asked Questions",
      icon: <HelpCircle size={48} className="text-emerald-600" />,
      text: "Q: Are your products organic? \nA: Yes, 100% organic and sourced from Himalayas.\n\nQ: Do you ship internationally?\nA: Currently we only ship within India."
    }
  };

  const data = content[type || 'contact'] || content['contact'];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-in fade-in">
      <div className="max-w-2xl w-full bg-white p-10 rounded-3xl shadow-xl border border-emerald-100 text-center">
        <div className="flex justify-center mb-6 bg-emerald-50 w-24 h-24 rounded-full items-center mx-auto">
          {data.icon}
        </div>
        <h1 className="text-4xl font-black text-emerald-900 mb-6">{data.title}</h1>
        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line mb-10">{data.text}</p>

        <Link to="/" className="inline-flex items-center gap-2 font-bold text-emerald-700 hover:text-emerald-900 transition-colors">
          <ArrowLeft size={20} /> Back to Shop
        </Link>
      </div>
    </div>
  );
};