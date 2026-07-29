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
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchAdminStats, fetchInvoices } from '../services/api';
import { AdminStats, InvoiceItem, HostingPlan } from '../types';
import { HOSTING_PLANS, DOMAIN_PRICING, DomainPricingItem } from '../data/hostingPlans';

export const AdminDashboard: React.FC = () => {
  const { formatPrice } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'plans' | 'discounts' | 'domains' | 'invoices'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

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
    </div>
  );
};
