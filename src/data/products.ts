import type { Product } from '../types';

export const products: Product[] = [
  // 1. Arthovita Oil
  {
    id: 1,
    name: "Dr. Arthovita Oil",
    category: "Joint & Muscle Pain",
    form: "Oils & Balms",
    type: "Joint & Pain Relief Oil (50 ml)",
    price: 499,
    originalPrice: 650,
    rating: 4.9,
    reviews: 124,
    image: "/products/arthovita_oil_catalog.jpg",
    poster: "/products/arthovita_poster.jpg",
    description: "A therapeutic Ayurvedic oil for effective relief from joint pain, stiffness, and muscular discomfort.",
    benefits: ["Reduces joint pain & stiffness", "Relieves muscular spasm", "Improves mobility & flexibility"],
    indications: "Arthritis & rheumatism, Back pain, sprains & sports injuries, Muscular pain & stiffness",
    dosage: "Apply externally as directed"
  },

  // 2. Gasovita Syrup
  {
    id: 2,
    name: "Dr. Gasovita Syrup",
    category: "Digestive Health",
    form: "Syrups & Tonics",
    type: "Digestive Syrup (200 ml)",
    price: 180,
    originalPrice: 220,
    rating: 4.8,
    reviews: 98,
    image: "/products/gasovita_catalog.jpg",
    poster: "/products/gasovita_poster.jpg",
    description: "A digestive tonic made with traditional herbs that act as carminatives, improve digestion, and relieve nausea.",
    benefits: ["Improves appetite & digestion", "Relieves nausea, bloating & gas", "Reduces acidity & indigestion"],
    indications: "Indigestion & acidity, Bloating, flatulence, Loss of appetite",
    dosage: "5–10 ml, 2–3 times daily"
  },

  // 3. Gynevita Tonic
  {
    id: 3,
    name: "Dr. Gynevita Tonic",
    category: "Women's Wellness",
    form: "Syrups & Tonics",
    type: "Women's Health Tonic (200 ml)",
    price: 210,
    originalPrice: 299,
    rating: 4.9,
    reviews: 210,
    image: "/products/gynevita_catalog.jpg",
    poster: "/products/gynevita_poster.jpeg",
    description: "An Ayurvedic formulation enriched with powerful herbs for complete gynecological wellness. Supports hormonal balance and overall female health.",
    benefits: ["Regulates menstrual cycle", "Reduces leucorrhoea & menorrhagia", "Improves fertility & reproductive health", "Relieves weakness & fatigue"],
    indications: "Menstrual irregularities, Leucorrhoea, Amenorrhoea, Habitual abortion, General rundown conditions",
    dosage: "5–10 ml, 2–3 times daily or as directed"
  },

  // 4. Varunalka Syrup
  {
    id: 4,
    name: "Dr. Varunalka Syrup",
    category: "Urinary Care",
    form: "Syrups & Tonics",
    type: "Urinary Care Syrup (200 ml)",
    price: 195,
    originalPrice: 250,
    rating: 4.7,
    reviews: 64,
    image: "/products/varunalka_catalog.jpg",
    poster: "/products/varunalaka_poster.jpg",
    description: "A coolant for the urinary tract, providing relief from burning urination, cystitis, and recurrent UTIs.",
    benefits: ["Relieves painful urination", "Prevents recurrent infections", "Supports kidney & bladder health"],
    indications: "Burning micturition, Cystitis & UTIs, Blood in urine",
    dosage: "5–10 ml, 2–3 times daily"
  },

  // 5. Gasovita Powder
  {
    id: 5,
    name: "Dr. Gasovita Powder",
    category: "Digestive Health",
    form: "Powders",
    type: "Digestive Powder (100 g)",
    price: 140,
    originalPrice: 190,
    rating: 4.6,
    reviews: 85,
    image: "/products/gasovita_powder_catalog.jpg",
    poster: "/products/gasovitapowder_poster.jpg",
    description: "A traditional herbal formulation that reduces gas, bloating, and acidity while supporting overall digestion.",
    benefits: ["Relieves flatulence & indigestion", "Reduces acidity & heaviness", "Improves digestive strength"],
    indications: "Gas & acidity, Bloating & indigestion",
    dosage: "1–2 g or as directed"
  },

  // 6. Diabvita Powder
  {
    id: 6,
    name: "Dr. Diabvita Powder",
    category: "Diabetes Care",
    form: "Powders",
    type: "Diabetes Care Powder (100 g)",
    price: 380,
    originalPrice: 499,
    rating: 4.7,
    reviews: 110,
    image: "/products/diabvita_powder_catalog.jpg",
    poster: "/products/diabvita_poster.jpg",
    description: "A natural Ayurvedic powder that helps control blood sugar levels, boosts insulin function, and improves metabolism.",
    benefits: ["Regulates blood sugar naturally", "Enhances insulin secretion", "Improves digestion & metabolism", "Provides long-term glycemic support"],
    indications: "Diabetes management, High blood sugar, Weak metabolism",
    dosage: "As directed by physician"
  },

  // 7. Mayoplex Syrup
  {
    id: 7,
    name: "Dr. Mayoplex Syrup",
    category: "Joint & Muscle Pain",
    form: "Syrups & Tonics",
    type: "Musculoskeletal & Nerve Care (200 ml, 450 ml)",
    price: 350,
    originalPrice: 450,
    rating: 4.8,
    reviews: 85,
    image: "/products/mayoplex_catalog.jpg",
    poster: "/products/mayoplex_catalog.jpg",
    description: "A natural syrup for joint pain, arthritis, and muscular spasms, supporting bone and muscle strength.",
    benefits: ["Relieves joint & muscle pain", "Reduces inflammation & stiffness", "Improves mobility & flexibility"],
    indications: "Arthritis & spondylitis, Neuralgia & muscular spasm, Sports injuries & stiffness",
    dosage: "As directed by physician"
  },

  // 8. Arthovita Tablets
  {
    id: 8,
    name: "Dr. Arthovita Tablets",
    category: "Joint & Muscle Pain",
    form: "Tablets & Capsules",
    type: "Joint & Neuro Pain Tablets",
    price: 320,
    originalPrice: 400,
    rating: 4.8,
    reviews: 92,
    image: "/products/arthovita_tablets_catalog.jpg",
    poster: "/products/arthovita_poster.jpg",
    description: "Advanced Ayurvedic tablets for rheumatism, joints, and neuro-muscular pain. Reduces arthritis and supports bone strength.",
    benefits: ["Reduces arthritis & neuro-muscular pain", "Supports bone strength & flexibility", "Relieves stiffness & inflammation"],
    indications: "Rheumatism, Joints & Neuro Pain",
    dosage: "2 tablets twice daily with warm water or as directed"
  },

  // 9. Arthovedh
  {
    id: 9,
    name: "AyurVita Arthovedh",
    category: "Joint & Muscle Pain",
    form: "Tablets & Capsules",
    type: "Joint & Muscle Pain Relief Tablets",
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviews: 78,
    image: "/products/arthovedh_catalog.jpg",
    poster: "/products/arthovedh_catalog.jpg",
    description: "Ayurvedic formulation for rheumatism, joints, and muscle pain. Strengthens muscles and improves mobility.",
    benefits: ["Relieves joint pain, stiffness & swelling", "Effective in rheumatism, sciatica & gout", "Strengthens muscles & improves mobility"],
    indications: "Rheumatism, Joints & Muscle Pain",
    dosage: "As directed by physician"
  },

  // 10. Diabvita Tablets
  {
    id: 10,
    name: "Dr. Diabvita Tablets",
    category: "Diabetes Care",
    form: "Tablets & Capsules",
    type: "Diabetes Care Tablets",
    price: 495,
    originalPrice: 550,
    rating: 4.8,
    reviews: 120,
    image: "/products/diabvita_tablets_new.jpg",
    poster: "/products/diabvita_tablets_poster.jpg",
    description: "Daily tablets for maintaining healthy blood sugar levels naturally.",
    benefits: ["Regulates blood sugar", "Enhances insulin secretion", "Long-term glycemic support"],
    indications: "Diabetes, high blood sugar",
    dosage: "As directed by physician"
  },

  // 11. Stonevita Syrup (Kidney Stone)
  {
    id: 11,
    name: "Dr. Stonevita Syrup",
    category: "Urinary Care",
    form: "Syrups & Tonics",
    type: "Kidney Stone Relief (200 ml)",
    price: 240,
    originalPrice: 300,
    rating: 4.6,
    reviews: 55,
    image: "/products/stonevita_catalog.jpg",
    poster: "/products/varunalaka_poster.jpg",
    description: "Effective Ayurvedic syrup for dissolving kidney stones and preventing recurrence. Soothes urinary tract inflammation.",
    benefits: ["Helps dissolve kidney stones", "Relieves burning micturition", "Prevents UTI recurrence"],
    indications: "Renal calculi, UTI, Burning urination",
    dosage: "10 ml twice daily with water"
  },

  // 12. Livovita DS (Liver Care)
  {
    id: 12,
    name: "Dr. Livovita DS Tablet",
    category: "Digestion",
    form: "Tablets & Capsules",
    type: "Double Strength Liver Care",
    price: 380,
    originalPrice: 450,
    rating: 4.9,
    reviews: 142,
    image: "/products/livovita_catalog.jpg",
    poster: "/products/gasovita_poster.jpg",
    description: "Double strength liver protector. Regenerates liver cells and improves appetite and digestion.",
    benefits: ["Protects liver from toxins", "Improves appetite & digestion", "Useful in fatty liver"],
    indications: "Jaundice, Fatty Liver, Loss of Appetite",
    dosage: "1 tablet twice daily"
  },

  // 13. Pilovita Capsules (Piles Care)
  {
    id: 13,
    name: "Dr. Pilovita Capsules",
    category: "Digestion",
    form: "Tablets & Capsules",
    type: "Piles & Fissure Care",
    price: 499,
    originalPrice: 650,
    rating: 4.7,
    reviews: 89,
    image: "/products/pilovita_catalog.jpg",
    poster: "/products/digestive.jpg",
    description: "Herbal relief for piles and fissures. Reduces bleeding, pain, and inflammation naturally.",
    benefits: ["Stops rectal bleeding", "Relieves pain & itching", "Promotes smooth evacuation"],
    indications: "Piles, Fissures, Fistula",
    dosage: "1-2 capsules at bedtime"
  },

  // 14. Keshvita Hair Oil (Hair Care)
  {
    id: 14,
    name: "Dr. Keshvita Hair Oil",
    category: "Hair Care",
    form: "Oils & Balms",
    type: "Anti-Hairfall Oil (100 ml)",
    price: 350,
    originalPrice: 499,
    rating: 4.8,
    reviews: 320,
    image: "/products/keshvita_catalog.jpg",
    poster: "/products/arthovita_poster.jpg",
    description: "Enriched with Bhringraj and Amla. Reduces hair fall, promotes new growth, and prevents premature graying.",
    benefits: ["Controls hair fall", "Promotes hair regrowth", "Prevents dandruff & graying"],
    indications: "Hair fall, Dandruff, Alopecia",
    dosage: "Massage on scalp/hair at night"
  },

  // 15. Immunovita Chyawanprash (Immunity)
  {
    id: 15,
    name: "AyurVita Chyawanprash",
    category: "General Wellness",
    form: "Paste",
    type: "Immunity Booster (500 g)",
    price: 399,
    originalPrice: 450,
    rating: 4.9,
    reviews: 500,
    image: "/products/chyawanprash_catalog.jpg",
    poster: "/products/digestive.jpg",
    description: "Traditional formulation with 40+ herbs. Boosts immunity, energy, and respiratory health.",
    benefits: ["Boosts immunity", "Improves respiratory health", "Increases stamina"],
    indications: "Low immunity, seasonal cold/cough",
    dosage: "1 tsp daily with milk"
  },

  // 16. Kofvita Syrup (Cough Relief)
  {
    id: 16,
    name: "Dr. Kofvita Syrup",
    category: "Respiratory",
    form: "Syrups & Tonics",
    type: "Herbal Cough Syrup (100 ml)",
    price: 120,
    originalPrice: 150,
    rating: 4.7,
    reviews: 75,
    image: "/products/kofvita_catalog.jpg",
    poster: "/products/gasovita_poster.jpg",
    description: "Non-drowsy herbal formula for dry and wet cough. Soothes sore throat instantly.",
    benefits: ["Relieves dry & wet cough", "Soothes sore throat", "Non-drowsy formula"],
    indications: "Cough, Cold, Sore Throat",
    dosage: "10 ml thrice daily"
  },

  // 17. Stresscom Ashwagandha (Stress Relief)
  {
    id: 17,
    name: "AyurVita Ashwagandha",
    category: "Mental Wellness",
    form: "Tablets & Capsules",
    type: "Stress Relief Capsules",
    price: 450,
    originalPrice: 599,
    rating: 4.8,
    reviews: 110,
    image: "/products/ashwagandha_catalog.jpg",
    poster: "/products/arthovedh_catalog.jpg",
    description: "Pure Ashwagandha extract. Reduces stress, anxiety, and improves sleep quality.",
    benefits: ["Reduces stress & anxiety", "Improves sleep quality", "Boosts vitality"],
    indications: "Stress, Insomnia, Fatigue",
    dosage: "1 capsule twice daily"
  },

  // 18. Massvita Gainer (Weight Gain)
  {
    id: 18,
    name: "Dr. Massvita Granules",
    category: "General Wellness",
    form: "Powders",
    type: "Natural Weight Gainer (200 g)",
    price: 550,
    originalPrice: 750,
    rating: 4.5,
    reviews: 60,
    image: "/products/massvita_catalog.jpg",
    poster: "/products/diabvita_poster.jpg",
    description: "Herbal weight gainer for building muscle mass and strength naturally.",
    benefits: ["Healthy weight gain", "Builds muscle mass", "Improves appetite"],
    indications: "Underweight, Muscle weakness",
    dosage: "2 tsp with milk daily"
  }
];