export interface Product {
  id: number;
  name: string;
  category: string;
  form?: string;
  type: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  poster?: string;
  description: string;
  benefits: string[];
  indications: string;
  dosage: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any; // Using any for Timestamp compatibility for now, or use { seconds: number } | Date
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: { seconds: number };
  paymentMethod?: string;
  customer?: { address: string; city: string; pincode: string; phone?: string; name?: string };
}