import { useState } from 'react';
import toast from 'react-hot-toast';
import { WhatsAppIcon } from './WhatsAppFloat';
import { WHATSAPP_CONFIG } from '../config';
import type { CartItem } from '../types';

const GLOBAL_DISCOUNT = 0;

const REQUIRED_FIELDS = ['name', 'phone', 'address', 'pincode', 'city'] as const;
const VALIDATION_MESSAGE = 'कृपया सभी जरूरी जानकारी भरें';

interface FormState {
  name: string;
  phone: string;
  address: string;
  pincode: string;
  city: string;
}

interface CartWhatsAppFormProps {
  cart: CartItem[];
  cartTotal: number;
}

export const CartWhatsAppForm = ({ cart, cartTotal }: CartWhatsAppFormProps) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
  });
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setSuccess(false);
    };

  const isEmpty = (value: string) => !value || !value.trim();
  const invalidFields = REQUIRED_FIELDS.filter((f) => isEmpty(form[f]));
  const isInvalid = invalidFields.length > 0;

  const buildMessage = () => {
    const subtotal = cartTotal;
    const discount = GLOBAL_DISCOUNT;
    const total = subtotal - discount;

    const itemsBlock = cart
      .map((item) => {
        const lineTotal = item.price * item.quantity;
        return `- ${item.name} x ${item.quantity} = ₹${lineTotal}`;
      })
      .join('\n');

    return `*NEW ORDER - AyurVita Pharma*
-------------------

*Customer:*
${form.name.trim()}
${form.phone.trim()}

*Delivery Address:*
${form.address.trim()}
${form.pincode.trim()}, ${form.city.trim()}

*Items:*
${itemsBlock}

-------------------
*Total: ₹${total}*

Thank you | AyurVita - Authentic Ayurveda`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (isInvalid) {
      toast.error(VALIDATION_MESSAGE);
      return;
    }

    const message = buildMessage();
    const url = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSuccess(true);
    toast.success('WhatsApp खोला गया। ऑर्डर भेजकर पूरा करें।');
  };

  const inputClass = (field: keyof FormState) => {
    const base =
      'w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors';
    const invalid =
      touched && isEmpty(form[field])
        ? 'border-red-500 ring-2 ring-red-500'
        : 'border-gray-300';
    return `${base} ${invalid}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="wa-order-name" className="block text-sm font-medium text-gray-700 mb-1">
          नाम <span className="text-red-500">*</span>
        </label>
        <input
          id="wa-order-name"
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
        <label htmlFor="wa-order-phone" className="block text-sm font-medium text-gray-700 mb-1">
          फ़ोन <span className="text-red-500">*</span>
        </label>
        <input
          id="wa-order-phone"
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
        <label htmlFor="wa-order-address" className="block text-sm font-medium text-gray-700 mb-1">
          पता <span className="text-red-500">*</span>
        </label>
        <textarea
          id="wa-order-address"
          value={form.address}
          onChange={update('address')}
          className={inputClass('address')}
          required
          placeholder="पूरा पता"
          rows={2}
          autoComplete="street-address"
        />
      </div>

      <div>
        <label htmlFor="wa-order-pincode" className="block text-sm font-medium text-gray-700 mb-1">
          पिन कोड <span className="text-red-500">*</span>
        </label>
        <input
          id="wa-order-pincode"
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
        <label htmlFor="wa-order-city" className="block text-sm font-medium text-gray-700 mb-1">
          शहर <span className="text-red-500">*</span>
        </label>
        <input
          id="wa-order-city"
          type="text"
          value={form.city}
          onChange={update('city')}
          className={inputClass('city')}
          required
          placeholder="शहर"
          autoComplete="address-level2"
        />
      </div>

      {success && (
        <p className="text-sm text-green-600 font-medium" role="status">
          ऑर्डर लिंक खोला गया। व्हाट्सएप पर जाकर ऑर्डर पूरा करें।
        </p>
      )}

      <button
        type="submit"
        className="w-full py-4 bg-emerald-900 text-white rounded-xl font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-emerald-800 active:scale-[0.98] transition-all flex justify-center items-center gap-2 min-h-[52px] disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Place order via WhatsApp"
      >
        <WhatsAppIcon size={22} />
        ऑर्डर व्हाट्सएप पर भेजें
      </button>
    </form>
  );
};
