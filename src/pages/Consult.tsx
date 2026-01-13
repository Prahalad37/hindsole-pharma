import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Stethoscope, ClipboardList, Clock, CheckCircle, Loader2, Calendar } from 'lucide-react';

export const Consult = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    date: '',
    problem: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Data ko 'appointments' collection mein bhejo
      await addDoc(collection(db, "appointments"), {
        ...formData,
        status: 'Pending', // Shuru mein status pending rahega
        createdAt: serverTimestamp()
      });
      
      setSuccess(true);
      setFormData({ name: '', phone: '', age: '', date: '', problem: '' }); // Form clear karo
      
    } catch (error) {
      console.error("Error booking:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900/5 py-12 px-4 animate-in fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-emerald-900 mb-4">Ayurvedic Doctor Consultation</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Get personalized treatment from certified Vaidyas. Pure, natural, and effective healing plans tailored just for you.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left Side: Benefits */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Why Consult Hindsole?</h2>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-emerald-100 hover:shadow-md transition-all">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                        <Stethoscope size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Certified Doctors</h3>
                        <p className="text-gray-500 text-sm mt-1">Experienced BAMS Vaidyas with 10+ years of clinical practice.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-emerald-100 hover:shadow-md transition-all">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                        <ClipboardList size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Personalized Plans</h3>
                        <p className="text-gray-500 text-sm mt-1">Customized diet charts, lifestyle changes, and herbal medicines.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-emerald-100 hover:shadow-md transition-all">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700">
                        <Clock size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Flexible Timing</h3>
                        <p className="text-gray-500 text-sm mt-1">Choose your preferred slot. Video or Audio consultation available.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 relative overflow-hidden">
                
                {success ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">Request Sent!</h3>
                        <p className="text-gray-500">Our team will call you shortly to confirm your slot.</p>
                        <button onClick={() => setSuccess(false)} className="text-emerald-600 font-bold hover:underline">Book Another</button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-black text-emerald-900 mb-6">Book Appointment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Patient Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500" placeholder="Enter name" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone</label>
                                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500" placeholder="98765..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Age</label>
                                    <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500" placeholder="Years" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Preferred Date</label>
                                <div className="relative">
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500" />
                                    <Calendar className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20}/>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Describe Problem</label>
                                <textarea required rows={3} value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500 resize-none" placeholder="Suffering from..."></textarea>
                            </div>

                            <button disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex justify-center items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : 'Submit Request'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};