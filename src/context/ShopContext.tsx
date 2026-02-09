import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product, CartItem } from '../types';
import { products as localData } from '../data/products';
import { auth, db } from '../firebase';
import { type User } from 'firebase/auth'; // Import User type
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export interface UserProfile {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  cartTotal: number;
  clearCart: () => void;
  user: User | null;
  userProfile: UserProfile | null;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
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
      return parsedCart.filter((item: Product) => typeof item.id === 'number');
    } catch {
      console.warn("LocalStorage access denied or empty.");
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 2. Safe Storage Saving (Local)
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {
      console.warn("Could not save cart");
    }
  }, [cart]);

  // ☁️ 3. Cloud Sync (Firestore - Cart & Profile)
  useEffect(() => {
    if (!user) {
      // Clear profile on logout
      if (userProfile) {
        setTimeout(() => setUserProfile(null), 0);
      }
      return;
    }

    // A. Sync Cart
    const unsubCart = onSnapshot(doc(db, 'carts', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCart(data.items || []);
      }
    });

    // B. Sync Profile
    const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data() as UserProfile);
      } else {
        // Init profile if not exists
        const initialProfile = {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || ''
        };
        setDoc(doc.ref, initialProfile, { merge: true });
        setUserProfile(initialProfile);
      }
    });

    return () => {
      unsubCart();
      unsubProfile();
    };
  }, [user, userProfile]);

  // B. Write Cart to Cloud on Change
  useEffect(() => {
    if (!user) return;

    // Debounce write to avoid rapid fires
    const timer = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'carts', user.uid), { items: cart }, { merge: true });
      } catch (err) {
        console.error("Cloud Sync Error:", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [cart, user]);

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      toast.success("Profile updated");
    } catch (error) {
      console.error("Profile Update Error", error);
      toast.error("Failed to update profile");
    }
  };

  // 🔥 FIX: Toast notifications removed to prevent double messages
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(currentCart => {
      const existing = currentCart.find(item => item.id === product.id);
      if (existing) {
        return currentCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...currentCart, { ...product, quantity }];
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
      user, userProfile, updateUserProfile, setSearchQuery, searchQuery
    }}>
      {children}
    </ShopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) throw new Error('useShop error');
  return context;
};