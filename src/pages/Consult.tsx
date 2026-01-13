import { useState } from 'react';
import { Stethoscope, ClipboardList, Clock, Loader2, Calendar, Video, Phone, Mail, User, MessageCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast'; // ✅ Notification Import

export const Consult = () => {
  const [loading, setLoading] = useState(false);
  
  // ✅ Form State updated to match Admin Panel
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
      // ✅ Data sent to Firebase
      await addDoc(collection(db, "appointments"), {
        ...formData,
        status: 'pending', // Admin can change this later
        userId: auth.currentUser?.uid || 'guest',
        createdAt: serverTimestamp()
      });
      
      toast.success("Appointment Request Sent! 👨‍⚕️");
      
      // Form Reset (Keep name/email/phone if filled, reset others)
      setFormData(prev => ({ 
        ...prev, 
        date: '', 
        time: '', 
        message: '' 
      }));
      
    } catch (error) {
      console.error("Error booking:", error);
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 py-12 px-4 animate-in fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
            <span className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                Consult Vaidya
            </span>
            <h1 className="text-4xl font-black text-emerald-900 mb-4 mt-4 font-serif">Ayurvedic Doctor Consultation</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Get personalized treatment from certified Vaidyas. Pure, natural, and effective healing plans tailored just for you.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left Side: Benefits */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Why Consult Hindsole?</h2>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-emerald-100 hover:shadow-md transition-all group">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Stethoscope size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Certified Doctors</h3>
                        <p className="text-gray-500 text-sm mt-1">Experienced BAMS Vaidyas with 10+ years of clinical practice.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-emerald-100 hover:shadow-md transition-all group">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <ClipboardList size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">Personalized Plans</h3>
                        <p className="text-gray-500 text-sm mt-1">Customized diet charts, lifestyle changes, and herbal medicines.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-emerald-100 hover:shadow-md transition-all group">
                    <div className="bg-emerald-100 p-3 rounded-xl text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
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
                <h2 className="text-2xl font-black text-emerald-900 mb-6 flex items-center gap-2">
                    <Calendar className="text-emerald-600"/> Book Appointment
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Name & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                             <User className="absolute left-3 top-3.5 text-emerald-600" size={18}/>
                             <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium outline-emerald-500" placeholder="Name" />
                        </div>
                        <div className="relative">
                             <Phone className="absolute left-3 top-3.5 text-emerald-600" size={18}/>
                             <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium outline-emerald-500" placeholder="Phone" />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-emerald-600" size={18}/>
                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium outline-emerald-500" placeholder="Email Address" />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">DATE</label>
                            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">TIME</label>
                            <select required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium outline-emerald-500">
                                <option value="">Select Slot</option>
                                <option>Morning (10-1)</option>
                                <option>Afternoon (2-5)</option>
                                <option>Evening (6-9)</option>
                            </select>
                        </div>
                    </div>

                    {/* Mode */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">CONSULTATION MODE</label>
                        <div className="flex gap-3">
                            <label className={`flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.mode === 'Video Call' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="mode" value="Video Call" checked={formData.mode === 'Video Call'} onChange={() => setFormData({...formData, mode: 'Video Call'})} className="hidden"/>
                                <Video size={18}/> Video
                            </label>
                            <label className={`flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.mode === 'Phone Call' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="mode" value="Phone Call" checked={formData.mode === 'Phone Call'} onChange={() => setFormData({...formData, mode: 'Phone Call'})} className="hidden"/>
                                <Phone size={18}/> Audio
                            </label>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="relative">
                        <MessageCircle className="absolute left-3 top-3 text-emerald-600" size={18}/>
                        <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-medium outline-emerald-500 resize-none" placeholder="Describe your health concern..."></textarea>
                    </div>

                    <button disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};