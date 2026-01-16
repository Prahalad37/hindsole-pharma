import type { Product } from '../types';

export const products: Product[] = [
  // 1. Arthovita Oil
  {
    id: 1,
    name: "Dr. Arthovita Oil",
    category: "Pain Relief",
    type: "Joint & Pain Relief Oil (50 ml)",
    price: 499,
    originalPrice: 650,
    rating: 4.9,
    reviews: 124,
    image: "/products/arthovita.jpg", 
    poster: "/products/arthovita_poster.jpg", 
    description: "Instant relief from joint pain, arthritis, and muscle stiffness. Made with 15+ rare herbs.",
    benefits: ["Reduces pain & stiffness", "Relaxes muscles", "Reduces swelling", "Improves mobility"],
    indications: "Joint pain, stiffness, swelling",
    dosage: "Apply externally as directed"
  },
  
  // 2. Gasovita Syrup
  {
    id: 2,
    name: "Dr. Gasovita Syrup",
    category: "Digestion",
    type: "Digestive Syrup (200 ml)",
    price: 180,
    originalPrice: 220,
    rating: 4.8,
    reviews: 98,
    image: "/products/gasovita.jpg", 
    poster: "/products/gasovita_poster.jpg",
    description: "A complete ayurvedic digestive tonic. Relieves acidity, gas, and bloating instantly.",
    benefits: ["Improves digestion", "Reduces acidity & gas", "Relieves flatulence & indigestion"],
    indications: "Indigestion, gastritis, flatulence, bloating",
    dosage: "5–10 ml, 2–3 times daily or as directed"
  },

  // 3. Gynevita Tonic
  {
    id: 3,
    name: "Dr. Gynevita Tonic",
    category: "Women's Health",
    type: "Women’s Health Tonic (100 ml)",
    price: 210,
    originalPrice: 299,
    rating: 4.9,
    reviews: 210,
    image: "/products/gynevita.jpg",
    poster: "/products/gynevita_poster.jpeg",
    description: "Supports women's health naturally. Helps in menstrual cycles and vitality.",
    benefits: ["Regulates menstrual cycle", "Controls leucorrhoea", "Reduces cramps", "Improves vitality"],
    indications: "Leucorrhoea, dysmenorrhea, irregular menses",
    dosage: "5–10 ml, 2–3 times daily or as directed"
  },

  // 4. Varunalka Syrup
  {
    id: 4,
    name: "Dr. Varunalka Syrup",
    category: "Urinary Care",
    type: "Urinary Care Syrup (200 ml)",
    price: 195,
    originalPrice: 250,
    rating: 4.7,
    reviews: 64,
    image: "/products/varunalaka.jpg",
    poster: "/products/varunalaka_poster.jpg",
    description: "Effective for urinary tract infections (UTI) and kidney health support.",
    benefits: ["Good diuretic", "Useful in UTI", "Reduces burning urination", "Supports kidney & bladder health"],
    indications: "UTI, cystitis, burning micturition",
    dosage: "As directed by physician"
  },

  // 5. Gasovita Powder
  {
    id: 5,
    name: "Dr. Gasovita Powder",
    category: "Digestion",
    type: "Digestive Powder (100 g)",
    price: 140,
    originalPrice: 190,
    rating: 4.6,
    reviews: 85,
    image: "/products/gasovitapowder.jpg",
    poster: "/products/gasovita_poster.jpg",
    description: "Herbal powder for quick relief from heavy meals, gas, and stomach discomfort.",
    benefits: ["Relieves acidity", "Reduces gas & bloating", "Improves digestion & metabolism", "Relieves flatulence"],
    indications: "Acidity, indigestion, gas, bloating",
    dosage: "1–2 g or as directed"
  },

  // 6. Diabvita Powder
  {
    id: 6,
    name: "Dr. Diabvita Powder",
    category: "Diabetes Care",
    type: "Diabetes Care Powder (100 g)",
    price: 380,
    originalPrice: 499,
    rating: 4.7,
    reviews: 110,
    image: "/products/diavita.jpg",
    poster: "/products/diabvita_poster.jpg",
    description: "Natural sugar management powder. Helps regulate glucose levels effectively.",
    benefits: ["Regulates blood sugar", "Enhances insulin secretion", "Improves metabolism", "Long-term glycemic support"],
    indications: "Diabetes, high blood sugar",
    dosage: "As directed by physician"
  },

  // 7. Arthovita Tablets (Future ready)
  {
    id: 7,
    name: "Dr. Arthovita Tablets",
    category: "Pain Relief",
    type: "Pain Relief Tablets",
    price: 320,
    originalPrice: 400,
    rating: 4.8,
    reviews: 92,
    image: "/products/arthotab.jpg",
    poster: "/products/artotab_poster.jpeg",
    description: "Concentrated formula for joint pain relief in tablet form. Easy to carry and consume.",
    benefits: ["Relieves joint pain", "Reduces stiffness", "Improves mobility"],
    indications: "Joint pain, stiffness",
    dosage: "1–2 tablets twice a day after meal"
  },

  // 8. Diabvita Tablets (Future ready)
  {
    id: 8,
    name: "Dr. Diabvita Tablets",
    category: "Diabetes Care",
    type: "Diabetes Care Tablets",
    price: 450,
    originalPrice: 550,
    rating: 4.8,
    reviews: 120,
    image: "/products/diabvita_tabs.jpg",
    poster: "/products/diabvita_tabs_poster.jpg",
    description: "Daily tablets for maintaining healthy blood sugar levels naturally.",
    benefits: ["Regulates blood sugar", "Enhances insulin secretion", "Long-term glycemic support"],
    indications: "Diabetes, high blood sugar",
    dosage: "As directed by physician"
  }
];