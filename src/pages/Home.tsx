import { useState, useEffect } from 'react';
import {
  ArrowRight, Truck, ShieldCheck, Leaf, Star, CheckCircle2,
  Stethoscope, FileText, Package, Activity, Quote, ChevronDown, ChevronRight,
  Clock, ArrowUpRight, Sparkles, Bone, Droplet, Flower2, Droplets,
  Phone, Mail, MapPin, BadgeCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeroCarousel from '../components/HeroCarousel';
import { products as productData } from '../data/products';
import { blogData } from '../data/blogs';
import type { Product } from '../types';
import { SEO } from '../components/SEO';
import { ProductSkeleton } from '../components/Skeleton';
import { COMPANY } from '../config/company';

// --- Category Data ---
const CATEGORIES = [
  { id: 'All', name: 'All Products', icon: <Sparkles size={16} /> },
  { id: 'Pain Relief', name: 'Pain Relief', icon: <Bone size={16} /> },
  { id: 'Diabetes Care', name: 'Diabetes Care', icon: <Droplet size={16} /> },
  { id: 'Digestion', name: 'Digestion', icon: <Leaf size={16} /> },
  { id: 'Women\'s Health', name: 'Women\'s Health', icon: <Flower2 size={16} /> },
  { id: 'Urinary Care', name: 'Urinary Care', icon: <Droplets size={16} /> },
];

const CategoryFilter = ({ activeCategory, onSelectCategory }: { activeCategory: string, onSelectCategory: (c: string) => void }) => {
  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-3 mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center md:overflow-visible">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all shrink-0 ${
            activeCategory === category.id
              ? "bg-emerald-700 text-white shadow-md hover:bg-emerald-800 transform hover:scale-105"
              : "bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }`}
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
    image: "https://ui-avatars.com/api/?name=Ramesh+Gupta&background=047857&color=fff&size=128",
    details: "58, Varanasi",
    concern: "Chronic Knee Pain",
    product: "Arthovita Kit",
    story: "I couldn't climb stairs for 3 years. After 2 months of the Arthovita course, my mobility has improved by 80%. I can now visit the temple daily.",
    outcomes: [{ label: "Pain", change: "↓" }, { label: "Mobility", change: "↑" }]
  },
  {
    id: 2,
    name: "Akash Pandey",
    image: "https://ui-avatars.com/api/?name=Akash+Pandey&background=047857&color=fff&size=128",
    details: "45, Indore",
    concern: "High Blood Sugar",
    product: "Diabvita Care",
    story: "My fasting sugar was constantly above 180. With diet changes and AyurVita, it has stabilized around 110. I feel much more energetic now.",
    outcomes: [{ label: "Sugar Lvl", change: "Normal" }, { label: "Energy", change: "↑" }]
  },
  {
    id: 3,
    name: "Amit Patel",
    image: "https://ui-avatars.com/api/?name=Amit+Patel&background=047857&color=fff&size=128",
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
  { q: "Are AyurVita medicines safe for long-term use?", a: "Yes, our formulations are 100% herbal and free from heavy metals or steroids, making them safe for long-term usage under guidance." },
  { q: "Do I need a prescription to order?", a: "Most of our wellness supplements do not require a prescription. However, we recommend our free doctor consultation for chronic conditions." },
  { q: "How long until I see results?", a: "Ayurveda works on the root cause. While symptomatic relief often starts within 3-7 days, we recommend a 3-month course for complete healing." },
  { q: "Is the packaging discreet?", a: "Absolutely. All orders are shipped in unmarked, secure packaging to maintain your privacy." },
  { q: "Are these medicines approved by AYUSH?", a: "Yes, all our manufacturing units are GMP certified and our formulations comply with Ministry of AYUSH guidelines." },
];

const CONCERN_CARDS = [
  { title: "Joint & Muscle Pain", img: "/products/jointpain.jpg", desc: "Relief from arthritis & stiffness" },
  { title: "Diabetes Care", img: "/products/diabetic.jpg", desc: "Manage blood sugar naturally" },
  { title: "Digestive Health", img: "/products/digestive.jpg", desc: "For acidity, gas & gut health" },
];

const TOTAL_REVIEWS = productData.reduce((s, p) => s + (p.reviews ?? 0), 0);

// --- Sub-Components ---

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className={`font-serif text-lg ${isOpen ? 'text-emerald-800' : 'text-stone-800'} transition-colors`}>
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
        description="AyurVita - Trusted healthcare products delivered to your doorstep. Explore our range of medicines, wellness products, and doctor consultations."
      />

      {/* 🌿 HERO CAROUSEL - Image-only slides */}
      <HeroCarousel />

      {/* 🏢 TRUSTED BUSINESS PROFILE - AyurVita */}
      <section className="bg-white border-b border-stone-200 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border-2 border-emerald-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/logo.svg"
                alt="AyurVita"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=AyurVita&background=047857&color=fff&size=64';
                }}
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">AyurVita Pharma</h3>
              <p className="text-sm text-emerald-700 font-semibold mt-0.5">by AyurVita</p>
              <p className="text-xs text-stone-600 mt-2 max-w-md">100% Authentic Ayurvedic</p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2.5 py-1 rounded-full font-bold">Verified Business</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2.5 py-1 rounded-full font-bold">Order via WhatsApp – Safe & Easy</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start items-center">
                {COMPANY.certifications.map((cert) => (
                  <span key={cert} className="inline-flex items-center gap-1 text-[10px] bg-white border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                    <BadgeCheck size={12} className="shrink-0" /> {cert}
                  </span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-100 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-xs text-stone-600">
                <a href={`tel:${COMPANY.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start hover:text-emerald-700 transition-colors">
                  <Phone size={14} className="shrink-0" /> {COMPANY.phone}
                </a>
                <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start hover:text-emerald-700 transition-colors">
                  <Mail size={14} className="shrink-0" /> {COMPANY.email}
                </a>
                <span className="flex items-start gap-2 w-full sm:max-w-[220px] justify-center sm:justify-start text-center sm:text-left">
                  <MapPin size={14} className="shrink-0 mt-0.5" /> {COMPANY.address}
                </span>
                <span className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start font-medium">GSTIN: {COMPANY.gst}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-stone-600">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <strong className="text-stone-800">4.8/5</strong> from {TOTAL_REVIEWS}+ reviews
            </span>
            <span className="flex items-center gap-1.5 text-stone-600">
              <ShieldCheck size={16} className="text-emerald-600" />
              <strong className="text-stone-800">{TOTAL_REVIEWS}+</strong> Happy Customers
            </span>
          </div>
        </div>
      </section>

      {/* 🔥 BEST SELLERS SECTION - Immediately after hero */}
      <section className="bg-emerald-50 py-12 md:py-16 relative z-20">
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

          {/* Product Cards Grid - 2x2 on mobile, no slide */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map((n) => <ProductSkeleton key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {getFilteredProducts().map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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

      {/* 🚚 FEATURES STRIP - Compact, mobile 2x2 grid */}
      <div className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/50 border-y border-emerald-100/80 py-5 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹999' },
              { icon: ShieldCheck, title: 'WhatsApp Order', sub: 'Easy & Safe' },
              { icon: Leaf, title: 'Pure Ayurvedic', sub: 'No chemicals added' },
              { icon: Star, title: 'Top Rated', sub: '4.9/5 Customer Score' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-emerald-100/60 shadow-sm hover:shadow-md hover:border-emerald-200/80 transition-all duration-300 group"
              >
                <div className="p-2 sm:p-2.5 bg-emerald-100/80 rounded-lg sm:rounded-xl shrink-0 group-hover:bg-emerald-200/80 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-stone-900 text-xs sm:text-sm leading-tight">{feature.title}</p>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">{feature.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 BEST SELLING MEDICINES SECTION (2nd Section) */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase block mb-2">AyurVita Pharma</span>
          <h2 className="text-4xl font-black text-emerald-950 mb-4 font-serif">Best Selling Medicines</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 max-w-2xl mx-auto">Trusted formulations for chronic pain, digestion, and lifestyle wellness.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {[1, 2, 3, 4].map((n) => <ProductSkeleton key={n} />)}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop" className="inline-block px-8 py-3 rounded-full border-2 border-emerald-900 text-emerald-900 font-bold hover:bg-emerald-900 hover:text-white active:scale-[0.98] transition-all transform hover:scale-105">
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* 🌱 SHOP BY CATEGORY */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-950 font-serif">Shop by Concern</h2>

          {/* Mobile: horizontal slide carousel */}
          <div className="md:hidden -mx-4 px-4 concern-slider">
            <Slider
              dots={true}
              infinite={true}
              speed={400}
              slidesToShow={1}
              slidesToScroll={1}
              swipeToSlide={true}
              arrows={false}
              centerMode={true}
              centerPadding="16px"
            >
              {CONCERN_CARDS.map((cat, idx) => (
                <div key={idx} className="px-1">
                  <Link to="/shop" className="group block relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-lg active:scale-[0.98] transition-transform">
                    <img
                      src={cat.img}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={cat.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-xl font-bold text-white mb-1">{cat.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{cat.desc}</p>
                      <span className="inline-flex items-center text-emerald-300 font-bold text-xs tracking-wide">
                        EXPLORE <ArrowRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {CONCERN_CARDS.map((cat, idx) => (
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
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        >
          {DOCTOR_REVIEWS.map((doc) => (
            <motion.div
              key={doc.id}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-stone-50 rounded-xl md:rounded-2xl p-4 md:p-8 border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-700"></div>

              <div className="flex items-start gap-2 md:gap-5 mb-3 md:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${doc.name}&background=047857&color=fff`; }}
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 md:bottom-0 md:right-0 bg-emerald-600 text-white p-0.5 md:p-1 rounded-full border-2 border-white translate-y-1/2 translate-x-1/2">
                    <CheckCircle2 size={8} fill="white" className="text-emerald-600 md:w-3 md:h-3" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-emerald-950 text-xs sm:text-base md:text-xl font-serif leading-tight line-clamp-2">{doc.name}</h3>
                  <p className="text-[10px] md:text-xs text-emerald-700 font-bold uppercase tracking-wide mt-0.5 line-clamp-1">{doc.qualification}</p>
                  <p className="text-[10px] md:text-sm text-stone-500 mt-0.5 line-clamp-1">{doc.specialty}</p>
                </div>
              </div>

              <div className="mb-3 md:mb-6">
                <div className="flex text-yellow-400 gap-0.5 md:gap-1 mb-2 md:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < Math.floor(doc.rating) ? "currentColor" : "none"} className={`md:w-4 md:h-4 ${i < Math.floor(doc.rating) ? "" : "text-stone-300"}`} />
                  ))}
                </div>
                <p className="text-stone-700 italic leading-relaxed text-[10px] sm:text-xs md:text-sm bg-white p-2 md:p-4 rounded-lg md:rounded-xl border border-stone-100 shadow-sm relative">
                  <Quote size={14} className="text-emerald-100 absolute -top-1 -left-1 fill-emerald-100 md:w-5 md:h-5" />
                  "{doc.quote}"
                </p>
              </div>

              <div className="pt-2 md:pt-4 border-t border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-2">
                <div className="flex items-center gap-1 md:gap-2 min-w-0">
                  <Stethoscope size={12} className="text-emerald-600 shrink-0 md:w-4 md:h-4" />
                  <span className="text-[9px] md:text-xs font-bold text-emerald-900 truncate">{doc.recommends}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {doc.credentials.map((cred, i) => (
                    <span key={i} className="text-[8px] md:text-[10px] bg-stone-200 text-stone-600 px-1.5 md:px-2 py-0.5 rounded-sm font-bold">{cred}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ❤️ PATIENT STORIES */}
      <section className="py-24 bg-emerald-50/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#065f46 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-emerald-950 font-serif">Patient Stories & Outcomes</h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {PATIENT_STORIES.map((patient) => (
              <motion.div
                key={patient.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <img
                    src={patient.image}
                    alt={patient.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-emerald-100 shrink-0 ring-2 ring-emerald-50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=047857&color=fff&size=128`;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs md:text-sm text-stone-900 truncate">{patient.name}</p>
                    <p className="text-[10px] md:text-xs text-stone-500 truncate">{patient.details}</p>
                    <p className="text-[10px] md:text-xs text-emerald-700 font-medium truncate">{patient.concern}</p>
                  </div>
                </div>
                <Quote size={20} className="text-emerald-200 mb-2 md:mb-4 md:w-8 md:h-8" />
                <p className="text-stone-700 mb-3 md:mb-6 leading-relaxed font-medium flex-grow text-[10px] md:text-base line-clamp-4 md:line-clamp-none">"{patient.story}"</p>

                <div className="flex gap-1.5 md:gap-2 mb-3 md:mb-6 flex-wrap">
                  {patient.outcomes.map((o, i) => (
                    <div key={i} className={`flex items-center gap-0.5 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-bold border ${o.change.includes('↓') || o.change === 'Gone' || o.change === 'Normal' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {o.label} <span className="text-[10px] md:text-sm">{o.change}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] md:text-xs text-emerald-600 font-medium">{patient.product}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🔄 HOW IT WORKS - Flowchart */}
      <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4 font-serif">How AyurVita Care Works</h2>
          <p className="text-gray-500">A seamless journey from consultation to cure.</p>
        </div>

        {/* Desktop: horizontal flowchart with arrows */}
        <div className="hidden md:flex items-stretch justify-between gap-0 relative">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group flex-1"
              >
                <div className="w-20 h-20 bg-white border-2 border-emerald-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:border-emerald-500 group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300 relative z-10">
                  <step.icon size={32} className="text-emerald-600" />
                  <div className="absolute -bottom-3 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-1">{step.title}</h3>
                <p className="text-xs text-stone-500 px-1 mb-2">{step.desc}</p>
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-100">
                  {step.metric}
                </span>
              </motion.div>
              {idx < PROCESS_STEPS.length - 1 && (
                <div className="flex-shrink-0 px-1 py-8 flex items-center justify-center">
                  <ChevronRight size={28} className="text-emerald-400" strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: 2x2 compact grid (2 rows) */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="flex items-start gap-2 p-3 bg-white border border-emerald-100 rounded-xl shadow-sm relative"
            >
              <div className="w-10 h-10 shrink-0 bg-white border-2 border-emerald-100 rounded-lg flex items-center justify-center">
                <step.icon size={20} className="text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="inline-block bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold mb-1">STEP {idx + 1}</span>
                <h3 className="text-xs font-bold text-stone-900 leading-tight">{step.title}</h3>
                <p className="text-[10px] text-stone-500 leading-tight line-clamp-2">{step.desc}</p>
                <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                  {step.metric}
                </span>
              </div>
              {idx % 2 === 0 && idx < 3 && (
                <ChevronRight size={12} className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-emerald-400 bg-stone-100 z-10" strokeWidth={2.5} />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-950 font-serif">Frequently Asked Questions</h2>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem key={idx} question={item.q} answer={item.a} />
          ))}
        </div>
      </section>

      {/* 📰 BLOG PREVIEW (WITH WORKING LINKS) */}
      <section className="py-20 bg-stone-100">
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
      </section>

      {/* 🩺 CONSULT BANNER (Final CTA) - Split Design */}
      <section className="py-0 my-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
          {/* LEFT SIDE - Doctor Image */}
          <div className="bg-gray-100 flex items-center justify-center p-8 md:p-12">
            <img
              src="/consult-banner-doctor.jpg"
              className="w-full h-full object-cover rounded-2xl"
              alt="Ayurvedic Doctor"
              loading="lazy"
            />
          </div>

          {/* RIGHT SIDE - Text Content with Green Pattern Background */}
          <div className="bg-emerald-700 relative overflow-hidden flex items-center p-8 md:p-12">
            {/* Decorative Leaf Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="leaf-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                    {/* Leaf shapes */}
                    <path d="M50,50 Q60,30 70,50 Q60,70 50,50 Z" fill="currentColor" opacity="0.3" />
                    <path d="M120,80 Q135,60 150,80 Q135,100 120,80 Z" fill="currentColor" opacity="0.25" />
                    <path d="M30,120 Q42,100 54,120 Q42,140 30,120 Z" fill="currentColor" opacity="0.2" />
                    <path d="M150,150 Q165,135 180,150 Q165,165 150,150 Z" fill="currentColor" opacity="0.3" />
                    <ellipse cx="90" cy="160" rx="15" ry="25" fill="currentColor" opacity="0.2" transform="rotate(45 90 160)" />
                    <ellipse cx="170" cy="40" rx="20" ry="30" fill="currentColor" opacity="0.25" transform="rotate(-30 170 40)" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#leaf-pattern)" className="text-emerald-500" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 text-white">
              <span className="bg-emerald-900/80 text-emerald-100 px-4 py-1.5 rounded-full font-bold text-xs uppercase mb-4 inline-block">Free Consultation</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif leading-tight">Expert Ayurvedic Advice</h2>
              <p className="text-lg text-emerald-50 mb-8 leading-relaxed">
                Unsure about which AyurVita medicine fits your needs? Talk to our certified doctors and get a personalized health plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/consult" className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg inline-flex items-center justify-center gap-2">
                  Book Appointment <ArrowRight size={18} />
                </Link>
                <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium px-4">
                  <Clock size={16} /> 15 Min Session
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div >
  );
};