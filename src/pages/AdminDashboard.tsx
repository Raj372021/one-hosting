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
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchAdminStats, fetchInvoices } from '../services/api';
import { AdminStats, InvoiceItem, HostingPlan } from '../types';
import { HOSTING_PLANS, DOMAIN_PRICING, DomainPricingItem } from '../data/hostingPlans';

export const AdminDashboard: React.FC = () => {
  const { formatPrice, user, payoutRequests, updatePayoutStatus, referralSales } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'customers' | 'plans' | 'discounts' | 'domains' | 'invoices' | 'margins' | 'ai_config' | 'payouts'
  >('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

  // Profit Margin Calculator State
  const [calcSubscribers, setCalcSubscribers] = useState<number>(250);
  const [calcAvgHostingPlan, setCalcAvgHostingPlan] = useState<number>(149); // ₹149/mo
  const [calcWholesaleCost, setCalcWholesaleCost] = useState<number>(28); // ₹28/mo

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
      role: 'user',
      status: 'Active',
      walletBalance: 2450,
      joinedDate: '2025-01-15',
      activePlan: 'Business Hosting (techventure.in)'
    },
    {
      id: 'usr_2',
      name: 'Alex Rivera',
      email: 'alex@onehost.cloud',
      phone: '+91 91234 56789',
      role: 'user',
      status: 'Active',
      walletBalance: 1200,
      joinedDate: '2025-02-01',
      activePlan: 'Cloud VPS (devstudio.ai)'
    },
    {
      id: 'usr_3',
      name: 'Priya Sharma',
      email: 'priya@techstartup.in',
      phone: '+91 99887 76655',
      role: 'user',
      status: 'Active',
      walletBalance: 5000,
      joinedDate: '2025-03-10',
      activePlan: 'Cloud Professional'
    },
    {
      id: 'usr_4',
      name: 'Aarav Patel',
      email: 'aarav@pateldesigns.com',
      phone: '+91 98111 22233',
      role: 'user',
      status: 'Suspended',
      walletBalance: 0,
      joinedDate: '2025-04-05',
      activePlan: 'Single Web Hosting'
    }
  ]);
  const [customerSearch, setCustomerSearch] = useState('');

  // New Customer Modal / Inputs
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustWallet, setNewCustWallet] = useState(1000);

  // Admin Coupons State
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'ONEHOST50', discountPct: 50, validTill: '2026-12-31', maxDiscount: 1000, active: true },
    { id: '2', code: 'FREEDOM2026', discountPct: 30, validTill: '2026-08-31', maxDiscount: 500, active: true },
    { id: '3', code: 'DIWALI75', discountPct: 75, validTill: '2026-11-15', maxDiscount: 2000, active: true }
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(20);
  const [newMaxDiscount, setNewMaxDiscount] = useState(1000);

  // Edit Plan State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editMonthlyPrice, setEditMonthlyPrice] = useState<number>(0);
  const [editRenewalPrice, setEditRenewalPrice] = useState<number>(0);

  // Edit Domain State
  const [editingDomainTld, setEditingDomainTld] = useState<string | null>(null);
  const [editRegINR, setEditRegINR] = useState<number>(0);
  const [editRenewINR, setEditRenewINR] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await fetchAdminStats();
    setStats(s);
    const inv = await fetchInvoices();
    setInvoices(inv);
  };

  // Customer Management Handlers
  const handleAddCustomer = () => {
    if (!newCustName.trim() || !newCustEmail.trim()) {
      showToast('Please enter customer name and email', 'error');
      return;
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      name: newCustName.trim(),
      email: newCustEmail.trim(),
      phone: newCustPhone.trim() || '+91 90000 00000',
      role: 'user',
      status: 'Active',
      walletBalance: newCustWallet,
      joinedDate: new Date().toISOString().split('T')[0],
      activePlan: 'No Active Plan'
    };
    setCustomers([newUser, ...customers]);
    setNewCustName('');
    setNewCustEmail('');
    setNewCustPhone('');
    setNewCustWallet(1000);
    showToast(`Customer ${newUser.name} created successfully!`, 'success');
  };

  const handleToggleCustomerStatus = (id: string) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`Account status for ${c.name} updated to ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleAddWalletBalance = (id: string) => {
    const amountStr = prompt('Enter wallet amount to add (₹):', '500');
    if (!amountStr) return;
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) return;

    setCustomers(customers.map(c => {
      if (c.id === id) {
        const newBal = c.walletBalance + amount;
        showToast(`Added ₹${amount} to ${c.name}'s wallet. New Balance: ₹${newBal}`, 'success');
        return { ...c, walletBalance: newBal };
      }
      return c;
    }));
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer ${name}?`)) {
      setCustomers(customers.filter(c => c.id !== id));
      showToast(`Deleted customer ${name}`, 'info');
    }
  };

  // Coupon Handlers
  const handleAddCoupon = () => {
    if (!newCode.trim()) {
      showToast('Please enter a valid promo code', 'error');
      return;
    }
    const coupon = {
      id: 'c_' + Date.now(),
      code: newCode.trim().toUpperCase(),
      discountPct: newDiscount,
      validTill: '2026-12-31',
      maxDiscount: newMaxDiscount,
      active: true
    };
    setCoupons([coupon, ...coupons]);
    setNewCode('');
    setNewDiscount(20);
    showToast(`Created Promo Code ${coupon.code}!`, 'success');
  };

  const handleToggleCouponActive = (id: string) => {
    setCoupons(coupons.map(c => {
      if (c.id === id) {
        const next = !c.active;
        showToast(`Promo Code ${c.code} is now ${next ? 'Active' : 'Disabled'}`, 'info');
        return { ...c, active: next };
      }
      return c;
    }));
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    setCoupons(coupons.filter(c => c.id !== id));
    showToast(`Deleted Promo Code ${code}`, 'info');
  };

  // Plan Price Handlers
  const handleStartEditPlan = (plan: HostingPlan) => {
    setEditingPlanId(plan.id);
    setEditMonthlyPrice(plan.monthlyPriceINR);
    setEditRenewalPrice(plan.renewalPriceINR);
  };

  const handleSavePlanPrice = (planId: string) => {
    setPlansList(plansList.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          monthlyPriceINR: editMonthlyPrice,
          renewalPriceINR: editRenewalPrice
        };
      }
      return p;
    }));
    setEditingPlanId(null);
    showToast('Plan rates updated successfully!', 'success');
  };

  // Domain Price Handlers
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>Super Admin Command Center</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Complete Control Panel: Rates, Customers, Coupons, Invoices & Infrastructure</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>All 18 Global Edge Nodes Live</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Overview & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'customers'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Manager ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'plans'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Plan Rates & Pricing ({plansList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'discounts'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Coupons & Discounts ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('domains')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'domains'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Domain Rates ({domainList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'invoices'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices & Orders ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('margins')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'margins'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Hosting Margin % & Profitability</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_config')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ai_config'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-300" />
          <span>AI Models & Prompt Quality</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'payouts'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
              : 'bg-amber-950/40 text-amber-300 hover:text-white border border-amber-500/30'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Cash Payout Requests ({payoutRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Total Registered Customers</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{(stats?.totalUsers || 14280).toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+14% new users this month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Monthly Recurring Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{formatPrice(stats?.monthlyRevenue || 1842900)}</div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+22% MRR Growth YoY</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Active Hosting Instances</span>
                <Server className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">{(stats?.hostingAccounts || 1242).toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">99.99% Uptime SLA</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Active Domain Registrations</span>
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">{(stats?.domainsRegistered || 3822).toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">DNS Zones Synced</div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Admin Control Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('customers')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
              >
                <Users className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">Manage Customers</div>
                <div className="text-xs text-slate-400">Add wallet credits, suspend or activate customer accounts</div>
              </button>

              <button
                onClick={() => setActiveTab('plans')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
              >
                <Server className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">Edit Hosting Rates</div>
                <div className="text-xs text-slate-400">Modify plan prices, renewal rates, and NVMe specs</div>
              </button>

              <button
                onClick={() => setActiveTab('discounts')}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
              >
                <Tag className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-sm text-white">Create Discount Coupons</div>
                <div className="text-xs text-slate-400">Add marketing promo codes, discount %, and limits</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMERS MANAGER */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Create New Customer Bar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>Add New Customer Account</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={newCustName}
                onChange={e => setNewCustName(e.target.value)}
                placeholder="Full Name"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
              <input
                type="email"
                value={newCustEmail}
                onChange={e => setNewCustEmail(e.target.value)}
                placeholder="Email Address"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                value={newCustPhone}
                onChange={e => setNewCustPhone(e.target.value)}
                placeholder="Phone Number (+91...)"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                value={newCustWallet}
                onChange={e => setNewCustWallet(Number(e.target.value))}
                placeholder="Initial Wallet (₹)"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleAddCustomer}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Customer Account</span>
            </button>
          </div>

          {/* Customer Search & Table */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>All Registered Customers</span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  placeholder="Search customer name/email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Wallet Balance</th>
                    <th className="p-3">Active Service</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white">
                        <div>{c.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">ID: {c.id}</div>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div>{c.email}</div>
                        <div className="text-[11px] text-slate-400">{c.phone}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                          c.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}>
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        {formatPrice(c.walletBalance)}
                      </td>
                      <td className="p-3 text-slate-300">
                        {c.activePlan}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleAddWalletBalance(c.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-bold text-[11px]"
                          title="Add Wallet Balance"
                        >
                          + Wallet
                        </button>
                        <button
                          onClick={() => handleToggleCustomerStatus(c.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                            c.status === 'Active'
                              ? 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border-amber-500/30'
                              : 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {c.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id, c.name)}
                          className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30"
                          title="Delete Customer"
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

      {/* TAB 3: HOSTING PLAN RATES MANAGER */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                <span>Hosting Plans & Pricing Rates Editor</span>
              </div>
              <span className="text-xs text-slate-400">All changes apply instantly across main page</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plansList.map(plan => {
                const isEditing = editingPlanId === plan.id;

                return (
                  <div key={plan.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-base text-white flex items-center gap-2">
                          <span>{plan.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                            {plan.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{plan.websites} • {plan.storage}</div>
                      </div>

                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEditPlan(plan)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Rates</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSavePlanPrice(plan.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-600/20"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div>
                          <div className="text-slate-500 text-[10px]">Monthly Rate:</div>
                          <div className="font-bold text-white">{formatPrice(plan.monthlyPriceINR)}/mo</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Renewal Rate:</div>
                          <div className="font-bold text-slate-300">{formatPrice(plan.renewalPriceINR)}/mo</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Original Price:</div>
                          <div className="font-bold text-slate-400 line-through">{formatPrice(plan.originalPriceINR)}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Monthly Price (₹):</label>
                          <input
                            type="number"
                            value={editMonthlyPrice}
                            onChange={e => setEditMonthlyPrice(Number(e.target.value))}
                            className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Renewal Price (₹):</label>
                          <input
                            type="number"
                            value={editRenewalPrice}
                            onChange={e => setEditRenewalPrice(Number(e.target.value))}
                            className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DISCOUNTS & COUPON CODES */}
      {activeTab === 'discounts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              <span>Discount Coupons & Promo Codes Manager</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
                placeholder="PROMO CODE (e.g. DIWALI50)"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono uppercase text-white focus:outline-none"
              />
              <input
                type="number"
                value={newDiscount}
                onChange={e => setNewDiscount(Number(e.target.value))}
                placeholder="Discount %"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                value={newMaxDiscount}
                onChange={e => setNewMaxDiscount(Number(e.target.value))}
                placeholder="Max Discount Cap (₹)"
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleAddCoupon}
                className="py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {coupons.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base text-purple-300 font-mono flex items-center gap-2">
                      <span>{c.code}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        c.active
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        {c.active ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {c.discountPct}% OFF • Max Discount {formatPrice(c.maxDiscount)} • Valid till {c.validTill}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCouponActive(c.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                    >
                      {c.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c.id, c.code)}
                      className="p-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DOMAIN EXTENSION PRICING */}
      {activeTab === 'domains' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Domain Extension Rates & Renewals</span>
              </div>
              <span className="text-xs text-slate-400">All TLD registration rates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {domainList.map(item => {
                const isEditing = editingDomainTld === item.tld;

                return (
                  <div key={item.tld} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-xl text-cyan-400 font-mono">{item.tld}</div>
                        <div className="text-[11px] text-slate-400">{item.category}</div>
                      </div>

                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEditDomain(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveDomainPrice(item.tld)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>

                    {!isEditing ? (
                      <div className="space-y-1 text-xs pt-1 border-t border-slate-800/80">
                        <div className="flex justify-between text-slate-300">
                          <span>Register Price:</span>
                          <span className="font-bold text-white">{formatPrice(item.registerINR)}/yr</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Renewal Price:</span>
                          <span>{formatPrice(item.renewINR)}/yr</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1 border-t border-slate-800">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Register (₹):</label>
                          <input
                            type="number"
                            value={editRegINR}
                            onChange={e => setEditRegINR(Number(e.target.value))}
                            className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Renew (₹):</label>
                          <input
                            type="number"
                            value={editRenewINR}
                            onChange={e => setEditRenewINR(Number(e.target.value))}
                            className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INVOICES & ORDERS LOG */}
      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Customer Transaction & Razorpay Payment Logs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3">Invoice ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-400">{inv.id}</td>
                      <td className="p-3 font-semibold text-white">Raj Sahani</td>
                      <td className="p-3 text-slate-300">{inv.description}</td>
                      <td className="p-3 text-slate-400">{inv.paymentMethod}</td>
                      <td className="p-3 font-bold text-white">{formatPrice(inv.totalAmount)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {inv.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: HOSTING MARGIN % & PROFITABILITY ANALYSIS */}
      {activeTab === 'margins' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-xl text-white flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <span>Hosting Profit Margins & Cost Analytics</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Comprehensive breakdown of wholesale bare-metal cost vs customer retail price across Web Hosting, VPS, Domains & AI.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-right">
                <div className="text-[10px] font-bold text-emerald-300 uppercase">Average Gross Profit Margin</div>
                <div className="text-2xl font-black text-white">76.4%</div>
              </div>
            </div>
          </div>

          {/* Detailed Product Margin Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Single Web Hosting */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Single Web Hosting</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  81% MARGIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Entry level cPanel/NVMe SSD cloud container</p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Retail Price:</span>
                  <span className="font-bold text-white">₹79/mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wholesale Cost:</span>
                  <span className="text-rose-400">₹15/mo</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Profit / Sub:</span>
                  <span>+₹64/mo</span>
                </div>
              </div>
            </div>

            {/* 2. Premium Web Hosting */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Premium Web Hosting</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  81.2% MARGIN
                </span>
              </div>
              <p className="text-xs text-slate-400">100 Websites, Free Domain & SSL</p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Retail Price:</span>
                  <span className="font-bold text-white">₹149/mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wholesale Cost:</span>
                  <span className="text-rose-400">₹28/mo</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Profit / Sub:</span>
                  <span>+₹121/mo</span>
                </div>
              </div>
            </div>

            {/* 3. Business Cloud Hosting */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Business Cloud Hosting</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  82.0% MARGIN
                </span>
              </div>
              <p className="text-xs text-slate-400">200 Websites, Daily Backups & CDN</p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Retail Price:</span>
                  <span className="font-bold text-white">₹249/mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Wholesale Cost:</span>
                  <span className="text-rose-400">₹45/mo</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Profit / Sub:</span>
                  <span>+₹204/mo</span>
                </div>
              </div>
            </div>

            {/* 4. Cloud VPS 4-Core Server */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Cloud VPS (4 vCPU / 8GB)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  64.4% MARGIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Dedicated KVM instance for high traffic apps</p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Retail Price:</span>
                  <span className="font-bold text-white">₹899/mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bare-Metal Cost:</span>
                  <span className="text-rose-400">₹320/mo</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Profit / Sub:</span>
                  <span>+₹579/mo</span>
                </div>
              </div>
            </div>

            {/* 5. Domain Registrations (.com / .in) */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Domain Extensions (.in)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  41.8% MARGIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Registrar registry cost vs retail sale price</p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Retail Price:</span>
                  <span className="font-bold text-white">₹499/yr</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Registry Cost:</span>
                  <span className="text-rose-400">₹290/yr</span>
                </div>
                <div className="flex justify-between text-cyan-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Profit / Domain:</span>
                  <span>+₹209/yr</span>
                </div>
              </div>
            </div>

            {/* 6. AI Token Generation */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">AI Vibe Tokens & Code Gen</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  86.6% MARGIN
                </span>
              </div>
              <p className="text-xs text-slate-400">Gemini 2.5 API token wholesale cost vs AI credits</p>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Retail Rate / 1k Tokens:</span>
                  <span className="font-bold text-white">₹0.15</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>LLM Wholesale Cost:</span>
                  <span className="text-rose-400">₹0.02</span>
                </div>
                <div className="flex justify-between text-purple-400 font-bold border-t border-slate-800 pt-1.5">
                  <span>Net Margin / 1k Tokens:</span>
                  <span>+₹0.13</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Projected Profitability Calculator */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>Interactive Monthly Net Profit Simulator</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Active Subscribers Count</label>
                <input
                  type="number"
                  value={calcSubscribers}
                  onChange={e => setCalcSubscribers(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Avg Retail Plan Rate (₹/mo)</label>
                <input
                  type="number"
                  value={calcAvgHostingPlan}
                  onChange={e => setCalcAvgHostingPlan(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Wholesale Bare-Metal Cost (₹/mo)</label>
                <input
                  type="number"
                  value={calcWholesaleCost}
                  onChange={e => setCalcWholesaleCost(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Live Calculation Output */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Gross Revenue / Month</div>
                <div className="text-2xl font-black text-white mt-1">
                  {formatPrice(calcSubscribers * calcAvgHostingPlan)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Server Infrastructure Cost</div>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  {formatPrice(calcSubscribers * calcWholesaleCost)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40">
                <div className="text-[11px] font-bold text-emerald-300 uppercase">Net Monthly Profit</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {formatPrice(calcSubscribers * (calcAvgHostingPlan - calcWholesaleCost))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AI MODELS & SYSTEM PROMPTS CONFIGURATION */}
      {activeTab === 'ai_config' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>AI Engine & Model Routing Configuration</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Ensure 100% reliable AI generations for SaaS, websites, and apps across all deployment environments.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>GEMINI_API_KEY ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SaaS & App Builder Model */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>SaaS & Complex App Builder Model</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    DEEP LOGIC
                  </span>
                </div>
                <p className="text-xs text-slate-400">Used for generating full-stack SaaS apps, dashboards, and multi-component react apps.</p>
                <select
                  value={primaryAiModel}
                  onChange={e => setPrimaryAiModel(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended - Maximum Intelligence)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast Speed)</option>
                </select>
              </div>

              {/* Website Builder Model */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>Website & Landing Page Builder Model</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    SPEED & BEAUTY
                  </span>
                </div>
                <p className="text-xs text-slate-400">Used for generating single-page websites, portfolio sites, and landing pages.</p>
                <select
                  value={websiteModel}
                  onChange={e => setWebsiteModel(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Instant Render)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (In-depth styling)</option>
                </select>
              </div>
            </div>

            {/* Token Limit & Strict Code Prompt Settings */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Code Generation Completeness Guarantees</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Max Generation Output Tokens</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={e => setMaxTokens(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Set to 8,192 tokens to allow long complete code outputs without truncation.</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">System Prompt Quality Guard</label>
                  <select
                    value={systemPromptQuality}
                    onChange={e => setSystemPromptQuality(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  >
                    <option value="ultra_strict">Ultra Strict (Zero placeholders allowed, 100% working code)</option>
                    <option value="balanced">Balanced Standard</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Enforces full Tailwind CSS, working state handlers, and full components.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('AI Model Configuration updated and saved globally!', 'success')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
                >
                  Save AI Engine Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: CASH PAYOUT REQUESTS MANAGEMENT */}
      {activeTab === 'payouts' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>Referral Cash Payout Requests Management</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Review customer payout requests for invite milestone rewards. Transfer cash directly to the user's Bank Account or UPI VPA and mark as Transferred.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ADMIN PAYOUT DESK
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Payout ID</th>
                    <th className="py-3 px-3">User & Email</th>
                    <th className="py-3 px-3">Reward Tier</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Bank Account & UPI Details</th>
                    <th className="py-3 px-3">Requested Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
                  {payoutRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                        No cash payout requests found.
                      </td>
                    </tr>
                  ) : (
                    payoutRequests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-white">{req.id}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-white block">{req.userName}</span>
                          <span className="text-[10px] text-slate-400 block">{req.userEmail}</span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-amber-300">{req.rewardTier}</td>
                        <td className="py-3.5 px-3 font-black text-emerald-400 text-sm">₹{req.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-3">
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                            <span className="font-bold text-white block">{req.bankDetails.accountName} ({req.bankDetails.bankName})</span>
                            <span className="text-[10px] text-slate-300 block font-mono">
                              A/C: {req.bankDetails.accountNumber} • IFSC: {req.bankDetails.ifsc}
                            </span>
                            <span className="text-[10px] text-amber-300 font-mono font-bold block">
                              UPI: {req.bankDetails.upiId} • Ph: {req.bankDetails.phone}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400">{new Date(req.requestedAt).toLocaleDateString()}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {req.status === 'APPROVED' ? 'TRANSFERRED ✅' : req.status === 'REJECTED' ? 'REJECTED ❌' : 'PENDING APPROVAL ⏳'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => {
                                    updatePayoutStatus(req.id, 'APPROVED');
                                    showToast(`Payout #${req.id} approved! Marked ₹${req.amount} as Transferred to ${req.bankDetails.upiId}.`, 'success');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition-all cursor-pointer shadow-md"
                                >
                                  Approve & Transfer ₹{req.amount}
                                </button>
                                <button
                                  onClick={() => {
                                    updatePayoutStatus(req.id, 'REJECTED');
                                    showToast(`Payout #${req.id} rejected.`, 'info');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-[11px] border border-rose-800 transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {req.status === 'APPROVED' && (
                              <span className="text-[11px] text-emerald-400 font-extrabold">Paid via Bank/UPI</span>
                            )}
                            {req.status === 'REJECTED' && (
                              <span className="text-[11px] text-rose-400 font-bold">Declined</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ALL REFERRAL PLAN SALES ACROSS PLATFORM */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span>Real-Time Referral Plan Sales Across Platform</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Track every plan purchase generated when a customer sends a referral link (`?ref=...`) to another user!
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE SALES TRACKER ({referralSales.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Sale ID</th>
                    <th className="py-3 px-3">Referrer User</th>
                    <th className="py-3 px-3">Purchasing Customer</th>
                    <th className="py-3 px-3">Purchased Plan</th>
                    <th className="py-3 px-3">Sale Value</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3 text-right">Referral Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
                  {referralSales.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                        No referral sales recorded yet.
                      </td>
                    </tr>
                  ) : (
                    referralSales.map(sale => (
                      <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-white">{sale.id}</td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-amber-300 block">{sale.referrerName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">CODE: {sale.referrerCode}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-white block">{sale.referredCustomerName}</span>
                          <span className="text-[10px] text-slate-400 block">{sale.referredCustomerEmail}</span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-purple-300">{sale.planName}</td>
                        <td className="py-3.5 px-3 font-black text-emerald-400 text-sm">₹{sale.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-3 text-slate-400">{new Date(sale.purchasedAt).toLocaleString()}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            QUALIFIED PLAN PURCHASE ✅
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
    </div>
  );
};
