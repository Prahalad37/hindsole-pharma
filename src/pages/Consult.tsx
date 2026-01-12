import { useState } from 'react';
import { CheckCircle, Stethoscope, ClipboardList, Calendar } from 'lucide-react';

export const Consult = () => {
  const [consultData, setConsultData] = useState({ name: "", phone: "", age: "", issue: "", date: "" });
  const [consultSuccess, setConsultSuccess] = useState(false);

  const handleConsultSubmit = (e: any) => {
    e.preventDefault();
    setConsultSuccess(true);
  };

  return (
    <div className="flex-grow animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div className="bg-emerald-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover" alt="" /></div>
        <div className="relative max-w-4xl mx-auto">
            <span className="bg-emerald-700/50 border border-emerald-500 text-emerald-100 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">100% Private & Secure</span>
            <h1 className="text-4xl md:text-6xl font-black mb-6">Expert Ayurvedic Consultation</h1>
            <p className="text-xl text-emerald-100 opacity-80 max-w-2xl mx-auto">Talk to certified Vaidyas from home.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {consultSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-[3rem] p-12 text-center max-w-2xl mx-auto">
            <CheckCircle size={80} className="text-emerald-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-emerald-950 mb-4">Request Sent!</h2>
            <p className="text-gray-600 text-lg mb-8">We will call you at <strong>{consultData.phone}</strong> shortly.</p>
            <button onClick={() => setConsultSuccess(false)} className="text-emerald-700 font-bold border-b-2 border-emerald-700">Book Another</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
                <h2 className="text-3xl font-black text-gray-900">Why Consult Hindsole?</h2>
                <div className="grid gap-6">
                  {[{icon: Stethoscope, title: "Certified Doctors", desc: "Experienced BAMS Vaidyas"}, {icon: ClipboardList, title: "Personalized Plans", desc: "Customized diet & medicine"}, {icon: Calendar, title: "Flexible Timing", desc: "Choose your slot"}].map((item, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-emerald-100 p-3 rounded-full h-fit text-emerald-700"><item.icon size={24}/></div>
                      <div><h3 className="font-bold text-lg mb-1">{item.title}</h3><p className="text-sm text-gray-500">{item.desc}</p></div>
                    </div>
                  ))}
                </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black mb-6">Book Appointment</h3>
                <form onSubmit={handleConsultSubmit} className="space-y-5">
                  <input required type="text" value={consultData.name} onChange={(e)=>setConsultData({...consultData, name: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="Patient Name"/>
                  <div className="grid grid-cols-2 gap-4">
                      <input required type="tel" value={consultData.phone} onChange={(e)=>setConsultData({...consultData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="Phone"/>
                      <input required type="number" value={consultData.age} onChange={(e)=>setConsultData({...consultData, age: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="Age"/>
                  </div>
                  <input required type="date" value={consultData.date} onChange={(e)=>setConsultData({...consultData, date: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none"/>
                  <textarea required rows={3} value={consultData.issue} onChange={(e)=>setConsultData({...consultData, issue: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-2xl outline-none" placeholder="Describe Problem..."></textarea>
                  <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-emerald-700">Submit Request</button>
                </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};