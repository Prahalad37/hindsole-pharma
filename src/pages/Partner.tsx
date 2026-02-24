import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Handshake, TrendingUp, ShieldCheck, Package, Users, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';

const staggerItem = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const staggerContainer = { initial: {}, animate: { transition: { staggerChildren: 0.1 } } };

const BENEFITS = [
  { icon: <TrendingUp size={28} />, title: "High Margins", text: "Enjoy attractive profit margins on every product with competitive wholesale pricing." },
  { icon: <Package size={28} />, title: "Marketing Support", text: "Get free promotional materials, product catalogues, and digital marketing support." },
  { icon: <ShieldCheck size={28} />, title: "Genuine Products", text: "100% authentic Ayurvedic formulations backed by 150+ years of heritage and trust." },
  { icon: <Users size={28} />, title: "Training & Support", text: "Dedicated relationship manager with product training and ongoing sales support." },
];

const STEPS = [
  { step: "01", title: "Apply", text: "Fill the enquiry form or contact us on WhatsApp with your details." },
  { step: "02", title: "Evaluation", text: "Our team reviews your application and market potential within 48 hours." },
  { step: "03", title: "Onboarding", text: "Receive your welcome kit, product samples, and distributor agreement." },
  { step: "04", title: "Launch", text: "Start selling with our marketing support and dedicated account manager." },
];

export const Partner = () => {
  const whatsappLink = "https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20the%20AyurVita%20Partner%20Program.";

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Partner With Us" description="Become an AyurVita distribution partner. Earn high margins with India's trusted Ayurvedic brand." />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white px-4 py-16 sm:py-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-white transition-colors mb-8 min-h-[44px]">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Handshake size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Partner With AyurVita</h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Join India's fastest-growing Ayurvedic brand as a distribution partner. Build a profitable business with products trusted by thousands of families.
          </p>
        </div>
      </motion.section>

      {/* Benefits */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-10">Why Partner With Us?</h2>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-emerald-600 mb-4">{b.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white px-4 py-12 sm:py-16 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-10">How It Works</h2>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div key={i} variants={staggerItem} className="text-center">
                <div className="text-4xl font-black text-emerald-200 mb-3">{s.step}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Who Can Apply?</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
            We welcome applications from pharmacy owners, medical store operators, Ayurvedic practitioners, healthcare distributors, and entrepreneurs passionate about Ayurveda and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:bg-emerald-700 active:scale-[0.98] transition-all min-h-[48px]"
            >
              <Phone size={18} /> Apply via WhatsApp
            </a>
            <Link
              to="/policy/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 border-2 border-emerald-200 px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:border-emerald-400 active:scale-[0.98] transition-all min-h-[48px]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;
