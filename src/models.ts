// ✅ Product Definition
export interface Product {
  id: string;
  name: string;
  price: number; // Price number hona chahiye
  description: string;
  category: string;
  image: string;
  benefits: string[];
}

// ✅ CartItem Definition (Ye missing tha!)
export interface CartItem extends Product {
  quantity: number;
}

// ✅ Blog Post Definition
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
}

export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: { seconds: number } | Date | any;
}