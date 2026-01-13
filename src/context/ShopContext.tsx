import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, CartItem } from '../models';
import { db, auth } from '../firebase'; // ✅ auth import kiya
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  cartTotal: number;
  clearCart: () => void;
  user: any; 
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null); // ✅ Null se initialize kiya

  // 🔐 Firebase User Listener: Isse Username sync hoga
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        toast.success(`Increased ${product.name} quantity!`);
    } else {
        toast.success(`${product.name} added to cart! 🛒`);
    }
    setCart(currentCart => {
      const existing = currentCart.find(item => item.id === product.id);
      if (existing) {
        return currentCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
    toast.error("Item removed");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    setCart(currentCart => currentCart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => { setCart([]); toast("Cart cleared", { icon: '🧹' }); };
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