import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useShop } from '../context/ShopContext';
import {
    Star, Minus, Plus, ShoppingBag, Check, ShieldCheck,
    Leaf, Award, UserCheck,
    ChevronDown, Share2, Heart as HeartIcon,
    Activity, Sparkles, Truck, ArrowRight, Gift, CheckCircle2, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

export const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useShop();

    // Derived State
    const product = products.find(p => p.id === Number(id));

    // Local UI State
    const [activeImage, setActiveImage] = useState('');
    const [prevId, setPrevId] = useState<string | undefined>(undefined);

    // Reset image when product changes (State Adjustment during Render)
    if (id !== prevId) {
        setPrevId(id);
        if (product) setActiveImage(product.image);
    }


    const [quantity, setQuantity] = useState(1);
    const [selectedPack, setSelectedPack] = useState(1); // 1 = Pack of 1, 2 = Pack of 2, etc.
    const [activeTab, setActiveTab] = useState('description');

    // Scroll to top & Redirect if not found
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!product) {
            navigate('/shop');
        }
    }, [product, navigate]);

    if (!product) return null;

    // Mock Gallery Images (using same image for demo if no others exist)
    const galleryImages = [
        product.image,
        product.poster || product.image,
        product.image,
        product.image
    ].filter(Boolean);

    // Pack Calculations
    // Pack Calculations
    const packOptions = [
        { size: 1, discount: 10, label: 'Pack of 1' },
        { size: 2, discount: 15, label: 'Pack of 2' },
        { size: 3, discount: 20, label: 'Pack of 3' },
    ];

    const calculateOriginalPrice = (size: number) => {
        return (product.originalPrice || Math.round(product.price * 1.25)) * size;
    };

    const calculatePrice = (size: number) => {
        const option = packOptions.find(p => p.size === size) || packOptions[0];
        const orig = calculateOriginalPrice(size);
        return Math.round(orig * (1 - option.discount / 100));
    };

    const currentPack = packOptions.find(p => p.size === selectedPack) || packOptions[0];

    // Derived values for current selection
    const price = calculatePrice(selectedPack);
    const originalPrice = calculateOriginalPrice(selectedPack);
    const discountPercentage = currentPack.discount;

    const handleAddToCart = () => {
        // Add 'quantity' number of 'selectedPack' bundles
        // Total items = quantity * selectedPack
        // For simplicity with current context, we add (quantity * selectedPack) individual items.
        addToCart(product, quantity * selectedPack);
        toast.success(`Added ${quantity} x ${currentPack.label} to Cart!`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    return (
        <div className="bg-white min-h-screen pb-24 font-sans">
            <SEO
                title={product.name}
                description={product.description || `Buy ${product.name} at best price.`}
                image={product.image}
            />

            {/* BREADCRUMB area could go here */}

            <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* LEFT COLUMN: Gallery */}
                <div className="space-y-4 select-none">
                    <div className="flex flex-col-reverse lg:flex-row gap-4 h-[500px] lg:h-[600px]">
                        {/* Thumbnails */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible hide-scrollbar lg:h-full lg:w-24 shrink-0">
                            {galleryImages.length > 0 ? galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setActiveImage(img)}
                                    className={`border-2 rounded-xl overflow-hidden w-20 h-20 flex-shrink-0 transition-all cursor-pointer ${activeImage === img ? 'border-emerald-600 ring-2 ring-emerald-100 opacity-100' : 'border-stone-100 opacity-70 hover:opacity-100 hover:border-emerald-200'}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx}`}
                                        className="w-full h-full object-contain bg-white p-1"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'; }}
                                    />
                                </button>
                            )) : (
                                // Fallback thumbnails if empty
                                [1, 2, 3].map(i => (
                                    <div key={i} className="w-20 h-20 bg-stone-100 rounded-xl animate-pulse"></div>
                                ))
                            )}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-white rounded-3xl border border-stone-100 p-8 relative group overflow-hidden flex items-center justify-center shadow-sm">
                            {/* Zoom Effect Container */}
                            <img
                                src={activeImage || 'https://placehold.co/600x600?text=Product+Image'}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Image+Not+Found'; }}
                            />

                            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                                <button className="p-3 bg-white rounded-full shadow-lg hover:text-red-500 hover:bg-red-50 transition-all border border-stone-100">
                                    <HeartIcon size={20} />
                                </button>
                                <button className="p-3 bg-white rounded-full shadow-lg hover:text-blue-500 hover:bg-blue-50 transition-all border border-stone-100">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Product Info */}
                <div className="flex flex-col h-full">
                    {/* Breadcrumb - Mobile Hidden */}
                    <nav className="hidden md:flex items-center gap-2 text-sm text-stone-500 mb-6 font-medium">
                        <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/shop" className="hover:text-emerald-700 transition-colors">{product.category}</Link>
                        <ChevronRight size={14} />
                        <span className="text-emerald-900 font-bold">{product.name}</span>
                    </nav>

                    {/* Title & Reviews */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-4xl font-black text-emerald-950 font-serif mb-2 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-stone-500 text-sm md:text-base mb-3 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {["Weight Loss", "Tasty Drink", "Curbs Cravings", "Improves Gut Health"].map((tag, i) => (
                                <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide border ${i === 1 ? 'bg-amber-200 text-amber-900 border-amber-300' : i === 2 ? 'bg-blue-200 text-blue-900 border-blue-300' : 'bg-green-100 text-green-800 border-green-200'}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-stone-300"} />
                                ))}
                            </div>
                            <span className="text-stone-500 text-sm font-bold">
                                {product.rating} | {product.reviews} reviews
                            </span>
                        </div>

                        {/* Pricing Main Display */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-black text-stone-900">₹{price}</span>
                            <span className="text-lg text-stone-400 line-through font-medium">₹{originalPrice}</span>
                            <span className="bg-emerald-700 text-white px-2 py-1 rounded text-xs font-bold">
                                {discountPercentage}% OFF
                            </span>
                            <span className="text-[10px] text-stone-500 italic block w-full mt-1">(Inclusive of all taxes)</span>
                        </div>

                        {/* FREE GIFT BANNER */}
                        <div className="bg-emerald-800 text-white text-xs font-bold px-4 py-3 rounded-md flex items-center gap-2 mb-6">
                            <Gift size={16} className="animate-pulse" />
                            FREE Shilajit Lozenges worth ₹599 on orders above ₹1149
                        </div>

                        <div className="space-y-4 mb-8">
                            <h3 className="text-sm font-bold text-stone-900">Size: Pack of {selectedPack}</h3>

                            <div className="space-y-3">
                                {[1, 2, 3].map((size) => {
                                    const pPrice = calculatePrice(size);
                                    const pOrig = calculateOriginalPrice(size);
                                    const isSelected = selectedPack === size;

                                    return (
                                        <div
                                            key={size}
                                            onClick={() => setSelectedPack(size)}
                                            className={`relative p-4 rounded-lg border-2 cursor-pointer flex justify-between items-center transition-all duration-200 ${isSelected ? 'bg-emerald-900 border-emerald-900' : 'bg-white border-stone-200 hover:border-emerald-200'}`}
                                        >
                                            {/* Badge */}
                                            {size === 1 && <span className={`absolute -top-3 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 border border-green-200'}`}>Trial Pack</span>}
                                            {size === 2 && <span className={`absolute -top-3 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-green-500 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>Bestseller</span>}
                                            {size === 3 && <span className={`absolute -top-3 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-green-500 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>Expert Recommended</span>}

                                            <div className="flex items-center gap-4">
                                                <div className={`w-16 h-16 rounded-md overflow-hidden bg-white p-1 ${isSelected ? 'opacity-100' : 'opacity-80'}`}>
                                                    <img src={product.image} className="w-full h-full object-contain" alt="Pack" />
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-stone-900'}`}>PACK OF {size}</p>
                                                    <p className={`text-xs ${isSelected ? 'text-emerald-200' : 'text-stone-500'}`}>{size * (product.type.includes('ml') ? 450 : 60)} {product.type.includes('ml') ? 'ML' : 'Tabs'}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-stone-900'}`}>₹{Math.round(pPrice)}</p>
                                                <p className={`text-xs line-through ${isSelected ? 'text-emerald-400' : 'text-stone-400'}`}>₹{pOrig}</p>
                                                <span className={`text-[10px] font-bold ${isSelected ? 'text-green-300' : 'text-green-600'}`}>{Math.round(((pOrig - pPrice) / pOrig) * 100)}% OFF</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* QUANTITY & CART (Desktop) */}
                        <div className="hidden lg:flex items-center gap-4 mb-8">
                            <div className="flex items-center border-2 border-stone-200 rounded-lg h-12">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-50"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center font-bold text-stone-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-full flex items-center justify-center text-stone-500 hover:bg-stone-50"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-emerald-900 text-white h-12 rounded-lg font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                            >
                                <ShoppingBag size={20} />
                                ADD TO CART - ₹{price * quantity}
                            </button>
                        </div>

                        {/* Benefits Icons Grid (Mobile Style Clone) */}
                        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full border border-emerald-100 shadow-sm shrink-0">
                                        <Activity size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-stone-900 leading-tight">Helps burn excess fat</p>
                                        <p className="text-[10px] text-stone-500">Supports weight loss</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full border border-emerald-100 shadow-sm shrink-0">
                                        <ShieldCheck size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-stone-900 leading-tight">Helps boost immunity</p>
                                        <p className="text-[10px] text-stone-500">Improve digestion</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full border border-emerald-100 shadow-sm shrink-0">
                                        <Sparkles size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-stone-900 leading-tight">Improves hair health</p>
                                        <p className="text-[10px] text-stone-500">& skin glow</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white rounded-full border border-emerald-100 shadow-sm shrink-0">
                                        <Leaf size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-stone-900 leading-tight">Great taste</p>
                                        <p className="text-[10px] text-stone-500">& no pungent smell</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Checker (Simplified) */}
                        <div className="border border-stone-200 rounded-lg p-4 flex items-center justify-between mb-8 cursor-pointer hover:bg-stone-50">
                            <div className="flex items-center gap-3">
                                <Truck size={20} className="text-stone-400" />
                                <span className="text-sm font-bold text-stone-600">Check delivery date</span>
                            </div>
                            <ChevronRight size={16} className="text-stone-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* LIFESTYLE BANNER (Screenshot 4) */}
            {product.poster && (
                <div className="w-full relative h-[400px] md:h-[500px] bg-stone-900 mb-16 rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-7xl">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-70"
                        style={{ backgroundImage: `url(${product.poster})` }}
                    />
                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">LIFESTYLE WELLNESS</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight font-serif drop-shadow-lg">
                            Holistic Healing for Modern Life.
                        </h2>
                        <p className="text-lg text-emerald-50 mb-8 leading-relaxed drop-shadow-md">
                            Experience the ancient wisdom of Ayurveda, reformulated for your busy lifestyle. 100% natural, effective, and safe.
                        </p>
                        <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 w-fit transition-transform transform hover:scale-105 flex items-center gap-2">
                            Explore Benefits <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* TABS SECTION */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="flex border-b border-stone-200 mb-8 overflow-x-auto hide-scrollbar">
                    {['Description', 'Key Ingredients', 'How to Use', 'Product Details'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-6 text-sm font-bold whitespace-nowrap transition-colors relative ${activeTab === tab
                                ? 'text-emerald-900'
                                : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-900 rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 prose prose-stone prose-emerald">
                        {activeTab === 'Description' && (
                            <div className="space-y-4 animate-fadeIn">
                                <p className="text-stone-600 leading-relaxed text-lg">
                                    {product.description}
                                </p>
                                <h4 className="font-bold text-emerald-900 mt-6 mb-4">Why choose Ayurvita?</h4>
                                <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
                                    {product.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={14} className="text-emerald-700" />
                                            </div>
                                            <span className="text-stone-700 font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'Key Ingredients' && (
                            <div className="animate-fadeIn">
                                <h3 className="text-xl font-bold text-emerald-900 mb-4">Key Herbal Ingredients</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Ashwagandha', 'Turmeric', 'Gilloy', 'Amla', 'Tulsi', 'Neem'].map((herb, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 border border-stone-100 rounded-lg hover:shadow-md transition-all">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">{herb[0]}</div>
                                            <div>
                                                <p className="font-bold text-gray-900">{herb}</p>
                                                <p className="text-xs text-gray-500">Premium Extract</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'How to Use' && (
                            <div className="animate-fadeIn space-y-4">
                                <h3 className="text-xl font-bold text-emerald-900 mb-2">Recommended Dosage</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-emerald-100 text-emerald-800 font-bold w-6 h-6 rounded-full flex items-center justify-center mt-0.5">1</div>
                                        <p className="text-gray-700">{product.dosage}</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-emerald-100 text-emerald-800 font-bold w-6 h-6 rounded-full flex items-center justify-center mt-0.5">2</div>
                                        <p className="text-gray-700">For best results, consume with warm water or milk.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="bg-emerald-100 text-emerald-800 font-bold w-6 h-6 rounded-full flex items-center justify-center mt-0.5">3</div>
                                        <p className="text-gray-700">Consistent usage for 3 months is recommended for chronic conditions.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Product Details' && (
                            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Form</span> <span className="font-medium text-gray-900">{product.form}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Net Quantity</span> <span className="font-medium text-gray-900">{product.type}</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Gender</span> <span className="font-medium text-gray-900">Unisex</span></div>
                                <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Ideal For</span> <span className="font-medium text-gray-900">{product.indications}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TRUST BANNER */}
            <div className="bg-emerald-900 py-12 text-white mb-16">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <ShieldCheck size={40} className="text-amber-400" />
                        <p className="font-bold text-sm md:text-base">Researched & Crafted By Experts</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Award size={40} className="text-amber-400" />
                        <p className="font-bold text-sm md:text-base">New-Age Formulations</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Leaf size={40} className="text-amber-400" />
                        <p className="font-bold text-sm md:text-base">100% Ayurvedic Actives</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <UserCheck size={40} className="text-amber-400" />
                        <p className="font-bold text-sm md:text-base">Free Expert Consultation</p>
                    </div>
                </div>
            </div>

            {/* EXPERT CONSULTATION BANNER (Screenshot 5) */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 rounded-2xl overflow-hidden flex flex-col md:flex-row items-center shadow-lg relative">

                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex-1 p-8 md:p-12 text-center md:text-left relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Talk to our Expert</h2>
                        <p className="text-emerald-100 text-lg mb-8 max-w-md mx-auto md:mx-0">
                            Not sure if this is the right product for you? Get a free consultation with our certified Ayurvedic doctors.
                        </p>
                        <button
                            onClick={() => navigate('/consult')}
                            className="bg-white text-emerald-900 font-bold px-8 py-3 rounded-lg shadow-md hover:bg-emerald-50 hover:scale-105 transition-all text-sm uppercase tracking-wider"
                        >
                            Take Consultation Now
                        </button>
                    </div>

                    <div className="w-full md:w-1/2 h-64 md:h-auto relative flex items-end justify-center md:justify-end pr-0 md:pr-12">
                        <img
                            src="/doctors/doc-1.jpg"
                            alt="Ayurvedic Expert"
                            className="h-full object-cover object-top mask-image-b md:h-[120%] md:-mb-8 drop-shadow-xl"
                        />
                    </div>
                </div>
            </div>

            {/* FAQ SECTION (Screenshot 5) */}
            <div className="max-w-4xl mx-auto px-4 mb-20">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        "Which Ayurvedic Fitness product is best for weight loss?",
                        "Do Ayurvedic Fitness products help you in losing weight?",
                        "Does Triphala herb burn fat?",
                        "Are there any side effects associated with using Ayurvedic fitness products?",
                        "Are there any age restrictions for using the weight management products?"
                    ].map((question, i) => (
                        <div key={i} className="border border-emerald-100 rounded-lg bg-emerald-50/30 overflow-hidden">
                            <button className="w-full flex items-center justify-between p-4 text-left font-bold text-emerald-900 hover:bg-emerald-50 transition-colors">
                                <span>{question}</span>
                                <ChevronDown size={20} className="text-emerald-600" />
                            </button>
                            {/* Static Open State for Demo (first one could be open, or use state if requested. Assuming closed for now or simple list) */}
                        </div>
                    ))}
                </div>
            </div>

            {/* FREQUENTLY BOUGHT TOGETHER */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together</h2>
                <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                    {products.slice(0, 4).map((recProduct) => (
                        <div key={recProduct.id} className="min-w-[280px] bg-white rounded-xl border border-stone-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="h-40 flex items-center justify-center mb-4 bg-stone-50 rounded-lg">
                                <img src={recProduct.image} alt={recProduct.name} className="max-h-full p-2 object-contain" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{recProduct.name}</h4>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="font-bold text-emerald-800">₹{recProduct.price}</span>
                                <span className="text-xs text-gray-400 line-through">₹{recProduct.originalPrice}</span>
                            </div>
                            <button
                                onClick={() => { addToCart(recProduct, 1); toast.success('Added to bundle!'); }}
                                className="mt-auto w-full bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-800 transition-colors uppercase"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* NEW LAUNCHES (Screenshot 6) */}
            <div className="max-w-7xl mx-auto px-4 mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">New Launches</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.slice(4, 8).map(p => (
                        <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                            <div className="h-48 bg-stone-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                                <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">New</span>
                                <img src={p.image} alt={p.name} className="max-h-full p-4 object-contain transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-bold text-emerald-800">₹{p.price}</span>
                                <button className="bg-emerald-100 text-emerald-800 p-2 rounded-lg hover:bg-emerald-200 transition-colors">
                                    <ShoppingBag size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CUSTOMER REVIEWS (Screenshot 6) */}
            <div className="bg-white py-16 border-t border-stone-100 mb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Customer Reviews</h2>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-stone-50 p-6 rounded-2xl">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                                </div>
                                <span className="font-bold text-gray-900 text-lg">4.78 out of 5</span>
                            </div>
                            <p className="text-sm text-gray-500">Based on {product.reviews} reviews</p>
                        </div>
                        <button className="bg-emerald-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-900 transition-colors shadow-md">
                            Write a review
                        </button>
                    </div>

                    <div className="space-y-8">
                        {[
                            { user: "Sudesh Ketwal", date: "01/24/2026", title: "Good taste", body: "Good and healthy substitute for all drink." },
                            { user: "Anjali Gupta", date: "01/20/2026", title: "Very Effective", body: "I've been using this for a month and I can feel the difference. Highly recommend!" },
                            { user: "Rahul Sharma", date: "01/15/2026", title: "Love the packaging", body: "Great product, delivery was fast and the packaging is premium." }
                        ].map((review, i) => (
                            <div key={i} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                <div className="flex items-center gap-1 text-emerald-500 mb-2">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-gray-900 text-sm">{review.user}</span>
                                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                        <Check size={10} /> Verified
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{review.title}</h4>
                                <p className="text-gray-600 text-sm">{review.body}</p>
                                <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* STICKY BOTTOM BAR (Mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">{currentPack.label}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">₹{price * quantity}</span>
                        <span className="text-xs text-gray-400 line-through">₹{originalPrice * quantity}</span>
                    </div>
                </div>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-emerald-800 text-white font-bold text-sm py-3 rounded-lg shadow-md active:scale-95 transition-transform"
                >
                    ADD TO CART
                </button>
            </div>

        </div >
    );
};
