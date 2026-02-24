import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, ShieldCheck, Globe, Phone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import { COMPANY } from '../config/company';

const staggerItem = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const staggerContainer = { initial: {}, animate: { transition: { staggerChildren: 0.1 } } };

const VERIFY_STEPS = [
  { icon: <Globe size={24} />, title: "Official Website Only", text: "Purchase only from our official website ayurvita.in. We do not sell through unauthorized third-party websites." },
  { icon: <ShieldCheck size={24} />, title: "Check the Seal", text: "All genuine AyurVita products have a tamper-proof holographic seal on the packaging. If the seal is broken or missing, do not use the product." },
  { icon: <CheckCircle2 size={24} />, title: "Verify Batch Number", text: "Every product has a unique batch number printed on the label. You can verify it by contacting our support team." },
  { icon: <Phone size={24} />, title: "Report Suspicious Sellers", text: `If you find anyone selling fake AyurVita products, report immediately to ${COMPANY.email} or call ${COMPANY.phone}.` },
];

const RED_FLAGS = [
  "Unusually low prices (50%+ below MRP)",
  "Products without holographic seal or batch number",
  "Sellers on unauthorized marketplaces or social media",
  "Packaging that looks different from official product images",
  "Sellers refusing to share invoice or bill",
  "Products with blurred or misspelled labels",
];

export const BewareOfFraud = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Beware of Fraud" description="Protect yourself from counterfeit products. Learn how to identify genuine AyurVita products." />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white px-4 py-16 sm:py-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-red-200 hover:text-white transition-colors mb-8 min-h-[44px]">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Beware of Fraud</h1>
          <p className="text-base sm:text-lg text-red-100 max-w-2xl mx-auto leading-relaxed">
            Protect your health. Counterfeit Ayurvedic products can be harmful. Learn how to identify genuine AyurVita products and stay safe.
          </p>
        </div>
      </motion.section>

      {/* Warning Banner */}
      <section className="px-4 py-8 sm:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8 flex gap-4 items-start">
            <AlertTriangle size={28} className="text-amber-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-900 mb-2">Important Notice</h2>
              <p className="text-sm sm:text-base text-amber-800 leading-relaxed">
                It has come to our attention that some unauthorized sellers are manufacturing and selling counterfeit products using the AyurVita brand name. These fake products have not undergone quality testing and may contain harmful ingredients. We urge all customers to purchase only from our official channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Steps */}
      <section className="px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-10">How to Verify Genuine Products</h2>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VERIFY_STEPS.map((s, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-emerald-600 mb-3">{s.icon}</div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="bg-white px-4 py-10 sm:py-14 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8">Red Flags to Watch For</h2>
          <div className="space-y-3">
            {RED_FLAGS.map((flag, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 rounded-xl px-5 py-4">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-red-900 font-medium">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Channels */}
      <section className="px-4 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Our Official Channels</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">Purchase only from these verified channels to ensure product authenticity.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-xl p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Website</p>
              <p className="text-sm font-semibold text-gray-900">ayurvita.in</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">WhatsApp</p>
              <p className="text-sm font-semibold text-gray-900">{COMPANY.phone}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm font-semibold text-gray-900">{COMPANY.email}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BewareOfFraud;
