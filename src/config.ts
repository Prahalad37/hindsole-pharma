/**
 * Centralized app config. Override via env (e.g. VITE_WHATSAPP_NUMBER, VITE_SITE_URL, VITE_ADMIN_EMAILS).
 */
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '919119890537';
const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://ayurvita.in';

const ADMIN_EMAILS_RAW = import.meta.env.VITE_ADMIN_EMAILS ?? 'ppandtech8998@gmail.com';
export const ALLOWED_ADMIN_EMAILS: string[] = ADMIN_EMAILS_RAW
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const WHATSAPP_CONFIG = {
  number: WHATSAPP_NUMBER,
} as const;

export const SEO_CONFIG = {
  siteUrl: SITE_URL,
} as const;

/** Converts relative path to absolute URL for social crawlers. */
export const toAbsoluteUrl = (path: string): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`;
};
