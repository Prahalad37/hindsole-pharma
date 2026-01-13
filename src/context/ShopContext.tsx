import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

interface ShopContextType {
  cart: any[];
  addToCart: (product: any) => void;
  decreaseItem: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  cartTotal: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: any;
  login: () => void;
  logout: () => void;
  clearCart: () => void; // Naya function: Order ke baad cart saaf karne ke liye
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  // 1. CHANGE: Shuru mein LocalStorage check karo
  const [cart, setCart] = useState<any[]>(() => {
    const savedCart = localStorage.getItem("hindsole_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  // 2. CHANGE: Jab bhi Cart badle, use LocalStorage mein save kar do
  useEffect(() => {
    localStorage.setItem("hindsole_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    signOut(auth);
    alert("You have been logged out!");
  };

  const addToCart = (product: any) => {
    setCart(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const decreaseItem = (productId: number) => {
    setCart(current => {
      const existing = current.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return current.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return current.filter(item => item.id !== productId);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(current => current.filter(item => item.id !== productId));
  };

  // Naya Function: Order successful hone par ise call karenge
  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <ShopContext.Provider value={{ cart, addToCart, decreaseItem, removeFromCart, clearCart, cartTotal, searchQuery, setSearchQuery, user, login, logout }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) throw new Error('useShop must be used within a ShopProvider');
  return context;
};