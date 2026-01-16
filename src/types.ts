export interface Product {
  id: number;
  name: string;
  category: string;
  type: string;          
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  poster?: string;
  benefits: string[];    
  indications: string;   
  dosage: string;        
}