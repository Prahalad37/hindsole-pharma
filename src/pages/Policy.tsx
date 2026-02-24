import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Truck, HelpCircle, Mail, FileText, Lock, ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { COMPANY } from '../config/company';

import type { ReactNode } from 'react';

interface PolicySection {
  heading: string;
  text: string;
}

interface PolicyContent {
  title: string;
  icon: ReactNode;
  description: string;
  sections: PolicySection[];
}

const FAQ_ITEMS = [
  { q: "Are your products 100% Ayurvedic and natural?", a: "Yes. All AyurVita products are formulated using traditional Ayurvedic recipes with 100% natural ingredients. We do not use artificial preservatives, colours, or chemicals." },
  { q: "Do I need a prescription to buy your products?", a: "No prescription is required for most of our products. However, we strongly recommend consulting with an Ayurvedic practitioner or using our FREE Consultation service before starting any new health regimen." },
  { q: "How long does delivery take?", a: "We ship all orders within 24–48 hours. Standard delivery takes 3–5 business days across India. Metro cities typically receive orders within 2–3 business days." },
  { q: "What are the shipping charges?", a: "Shipping is FREE on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 applies." },
  { q: "Can I return or exchange a product?", a: `Yes, you can return unopened and unused products within 7 days of delivery. Please contact our support team at ${COMPANY.email} to initiate a return.` },
  { q: "How do I track my order?", a: "Once your order is dispatched, you will receive a tracking link via SMS and email. You can also track your order from the 'My Orders' section after logging in." },
  { q: "Do you ship internationally?", a: "Currently, we only ship within India. We are working on expanding to international markets soon." },
  { q: "What payment methods do you accept?", a: "We accept UPI (GPay, PhonePe, Paytm), and Cash on Delivery (COD). All online payments are secured with industry-standard encryption." },
  { q: "How should I store Ayurvedic products?", a: "Store products in a cool, dry place away from direct sunlight. Keep syrups and tonics tightly sealed after opening. Always check the expiry date before use." },
  { q: "Are your products safe during pregnancy?", a: "Some products may not be suitable during pregnancy or breastfeeding. Please consult your healthcare provider or use our FREE Consultation service before taking any product." },
  { q: "Can I take multiple AyurVita products together?", a: "Yes, most of our products are compatible. However, for personalised advice on combining products, please consult our Ayurvedic experts through our FREE Consultation service." },
  { q: "What is your refund timeline?", a: "Refunds are processed within 5–7 business days after we receive the returned product. The amount is credited back to your original payment method." },
];

export const Policy = () => {
  const { type } = useParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const content: Record<string, PolicyContent> = {
    shipping: {
      title: "Shipping Policy",
      icon: <Truck size={40} className="text-emerald-600" />,
      description: "We are committed to delivering your Ayurvedic wellness products safely and promptly across India.",
      sections: [
        { heading: "Processing Time", text: "All orders are processed and dispatched within 24–48 hours of order confirmation (excluding Sundays and public holidays). You will receive a confirmation email with tracking details once your order is shipped." },
        { heading: "Delivery Timeline", text: "Standard delivery takes 3–5 business days depending on your location. Metro cities (Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune) typically receive orders within 2–3 business days. Remote and rural areas may take up to 7 business days." },
        { heading: "Shipping Charges", text: "FREE shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 is applicable. Cash on Delivery (COD) is available at no extra charge." },
        { heading: "Packaging", text: "All products are packed in eco-friendly, tamper-proof packaging to ensure they reach you in perfect condition. Fragile items like glass bottles are given extra protective wrapping." },
        { heading: "Order Tracking", text: "Once your order is dispatched, you will receive a tracking link via SMS and email. You can also track your order status by logging into your account and visiting the 'My Orders' section." },
        { heading: "Delivery Partners", text: "We partner with trusted logistics providers including Delhivery, BlueDart, and India Post to ensure reliable and timely deliveries across India." },
      ]
    },
    returns: {
      title: "Returns & Refunds",
      icon: <ShieldCheck size={40} className="text-emerald-600" />,
      description: "Your satisfaction is our priority. If you are not happy with your purchase, we are here to help.",
      sections: [
        { heading: "Return Eligibility", text: "Products can be returned within 7 days of delivery. The product must be unused, unopened, and in its original packaging. Opened or used products cannot be returned due to hygiene and safety reasons." },
        { heading: "How to Initiate a Return", text: `Email us at ${COMPANY.email} with your order number, product name, and reason for return. Our team will respond within 24 hours with return instructions and a pickup schedule.` },
        { heading: "Refund Process", text: "Once we receive and inspect the returned product, your refund will be processed within 5–7 business days. The amount will be credited back to your original payment method (UPI or bank account)." },
        { heading: "Damaged or Defective Products", text: "If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the damage. We will arrange a free replacement or full refund immediately." },
        { heading: "Non-Returnable Items", text: "Opened or used products, products with broken seals, and items purchased during clearance sales are not eligible for return. Gift cards and consultation fees are also non-refundable." },
        { heading: "COD Refunds", text: "For Cash on Delivery orders, refunds will be processed via bank transfer. Please provide your bank account details (account number, IFSC code) when initiating the return." },
      ]
    },
    contact: {
      title: "Contact Us",
      icon: <Mail size={40} className="text-emerald-600" />,
      description: "We would love to hear from you. Reach out to us through any of the following channels.",
      sections: [
        { heading: "Customer Support", text: `Email: ${COMPANY.email}\nPhone: ${COMPANY.phone}\nAvailability: Monday to Saturday, 10:00 AM – 6:00 PM IST` },
        { heading: "WhatsApp Support", text: `For quick queries and order updates, message us on WhatsApp at ${COMPANY.phone}. Our team typically responds within 30 minutes during business hours.` },
        { heading: "Registered Office", text: `${COMPANY.address}\nGSTIN: ${COMPANY.gst}` },
        { heading: "Business Enquiries", text: "For partnership, bulk orders, or contract manufacturing enquiries, please email us at business@ayurvita.in with your requirements." },
        { heading: "Feedback & Suggestions", text: "Your feedback helps us improve. Share your experience or suggestions at feedback@ayurvita.in. We read every message and continuously strive to serve you better." },
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      icon: <HelpCircle size={40} className="text-emerald-600" />,
      description: "Find quick answers to the most common questions about our products, orders, and services.",
      sections: []
    },
    terms: {
      title: "Terms & Conditions",
      icon: <FileText size={40} className="text-emerald-600" />,
      description: "Please read these terms carefully before using our website or purchasing our products.",
      sections: [
        { heading: "Acceptance of Terms", text: "By accessing and using the AyurVita website (ayurvita.in), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services." },
        { heading: "Products & Pricing", text: "All products listed on our website are Ayurvedic formulations and are not intended to diagnose, treat, cure, or prevent any disease. Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We reserve the right to modify prices without prior notice." },
        { heading: "Orders & Payment", text: "By placing an order, you confirm that all information provided is accurate. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity. Payment must be completed via UPI or Cash on Delivery." },
        { heading: "Intellectual Property", text: "All content on this website — including text, images, logos, product names, and formulations — is the property of AyurVita and is protected by Indian copyright and trademark laws. Unauthorised use or reproduction is strictly prohibited." },
        { heading: "Limitation of Liability", text: "AyurVita shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the product in question." },
        { heading: "User Responsibilities", text: "You agree to use our website only for lawful purposes. You shall not post misleading reviews, misuse discount codes, or attempt to access restricted areas of our systems. Any violation may result in account suspension." },
        { heading: "Governing Law", text: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India." },
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: <Lock size={40} className="text-emerald-600" />,
      description: "We value your privacy and are committed to protecting your personal information.",
      sections: [
        { heading: "Information We Collect", text: "We collect personal information that you voluntarily provide, including your name, email address, phone number, shipping address, and payment details. We also collect device information, IP address, and browsing behaviour through cookies for analytics purposes." },
        { heading: "How We Use Your Information", text: "Your information is used to process orders, provide customer support, send order updates and promotional communications (with your consent), improve our website and services, and prevent fraud." },
        { heading: "Data Protection", text: "We implement industry-standard security measures including SSL encryption, secure payment gateways, and access controls to protect your personal data. Your payment information is never stored on our servers." },
        { heading: "Third-Party Sharing", text: "We do not sell your personal information. We share data only with trusted partners necessary for order fulfilment — including logistics providers (for delivery) and payment processors (for transactions). All partners are bound by confidentiality agreements." },
        { heading: "Cookies", text: "Our website uses cookies to enhance your browsing experience, remember your preferences, and analyse website traffic. You can manage cookie preferences through your browser settings. Disabling cookies may affect some website functionality." },
        { heading: "Your Rights", text: `You have the right to access, correct, or delete your personal information at any time. To exercise these rights, email us at ${COMPANY.email}. We will respond within 30 days.` },
        { heading: "Data Retention", text: "We retain your personal information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes. Order records are retained for 5 years for tax and legal purposes." },
        { heading: "Updates to This Policy", text: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of our website after changes constitutes acceptance." },
      ]
    },
  };

  const data = content[type || 'contact'] || content['contact'];
  const isFaq = type === 'faq';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6">
      <SEO title={data.title} description={data.description} />

      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors mb-6 sm:mb-8 min-h-[44px]">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-50 to-white px-6 py-8 sm:px-10 sm:py-10 text-center border-b border-emerald-100">
            <div className="bg-emerald-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-5">
              {data.icon}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-900 mb-3">{data.title}</h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-lg mx-auto leading-relaxed">{data.description}</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {isFaq ? (
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                        isOpen
                          ? 'border-emerald-200 bg-emerald-50/50 shadow-md shadow-emerald-100/50'
                          : 'border-gray-100 bg-white hover:border-emerald-100 hover:shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-start gap-4 text-left px-4 py-4 sm:px-5 sm:py-5 min-h-[56px] transition-colors"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className={`flex-1 font-semibold pr-2 text-sm sm:text-base leading-snug ${isOpen ? 'text-emerald-900' : 'text-gray-800'}`}>
                          {item.q}
                        </span>
                        <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                          <ChevronDown size={18} strokeWidth={2.5} />
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 -mt-2 pl-12 sm:pl-[4.75rem]">
                              <div className="flex gap-3">
                                <MessageCircle size={18} className="text-emerald-400 shrink-0 mt-0.5 hidden sm:block" />
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.a}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-8">
                {data.sections.map((section, idx) => (
                  <div key={idx}>
                    <h2 className="text-base sm:text-lg font-bold text-emerald-900 mb-2">{section.heading}</h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">{section.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-5 sm:px-10 sm:py-6 border-t border-gray-100 text-center">
            <p className="text-xs sm:text-sm text-gray-400">Last updated: February 2026 | AyurVita</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
