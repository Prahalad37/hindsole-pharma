import { Leaf, Heart, Mountain, Quote, ShieldCheck } from 'lucide-react';

export const Story = () => {
    return (
        <div className="min-h-screen bg-stone-50 animate-in fade-in">

            {/* 🌿 Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center text-center px-4">
                <div className="absolute inset-0">
                    {/* Background Image */}
                    <img
                        src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop"
                        alt="Himalayas & Herbs"
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-white space-y-6">
                    <span className="text-emerald-300 font-bold tracking-[0.2em] uppercase text-sm">Est. 2026</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight font-serif">
                        Rooted in Trust, <br />
                        <span className="text-emerald-400">Healed by Nature.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed font-light">
                        The journey of how <b>Sumit Pal</b> turned ancient Himalayan wisdom into a modern cure for millions.
                    </p>
                </div>
            </div>

            {/* 🏔️ Values Grid with Product Mentions */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 font-serif">Why Ayurvita is Different</h2>
                    <p className="text-gray-500 mt-4">We don't just sell medicines; we deliver purity.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 text-center">
                    {/* Value 1 */}
                    <div className="space-y-4 px-4 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mountain size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Himalayan Herbs</h3>
                        <p className="text-gray-600 leading-relaxed">
                            The herbs used in <b>Dr. Arthovita</b> and <b>Gasovita</b> are sourced directly from the upper ranges of Uttarakhand, ensuring 100% potency.
                        </p>
                    </div>

                    {/* Value 2 */}
                    <div className="space-y-4 px-4 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Leaf size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">No Harmful Chemicals</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Unlike modern pills, our products like <b>Dr. Gynevita</b> contain no steroids or synthetic fillers. Pure, safe, and effective.
                        </p>
                    </div>

                    {/* Value 3 */}
                    <div className="space-y-4 px-4 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Ancient Formula, Modern Lab</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We follow the exact texts of Ayurveda but test every batch of <b>Dr. Diabvita</b> in GMP-certified labs for safety.
                        </p>
                    </div>
                </div>
            </div>

            {/* ✍️ The Founder's Note (Sumit Pal) */}
            <div className="bg-emerald-900 py-24 px-6 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 p-20 opacity-5">
                    <Quote size={400} />
                </div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="w-full md:w-1/2 relative">
                        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-emerald-500/30 rounded-3xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                            alt="Sumit Pal - Founder"
                            className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover filter brightness-90"
                        />
                    </div>

                    <div className="w-full md:w-1/2 space-y-8">
                        <div className="inline-block bg-emerald-800 px-4 py-1 rounded-full text-emerald-300 text-sm font-bold tracking-wider uppercase">
                            Founder's Message
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white font-serif leading-tight">
                            "Health shouldn't come with side effects."
                        </h2>
                        <div className="space-y-6 text-emerald-100 text-lg leading-relaxed font-light">
                            <p>
                                "I started <b>Ayurvita Pharma</b> with a simple observation. I saw people popping painkillers for joint pain and antacids for gas every single day. They were treating the symptoms, not the root cause."
                            </p>
                            <p>
                                "I wanted to change that. With <b>Dr. Arthovita</b> and <b>Dr. Gasovita</b>, we are bringing back the power of Indian roots. My promise is simple: authentic Ayurveda that actually works."
                            </p>
                        </div>
                        <div className="pt-6 border-t border-emerald-700/50">
                            <p className="font-black text-2xl text-white">Sumit Pal</p>
                            <p className="text-emerald-400 font-medium">Founder & CEO, Ayurvita Pharma</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ❤️ Bottom CTA */}
            <div className="bg-white py-24 text-center px-4">
                <Heart size={48} className="mx-auto mb-6 text-emerald-600 animate-pulse" />
                <h2 className="text-4xl font-black mb-6 text-emerald-950 font-serif">Join the Ayurveda Revolution</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
                    Start your journey towards a chemical-free, healthier life with Sumit Pal's vision.
                </p>
                <a href="/shop" className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:scale-105">
                    Explore Our Medicines
                </a>
            </div>

        </div>
    );
};