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
      if (!Array.isArray(parsedCart)) return [];
      return parsedCart.filter((item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as CartItem).id === 'number' &&
        typeof (item as CartItem).quantity === 'number' &&
        (item as CartItem).quantity >= 1
      );
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

  const isWritingCart = { current: false };

  useEffect(() => {
    if (!user) {
      if (userProfile) {
        setTimeout(() => setUserProfile(null), 0);
      }
      return;
    }

    const unsubCart = onSnapshot(
      doc(db, 'carts', user.uid),
      (snapshot) => {
        if (snapshot.exists() && !isWritingCart.current) {
          const data = snapshot.data();
          if (data.items && data.items.length > 0) {
            setCart(data.items);
          }
        }
      },
      (err) => console.warn("Cart sync error:", err)
    );

    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.data() as UserProfile);
        } else {
          const initialProfile = {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || ''
          };
          setDoc(snapshot.ref, initialProfile, { merge: true }).catch(() => {});
          setUserProfile(initialProfile);
        }
      },
      (err) => console.warn("Profile sync error:", err)
    );

    return () => {
      unsubCart();
      unsubProfile();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) return;

    isWritingCart.current = true;
    const timer = setTimeout(async () => {
      try {
        await setDoc(doc(db, 'carts', user.uid), { items: cart }, { merge: true });
      } catch (err) {
        console.warn("Cart write error:", err);
      } finally {
        isWritingCart.current = false;
      }
    }, 1500);

    return () => { clearTimeout(timer); isWritingCart.current = false; };
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