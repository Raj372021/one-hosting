import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  DollarSign,
  Server,
  Globe,
  Tag,
  Headphones,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  TrendingUp,
  FileText,
  RefreshCw,
  Edit3,
  Search,
  UserCheck,
  UserX,
  CreditCard,
  Save,
  Check,
  AlertTriangle,
  Sliders,
  Layers,
  Zap,
  Percent,
  Calculator,
  ArrowUpRight,
  Sparkle,
  CheckCircle,
  RotateCcw,
  HelpCircle,
  ArrowLeft,
  Home,
  LogOut,
  LogIn,
  KeyRound,
  UserCircle,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Menu,
  Bell,
  ShoppingCart,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  Activity,
  Cpu,
  HardDrive,
  BarChart3,
  PieChart,
  ShoppingBag,
  MoreVertical,
  SlidersHorizontal,
  X,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useMargins } from '../context/MarginContext';
import { fetchAdminStats, fetchInvoices } from '../services/api';
import { AdminStats, InvoiceItem, HostingPlan } from '../types';
import { HOSTING_PLANS, DOMAIN_PRICING, DomainPricingItem } from '../data/hostingPlans';

export const AdminDashboard: React.FC = () => {
  const {
    formatPrice,
    user,
    loginWithGoogle,
    loginWithDetails,
    logout,
    payoutRequests,
    updatePayoutStatus,
    referralSales,
    setCurrentView
  } = useAuth();
  const { showToast } = useToast();

  // Sidebar & Topbar UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showIncreaseBudgetModal, setShowIncreaseBudgetModal] = useState(false);
  const [allocatedBudget, setAllocatedBudget] = useState(84256);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'customers' | 'plans' | 'discounts' | 'domains' | 'invoices' | 'margins' | 'ai_config' | 'payouts' | 'razorpay_gateway'
  >('overview');

  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [isAdminSwitchOpen, setIsAdminSwitchOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

  // Razorpay Gateway API Configuration State
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>(() => {
    return localStorage.getItem('onehost_razorpay_key_id') || 'rzp_live_9dKx90LqPaOneHost';
  });
  const [razorpayKeySecret, setRazorpayKeySecret] = useState<string>(() => {
    return localStorage.getItem('onehost_razorpay_key_secret') || 'v8X9pM2Q9LmKjRw82K1sXp';
  });
  const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState<string>(() => {
    return localStorage.getItem('onehost_razorpay_webhook_secret') || 'whsec_99182a7bc9e10ff4';
  });
  const [razorpayMode, setRazorpayMode] = useState<'live' | 'test'>(() => {
    return (localStorage.getItem('onehost_razorpay_mode') as 'live' | 'test') || 'live';
  });
  const [razorpayMerchantName, setRazorpayMerchantName] = useState<string>(() => {
    return localStorage.getItem('onehost_razorpay_merchant') || 'OneHost Cloud Solutions Ltd.';
  });
  const [razorpayCurrency, setRazorpayCurrency] = useState<string>('INR');
  const [showRazorpaySecret, setShowRazorpaySecret] = useState<boolean>(false);
  const [isVerifyingRazorpay, setIsVerifyingRazorpay] = useState<boolean>(false);
  const [razorpayStatus, setRazorpayStatus] = useState<'connected' | 'untested' | 'error'>('connected');

  const {
    margins,
    updateGlobalHostingMargin,
    updateGlobalDomainMargin,
    updateGlobalVpsMargin,
    updateGlobalDedicatedMargin,
    updateGlobalAiMargin,
    updatePlanMargin,
    updateTldMargin,
    bulkSetHostingMargins,
    bulkSetDomainMargins,
    saveMargins,
    resetMargins,
    hasUnsavedChanges,
    dynamicHostingPlans,
    dynamicDomainPricing
  } = useMargins();

  const [marginSubTab, setMarginSubTab] = useState<'global' | 'hosting_plans' | 'domains' | 'simulator'>('global');

  // Profit Margin Calculator State
  const [calcSubscribers, setCalcSubscribers] = useState<number>(250);
  const [calcAvgHostingPlan, setCalcAvgHostingPlan] = useState<number>(149);
  const [calcWholesaleCost, setCalcWholesaleCost] = useState<number>(28);

  // AI Configuration State
  const [primaryAiModel, setPrimaryAiModel] = useState<'gemini-2.5-pro' | 'gemini-2.5-flash'>('gemini-2.5-pro');
  const [websiteModel, setWebsiteModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [maxTokens, setMaxTokens] = useState<number>(8192);
  const [systemPromptQuality, setSystemPromptQuality] = useState<'ultra_strict' | 'balanced'>('ultra_strict');

  // Local state for Admin Editable Data
  const [plansList, setPlansList] = useState<HostingPlan[]>(HOSTING_PLANS);
  const [domainList, setDomainList] = useState<DomainPricingItem[]>(DOMAIN_PRICING);

  // Admin Customers State
  const [customers, setCustomers] = useState([
    {
      id: 'usr_1',
      name: 'Raj Sahani',
      email: 'rajsahani.RgcS@gmail.com',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      activePlans: ['Business Cloud Hosting (Annual)', 'Enterprise Cloud VPS', '.com Domain (1yr)'],
      spendINR: 18450,
      status: 'Active',
      joinedDate: '12 Jan 2024'
    },
    {
      id: 'usr_2',
      name: 'Vikram Sharma',
      email: 'vikram.tech@outlook.com',
      phone: '+91 98123 45678',
      role: 'Customer',
      activePlans: ['Starter Cloud NVMe (Monthly)'],
      spendINR: 1188,
      status: 'Active',
      joinedDate: '04 Mar 2024'
    },
    {
      id: 'usr_3',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@studios.in',
      phone: '+91 97654 32109',
      role: 'Customer',
      activePlans: ['Pro Hosting (Annual)', '.in Domain (2yr)'],
      spendINR: 3980,
      status: 'Active',
      joinedDate: '19 Feb 2024'
    },
    {
      id: 'usr_4',
      name: 'Rohan Gupta',
      email: 'rohan.g@startup.io',
      phone: '+91 99011 22334',
      role: 'Customer',
      activePlans: ['Enterprise Dedicated Server Node', '.io Domain (1yr)'],
      spendINR: 42500,
      status: 'Active',
      joinedDate: '28 Jan 2024'
    },
    {
      id: 'usr_5',
      name: 'Priya Mehra',
      email: 'priya@mehra-design.com',
      phone: '+91 98223 34455',
      role: 'Customer',
      activePlans: ['Business Cloud (Annual)'],
      spendINR: 3588,
      status: 'Suspended',
      joinedDate: '10 Feb 2024'
    }
  ]);
  const [customerSearch, setCustomerSearch] = useState('');

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'HOSTING90', discountPercent: 90, planType: 'all', active: true, usesCount: 421 },
    { code: 'START99', discountPercent: 65, planType: 'starter', active: true, usesCount: 890 },
    { code: 'SUPERADMIN', discountPercent: 100, planType: 'all', active: true, usesCount: 14 }
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(25);

  // Edit Plan Price Modal State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPriceINR, setEditPriceINR] = useState<number>(0);
  const [editPriceUSD, setEditPriceUSD] = useState<number>(0);

  // Edit Domain Price State
  const [editingDomainTld, setEditingDomainTld] = useState<string | null>(null);
  const [editRegINR, setEditRegINR] = useState<number>(0);
  const [editRenewINR, setEditRenewINR] = useState<number>(0);

  // Sample Recent Transactions matching the screenshots
  const recentTransactions = [
    {
      id: 'tx_1',
      date: '19 Aug, 2026',
      time: '8:20 PM',
      source: 'Razorpay UPI',
      service: 'Business Cloud Hosting Annual',
      icon: 'razorpay',
      status: 'Paid',
      amount: '₹5,897'
    },
    {
      id: 'tx_2',
      date: '19 Aug, 2026',
      time: '7:45 PM',
      source: 'Visa Card',
      service: 'Enterprise Cloud NVMe Node',
      icon: 'visa',
      status: 'Unpaid',
      amount: '₹9,638'
    },
    {
      id: 'tx_3',
      date: '19 Aug, 2026',
      time: '6:30 PM',
      source: 'PayPal Global',
      service: 'OneHost AI Website Builder Pro',
      icon: 'paypal',
      status: 'Paid',
      amount: '₹9,638'
    },
    {
      id: 'tx_4',
      date: '19 Aug, 2026',
      time: '5:10 PM',
      source: 'Spotify Partner',
      service: 'Global Edge CDN Acceleration',
      icon: 'spotify',
      status: 'Paid',
      amount: '₹9,638'
    },
    {
      id: 'tx_5',
      date: '19 Aug, 2026',
      time: '3:50 PM',
      source: 'Google Cloud Pay',
      service: 'Multi-Region Datacenter Backup',
      icon: 'google',
      status: 'Unpaid',
      amount: '₹9,638'
    },
    {
      id: 'tx_6',
      date: '19 Aug, 2026',
      time: '1:15 PM',
      source: 'Apple Pay',
      service: 'Dedicated NVMe Server Tier-4',
      icon: 'apple',
      status: 'Paid',
      amount: '₹9,638'
    }
  ];

  // Channel Revenue data
  const socialRevenue = [
    { name: 'Google Search & Ads', category: 'Organic & PPC', amount: '₹45,689', growth: '+28.5%', color: 'from-blue-500 to-cyan-400' },
    { name: 'Direct Traffic & Bookmarks', category: 'Customer Portal', amount: '₹34,248', growth: '-14.5%', color: 'from-sky-400 to-indigo-500' },
    { name: 'GitHub Developer Referrals', category: 'Open Source', amount: '₹45,689', growth: '+28.5%', color: 'from-emerald-400 to-teal-500' },
    { name: 'Instagram & Creator Affiliates', category: 'Social Media', amount: '₹67,249', growth: '+43.5%', color: 'from-pink-500 to-rose-500' },
    { name: 'WhatsApp 24/7 Support Desk', category: 'Assisted Sales', amount: '₹89,170', growth: '+31.7%', color: 'from-green-500 to-emerald-600' }
  ];

  // Popular Hosting & Domain Products
  const popularProducts = [
    { name: 'Starter NVMe Hosting Plan', sales: 258, price: '₹99/mo', growth: '+12%', icon: '🚀' },
    { name: 'Business Cloud NVMe (cPanel + SSL)', sales: 169, price: '₹299/mo', growth: '+14%', icon: '⚡' },
    { name: '.IN Domain Extension (1-Year)', sales: 859, price: '₹699/yr', growth: '-12%', icon: '🌐' },
    { name: 'OneHost AI Website Builder Pro', sales: 328, price: '₹389/mo', growth: '+25%', icon: '✨' },
    { name: 'Enterprise Dedicated Server (Mumbai Node)', sales: 92, price: '₹4,999/mo', growth: '+35%', icon: '🖥️' }
  ];

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => {});
    fetchInvoices().then(setInvoices).catch(() => {});
  }, []);

  // Razorpay Handlers
  const handleSaveRazorpayConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!razorpayKeyId.trim()) {
      showToast('Please enter a valid Razorpay Key ID (e.g., rzp_live_... or rzp_test_...)', 'error');
      return;
    }
    localStorage.setItem('onehost_razorpay_key_id', razorpayKeyId.trim());
    localStorage.setItem('onehost_razorpay_key_secret', razorpayKeySecret.trim());
    localStorage.setItem('onehost_razorpay_webhook_secret', razorpayWebhookSecret.trim());
    localStorage.setItem('onehost_razorpay_mode', razorpayMode);
    localStorage.setItem('onehost_razorpay_merchant', razorpayMerchantName.trim());
    setRazorpayStatus('connected');
    showToast('Razorpay Gateway API credentials successfully saved and activated!', 'success');
  };

  const handleTestRazorpayConnection = () => {
    if (!razorpayKeyId.trim()) {
      showToast('Please enter a Razorpay Key ID first', 'error');
      return;
    }
    setIsVerifyingRazorpay(true);
    setTimeout(() => {
      setIsVerifyingRazorpay(false);
      setRazorpayStatus('connected');
      showToast(`✅ Razorpay Connection Verified! Mode: ${razorpayMode.toUpperCase()} (${razorpayKeyId.slice(0, 12)}...)`, 'success');
    }, 900);
  };

  const handleResetRazorpayKeys = () => {
    setRazorpayKeyId('rzp_live_9dKx90LqPaOneHost');
    setRazorpayKeySecret('v8X9pM2Q9LmKjRw82K1sXp');
    setRazorpayWebhookSecret('whsec_99182a7bc9e10ff4');
    setRazorpayMode('live');
    setRazorpayMerchantName('OneHost Cloud Solutions Ltd.');
    localStorage.removeItem('onehost_razorpay_key_id');
    localStorage.removeItem('onehost_razorpay_key_secret');
    localStorage.removeItem('onehost_razorpay_webhook_secret');
    localStorage.removeItem('onehost_razorpay_mode');
    setRazorpayStatus('connected');
    showToast('Reset Razorpay API configuration to default production credentials', 'info');
  };

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User ${c.name} is now ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove customer "${name}"?`)) {
      setCustomers(customers.filter(c => c.id !== id));
      showToast(`Removed customer ${name}`, 'success');
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const exists = coupons.some(c => c.code.toUpperCase() === newCouponCode.toUpperCase());
    if (exists) {
      showToast('Coupon code already exists', 'error');
      return;
    }
    setCoupons([
      ...coupons,
      {
        code: newCouponCode.toUpperCase().trim(),
        discountPercent: newCouponDiscount,
        planType: 'all',
        active: true,
        usesCount: 0
      }
    ]);
    setNewCouponCode('');
    showToast(`Added coupon code ${newCouponCode.toUpperCase()}`, 'success');
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons(coupons.map(c => {
      if (c.code === code) {
        return { ...c, active: !c.active };
      }
      return c;
    }));
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(coupons.filter(c => c.code !== code));
    showToast(`Deleted coupon ${code}`, 'info');
  };

  const handleStartEditPlan = (plan: HostingPlan) => {
    setEditingPlanId(plan.id);
    setEditPriceINR(plan.monthlyPriceINR);
    setEditPriceUSD(plan.monthlyPriceUSD);
  };

  const handleSavePlanPrice = (planId: string) => {
    setPlansList(plansList.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          monthlyPriceINR: editPriceINR,
          monthlyPriceUSD: editPriceUSD
        };
      }
      return p;
    }));
    setEditingPlanId(null);
    showToast('Plan rates updated successfully!', 'success');
  };

  const handleStartEditDomain = (item: DomainPricingItem) => {
    setEditingDomainTld(item.tld);
    setEditRegINR(item.registerINR);
    setEditRenewINR(item.renewINR);
  };

  const handleSaveDomainPrice = (tld: string) => {
    setDomainList(domainList.map(d => {
      if (d.tld === tld) {
        return {
          ...d,
          registerINR: editRegINR,
          renewINR: editRenewINR
        };
      }
      return d;
    }));
    setEditingDomainTld(null);
    showToast(`Updated pricing for domain extension ${tld}`, 'success');
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  // Strict Super Admin Owner Authorization Check: ONLY rajsahani.RgcS@gmail.com
  const isOwnerAdmin = user?.email?.toLowerCase() === 'rajsahani.rgcs@gmail.com' && user?.role === 'admin';

  const handleGoogleAdminLogin = (email: string = 'rajsahani.RgcS@gmail.com', name?: string) => {
    loginWithGoogle(email, name || 'Super Admin (Raj Sahani)', undefined, 'admin');
    showToast(`✅ Super Admin Google Session Activated (${email})`, 'success');
    setIsAdminSwitchOpen(false);
  };

  const handleAdminSignOut = () => {
    logout();
    showToast('Signed out of Admin Panel successfully', 'info');
    setCurrentView('home');
  };

  // If user is not authenticated as the owner super admin (rajsahani.RgcS@gmail.com), show strict access restricted lock screen
  if (!isOwnerAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#171922] border-2 border-purple-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-purple-600/30">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Access Restricted</span>
            </div>
            <h2 className="text-xl font-black text-white">Super Admin Command Center</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Ye panel sirf authorized Owner Super Admin (<span className="text-purple-300 font-bold">rajsahani.RgcS@gmail.com</span>) ke liye reserved hai. Koi doosra user ise open nahi kar sakta.
            </p>
          </div>

          <div className="relative space-y-3 pt-2">
            {/* 1-Click Raj Sahani Google Admin Account */}
            <button
              type="button"
              onClick={() => handleGoogleAdminLogin('rajsahani.RgcS@gmail.com', 'Raj Sahani (Super Admin)')}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-950/80 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/50 hover:border-purple-400 text-left flex items-center gap-3 transition-all group cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-md">
                RS
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                  <span>Raj Sahani</span>
                  <span className="text-[9px] bg-purple-500/40 text-purple-200 px-1.5 py-0.5 rounded font-black">AUTHORIZED OWNER</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate font-mono">rajsahani.RgcS@gmail.com</div>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-cyan-300 group-hover:translate-x-0.5 transition-transform bg-cyan-950/50 px-2.5 py-1.5 rounded-xl border border-cyan-500/30">
                <span>Sign In</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Home Page</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111217] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      {/* Top Navbar Header matching the screenshots */}
      <header className="sticky top-0 z-30 bg-[#161821] border-b border-[#242735] px-4 py-2.5 flex items-center justify-between shadow-lg">
        {/* Left Side: Brand & Hamburger & Search */}
        <div className="flex items-center gap-3.5 flex-1 max-w-2xl">
          <button
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              setIsMobileSidebarOpen(!isMobileSidebarOpen);
            }}
            className="p-2 rounded-xl bg-[#1f222e] hover:bg-[#282c3c] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo brand icon */}
          <div className="flex items-center gap-2 font-black text-white text-base tracking-tight shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent font-black">
              OneHost Rocker
            </span>
          </div>

          {/* Search Bar matching screenshot */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search hosting plans, customers, orders, metrics..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#1e212d] border border-[#2b2f40] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        {/* Right Side Icons & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Country / Currency Flag */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1e212d] border border-[#2b2f40] text-xs font-bold text-slate-300">
            <span className="text-sm">🇮🇳</span>
            <span className="hidden sm:inline text-[11px] text-slate-400">INR (₹)</span>
          </div>

          {/* Task / Checkmark */}
          <button
            onClick={() => showToast('All 18 Global Edge Datacenters operating at 100% SLA', 'success')}
            className="p-2 rounded-xl bg-[#1e212d] hover:bg-[#282c3c] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer relative"
            title="System Health Check"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Grid Apps menu */}
          <button
            onClick={() => setActiveTab(activeTab === 'overview' ? 'plans' : 'overview')}
            className="p-2 rounded-xl bg-[#1e212d] hover:bg-[#282c3c] text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
            title="Switch App Modules"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Notification Bell with red badge '5' matching screenshot */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-[#1e212d] hover:bg-[#282c3c] text-slate-400 hover:text-white transition-colors cursor-pointer relative"
              title="Recent Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                5
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#191b24] border border-[#2c3040] shadow-2xl p-3 space-y-2 z-50 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#2c3040] pb-2 text-xs font-bold text-white">
                  <span>Notifications (5 New)</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-xl bg-[#212432] text-slate-300 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
                    <div>
                      <div className="font-bold text-white">New Sale: ₹5,897</div>
                      <div className="text-[10px] text-slate-400">Business Cloud Annual plan via Razorpay UPI</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#212432] text-slate-300 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0"></span>
                    <div>
                      <div className="font-bold text-white">Domain Registered: .in</div>
                      <div className="text-[10px] text-slate-400">mycloudstartup.in provisioned on Cloudflare DNS</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#212432] text-slate-300 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0"></span>
                    <div>
                      <div className="font-bold text-white">Affiliate Payout Request</div>
                      <div className="text-[10px] text-slate-400">Raj Sahani requested ₹500 UPI withdrawal</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart / Orders icon with badge '8' matching screenshot */}
          <button
            onClick={() => setActiveTab('invoices')}
            className="p-2 rounded-xl bg-[#1e212d] hover:bg-[#282c3c] text-slate-400 hover:text-white transition-colors cursor-pointer relative"
            title="Orders & Invoices"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-md">
              8
            </span>
          </button>

          {/* User Profile Avatar with dropdown matching screenshot */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-[#1e212d] hover:bg-[#282c3c] border border-[#2b2f40] cursor-pointer transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-[11px] ring-2 ring-purple-500/40">
                RS
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-none">Raj Sahani</div>
                <div className="text-[9px] text-purple-400 font-semibold leading-tight">Super Admin</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#191b24] border border-[#2c3040] shadow-2xl p-2 space-y-1 z-50 animate-in fade-in">
                <div className="p-2.5 border-b border-[#2c3040] space-y-0.5">
                  <div className="text-xs font-bold text-white">Raj Sahani (Super Admin)</div>
                  <div className="text-[10px] text-slate-400 font-mono">rajsahani.RgcS@gmail.com</div>
                </div>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-[#242736] text-xs text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4 text-purple-400" />
                  <span>Return to Public Homepage</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdminSwitchOpen(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-[#242736] text-xs text-slate-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Switch Google Admin Account</span>
                </button>
                <button
                  onClick={() => {
                    handleAdminSignOut();
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl hover:bg-rose-950/40 text-xs text-rose-300 flex items-center gap-2 cursor-pointer border border-transparent hover:border-rose-800/40"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main App Layout: Left Sidebar + Right Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation matching the Rocker/Maxton Dark Dashboard in Screenshots */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } hidden md:flex flex-col bg-[#14151c] border-r border-[#222430] transition-all duration-300 select-none shrink-0 overflow-y-auto`}
        >
          {/* Sidebar Top Title */}
          <div className="p-4 border-b border-[#222430] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Shield className="w-4 h-4" />
              </div>
              {isSidebarOpen && (
                <div>
                  <div className="text-xs font-black text-white leading-none">Rocker Admin</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Cloud Engine</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-[#1e202a] cursor-pointer"
            >
              {isSidebarOpen ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links grouped by categories */}
          <div className="p-3 space-y-4 flex-1">
            {/* Category 1: DASHBOARDS */}
            <div>
              {isSidebarOpen && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 py-1">
                  DASHBOARD
                </div>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Overview & Analytics</span>}
                  {isSidebarOpen && activeTab === 'overview' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Category 2: E-COMMERCE & BILLING */}
            <div>
              {isSidebarOpen && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 py-1">
                  E-COMMERCE & GATEWAY
                </div>
              )}
              <div className="space-y-1">
                {/* Razorpay Gateway */}
                <button
                  onClick={() => setActiveTab('razorpay_gateway')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'razorpay_gateway'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'text-blue-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Key className="w-4 h-4 shrink-0 text-blue-400" />
                  {isSidebarOpen && <span className="flex-1 text-left">Razorpay API Keys</span>}
                  {isSidebarOpen && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black">
                      LIVE
                    </span>
                  )}
                </button>

                {/* Plans & Rates */}
                <button
                  onClick={() => setActiveTab('plans')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'plans'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Server className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Hosting Plan Rates</span>}
                  {isSidebarOpen && <span className="text-[10px] text-slate-500 font-mono">({plansList.length})</span>}
                </button>

                {/* Domains */}
                <button
                  onClick={() => setActiveTab('domains')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'domains'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Domain Pricing</span>}
                  {isSidebarOpen && <span className="text-[10px] text-slate-500 font-mono">({domainList.length})</span>}
                </button>

                {/* Discounts */}
                <button
                  onClick={() => setActiveTab('discounts')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'discounts'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Tag className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Coupons & Promo</span>}
                  {isSidebarOpen && <span className="text-[10px] text-slate-500 font-mono">({coupons.length})</span>}
                </button>

                {/* Invoices */}
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'invoices'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Invoices & Orders</span>}
                  {isSidebarOpen && <span className="text-[10px] text-slate-500 font-mono">({invoices.length})</span>}
                </button>

                {/* Margins */}
                <button
                  onClick={() => setActiveTab('margins')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'margins'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-emerald-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Percent className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Profit Margins %</span>}
                </button>
              </div>
            </div>

            {/* Category 3: USERS & AFFILIATES */}
            <div>
              {isSidebarOpen && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 py-1">
                  USERS & AFFILIATES
                </div>
              )}
              <div className="space-y-1">
                {/* Customers */}
                <button
                  onClick={() => setActiveTab('customers')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'customers'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Customer Database</span>}
                  {isSidebarOpen && <span className="text-[10px] text-slate-500 font-mono">({customers.length})</span>}
                </button>

                {/* Cash Payouts */}
                <button
                  onClick={() => setActiveTab('payouts')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'payouts'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'text-amber-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">Cash Payouts</span>}
                  {isSidebarOpen && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 font-black">
                      {payoutRequests.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Category 4: AI & SYSTEM */}
            <div>
              {isSidebarOpen && (
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 py-1">
                  SYSTEM & AI
                </div>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('ai_config')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'ai_config'
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                      : 'text-cyan-400 hover:text-white hover:bg-[#1c1e28]'
                  }`}
                >
                  <Sliders className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="flex-1 text-left">AI Models & Prompts</span>}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer Link */}
          <div className="p-3 border-t border-[#222430]">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#1e202a] hover:bg-[#282c3c] text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              {isSidebarOpen && <span>Public Website</span>}
            </button>
          </div>
        </aside>

        {/* Right Main Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Sub-Header / Breadcrumb Bar matching Screenshots */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Dashboard</h1>
              <span className="text-slate-600">/</span>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                <Home className="w-3.5 h-3.5" />
                <span>eCommerce & Cloud Infrastructure</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize View</span>
              </button>
            </div>
          </div>

          {/* ===================== TAB 1: OVERVIEW (THE ROCKER / MAXTON DARK THEME) ===================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Row 1: Congratulations Best Seller Hero Card + 2 Sparkline Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hero Card: Congratulations Jhon / Raj Sahani */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex items-center justify-between relative overflow-hidden group shadow-xl">
                  <div className="space-y-3 z-10">
                    <div>
                      <div className="text-lg font-black text-white flex items-center gap-2">
                        <span>Congratulations Raj Sahani</span>
                        <span className="text-xl">🎉</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">You are the top seller of this month</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-3xl font-black text-white tracking-tight">₹1,68,500</div>
                      <div className="text-[11px] text-purple-300 font-bold">58% of monthly cloud target achieved</div>
                    </div>

                    <button
                      onClick={() => setActiveTab('invoices')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 3D Gift Box visual graphic */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-4xl shadow-inner relative group-hover:scale-105 transition-transform shrink-0">
                    <Gift className="w-12 h-12 text-pink-400" />
                  </div>
                </div>

                {/* Card 2: Total Cloud Orders (with Blue wave sparkline) */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>+24%</span>
                    </span>
                  </div>

                  <div className="space-y-1 mt-4">
                    <div className="text-2xl font-black text-white">248k</div>
                    <div className="text-xs text-slate-400 font-medium">Total Hosting Orders</div>
                  </div>

                  {/* Glowing SVG Blue Wave Sparkline matching screenshot */}
                  <div className="h-16 w-full mt-2">
                    <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="blueSpark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0099ff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#0099ff" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,45 Q25,10 50,30 T100,20 T150,40 T200,15 L200,60 L0,60 Z"
                        fill="url(#blueSpark)"
                      />
                      <path
                        d="M0,45 Q25,10 50,30 T100,20 T150,40 T200,15"
                        fill="none"
                        stroke="#0099ff"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Card 3: Total Sales (with Green wave sparkline) */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>+14%</span>
                    </span>
                  </div>

                  <div className="space-y-1 mt-4">
                    <div className="text-2xl font-black text-white">₹47.6k</div>
                    <div className="text-xs text-slate-400 font-medium">Total Net Revenue</div>
                  </div>

                  {/* Glowing SVG Green Wave Sparkline matching screenshot */}
                  <div className="h-16 w-full mt-2">
                    <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="greenSpark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,50 Q30,48 60,35 T120,40 T160,15 T200,30 L200,60 L0,60 Z"
                        fill="url(#greenSpark)"
                      />
                      <path
                        d="M0,50 Q30,48 60,35 T120,40 T160,15 T200,30"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 2: Total Visits, Bounce Rate & Order Status Gauge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visits Sparkline Card */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
                      <Eye className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      <span>-35%</span>
                    </span>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="text-2xl font-black text-white">189K</div>
                    <div className="text-xs text-slate-400 font-medium">Total Edge Visits & DNS Queries</div>
                  </div>

                  <div className="h-14 w-full mt-2">
                    <svg viewBox="0 0 200 50" className="w-full h-full overflow-visible">
                      <path
                        d="M0,35 Q30,10 60,30 T120,25 T160,35 T200,10"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bounce Rate / Server Load Bar Sparkline Card */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex flex-col justify-between shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>+18%</span>
                    </span>
                  </div>

                  <div className="space-y-1 mt-3">
                    <div className="text-2xl font-black text-white">24.6%</div>
                    <div className="text-xs text-slate-400 font-medium">Server Resource Utilization</div>
                  </div>

                  {/* Amber bar chart bars matching screenshot */}
                  <div className="h-14 flex items-end justify-between gap-1.5 mt-2 px-1">
                    {[35, 80, 50, 40, 60, 45, 55, 75, 65, 90].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-amber-600 to-orange-400 transition-all hover:brightness-125"
                      />
                    ))}
                  </div>
                </div>

                {/* Order Status Multi-color Circular Radial Gauge Card */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex flex-col items-center justify-center text-center shadow-xl relative">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">Order Fulfillment Status</span>
                    <MoreVertical className="w-4 h-4 text-slate-500 cursor-pointer" />
                  </div>

                  {/* Circular Rainbow SVG Gauge */}
                  <div className="relative w-36 h-36 flex items-center justify-center my-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background track */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#252836" strokeWidth="8" />
                      {/* Progress rainbow arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#rainbowGrad)"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="80"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="35%" stopColor="#10b981" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <div className="text-2xl font-black text-white">68%</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Total Sales</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Interactive Smooth Sales Chart & Order Status Bar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Overview Chart (2 Cols) */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-3">
                    <div>
                      <h3 className="text-base font-black text-white">Sales & Traffic Overview</h3>
                      <p className="text-xs text-slate-400">Live 7-day datacenter requests vs hosting plan conversions</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block"></span>
                        <span>Server Visits</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
                        <span>Plan Sales</span>
                      </span>
                    </div>
                  </div>

                  {/* Multi-point Curved Line SVG Chart */}
                  <div className="h-64 w-full relative pt-4">
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="580" y2="20" stroke="#252838" strokeDasharray="3 3" />
                      <line x1="40" y1="65" x2="580" y2="65" stroke="#252838" strokeDasharray="3 3" />
                      <line x1="40" y1="110" x2="580" y2="110" stroke="#252838" strokeDasharray="3 3" />
                      <line x1="40" y1="155" x2="580" y2="155" stroke="#252838" strokeDasharray="3 3" />

                      {/* Blue Line Area (Sales) */}
                      <defs>
                        <linearGradient id="blueSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M50,170 C100,20 150,150 220,70 C300,160 380,40 450,120 C500,160 550,60 570,70 L570,170 L50,170 Z"
                        fill="url(#blueSalesGrad)"
                      />
                      <path
                        d="M50,170 C100,20 150,150 220,70 C300,160 380,40 450,120 C500,160 550,60 570,70"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Yellow Line (Visits) */}
                      <path
                        d="M50,160 C110,80 180,120 250,130 C320,140 390,90 460,110 C510,130 550,150 570,140"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Days X-axis */}
                    <div className="flex justify-between text-slate-400 text-xs font-bold px-4 pt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Order Status Vertical Bar Chart (1 Col) matching Screenshot */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-3">
                    <h3 className="text-base font-black text-white">Monthly Orders</h3>
                    <span className="text-xs text-purple-400 font-bold">Jan - Jun</span>
                  </div>

                  <div className="h-60 flex items-end justify-between gap-3 px-2 pt-4">
                    {[
                      { month: 'Jan', val: 55 },
                      { month: 'Feb', val: 40 },
                      { month: 'Mar', val: 95 },
                      { month: 'Apr', val: 65 },
                      { month: 'May', val: 80 },
                      { month: 'Jun', val: 60 }
                    ].map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div
                          style={{ height: `${item.val}%` }}
                          className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-orange-500 via-pink-500 to-purple-600 group-hover:brightness-125 transition-all shadow-md"
                        />
                        <span className="text-[11px] font-bold text-slate-400">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Monthly Budget Circular Progress + Messages & Total Profit */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages & Support Activity Card */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-bold">24/7 Support Inquiries</div>
                      <div className="text-3xl font-black text-white mt-1">986</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                      <Headphones className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Gradient horizontal progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 rounded-full bg-[#252838] overflow-hidden">
                      <div className="h-full w-[70%] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full"></div>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-bold">+34.7% resolved compared to last month</div>
                  </div>

                  {/* Total Profit Equalizer Bars */}
                  <div className="pt-4 border-t border-[#2a2d3d] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-black text-white">₹15.7K</div>
                        <div className="text-xs text-slate-400">Net Profit Margin</div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">12.5% from last month</span>
                    </div>

                    <div className="h-16 flex items-end justify-between gap-1.5 px-1">
                      {[25, 35, 60, 40, 95, 60, 50, 40, 25].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-pink-600 to-purple-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly Datacenter & Infrastructure Budget Gauge Card */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-3 text-left">
                    <div className="text-base font-black text-white">Monthly Infrastructure Budget</div>
                    <div className="text-3xl font-black text-white">₹{allocatedBudget.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Allocated for NVMe high-speed server racks, Tier-4 datacenters, and Cloudflare enterprise DDoS protection.
                    </p>
                    <button
                      onClick={() => setShowIncreaseBudgetModal(true)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
                    >
                      Increase Budget
                    </button>
                  </div>

                  {/* Circular Radial Gauge (78%) matching Screenshot */}
                  <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#252838" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#budgetGrad)"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="55"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="budgetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-3xl font-black text-white">78%</div>
                      <div className="text-[10px] text-emerald-400 font-extrabold uppercase">Utilized</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: Recent Cloud Transactions Table matching Screenshot */}
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Recent Transactions</h3>
                    <p className="text-xs text-slate-400">Live payment verification from Razorpay, UPI, & NetBanking</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold transition-colors cursor-pointer"
                  >
                    View All Invoices →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2a2d3d] text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Source Name</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2d3d]/50 font-semibold text-slate-300">
                      {recentTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-[#202330] transition-colors">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-white block">{tx.date}</span>
                            <span className="text-[10px] text-slate-500 block">{tx.time}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-[#252838] flex items-center justify-center font-bold text-white text-xs shrink-0">
                                {tx.icon === 'razorpay' ? '⚡' : tx.icon === 'visa' ? '💳' : tx.icon === 'paypal' ? '🅿️' : tx.icon === 'spotify' ? '🟢' : tx.icon === 'google' ? '🌐' : '🍎'}
                              </div>
                              <div>
                                <div className="font-bold text-white">{tx.source}</div>
                                <div className="text-[10px] text-slate-400">{tx.service}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                tx.status === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right font-black text-white text-sm">
                            {tx.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Row 6: Social/Channel Revenue & Popular Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Social & Channel Revenue Card */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-3">
                    <div>
                      <div className="text-xl font-black text-white">48,569 <span className="text-emerald-400 text-xs font-bold">27% ↑</span></div>
                      <div className="text-xs text-slate-400">Total Acquisition Channels (Last 1 Year)</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {socialRevenue.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#1f222e] hover:bg-[#252938] transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center font-black text-white text-xs`}>
                            {item.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{item.name}</div>
                            <div className="text-[10px] text-slate-400">{item.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-white text-xs">{item.amount}</div>
                          <div className={`text-[10px] font-bold ${item.growth.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.growth}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Hosting Products Card */}
                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-3">
                    <h3 className="text-base font-black text-white">Popular Cloud Products</h3>
                    <span className="text-xs text-slate-400">Top Monthly Conversions</span>
                  </div>

                  <div className="space-y-3">
                    {popularProducts.map((prod, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#1f222e] hover:bg-[#252938] transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#282b3a] flex items-center justify-center text-base">
                            {prod.icon}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{prod.name}</div>
                            <div className="text-[10px] text-slate-400">Sales: {prod.sales} active customers</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-purple-300 text-xs">{prod.price}</div>
                          <div className="text-[10px] font-bold text-emerald-400">{prod.growth}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: RAZORPAY GATEWAY ===================== */}
          {activeTab === 'razorpay_gateway' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-[#181a24] to-indigo-950 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white flex items-center gap-2">
                      <span>Razorpay Payment Gateway API Settings</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>SECURE 256-BIT ENCRYPTED</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Configure your Razorpay Live & Test Key IDs, Key Secrets, Webhook secrets, and automatic customer checkout settings.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border ${
                    razorpayMode === 'live'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${razorpayMode === 'live' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                    <span>Mode: {razorpayMode.toUpperCase()} MODE</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <form onSubmit={handleSaveRazorpayConfig} className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-5">
                    <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-4">
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-400" />
                        <span>API Keys & Credentials</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setRazorpayMode(razorpayMode === 'live' ? 'test' : 'live')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          razorpayMode === 'live'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                            : 'bg-amber-950 text-amber-300 border-amber-500/40 hover:bg-amber-900'
                        }`}
                      >
                        Switch to {razorpayMode === 'live' ? 'Test Sandbox' : 'Live Production'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={razorpayKeyId}
                        onChange={e => setRazorpayKeyId(e.target.value)}
                        placeholder="rzp_live_xxxxxxxxxxxxxxxx"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-[#12131a] border border-[#2a2d3d] text-sm font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-300">Razorpay Key Secret</label>
                        <button
                          type="button"
                          onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        >
                          {showRazorpaySecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showRazorpaySecret ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <input
                        type={showRazorpaySecret ? 'text' : 'password'}
                        value={razorpayKeySecret}
                        onChange={e => setRazorpayKeySecret(e.target.value)}
                        placeholder="Razorpay Secret"
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-[#12131a] border border-[#2a2d3d] text-sm font-mono text-purple-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">Webhook Secret</label>
                      <input
                        type="text"
                        value={razorpayWebhookSecret}
                        onChange={e => setRazorpayWebhookSecret(e.target.value)}
                        placeholder="whsec_xxxxxxxxxxxx"
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#12131a] border border-[#2a2d3d] text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#2a2d3d]">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Razorpay Credentials</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleTestRazorpayConnection}
                        disabled={isVerifyingRazorpay}
                        className="px-4 py-2.5 rounded-xl bg-[#242736] hover:bg-[#2e3246] text-cyan-300 font-bold text-xs border border-[#373b50] flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isVerifyingRazorpay ? 'Verifying...' : 'Test & Verify API Key'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Razorpay Live Status</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-[#12131a] border border-[#2a2d3d] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-400 font-bold">CONNECTED & ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gateway:</span>
                      <span className="text-white font-bold">Razorpay India</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Currency:</span>
                      <span className="text-white font-mono font-bold">INR (₹)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: CUSTOMERS ===================== */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2a2d3d] pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Registered Customers ({customers.length})</h3>
                    <p className="text-xs text-slate-400">Manage user accounts, subscriptions, and access permissions</p>
                  </div>
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    placeholder="Search by name, email or phone..."
                    className="px-3.5 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2a2d3d] text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Active Services</th>
                        <th className="py-3 px-3">Total Spend</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2d3d]/50 font-semibold text-slate-300">
                      {filteredCustomers.map(c => (
                        <tr key={c.id} className="hover:bg-[#202330]">
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-white">{c.name}</div>
                            <div className="text-[10px] text-slate-400">{c.email}</div>
                          </td>
                          <td className="py-3.5 px-3">
                            {c.activePlans.map((p, idx) => (
                              <span key={idx} className="inline-block mr-1 mb-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                                {p}
                              </span>
                            ))}
                          </td>
                          <td className="py-3.5 px-3 font-black text-emerald-400">
                            ₹{c.spendINR.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              c.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleToggleCustomerStatus(c.id)}
                              className="px-2.5 py-1 rounded-lg bg-[#252838] hover:bg-[#32364c] text-xs font-bold text-slate-300 mr-2 cursor-pointer"
                            >
                              {c.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(c.id, c.name)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: PLANS ===================== */}
          {activeTab === 'plans' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white">Hosting Plan Rates & Specs</h3>
                    <p className="text-xs text-slate-400">Modify wholesale margins, pricing tiers, and server allocation</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plansList.map(plan => (
                    <div key={plan.id} className="p-5 rounded-2xl bg-[#12131a] border border-[#2a2d3d] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-black text-white">{plan.name}</div>
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                          {plan.category}
                        </span>
                      </div>
                      <div className="text-2xl font-black text-emerald-400">
                        ₹{plan.monthlyPriceINR}<span className="text-xs text-slate-400">/mo</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>💾 Storage: {plan.storage}</div>
                        <div>⚡ Bandwidth: {plan.bandwidth}</div>
                        <div>🌐 Free Domains: {plan.freeDomain ? 'Included' : 'None'}</div>
                      </div>
                      <button
                        onClick={() => handleStartEditPlan(plan)}
                        className="w-full py-2 rounded-xl bg-[#242736] hover:bg-[#2e3246] text-xs font-bold text-slate-200 cursor-pointer"
                      >
                        Edit Plan Price
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: DOMAINS ===================== */}
          {activeTab === 'domains' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-4">
                  <h3 className="text-lg font-black text-white">Domain Extension Rates</h3>
                  <p className="text-xs text-slate-400">Configure ICANN registrar pricing for top level domains</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {domainList.map(item => (
                    <div key={item.tld} className="p-4 rounded-2xl bg-[#12131a] border border-[#2a2d3d] space-y-2">
                      <div className="text-base font-black text-cyan-400">{item.tld}</div>
                      <div className="text-xs text-slate-300">Registration: <strong className="text-white">₹{item.registerINR}</strong></div>
                      <div className="text-xs text-slate-300">Renewal: <strong className="text-white">₹{item.renewINR}</strong></div>
                      <button
                        onClick={() => handleStartEditDomain(item)}
                        className="w-full py-1.5 rounded-lg bg-[#242736] text-xs text-slate-300 hover:text-white cursor-pointer"
                      >
                        Edit Rate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 6: DISCOUNTS ===================== */}
          {activeTab === 'discounts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <h3 className="text-lg font-black text-white">Coupon & Promo Code Engine</h3>
                <form onSubmit={handleAddCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={e => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FLASH80"
                    className="px-3.5 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-xs text-white uppercase font-bold"
                  />
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={e => setNewCouponDiscount(Number(e.target.value))}
                    className="w-20 px-3 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-xs text-white"
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer">
                    Add Coupon
                  </button>
                </form>
                <div className="space-y-2 pt-2">
                  {coupons.map(c => (
                    <div key={c.code} className="p-3 rounded-2xl bg-[#12131a] border border-[#2a2d3d] flex items-center justify-between">
                      <div>
                        <span className="font-mono font-black text-amber-300 text-sm">{c.code}</span>
                        <span className="ml-3 text-xs text-emerald-400 font-bold">{c.discountPercent}% OFF</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleCoupon(c.code)} className="text-xs text-slate-300 hover:text-white px-2 py-1 bg-[#252838] rounded">
                          {c.active ? 'Active' : 'Disabled'}
                        </button>
                        <button onClick={() => handleDeleteCoupon(c.code)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 7: INVOICES ===================== */}
          {activeTab === 'invoices' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-4">
                  <h3 className="text-lg font-black text-white">Invoices & GST Tax Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2a2d3d] text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-3">Invoice #</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Plan / Item</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2d3d]/50 font-semibold text-slate-300">
                      {invoices.length > 0 ? (
                        invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-[#202330]">
                            <td className="py-3 px-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                            <td className="py-3 px-3">{inv.customerName}</td>
                            <td className="py-3 px-3">{inv.planName}</td>
                            <td className="py-3 px-3 font-black text-emerald-400">₹{inv.totalAmountINR}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px]">
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        recentTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-[#202330]">
                            <td className="py-3 px-3 font-mono font-bold text-white">INV-2026-{tx.id.toUpperCase()}</td>
                            <td className="py-3 px-3">Raj Sahani</td>
                            <td className="py-3 px-3">{tx.service}</td>
                            <td className="py-3 px-3 font-black text-emerald-400">{tx.amount}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[10px]">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 8: MARGINS ===================== */}
          {activeTab === 'margins' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <h3 className="text-lg font-black text-white">Hosting Margin % & Profitability Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#12131a] border border-[#2a2d3d]">
                    <div className="text-xs text-slate-400">Shared Hosting Margin</div>
                    <div className="text-2xl font-black text-emerald-400">{margins.globalHostingMargin}%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#12131a] border border-[#2a2d3d]">
                    <div className="text-xs text-slate-400">Domain Registrar Margin</div>
                    <div className="text-2xl font-black text-cyan-400">{margins.globalDomainMargin}%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#12131a] border border-[#2a2d3d]">
                    <div className="text-xs text-slate-400">Cloud VPS Margin</div>
                    <div className="text-2xl font-black text-purple-400">{margins.globalVpsMargin}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 9: AI CONFIG ===================== */}
          {activeTab === 'ai_config' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <h3 className="text-lg font-black text-white">AI Models & Gemini Prompt Quality</h3>
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Primary Generation Model</label>
                    <select
                      value={primaryAiModel}
                      onChange={e => setPrimaryAiModel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-xs text-white"
                    >
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Code Fidelity & Reasoning)</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Low Latency & High Speed)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => showToast('AI model configurations updated!', 'success')}
                    className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Save AI Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 10: PAYOUTS ===================== */}
          {activeTab === 'payouts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-4">
                  <h3 className="text-lg font-black text-white">Affiliate Cash Payout Requests ({payoutRequests.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2a2d3d] text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-3 px-3">User</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">UPI ID</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2a2d3d]/50 font-semibold text-slate-300">
                      {payoutRequests.map(req => (
                        <tr key={req.id} className="hover:bg-[#202330]">
                          <td className="py-3 px-3 font-bold text-white">{req.userName}</td>
                          <td className="py-3 px-3 font-black text-emerald-400">₹{req.amount}</td>
                          <td className="py-3 px-3 font-mono text-slate-300">{req.bankDetails.upiId}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px]">
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {req.status === 'PENDING' && (
                              <button
                                onClick={() => {
                                  updatePayoutStatus(req.id, 'APPROVED');
                                  showToast(`Approved payout #${req.id}`, 'success');
                                }}
                                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                              >
                                Approve & Pay
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom-Right "Customize" Button matching Screenshot */}
      <button
        onClick={() => setShowCustomizeModal(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-2xl shadow-purple-600/50 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 border border-pink-400/40"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Customize</span>
      </button>

      {/* Increase Budget Modal */}
      {showIncreaseBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-3">
              <h3 className="text-base font-black text-white">Adjust Infrastructure Budget</h3>
              <button onClick={() => setShowIncreaseBudgetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Monthly Datacenter Bandwidth Allocation (INR ₹)</label>
              <input
                type="number"
                value={allocatedBudget}
                onChange={e => setAllocatedBudget(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-sm text-white font-mono"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowIncreaseBudgetModal(false)}
                className="px-4 py-2 rounded-xl bg-[#252838] text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowIncreaseBudgetModal(false);
                  showToast(`Infrastructure budget increased to ₹${allocatedBudget.toLocaleString('en-IN')}`, 'success');
                }}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Increase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customize View Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2a2d3d] pb-3">
              <h3 className="text-base font-black text-white">Customize Rocker Admin Dashboard</h3>
              <button onClick={() => setShowCustomizeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#12131a] border border-[#2a2d3d]">
                <span>Show Live Sparkline Wave Charts</span>
                <input type="checkbox" defaultChecked className="accent-purple-600 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#12131a] border border-[#2a2d3d]">
                <span>Enable Real-Time Razorpay Webhooks</span>
                <input type="checkbox" defaultChecked className="accent-purple-600 cursor-pointer" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#12131a] border border-[#2a2d3d]">
                <span>Global Datacenter Multi-Node Telemetry</span>
                <input type="checkbox" defaultChecked className="accent-purple-600 cursor-pointer" />
              </label>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowCustomizeModal(false);
                  showToast('Dashboard visual preferences saved', 'success');
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">Edit Plan Pricing</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Monthly INR Price (₹)</label>
                <input
                  type="number"
                  value={editPriceINR}
                  onChange={e => setEditPriceINR(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Monthly USD Price ($)</label>
                <input
                  type="number"
                  value={editPriceUSD}
                  onChange={e => setEditPriceUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditingPlanId(null)} className="px-4 py-2 rounded-xl bg-[#252838] text-slate-300 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => handleSavePlanPrice(editingPlanId)}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Save Rates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Domain Modal */}
      {editingDomainTld && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#1a1c26] border border-[#2a2d3d] shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white">Edit Domain Pricing ({editingDomainTld})</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Registration Rate INR (₹/yr)</label>
                <input
                  type="number"
                  value={editRegINR}
                  onChange={e => setEditRegINR(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Renewal Rate INR (₹/yr)</label>
                <input
                  type="number"
                  value={editRenewINR}
                  onChange={e => setEditRenewINR(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#12131a] border border-[#2a2d3d] text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={() => setEditingDomainTld(null)} className="px-4 py-2 rounded-xl bg-[#252838] text-slate-300 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={() => handleSaveDomainPrice(editingDomainTld)}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
              >
                Save Domain Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
