import { Leaf } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-white p-24 text-center">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex justify-center items-center gap-2"><Leaf className="text-emerald-400" /><span className="text-3xl font-black tracking-tighter">HINDSOLE</span></div>
          <p className="opacity-40 text-sm italic font-medium">Crafted with purity in the foothills of Himalayas.</p>
          <div className="h-px w-20 bg-emerald-800 mx-auto"></div>
          <p className="text-[10px] opacity-20 uppercase font-black tracking-[0.4em]">© 2026 Hindsole Pharma</p>
        </div>
    </footer>
  );
};