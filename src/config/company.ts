/**
 * Central business/company info for trust, contact, and legal display.
 * Override via env: VITE_COMPANY_PHONE, VITE_COMPANY_EMAIL, VITE_COMPANY_GST, VITE_COMPANY_ADDRESS
 */
import { WHATSAPP_CONFIG } from '../config';

const PHONE = import.meta.env.VITE_COMPANY_PHONE ?? '+91-9111989053';
const EMAIL = import.meta.env.VITE_COMPANY_EMAIL ?? 'support@ayurvita.in';
const GST = import.meta.env.VITE_COMPANY_GST ?? '09AABCU9603R1ZM';
const ADDRESS = import.meta.env.VITE_COMPANY_ADDRESS ?? 'AyurVita, Ayurvedic Wellness Centre, Ahraura, Mirzapur, Uttar Pradesh, India – 231301';
const ESTABLISHED_YEAR = import.meta.env.VITE_COMPANY_YEAR ?? '2026';

export const COMPANY = {
  name: 'AyurVita',
  phone: PHONE,
  email: EMAIL,
  gst: GST,
  address: ADDRESS,
  whatsapp: WHATSAPP_CONFIG.number,
  establishedYear: ESTABLISHED_YEAR,
  certifications: ['GMP Certified', 'AYUSH Compliant', 'GST Registered'],
} as const;
