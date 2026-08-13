import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Currency, ThemeMode, CartItem, UserSubscription, N8nWorkflow, UserBankDetails, PayoutRequest, ReferralSale } from '../types';

interface AuthContextType {
  user: User | null;
  currency: Currency;
  theme: ThemeMode;
  cart: CartItem[];
  wishlist: string[];
  currentView: string;
  payoutRequests: PayoutRequest[];
  referralSales: ReferralSale[];
  setCurrentView: (view: string) => void;
  setCurrency: (curr: Currency) => void;
  setTheme: (theme: ThemeMode) => void;
  login: (role?: 'user' | 'admin', email?: string) => void;
  loginWithDetails: (email: string, name?: string, phone?: string, role?: 'user' | 'admin') => void;
  updateProfile: (updated: Partial<User>) => void;
  resetUserPassword: (phoneOrEmail: string, newPass: string) => boolean;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (domain: string) => void;
  formatPrice: (amountINR: number) => string;
  topUpWallet: (amount: number) => void;
  addAiCredits: (credits: number, planName?: string, price?: number) => void;
  deductAiCredits: (credits: number) => boolean;
  activateSubscription: (sub: Omit<UserSubscription, 'id' | 'activatedAt' | 'renewAt' | 'status'>) => void;
  addN8nWorkflow: (wf: Omit<N8nWorkflow, 'id' | 'executionsCount'>) => void;
  toggleN8nWorkflow: (id: string) => void;
  checkoutCartAndActivatePlans: () => void;
  saveBankDetails: (details: UserBankDetails) => void;
  requestPayout: (rewardTier: string, amount: number, invitesMilestone: number) => boolean;
  updatePayoutStatus: (payoutId: string, status: 'APPROVED' | 'REJECTED') => void;
  recordReferralSale: (planName: string, amount: number) => void;
}

const DEFAULT_USER: User = {
  id: 'usr_1',
  name: 'Raj Sahani',
  email: 'rajsahani.RgcS@gmail.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  walletBalance: 2450,
  aiCredits: 2500,
  verified: true,
  twoFactorEnabled: true,
  createdAt: '2025-01-15T10:30:00Z',
  phone: '+91 98765 43210',
  gstin: '27AABCU9603R1ZM',
  referralCode: 'RAJ500',
  invitedCount: 520,
  referralEarnings: 1000,
  bankDetails: {
    accountName: 'Raj Sahani',
    bankName: 'HDFC Bank',
    accountNumber: '5010023948123',
    ifsc: 'HDFC0001234',
    upiId: 'rajsahani@upi',
    phone: '+91 98765 43210'
  },
  subscriptions: [
    {
      id: 'sub_n8n_pro',
      title: 'n8n Pro Automation Cloud',
      category: 'n8n',
      planName: 'n8n Pro Automation',
      status: 'ACTIVE',
      monthlyPrice: 499,
      billingCycle: 'monthly',
      activatedAt: '2026-02-01',
      renewAt: '2026-03-01',
      instanceUrl: 'https://n8n-raj.onehost.cloud',
      webhookUrl: 'https://n8n-raj.onehost.cloud/webhook/v1',
      apiKey: 'n8n_sec_key_a882910f',
      details: 'Active Managed n8n Automation Engine with 100k Executions/mo'
    },
    {
      id: 'sub_host_pro',
      title: 'Business Pro Hosting (techventure.in)',
      category: 'hosting',
      planName: 'Business Pro Hosting',
      status: 'ACTIVE',
      monthlyPrice: 199,
      billingCycle: 'yearly',
      activatedAt: '2026-01-10',
      renewAt: '2027-01-10',
      serverIp: '185.199.108.153',
      details: '200 GB NVMe Storage, Free SSL & 50 Mailboxes'
    }
  ],
  n8nWorkflows: [
    {
      id: 'wf_1',
      name: 'WhatsApp AI Lead Auto-Responder',
      description: 'Auto-reply to incoming WhatsApp inquiries with Gemini AI 2.5',
      category: 'whatsapp',
      active: true,
      triggerType: 'webhook',
      executionsCount: 1420,
      lastExecutionAt: '2 mins ago',
      webhookUrl: 'https://n8n-raj.onehost.cloud/webhook/whatsapp-bot-v1',
      nodesCount: 5
    },
    {
      id: 'wf_2',
      name: 'Lead Auto-Capture & Google Sheets Sync',
      description: 'Capture web form leads and save directly to Google Sheets',
      category: 'crm',
      active: true,
      triggerType: 'webhook',
      executionsCount: 890,
      lastExecutionAt: '15 mins ago',
      webhookUrl: 'https://n8n-raj.onehost.cloud/webhook/leads-sync',
      nodesCount: 4
    }
  ]
};

const ADMIN_USER: User = {
  id: 'usr_admin',
  name: 'Super Admin',
  email: 'admin@onehost.cloud',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  walletBalance: 50000,
  aiCredits: 10000,
  verified: true,
  twoFactorEnabled: true,
  createdAt: '2024-11-01T08:00:00Z',
  phone: '+91 90000 00000',
  gstin: '27ADMIN9603R1ZX',
  subscriptions: [],
  n8nWorkflows: []
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['techventure.ai', 'cloudnode.io']);
  const [currentView, setCurrentView] = useState<string>('home'); // home, dashboard, admin, pricing, domains, hosting, deployments, billing, tickets, n8n
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([
    {
      id: 'po_101',
      userId: 'usr_1',
      userName: 'Raj Sahani',
      userEmail: 'rajsahani.RgcS@gmail.com',
      amount: 1000,
      rewardTier: '500 Invites Milestone Reward',
      invitesMilestone: 500,
      status: 'PENDING',
      requestedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      bankDetails: {
        accountName: 'Raj Sahani',
        bankName: 'HDFC Bank',
        accountNumber: '5010023948123',
        ifsc: 'HDFC0001234',
        upiId: 'rajsahani@upi',
        phone: '+91 98765 43210'
      }
    }
  ]);

  const [referralSales, setReferralSales] = useState<ReferralSale[]>([
    {
      id: 'sale_8901',
      referrerCode: 'RAJ500',
      referrerName: 'Raj Sahani',
      referredCustomerName: 'Aman Sharma',
      referredCustomerEmail: 'aman.dev@gmail.com',
      planName: 'Starter Pack 1,000 AI Credits (₹499 Plan)',
      amount: 499,
      purchasedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'QUALIFIED_PLAN_PURCHASE'
    },
    {
      id: 'sale_8902',
      referrerCode: 'RAJ500',
      referrerName: 'Raj Sahani',
      referredCustomerName: 'Priya Verma',
      referredCustomerEmail: 'priya.v@techstudio.in',
      planName: 'Business Pro Hosting Plan (₹199/mo)',
      amount: 2388,
      purchasedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      status: 'QUALIFIED_PLAN_PURCHASE'
    },
    {
      id: 'sale_8903',
      referrerCode: 'RAJ500',
      referrerName: 'Raj Sahani',
      referredCustomerName: 'Vikram Mehta',
      referredCustomerEmail: 'vikram@mehtalabs.io',
      planName: 'n8n Pro Automation Cloud Plan',
      amount: 499,
      purchasedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      status: 'QUALIFIED_PLAN_PURCHASE'
    }
  ]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Capture referral code from URL search parameter (?ref=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        sessionStorage.setItem('onehost_referrer', ref);
      }
    }
  }, []);

  const recordReferralSale = (planName: string, amount: number) => {
    const refCode = sessionStorage.getItem('onehost_referrer') || user?.referralCode || 'RAJ500';
    const newSale: ReferralSale = {
      id: `sale_${Date.now()}`,
      referrerCode: refCode,
      referrerName: 'Raj Sahani',
      referredCustomerName: user?.name || 'Referred Customer',
      referredCustomerEmail: user?.email || 'customer@gmail.com',
      planName: planName,
      amount: amount,
      purchasedAt: new Date().toISOString(),
      status: 'QUALIFIED_PLAN_PURCHASE'
    };

    setReferralSales(prev => [newSale, ...prev]);

    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        invitedCount: (prev.invitedCount || 0) + 1,
        referralSales: [newSale, ...(prev.referralSales || [])]
      };
    });
  };

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

  const loginWithDetails = (email: string, name?: string, phone?: string, role: 'user' | 'admin' = 'user') => {
    if (role === 'admin') {
      setUser({
        ...ADMIN_USER,
        email: email || ADMIN_USER.email,
        name: name || ADMIN_USER.name,
        phone: phone || ADMIN_USER.phone
      });
      setCurrentView('admin');
    } else {
      const u: User = {
        ...DEFAULT_USER,
        id: `usr_${Date.now()}`,
        email: email,
        name: name || email.split('@')[0],
        phone: phone || '+91 98765 43210',
        createdAt: new Date().toISOString()
      };
      setUser(u);
      setCurrentView('dashboard');
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updated
      };
    });
  };

  const resetUserPassword = (phoneOrEmail: string, newPass: string): boolean => {
    if (user && (user.email.toLowerCase() === phoneOrEmail.toLowerCase() || (user.phone && user.phone.includes(phoneOrEmail)))) {
      // Password updated for current user session
      return true;
    }
    return true;
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

  const addAiCredits = (credits: number, planName = 'Starter 1,000 AI Credits Pack', price = 499) => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        aiCredits: (prev.aiCredits || 0) + credits
      } : null);
      recordReferralSale(planName, price);
    }
  };

  const deductAiCredits = (credits: number): boolean => {
    if (!user) return false;
    const current = user.aiCredits || 0;
    if (current < credits) return false;
    setUser({
      ...user,
      aiCredits: current - credits
    });
    return true;
  };

  const activateSubscription = (sub: Omit<UserSubscription, 'id' | 'activatedAt' | 'renewAt' | 'status'>) => {
    if (!user) return;
    const newSub: UserSubscription = {
      ...sub,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      status: 'ACTIVE',
      activatedAt: new Date().toISOString().split('T')[0],
      renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setUser(prev => {
      if (!prev) return null;
      const existing = prev.subscriptions || [];
      return {
        ...prev,
        subscriptions: [newSub, ...existing]
      };
    });

    recordReferralSale(sub.planName, sub.monthlyPrice);
  };

  const addN8nWorkflow = (wf: Omit<N8nWorkflow, 'id' | 'executionsCount'>) => {
    if (!user) return;
    const newWf: N8nWorkflow = {
      ...wf,
      id: `wf_${Date.now()}`,
      executionsCount: 0
    };

    setUser(prev => {
      if (!prev) return null;
      const existing = prev.n8nWorkflows || [];
      return {
        ...prev,
        n8nWorkflows: [newWf, ...existing]
      };
    });
  };

  const toggleN8nWorkflow = (id: string) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        n8nWorkflows: (prev.n8nWorkflows || []).map(w =>
          w.id === id ? { ...w, active: !w.active } : w
        )
      };
    });
  };

  const checkoutCartAndActivatePlans = () => {
    if (!user || cart.length === 0) return;

    cart.forEach(item => {
      const isN8n = item.title.toLowerCase().includes('n8n');
      const isVps = item.title.toLowerCase().includes('vps');

      const sub: Omit<UserSubscription, 'id' | 'activatedAt' | 'renewAt' | 'status'> = {
        title: item.title,
        category: isN8n ? 'n8n' : isVps ? 'vps' : item.type === 'domain' ? 'domain' : 'hosting',
        planName: item.title,
        monthlyPrice: item.price,
        billingCycle: item.billingCycle,
        instanceUrl: isN8n ? `https://n8n-${user.id}.onehost.cloud` : `https://${item.domainName || 'app'}.onehost.cloud`,
        webhookUrl: isN8n ? `https://n8n-${user.id}.onehost.cloud/webhook/v1` : undefined,
        serverIp: '185.199.108.153',
        details: item.details || item.subtitle || 'Active Plan with 24/7 Uptime & Instant SSL'
      };

      activateSubscription(sub);
    });

    clearCart();
  };

  const saveBankDetails = (details: UserBankDetails) => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        bankDetails: details
      } : null);
    }
  };

  const requestPayout = (rewardTier: string, amount: number, invitesMilestone: number): boolean => {
    if (!user || !user.bankDetails) return false;
    const newReq: PayoutRequest = {
      id: `po_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount,
      rewardTier,
      invitesMilestone,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      bankDetails: user.bankDetails
    };

    setPayoutRequests(prev => [newReq, ...prev]);
    setUser(prev => prev ? {
      ...prev,
      payoutRequests: [newReq, ...(prev.payoutRequests || [])]
    } : null);
    return true;
  };

  const updatePayoutStatus = (payoutId: string, status: 'APPROVED' | 'REJECTED') => {
    setPayoutRequests(prev => prev.map(p => p.id === payoutId ? { ...p, status, processedAt: new Date().toISOString() } : p));
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        payoutRequests: (prev.payoutRequests || []).map(p => p.id === payoutId ? { ...p, status, processedAt: new Date().toISOString() } : p)
      };
    });
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
        payoutRequests,
        referralSales,
        setCurrentView,
        setCurrency,
        setTheme,
        login,
        loginWithDetails,
        updateProfile,
        resetUserPassword,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        formatPrice,
        topUpWallet,
        addAiCredits,
        deductAiCredits,
        activateSubscription,
        addN8nWorkflow,
        toggleN8nWorkflow,
        checkoutCartAndActivatePlans,
        saveBankDetails,
        requestPayout,
        updatePayoutStatus,
        recordReferralSale
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
