import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Factory, FlaskConical, Award, Truck, ClipboardList, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';

const staggerItem = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const staggerContainer = { initial: {}, animate: { transition: { staggerChildren: 0.1 } } };

const CAPABILITIES = [
  { icon: <FlaskConical size={28} />, title: "Custom Formulations", text: "Our R&D team develops bespoke Ayurvedic formulations tailored to your brand requirements and target market." },
  { icon: <Award size={28} />, title: "GMP Certified", text: "State-of-the-art manufacturing facility adhering to GMP, ISO, and AYUSH Ministry standards." },
  { icon: <Truck size={28} />, title: "End-to-End Service", text: "From formulation and manufacturing to packaging, labelling, and logistics — we handle it all." },
  { icon: <ClipboardList size={28} />, title: "Regulatory Support", text: "We assist with FSSAI licensing, AYUSH certifications, and all regulatory compliance documentation." },
];

const PRODUCT_CATEGORIES = [
  "Syrups & Tonics",
  "Tablets & Capsules",
  "Powders & Churnas",
  "Oils & Balms",
  "Pastes (Chyawanprash etc.)",
  "Herbal Cosmetics",
];

export const ContractManufacturing = () => {
  const whatsappLink = "https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20Contract%20Manufacturing%20services.";

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Contract Manufacturing" description="Ayurvedic contract manufacturing by AyurVita. GMP-certified facility for tablets, syrups, oils and more." />

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
            <Factory size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Contract Manufacturing</h1>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Launch your own Ayurvedic brand with our GMP-certified manufacturing facility. From formulation to finished product — we bring your vision to life.
          </p>
        </div>
      </motion.section>

      {/* Capabilities */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-10">Our Capabilities</h2>
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CAPABILITIES.map((c, i) => (
              <motion.div key={i} variants={staggerItem} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-emerald-600 mb-4">{c.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{c.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Range */}
      <section className="bg-white px-4 py-12 sm:py-16 border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Product Categories</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8">We manufacture a wide range of Ayurvedic and herbal products.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {PRODUCT_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-emerald-50 rounded-xl px-4 py-4 sm:py-5 text-center">
                <span className="text-sm sm:text-base font-semibold text-emerald-800">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOQ & Process */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8">Process & MOQ</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Minimum Order Quantity</h3>
              <p className="text-sm sm:text-base text-gray-600">MOQ varies by product type. Typically 500–1,000 units for tablets/capsules and 200–500 units for syrups and oils. We are flexible for first-time orders.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Lead Time</h3>
              <p className="text-sm sm:text-base text-gray-600">Standard lead time is 15–30 days from formulation approval. Rush orders can be accommodated based on capacity.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">Private Labelling</h3>
              <p className="text-sm sm:text-base text-gray-600">We offer complete white-label and private-label solutions including custom packaging design, brand labelling, and marketing collateral support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-900 text-white px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">Ready to Start?</h2>
          <p className="text-sm sm:text-base text-emerald-100 mb-8">Contact us today to discuss your requirements and get a custom quote.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:bg-emerald-50 active:scale-[0.98] transition-all min-h-[48px]"
            >
              <Phone size={18} /> WhatsApp Enquiry
            </a>
            <a
              href="mailto:business@ayurvita.in"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm sm:text-base hover:border-white active:scale-[0.98] transition-all min-h-[48px]"
            >
              Email: business@ayurvita.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContractManufacturing;
