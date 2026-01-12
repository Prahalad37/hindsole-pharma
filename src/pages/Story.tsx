export const Story = () => {
  return (
    <div className="flex-grow animate-in fade-in duration-700">
      <div className="bg-emerald-50 py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4 block italic">Our Roots</span>
          <h1 className="text-5xl md:text-7xl font-black text-emerald-950 mb-8 tracking-tighter">Purity in Every Soul.</h1>
          <p className="text-xl text-emerald-800/70 leading-relaxed font-medium">Hindsole Pharma was born in Rishikesh with a vision to bridge ancient secrets and modern life.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500" alt="Heritage" />
        <div className="space-y-8">
          <h2 className="text-4xl font-black text-gray-900">Hamara Maksad</h2>
          <p className="text-lg text-gray-600 leading-relaxed italic">Hum sirf products nahi, ek swasth jeevan ka vaada dete hain. Every ingredient is ethically sourced and 100% natural.</p>
          <div className="grid grid-cols-2 gap-8 pt-6">
            <div className="space-y-2"><h4 className="text-4xl font-black text-emerald-600">100%</h4><p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Natural Herbs</p></div>
            <div className="space-y-2"><h4 className="text-4xl font-black text-emerald-600">50k+</h4><p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Happy Lives</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};