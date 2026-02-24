import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import { WhatsAppIcon } from '../components/WhatsAppFloat';
import { WHATSAPP_CONFIG } from '../config';
import { PageFadeLayout } from '../components/PageFadeLayout';

const VALIDATION_MESSAGE = 'कृपया सभी जरूरी जानकारी भरें';

export const Order = () => {
  const { cart, cartTotal } = useShop();
  const navigate = useNavigate();
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    productInfo: '',
    extraQueries: '',
  });

  const update = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setSuccess(false);
    };

  const isEmpty = (v: string) => !v || !v.trim();
  const requiredOk =
    !isEmpty(form.name) &&
    !isEmpty(form.phone) &&
    !isEmpty(form.address) &&
    !isEmpty(form.pincode) &&
    !isEmpty(form.city);

  const buildMessage = () => {
    const itemsBlock =
      cart.length > 0
        ? cart
            .map((i) => `- ${i.name} x ${i.quantity} = ₹${i.price * i.quantity}`)
            .join('\n')
        : (form.productInfo && form.productInfo.trim()) || '- Product details not provided';

    const extraSection = form.extraQueries.trim()
      ? `\n*Extra Query:*\n${form.extraQueries.trim()}`
      : '';

    return `*NEW ORDER - AyurVita Pharma*
-------------------

*Customer:*
${form.name.trim()}
${form.phone.trim()}

*Delivery Address:*
${form.address.trim()}
${form.pincode.trim()}, ${form.city.trim()}

*Items:*
${itemsBlock}${extraSection}

-------------------
*Total: ₹${cartTotal || 0}*

Thank you | AyurVita - Authentic Ayurveda`;
  };

  const inputClass = (field: string) => {
    const base = 'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors';
    const invalid =
      touched && isEmpty(form[field as keyof typeof form])
        ? 'border-red-500 ring-2 ring-red-500'
        : 'border-gray-300';
    return `${base} ${invalid}`;
  };

  const canSubmit = requiredOk && (cart.length > 0 || !isEmpty(form.productInfo));

  const handleSubmitWithValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) {
      if (cart.length === 0 && isEmpty(form.productInfo)) {
        toast.error('कृपया cart में items जोड़ें या product details लिखें');
      } else {
        toast.error(VALIDATION_MESSAGE);
      }
      return;
    }
    const url = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank');
    setSuccess(true);
    toast.success('WhatsApp खोला गया। ऑर्डर भेजकर पूरा करें।');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-sm font-bold text-gray-800 tracking-wide uppercase">Order via WhatsApp</h1>
        <div className="w-11" />
      </div>

      <PageFadeLayout className="max-w-md mx-auto p-4 space-y-6">
        {cart.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-3">Items to Order ({cart.length})</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 py-2 border-b border-gray-100 last:border-0 text-sm">
                <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <span className="font-bold text-emerald-800">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-dashed flex justify-between font-bold text-emerald-800">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitWithValidation} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-800">Delivery Details</h3>

          <div>
            <label htmlFor="order-name" className="block text-xs font-bold text-gray-500 uppercase mb-1">नाम *</label>
            <input
              id="order-name"
              type="text"
              value={form.name}
              onChange={update('name')}
              className={inputClass('name')}
              required
              placeholder="आपका नाम"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="order-phone" className="block text-xs font-bold text-gray-500 uppercase mb-1">फ़ोन *</label>
            <input
              id="order-phone"
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              className={inputClass('phone')}
              required
              placeholder="10 अंक"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="order-address" className="block text-xs font-bold text-gray-500 uppercase mb-1">पता *</label>
            <textarea
              id="order-address"
              value={form.address}
              onChange={update('address')}
              className={inputClass('address')}
              required
              placeholder="पूरा पता"
              rows={2}
              autoComplete="street-address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="order-pincode" className="block text-xs font-bold text-gray-500 uppercase mb-1">पिन कोड *</label>
              <input
                id="order-pincode"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.pincode}
                onChange={update('pincode')}
                className={inputClass('pincode')}
                required
                placeholder="6 अंक"
                autoComplete="postal-code"
              />
            </div>
            <div>
              <label htmlFor="order-city" className="block text-xs font-bold text-gray-500 uppercase mb-1">शहर *</label>
              <input
                id="order-city"
                type="text"
                value={form.city}
                onChange={update('city')}
                className={inputClass('city')}
                required
                placeholder="शहर"
                autoComplete="address-level2"
              />
            </div>
          </div>

          {cart.length === 0 && (
            <div>
              <label htmlFor="order-product" className="block text-xs font-bold text-gray-500 uppercase mb-1">Product / Items</label>
              <textarea
                id="order-product"
                value={form.productInfo}
                onChange={update('productInfo')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="बताएं क्या चाहिए (उत्पाद का नाम, मात्रा)"
                rows={3}
              />
            </div>
          )}

          <div>
            <label htmlFor="order-queries" className="block text-xs font-bold text-gray-500 uppercase mb-1">अतिरिक्त प्रश्न / Extra Queries</label>
            <textarea
              id="order-queries"
              value={form.extraQueries}
              onChange={update('extraQueries')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="कोई सवाल, special request, या नोट"
              rows={3}
            />
          </div>

          {success && (
            <p className="text-sm text-green-600 font-medium" role="status">
              ऑर्डर लिंक खोला गया। व्हाट्सएप पर जाकर ऑर्डर पूरा करें।
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-emerald-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2 min-h-[52px]"
            aria-label="Send order to WhatsApp"
          >
            <WhatsAppIcon size={22} />
            Send to AyurVita on WhatsApp
          </button>
          <p className="text-xs text-center text-gray-500 font-medium">Safe, Discreet & Easy | 100% Authentic Ayurvedic Products</p>
        </form>
      </PageFadeLayout>
    </div>
  );
};
