import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../types';
import { products as localData } from '../data/products';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export interface CartItem extends Product {
  quantity: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  cartTotal: number;
  clearCart: () => void;
  user: any; 
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [products] = useState<Product[]>(localData);
  
  // ✅ 1. Safe Cart Initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return [];

      const parsedCart = JSON.parse(savedCart);
      return parsedCart.filter((item: any) => typeof item.id === 'number');
    } catch (error) {
      console.warn("LocalStorage access denied or empty.");
      return [];
    }
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 2. Safe Storage Saving
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.warn("Could not save cart");
    }
  }, [cart]);

  // 🔥 FIX: Toast notifications removed to prevent double messages
  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existing = currentCart.find(item => item.id === product.id);
      if (existing) {
        return currentCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    // Note: Notification ab ProductCard component handle karega
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
    toast.error("Item removed");
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    setCart(currentCart => currentCart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => { 
    setCart([]); 
    // Clear cart par notification rehne diya hai kyunki ye user action hai
    // Agar wahan bhi double aa raha ho to ise bhi hata sakte hain
    // toast("Cart cleared", { icon: '🧹' }); 
  };
  
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <ShopContext.Provider value={{ 
      products, cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart, 
      user, setSearchQuery, searchQuery 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) throw new Error('useShop error');
  return context;
};