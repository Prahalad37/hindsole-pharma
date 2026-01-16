import { useState } from 'react';
import { 
  Stethoscope, ClipboardList, Clock, Loader2, Calendar, 
  Video, Phone, Mail, User, MessageCircle, CheckCircle, ArrowRight 
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Consult = () => {
  const [loading, setLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false); // Success State
  
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
    phone: '',
    age: '',
    date: '',
    time: '',
    mode: 'Video Call',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase mein save karo
      await addDoc(collection(db, "appointments"), {
        ...formData,
        status: 'pending',
        userId: auth.currentUser?.uid || 'guest',
        createdAt: serverTimestamp()
      });
      
      // 2. Success UI dikhao
      toast.success("Request Sent Successfully! 🌿");
      setIsBooked(true);
      
    } catch (error) {
      console.error("Error booking:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen (Booking confirm hone ke baad ye dikhega)
  if (isBooked) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={60} className="text-emerald-600" />
      </div>
      <h2 className="text-4xl font-black text-emerald-950 mb-4 font-serif">Appointment Requested!</h2>
      <p className="text-gray-600 max-w-md text-lg mb-8">
        Thank you, <strong>{formData.name}</strong>. Our Vaidya will review your request and confirm the slot shortly via Phone/WhatsApp.
      </p>
      <div className="flex gap-4">
        <Link to="/" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">
          Back to Home
        </Link>
        <Link to="/shop" className="bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-all shadow-lg">
          Buy Medicines
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 md:py-20">
      <div className="max-w-6xl mx-auto">
        
        {/* 🌿 Header Section */}
        <div className="text-center mb-16 space-y-4">
            <span className="bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-200">
                Holistic Healing
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-emerald-950 font-serif">
                Consult an Expert Vaidya
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Start your journey towards root-cause healing. Book a 1-on-1 session with our certified Ayurvedic doctors today.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* 👈 Left Side: Features & Process */}
            <div className="space-y-10">
                
                {/* Feature Cards */}
                <div className="space-y-6">
                    <div className="flex gap-5 items-start">
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-emerald-600 border border-emerald-50">
                            <Stethoscope size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Diagnosis (Nadi Pariksha)</h3>
                            <p className="text-gray-500 mt-1 leading-relaxed">Our doctors analyze your body type (Dosha) to find the root cause of your ailment.</p>
                        </div>
                    </div>

                    <div className="flex gap-5 items-start">
                        <div className="bg-white p-4 rounded-2xl shadow-sm text-emerald-600 border border-emerald-50">
                            <ClipboardList size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Personalized Diet Plan</h3>
                            <p className="text-gray-500 mt-1 leading-relaxed">Get a custom food chart telling you exactly what to eat and avoid for your condition.</p>
                        </div>
                    </div>
                </div>

                {/* How it works */}
                <div className="bg-emerald-900 text-white p-8 rounded-[2rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h3 className="text-2xl font-bold mb-6 relative z-10">How it works?</h3>
                    <ul className="space-y-4 relative z-10 text-emerald-100">
                        <li className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">1</span>
                            Fill the appointment form.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">2</span>
                            Doctor reviews your details.
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">3</span>
                            Join the Video/Audio call.
                        </li>
                    </ul>
                </div>
            </div>

            {/* 👉 Right Side: Booking Form */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 relative">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <Calendar className="text-emerald-600"/> Book Slot
                    </h2>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Available</span>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Name & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                             <User className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18}/>
                             <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Name" />
                        </div>
                        <div className="relative group">
                             <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18}/>
                             <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Phone" />
                        </div>
                    </div>

                    {/* Email & Age */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 relative group">
                            <Mail className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18}/>
                            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="Email Address" />
                        </div>
                        <div className="relative">
                            <input required type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-center" />
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Date</label>
                            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Time Slot</label>
                            <select required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer appearance-none">
                                <option value="">Select Time</option>
                                <option>Morning (10 AM - 1 PM)</option>
                                <option>Afternoon (2 PM - 5 PM)</option>
                                <option>Evening (6 PM - 9 PM)</option>
                            </select>
                        </div>
                    </div>

                    {/* Mode */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Preferred Mode</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 border-2 rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.mode === 'Video Call' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}>
                                <input type="radio" name="mode" value="Video Call" checked={formData.mode === 'Video Call'} onChange={() => setFormData({...formData, mode: 'Video Call'})} className="hidden"/>
                                <Video size={18}/> Video Call
                            </label>
                            <label className={`flex-1 border-2 rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.mode === 'Phone Call' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : 'border-gray-100 hover:border-gray-300 text-gray-600'}`}>
                                <input type="radio" name="mode" value="Phone Call" checked={formData.mode === 'Phone Call'} onChange={() => setFormData({...formData, mode: 'Phone Call'})} className="hidden"/>
                                <Phone size={18}/> Audio Call
                            </label>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="relative group">
                        <MessageCircle className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18}/>
                        <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 font-medium outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-all" placeholder="Briefly describe your health issue..."></textarea>
                    </div>

                    <button disabled={loading} className="w-full bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <>Confirm Appointment <ArrowRight size={18}/></>}
                    </button>
                    
                    <p className="text-center text-xs text-gray-400">
                        <span className="text-emerald-600 font-bold">Free Cancellation</span> up to 2 hours before the slot.
                    </p>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};