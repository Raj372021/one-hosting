import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Currency, ThemeMode, CartItem } from '../types';

interface AuthContextType {
  user: User | null;
  currency: Currency;
  theme: ThemeMode;
  cart: CartItem[];
  wishlist: string[];
  currentView: string;
  setCurrentView: (view: string) => void;
  setCurrency: (curr: Currency) => void;
  setTheme: (theme: ThemeMode) => void;
  login: (role?: 'user' | 'admin', email?: string) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (domain: string) => void;
  formatPrice: (amountINR: number) => string;
  topUpWallet: (amount: number) => void;
}

const DEFAULT_USER: User = {
  id: 'usr_1',
  name: 'Raj Sahani',
  email: 'rajsahani.RgcS@gmail.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  walletBalance: 2450,
  verified: true,
  twoFactorEnabled: true,
  createdAt: '2025-01-15T10:30:00Z',
  phone: '+91 98765 43210',
  gstin: '27AABCU9603R1ZM'
};

const ADMIN_USER: User = {
  id: 'usr_admin',
  name: 'Super Admin',
  email: 'admin@onehost.cloud',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  walletBalance: 50000,
  verified: true,
  twoFactorEnabled: true,
  createdAt: '2024-11-01T08:00:00Z',
  phone: '+91 90000 00000',
  gstin: '27ADMIN9603R1ZX'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['techventure.ai', 'cloudnode.io']);
  const [currentView, setCurrentView] = useState<string>('home'); // home, dashboard, admin, pricing, domains, hosting, deployments, billing, tickets

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const login = (role: 'user' | 'admin' = 'user', email?: string) => {
    if (role === 'admin') {
      setUser(ADMIN_USER);
      setCurrentView('admin');
    } else {
      const u = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: email ? email.split('@')[0].toUpperCase() : DEFAULT_USER.name
      };
      setUser(u);
      setCurrentView('dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (domain: string) => {
    setWishlist(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    );
  };

  const formatPrice = (amountINR: number) => {
    if (currency === 'USD') {
      const usd = (amountINR / 83.5).toFixed(2);
      return `$${usd}`;
    }
    return `₹${amountINR.toLocaleString('en-IN')}`;
  };

  const topUpWallet = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        walletBalance: user.walletBalance + amount
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currency,
        theme,
        cart,
        wishlist,
        currentView,
        setCurrentView,
        setCurrency,
        setTheme,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        formatPrice,
        topUpWallet
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
