import { useState, useEffect } from 'react';
import {
  ArrowRight, Truck, ShieldCheck, Leaf, Star, CheckCircle2,
  Stethoscope, User, FileText, Package, Activity, Quote, ChevronDown,
  Clock, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import HeroCarousel from '../components/HeroCarousel';
import { products as productData } from '../data/products';
import { blogData } from '../data/blogs';
import type { Product } from '../types';
import { SEO } from '../components/SEO';
import { ProductSkeleton } from '../components/Skeleton';

// --- Category Data ---
const CATEGORIES = [
  { id: 'All', name: 'All Products', icon: '✨' },
  { id: 'Pain Relief', name: 'Pain Relief', icon: '🦴' },
  { id: 'Diabetes Care', name: 'Diabetes Care', icon: '🩸' },
  { id: 'Digestion', name: 'Digestion', icon: '🌿' },
  { id: 'Women\'s Health', name: 'Women\'s Health', icon: '🌸' },
  { id: 'Urinary Care', name: 'Urinary Care', icon: '💧' },
];

const CategoryFilter = ({ activeCategory, onSelectCategory }: { activeCategory: string, onSelectCategory: (c: string) => void }) => {
  return (
    <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 mb-8">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={
            activeCategory === category.id
              ? "flex items-center justify-center gap-2 px-2 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md hover:bg-emerald-800 transition-all transform hover:scale-105 w-full md:w-auto"
              : "flex items-center justify-center gap-2 px-2 py-2.5 rounded-full bg-white border-2 border-emerald-200 text-emerald-700 font-bold text-xs md:text-sm hover:bg-emerald-50 transition-all w-full md:w-auto"
          }
        >
          <span>{category.icon}</span>
          <span className="whitespace-nowrap">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

// --- Animated Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- Local Data Constants ---

const DOCTOR_REVIEWS = [
  {
    id: 1,
    name: "Dr. Anjali Sharma",
    qualification: "BAMS, MD (Ayurveda)",
    specialty: "Joint & Musculoskeletal Care",
    image: "/doctors/doc-1.jpg",
    recommends: "Dr. Arthovita Oil & Capsules",
    quote: "I frequently prescribe Arthovita for osteoarthritis patients. The Shallaki and Nirgundi blend offers potent anti-inflammatory action without gastric side effects.",
    rating: 5,
    credentials: ["ISO 9001", "GMP Certified"]
  },
  {
    id: 2,
    name: "Dr. Rajesh Verma",
    qualification: "BAMS, Ayurvedic Physician",
    specialty: "Metabolic Disorders",
    image: "/doctors/doc-2.jpg",
    recommends: "Dr. Diabvita Powder",
    quote: "For Type-2 diabetes management, this formulation helps regulate insulin sensitivity naturally. It is an excellent adjuvant to standard care.",
    rating: 4.8,
    credentials: ["AYUSH Ministry", "Clinical Proven"]
  },
  {
    id: 3,
    name: "Dr. Meera Nair",
    qualification: "B.Pharm (Ayur), PhD",
    specialty: "Gastroenterology",
    image: "/doctors/doc-3.jpg",
    recommends: "Dr. Gasovita Syrup",
    quote: "Effective for chronic acidity and bloating. The cooling herbs soothe the Pitta dosha almost immediately. Highly recommended for daily gut health.",
    rating: 4.9,
    credentials: ["15+ Yrs Exp", "Herbal Expert"]
  }
];

const PATIENT_STORIES = [
  {
    id: 1,
    name: "Ramesh Gupta",
    details: "58, Varanasi",
    concern: "Chronic Knee Pain",
    product: "Arthovita Kit",
    story: "I couldn't climb stairs for 3 years. After 2 months of the Arthovita course, my mobility has improved by 80%. I can now visit the temple daily.",
    outcomes: [{ label: "Pain", change: "↓" }, { label: "Mobility", change: "↑" }]
  },
  {
    id: 2,
    name: "Akash Pandey",
    details: "45, Indore",
    concern: "High Blood Sugar",
    product: "Diabvita Care",
    story: "My fasting sugar was constantly above 180. With diet changes and Ayurvita, it has stabilized around 110. I feel much more energetic now.",
    outcomes: [{ label: "Sugar Lvl", change: "Normal" }, { label: "Energy", change: "↑" }]
  },
  {
    id: 3,
    name: "Amit Patel",
    details: "34, Ahmedabad",
    concern: "Severe Gastritis",
    product: "Gasovita Syrup",
    story: "IT job stress gave me severe acidity. This syrup gives instant relief unlike chemical antacids. It's now a staple in my home.",
    outcomes: [{ label: "Acidity", change: "Gone" }, { label: "Bloating", change: "↓" }]
  }
];

const PROCESS_STEPS = [
  { icon: FileText, title: "Share Your Concern", desc: "Tell us about your symptoms", metric: "100+ Doctors" },
  { icon: Stethoscope, title: "Doctor Assessment", desc: "Review by BAMS experts", metric: "Free Consult" },
  { icon: Activity, title: "Personalised Plan", desc: "Customized dosage & diet", metric: "100% Herbal" },
  { icon: Package, title: "Doorstep Delivery", desc: "Discreet & safe shipping", metric: "48hr Dispatch" },
];

const FAQ_ITEMS = [
  { q: "Are Ayurvita medicines safe for long-term use?", a: "Yes, our formulations are 100% herbal and free from heavy metals or steroids, making them safe for long-term usage under guidance." },
  { q: "Do I need a prescription to order?", a: "Most of our wellness supplements do not require a prescription. However, we recommend our free doctor consultation for chronic conditions." },
  { q: "How long until I see results?", a: "Ayurveda works on the root cause. While symptomatic relief often starts within 3-7 days, we recommend a 3-month course for complete healing." },
  { q: "Is the packaging discreet?", a: "Absolutely. All orders are shipped in unmarked, secure packaging to maintain your privacy." },
  { q: "Are these medicines approved by AYUSH?", a: "Yes, all our manufacturing units are GMP certified and our formulations comply with Ministry of AYUSH guidelines." },
];

// --- Sub-Components ---

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className={`font - serif text - lg ${isOpen ? 'text-emerald-800' : 'text-stone-800'} transition - colors`}>
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="text-emerald-600" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-stone-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const getFilteredProducts = () => {
    if (activeCategory === "All") {
      return productData; // Return all products instead of just featured ones for "All" view in this section
    }
    return productData.filter(product => product.category === activeCategory);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        // FETCHING 8 PRODUCTS for "2 rows of 4" layout
        const filtered = productData.slice(0, 8);
        setFeaturedProducts(filtered);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-900 overflow-x-hidden">
      <SEO
        title="Home"
        description="Hindsole Pharma - Trusted healthcare products delivered to your doorstep. Explore our range of medicines, wellness products, and doctor consultations."
      />

      {/* 🌿 HERO CAROUSEL - Image-only slides */}
      <HeroCarousel />

      {/* 🔥 BEST SELLERS SECTION - Immediately after hero */}
      <section className="bg-gradient-to-b from-emerald-50/30 to-white py-12 md:py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-emerald-950 font-serif mb-2">Our Best Sellers</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          {/* Category Pills */}
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Product Cards Grid - MOBILE SWIPE ADDED */}
          {loading ? (
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 hide-scrollbar">
              {[1, 2, 3, 4].map((n) => <ProductSkeleton key={n} />)}
            </div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 hide-scrollbar">
              {getFilteredProducts().map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] snap-center sm:min-w-[320px] lg:min-w-0"
                >
                  <ProductCard
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🚚 FEATURES STRIP - Moved below Best Sellers */}
      <div className="bg-white border-b border-stone-200 py-8">
        <div className="flex flex-wrap justify-center md:justify-around gap-8 max-w-7xl mx-auto px-4">
          {[
            { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹999' },
            { icon: ShieldCheck, title: 'Secure Payment', sub: '100% Protected' },
            { icon: Leaf, title: 'Pure Ayurvedic', sub: 'No chemicals added' },
            { icon: Star, title: 'Top Rated', sub: '4.9/5 Customer Score' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 group cursor-default"
            >
              <div className="p-3 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors group-hover:scale-110 duration-300">
                <feature.icon size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">{feature.title}</p>
                <p className="text-xs text-stone-500">{feature.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔥 BEST SELLING MEDICINES SECTION (2nd Section) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase block mb-2">Ayurvita Pharma</span>
          <h2 className="text-4xl font-black text-emerald-950 mb-4 font-serif">Best Selling Medicines</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 max-w-2xl mx-auto">Trusted formulations for chronic pain, digestion, and lifestyle wellness.</p>
        </div>

        {loading ? (
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 hide-scrollbar">
            {[1, 2, 3, 4].map((n) => <ProductSkeleton key={n} />)}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 hide-scrollbar"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp} className="min-w-[280px] snap-center sm:min-w-[320px] lg:min-w-0">
                <ProductCard
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full border-2 border-emerald-900 text-emerald-900 font-bold hover:bg-emerald-900 hover:text-white transition-all transform hover:scale-105">
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* 🌱 SHOP BY CATEGORY */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-950 font-serif">Shop by Concern</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Joint & Muscle Pain", img: "/products/jointpain.jpg", desc: "Relief from arthritis & stiffness" },
              { title: "Diabetes Care", img: "/products/diabetic.jpg", desc: "Manage blood sugar naturally" },
              { title: "Digestive Health", img: "/products/digestive.jpg", desc: "For acidity, gas & gut health" },
            ].map((cat, idx) => (
              <Link to="/shop" key={idx} className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                <img
                  src={cat.img}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={cat.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {cat.desc}
                  </p>
                  <span className="inline-flex items-center text-emerald-300 font-bold text-sm tracking-wide group-hover:text-emerald-200">
                    EXPLORE <ArrowRight size={16} className="ml-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 👨‍⚕️ DOCTOR RECOMMENDATIONS */}
      <section className="py-24 px-4 max-w-7xl mx-auto bg-white relative">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase block mb-2">Clinical Validation</span>
          <h2 className="text-4xl font-bold text-emerald-950 mb-4 font-serif">Doctor Recommended Formulations</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Prescribed by leading BAMS and MD practitioners across India for effective healing.</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {DOCTOR_REVIEWS.map((doc) => (
            <motion.div
              key={doc.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-stone-50 rounded-2xl p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-700"></div>

              <div className="flex items-start gap-5 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${doc.name}&background=047857&color=fff`; }}
                  />
                  < div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border-2 border-white translate-y-1/2 translate-x-1/2" >
                    <CheckCircle2 size={12} fill="white" className="text-emerald-600" />
                  </div >
                </div >
                <div>
                  <h3 className="font-bold text-emerald-950 text-xl font-serif">{doc.name}</h3>
                  <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide mt-1">{doc.qualification}</p>
                  <p className="text-sm text-stone-500 mt-1">{doc.specialty}</p>
                </div>
              </div >

              <div className="mb-6">
                <div className="flex text-yellow-400 gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(doc.rating) ? "currentColor" : "none"} className={i < Math.floor(doc.rating) ? "" : "text-stone-300"} />
                  ))}
                </div>
                <p className="text-stone-700 italic leading-relaxed text-sm bg-white p-4 rounded-xl border border-stone-100 shadow-sm relative">
                  <Quote size={20} className="text-emerald-100 absolute -top-2 -left-2 fill-emerald-100" />
                  "{doc.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">{doc.recommends}</span>
                </div>
                <div className="flex gap-2">
                  {doc.credentials.map((cred, i) => (
                    <span key={i} className="text-[10px] bg-stone-200 text-stone-600 px-2 py-0.5 rounded-sm font-bold">{cred}</span>
                  ))}
                </div>
              </div>
            </motion.div >
          ))}
        </motion.div >
      </section >

      {/* ❤️ PATIENT STORIES */}
      < section className="py-24 bg-emerald-50/50 relative overflow-hidden" >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#065f46 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-emerald-950 font-serif">Patient Stories & Outcomes</h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {PATIENT_STORIES.map((patient) => (
              <motion.div
                key={patient.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 flex flex-col h-full"
              >
                <Quote size={32} className="text-emerald-200 mb-6" />
                <p className="text-stone-700 mb-6 leading-relaxed font-medium flex-grow">"{patient.story}"</p>

                <div className="flex gap-2 mb-6">
                  {patient.outcomes.map((o, i) => (
                    <div key={i} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${o.change.includes('↓') || o.change === 'Gone' || o.change === 'Normal' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {o.label} <span className="text-sm">{o.change}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold overflow-hidden">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900">{patient.name}</p>
                      <p className="text-xs text-stone-500">{patient.details}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section >

      {/* 🔄 HOW IT WORKS */}
      < section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden" >
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4 font-serif">How Ayurvita Care Works</h2>
          <p className="text-gray-500">A seamless journey from consultation to cure.</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-1 bg-stone-100 -z-10 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              whileInView={{ x: '100%' }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="w-full h-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white border-2 border-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:border-emerald-500 group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300 relative z-10">
                  <step.icon size={32} className="text-emerald-600" />
                  <div className="absolute -bottom-3 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    STEP {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 px-2 mb-3">{step.desc}</p>
                <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-100">
                  {step.metric}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ❓ FAQ SECTION */}
      < section className="py-20 px-4 max-w-4xl mx-auto" >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-950 font-serif">Frequently Asked Questions</h2>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem key={idx} question={item.q} answer={item.a} />
          ))}
        </div>
      </section >

      {/* 📰 BLOG PREVIEW (WITH WORKING LINKS) */}
      < section className="py-20 bg-stone-100" >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase block mb-2">Health Hub</span>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 font-serif">Latest Ayurvedic Insights</h2>
            </div>
            <Link to="/blogs" className="hidden md:flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-900">
              Read Journal <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Using blogData dynamically */}
            {blogData.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                to={`/${post.slug}`} // ✅ Navigates to /:slug
                className="block group h-full"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-emerald-800 uppercase">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-emerald-950 mb-3 group-hover:text-emerald-600 transition-colors font-serif line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mt-auto">
                      <span>Read More</span> <ArrowUpRight size={14} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/blogs" className="inline-block border-b-2 border-emerald-600 text-emerald-800 font-bold pb-1">
              View All Articles
            </Link>
          </div>
        </div>
      </section >

      {/* 🩺 CONSULT BANNER (Final CTA) */}
      < section className="bg-emerald-900 py-24 relative overflow-hidden" >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-emerald-800 text-emerald-200 px-4 py-1 rounded-full font-bold text-xs uppercase mb-4 inline-block">Free Consultation</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">Expert Ayurvedic Advice</h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-xl">
              Unsure about which Ayurvita medicine fits your needs? Talk to our certified doctors and get a personalized health plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/consult" className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg inline-flex items-center justify-center gap-2">
                Book Appointment <ArrowRight size={18} />
              </Link>
              <div className="flex items-center justify-center gap-2 text-emerald-200 text-sm font-medium px-4">
                <Clock size={16} /> 15 Min Session
              </div>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-lg">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
              className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10 border-8 border-emerald-800 w-full h-auto"
              alt="Ayurvedic Doctor"
              loading="lazy"
            />
          </div>
        </div>
      </section >

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div >
  );
};