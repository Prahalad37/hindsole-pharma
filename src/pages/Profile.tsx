import { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { User, Mail, Phone, MapPin, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Profile = () => {
    const { user, userProfile, updateUserProfile } = useShop();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        if (userProfile && (formData.name === '' || userProfile.uid !== user?.uid)) {
            // Only populate if form is empty or user switched, to avoid overwriting user edits while typing if logic was different
            // Actually simplest fix for the lint: just disable the warning or check condition
            setFormData({
                name: userProfile.name || '',
                email: userProfile.email || user?.email || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                city: userProfile.city || '',
                state: userProfile.state || '',
                pincode: userProfile.pincode || ''
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProfile, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await updateUserProfile(formData);
        setLoading(false);
    };

    if (!user) return <div className="p-10 text-center">Please login to view profile</div>;

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 animate-in fade-in">
            <div className="max-w-2xl mx-auto">

                <Link to="/" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-bold mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-emerald-100">

                    {/* Header */}
                    <div className="bg-emerald-900 text-white p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full translate-x-1/3 -translate-y-1/3 opacity-50 blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-20 h-20 bg-emerald-700 rounded-2xl flex items-center justify-center border-2 border-emerald-500 shadow-inner">
                                <User size={40} className="text-emerald-200" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black font-serif mb-1">{userProfile?.name || 'User Profile'}</h1>
                                <p className="text-emerald-300 flex items-center gap-2 text-sm"><Mail size={14} /> {user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

                        {/* Personal Info */}
                        <div>
                            <h3 className="text-emerald-900 font-bold text-lg mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <User size={18} className="text-emerald-600" /> Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Name</label>
                                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800" placeholder='Your Name' />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Phone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800" placeholder='+91 98765 43210' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h3 className="text-emerald-900 font-bold text-lg mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                <MapPin size={18} className="text-emerald-600" /> Shipping Address
                            </h3>
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800" placeholder='House No, Street, Landmark...' />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">City</label>
                                        <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800" placeholder='City' />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">State</label>
                                        <input name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800" placeholder='State' />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Pincode</label>
                                        <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800" placeholder='000000' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};
