import { Leaf, Award, Heart, Mountain } from 'lucide-react';

export const Story = () => {
  return (
    <div className="min-h-screen bg-white animate-in fade-in">
      
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center text-center px-4">
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1600" 
                alt="Himalayas" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-emerald-900/60 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-white space-y-6">
            <span className="text-emerald-300 font-bold tracking-[0.2em] uppercase text-sm">Since 2026</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">Rooted in Nature,<br/>Backed by Science.</h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                Hindsole Pharma isn't just a brand; it's a promise to bring the ancient healing secrets of the Himalayas to your doorstep.
            </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 px-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mountain size={32}/>
                </div>
                <h3 className="text-xl font-black text-gray-900">Sourced from Himalayas</h3>
                <p className="text-gray-500 leading-relaxed">
                    We don't buy from middlemen. Our herbs are hand-picked by local farmers in the upper ranges of Uttarakhand.
                </p>
            </div>
            <div className="space-y-4 px-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Leaf size={32}/>
                </div>
                <h3 className="text-xl font-black text-gray-900">100% Organic & Pure</h3>
                <p className="text-gray-500 leading-relaxed">
                    No fillers, no steroids, no chemicals. Just pure plant extracts processed using traditional Ayurvedic methods.
                </p>
            </div>
            <div className="space-y-4 px-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award size={32}/>
                </div>
                <h3 className="text-xl font-black text-gray-900">GMP Certified</h3>
                <p className="text-gray-500 leading-relaxed">
                    While our wisdom is ancient, our labs are modern. Every batch is tested for safety and potency.
                </p>
            </div>
        </div>
      </div>

      {/* The Founder's Note */}
      <div className="bg-emerald-50 py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-emerald-200 rounded-3xl"></div>
                <img 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800" 
                    alt="Founder" 
                    className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
                />
            </div>
            <div className="w-full md:w-1/2 space-y-8">
                <h2 className="text-4xl font-black text-emerald-900">A Message from the Founder</h2>
                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                    <p>
                        "I started Hindsole with a simple question: <span className="text-emerald-700 font-bold italic">Why are we forgetting our roots?</span>"
                    </p>
                    <p>
                        Growing up, I saw my grandmother cure complex ailments with simple kitchen herbs. But as I entered the corporate world, I saw people popping pills for every small headache.
                    </p>
                    <p>
                        We wanted to bridge this gap. To create medicines that work effectively without the side effects of modern chemicals.
                    </p>
                </div>
                <div className="pt-4 border-t border-emerald-200">
                    <p className="font-black text-xl text-emerald-900">Prahalad Pal</p>
                    <p className="text-emerald-600">Founder & CEO, Hindsole Pharma</p>
                </div>
            </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-emerald-900 text-white py-24 text-center px-4">
        <Heart size={48} className="mx-auto mb-6 text-emerald-400 animate-pulse"/>
        <h2 className="text-4xl font-black mb-6">Join the Ayurveda Revolution</h2>
        <p className="text-emerald-200 text-lg max-w-2xl mx-auto mb-10">
            Start your journey towards a chemical-free, healthier life today.
        </p>
        <a href="/" className="inline-block bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-lg shadow-emerald-900/50">
            Explore Our Products
        </a>
      </div>

    </div>
  );
};