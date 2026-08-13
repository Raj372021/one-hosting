import React, { useState, useEffect } from 'react';
import {
  Server,
  Globe,
  Rocket,
  CreditCard,
  Headphones,
  Plus,
  Settings,
  ExternalLink,
  ShieldCheck,
  Activity,
  HardDrive,
  FileText,
  Clock,
  RefreshCw,
  PlusCircle,
  Folder,
  Send,
  AlertCircle,
  CheckCircle2,
  Gift,
  Home,
  Mail,
  Layers,
  Sparkles,
  ShoppingBag,
  FileCode,
  Wrench,
  Layout,
  Bot,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Cpu,
  Database,
  Lock,
  Zap,
  ArrowRight,
  ArrowLeft,
  Workflow,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  fetchUserDomains,
  fetchHostingAccounts,
  fetchDeployments,
  fetchInvoices,
  fetchTickets,
  deployApplication,
  createTicket,
  replyTicket
} from '../services/api';
import { RegisteredDomain, HostingAccount, DeploymentItem, InvoiceItem, SupportTicket } from '../types';
import { DNSManagerModal } from '../components/DNSManagerModal';
import { HostingControlPanelModal } from '../components/HostingControlPanelModal';
import { InvoicePdfModal } from '../components/InvoicePdfModal';
import { RazorpayModal } from '../components/RazorpayModal';
import { AiWebsiteBuilderHub } from '../components/AiWebsiteBuilderHub';
import { N8nAutomationHub } from '../components/N8nAutomationHub';

export const UserDashboard: React.FC = () => {
  const { user, updateProfile, formatPrice, topUpWallet, addAiCredits, setCurrentView, toggleN8nWorkflow, addToCart, saveBankDetails, requestPayout, referralSales } = useAuth();
  const { showToast } = useToast();

  // Sidebar Active Menu State (hPanel style)
  const [sidebarTab, setSidebarTab] = useState<
    | 'home'
    | 'websites'
    | 'wordpress'
    | 'horizons'
    | 'builder'
    | 'webapps'
    | 'php'
    | 'migrations'
    | 'domains'
    | 'emails'
    | 'more_services'
    | 'email_marketing'
    | 'ecommerce'
    | 'ai_agents'
    | 'n8n_automations'
    | 'invites'
    | 'billing'
    | 'tickets'
    | 'profile'
  >('home');

  const [websitesExpanded, setWebsitesExpanded] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Bank Account & UPI State
  const [bankAccountName, setBankAccountName] = useState(user?.bankDetails?.accountName || 'Raj Sahani');
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || 'HDFC Bank');
  const [bankAccountNumber, setBankAccountNumber] = useState(user?.bankDetails?.accountNumber || '5010023948123');
  const [bankIfsc, setBankIfsc] = useState(user?.bankDetails?.ifsc || 'HDFC0001234');
  const [bankUpiId, setBankUpiId] = useState(user?.bankDetails?.upiId || 'rajsahani@upi');
  const [bankPhone, setBankPhone] = useState(user?.bankDetails?.phone || user?.phone || '+91 98765 43210');

  // Data States
  const [domains, setDomains] = useState<RegisteredDomain[]>([]);
  const [hostingAccounts, setHostingAccounts] = useState<HostingAccount[]>([]);
  const [deployments, setDeployments] = useState<DeploymentItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Modals State
  const [selectedDnsDomain, setSelectedDnsDomain] = useState<RegisteredDomain | null>(null);
  const [selectedHostingCpanel, setSelectedHostingCpanel] = useState<HostingAccount | null>(null);
  const [selectedInvoicePdf, setSelectedInvoicePdf] = useState<InvoiceItem | null>(null);
  const [selectedCreditPack, setSelectedCreditPack] = useState<{ name: string; credits: number; price: number } | null>(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // New Deployment Form
  const [deployProjectName, setDeployProjectName] = useState('');
  const [deployRepoUrl, setDeployRepoUrl] = useState('');
  const [deployDomain, setDeployDomain] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // New Ticket Form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [ticketMessage, setTicketMessage] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Migration Form
  const [migrationDomain, setMigrationDomain] = useState('');
  const [migrationSourceUrl, setMigrationSourceUrl] = useState('');

  // Email Account Form
  const [newEmailUser, setNewEmailUser] = useState('');
  const [newEmailDomain, setNewEmailDomain] = useState('techventure.in');
  const [userEmails, setUserEmails] = useState([
    { id: '1', address: 'admin@techventure.in', quota: '10 GB', status: 'Active' },
    { id: '2', address: 'support@techventure.in', quota: '5 GB', status: 'Active' }
  ]);

  // Profile Form State
  const [editName, setEditName] = useState(user?.name || 'Raj Sahani');
  const [editEmail, setEditEmail] = useState(user?.email || 'rajsahani.RgcS@gmail.com');
  const [editPhone, setEditPhone] = useState(user?.phone || '+91 98765 43210');
  const [editGstin, setEditGstin] = useState(user?.gstin || '07AAAAA0000A1Z5');
  const [profilePass, setProfilePass] = useState('');
  const [profileConfirmPass, setProfileConfirmPass] = useState('');
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profilePass && profilePass !== profileConfirmPass) {
      showToast('Passwords do not match', 'error');
      return;
    }

    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      gstin: editGstin,
      twoFactorEnabled: twoFactor
    });

    showToast('✅ Account profile details updated successfully!', 'success');
    setProfilePass('');
    setProfileConfirmPass('');
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const doms = await fetchUserDomains();
    const hosts = await fetchHostingAccounts();
    const deps = await fetchDeployments();
    const invs = await fetchInvoices();
    const tcks = await fetchTickets();

    setDomains(doms);
    setHostingAccounts(hosts);
    setDeployments(deps);
    setInvoices(invs);
    setTickets(tcks);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://onehost.cloud/ref?user=${user?.id || 'raj123'}`);
    setCopiedReferral(true);
    showToast('Referral link copied! Share to earn ₹13,000 per sign-up', 'success');
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const handleDeployApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deployProjectName.trim()) {
      showToast('Project name required', 'error');
      return;
    }

    setIsDeploying(true);
    const newDep = await deployApplication({
      projectName: deployProjectName,
      repoUrl: deployRepoUrl || 'github.com/onehost/sample-app',
      customDomain: deployDomain || 'techventure.in',
      envVars: [{ key: 'NODE_ENV', value: 'production' }]
    });

    setIsDeploying(false);
    if (newDep) {
      showToast(`Deployment "${newDep.projectName}" triggered!`, 'success');
      setDeployments([newDep, ...deployments]);
      setDeployProjectName('');
      setDeployRepoUrl('');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Subject and message required', 'error');
      return;
    }

    const res = await createTicket({
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      message: ticketMessage
    });

    if (res.success) {
      showToast(`Support Ticket #${res.ticket.id} created!`, 'success');
      setTickets([res.ticket, ...tickets]);
      setTicketSubject('');
      setTicketMessage('');
    }
  };

  const handleCreateEmailAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailUser.trim()) {
      showToast('Please enter an email prefix', 'error');
      return;
    }
    const fullEmail = `${newEmailUser.trim().toLowerCase()}@${newEmailDomain}`;
    setUserEmails([...userEmails, { id: 'em_' + Date.now(), address: fullEmail, quota: '10 GB', status: 'Active' }]);
    setNewEmailUser('');
    showToast(`Created email address ${fullEmail}!`, 'success');
  };

  const handleStartMigration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!migrationDomain.trim()) {
      showToast('Please enter website domain to migrate', 'error');
      return;
    }
    showToast(`Automated migration request queued for ${migrationDomain}! Our team will transfer it within 2 hours.`, 'success');
    setMigrationDomain('');
    setMigrationSourceUrl('');
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!ticketReplyText.trim()) return;
    const res = await replyTicket(ticketId, ticketReplyText);
    if (res.success) {
      showToast('Reply submitted!', 'success');
      setTicketReplyText('');
      loadDashboardData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Ribbon Banner: Refer & Earn (Hostinger style) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/80 via-slate-900 to-indigo-950 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>Refer & earn up to $160 (₹13,000) per friend!</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE PROGRAM
              </span>
            </div>
            <p className="text-xs text-slate-300">Invite developers or business owners and earn 20% recurring commission on every hosting plan bought.</p>
          </div>
        </div>

        <button
          onClick={handleCopyReferral}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
        >
          {copiedReferral ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedReferral ? 'Link Copied!' : 'Copy Referral Link'}</span>
        </button>
      </div>

      {/* Main Container with Left Sidebar & Right View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR (hPanel exact layout) */}
        <aside className="lg:col-span-3 rounded-2xl bg-slate-900 border border-slate-800 p-3 space-y-4">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="font-black text-xs text-slate-400 uppercase tracking-wider">hPanel Navigation</div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {/* Home */}
            <button
              onClick={() => setSidebarTab('home')}
              className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'home'
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Websites Parent Menu */}
            <div>
              <button
                onClick={() => {
                  setWebsitesExpanded(!websitesExpanded);
                  setSidebarTab('websites');
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                  sidebarTab === 'websites' || ['wordpress', 'horizons', 'builder', 'webapps', 'php', 'migrations'].includes(sidebarTab)
                    ? 'bg-slate-800/80 text-white font-bold border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layout className="w-4 h-4 text-purple-400" />
                  <span>Websites</span>
                </div>
                {websitesExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {/* Sub-items */}
              {websitesExpanded && (
                <div className="ml-4 pl-3 border-l border-slate-800 space-y-1 my-1">
                  <button
                    onClick={() => setSidebarTab('wordpress')}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
                      sidebarTab === 'wordpress' ? 'text-purple-300 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>WordPress</span>
                  </button>

                  <button
                    onClick={() => setSidebarTab('horizons')}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                      sidebarTab === 'horizons' ? 'text-purple-300 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Horizons</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">AI</span>
                  </button>

                  <button
                    onClick={() => setSidebarTab('builder')}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
                      sidebarTab === 'builder' ? 'text-purple-300 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Website Builder</span>
                  </button>

                  <button
                    onClick={() => setSidebarTab('webapps')}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
                      sidebarTab === 'webapps' ? 'text-purple-300 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Web Apps</span>
                  </button>

                  <button
                    onClick={() => setSidebarTab('php')}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
                      sidebarTab === 'php' ? 'text-purple-300 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>PHP / HTML</span>
                  </button>

                  <button
                    onClick={() => setSidebarTab('migrations')}
                    className={`w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors ${
                      sidebarTab === 'migrations' ? 'text-purple-300 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Migrations</span>
                  </button>
                </div>
              )}
            </div>

            {/* Domains */}
            <button
              onClick={() => setSidebarTab('domains')}
              className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'domains'
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Domains</span>
            </button>

            {/* Emails */}
            <button
              onClick={() => setSidebarTab('emails')}
              className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'emails'
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Emails</span>
            </button>

            <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              OneHost Apps
            </div>

            {/* Horizons App */}
            <button
              onClick={() => setSidebarTab('horizons')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'horizons' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Horizons</span>
            </button>

            {/* Email Marketing */}
            <button
              onClick={() => setSidebarTab('email_marketing')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'email_marketing' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Email marketing</span>
            </button>

            {/* Ecommerce */}
            <button
              onClick={() => setSidebarTab('ecommerce')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'ecommerce' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-rose-400" />
              <span>Ecommerce</span>
            </button>

            <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              AI Agents & Automations
            </div>

            {/* Vibe Coding & AI Agents */}
            <button
              onClick={() => setSidebarTab('ai_agents')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'ai_agents' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>Vibe Coding Agent</span>
            </button>

            {/* n8n Automation Workflows */}
            <button
              onClick={() => setSidebarTab('n8n_automations')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-all ${
                sidebarTab === 'n8n_automations' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Workflow className="w-4 h-4 text-purple-400" />
                <span>n8n Workflows</span>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                ACTIVE
              </span>
            </button>

            <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Referral Rewards & Cash
            </div>

            {/* Invite & Earn Cash Button */}
            <button
              onClick={() => setSidebarTab('invites')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-all border ${
                sidebarTab === 'invites'
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md'
                  : 'bg-amber-950/30 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Invite & Earn Cash</span>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                ₹10,000
              </span>
            </button>

            <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Billing & Support
            </div>

            <button
              onClick={() => setSidebarTab('billing')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'billing' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Invoices & GST</span>
            </button>

            <button
              onClick={() => setSidebarTab('tickets')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'tickets' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>Support Desk</span>
            </button>

            <button
              onClick={() => setSidebarTab('profile')}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'profile' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4 text-cyan-400" />
              <span>Account & Profile</span>
            </button>
          </nav>
        </aside>

        {/* RIGHT MAIN VIEW AREA */}
        <main className="lg:col-span-9 space-y-6">
          {/* USER WELCOME BAR */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={user?.avatar} alt={user?.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/40" />
              <div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Welcome back, {user?.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-400">{user?.email} • Member since 2025</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">AI Credits:</span>
                <span className="font-extrabold text-white">{user?.aiCredits ?? 100}</span>
              </div>

              <button
                onClick={() => setSidebarTab('billing')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all border border-cyan-400/30"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>+ Buy AI Credits</span>
              </button>

              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-1.5">
                <span className="text-slate-400">Wallet:</span>
                <span className="font-bold text-emerald-400">{formatPrice(user?.walletBalance || 0)}</span>
              </div>

              <button
                onClick={() => {
                  topUpWallet(1000);
                  showToast('Added ₹1,000 to your wallet balance!', 'success');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                + Add Funds
              </button>
            </div>
          </div>

          {/* VIEW 1: HOME */}
          {sidebarTab === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Active Subscriptions & Instant Activated Services */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-base text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span>Active Customer Subscriptions & Automations</span>
                    </div>
                    <p className="text-xs text-slate-400">Instantly activated plans linked to your profile with active credentials & URLs.</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('pricing')}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all"
                  >
                    + Upgrade / Add Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(user?.subscriptions || []).map(sub => (
                    <div key={sub.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-base text-white flex items-center gap-2">
                            <span>{sub.title}</span>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {sub.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                          🟢 ACTIVE
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">{sub.details}</p>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1 text-xs font-mono text-slate-300">
                        {sub.instanceUrl && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Instance URL:</span>
                            <a href={sub.instanceUrl} target="_blank" rel="noreferrer" className="text-purple-400 font-bold hover:underline">
                              {sub.instanceUrl}
                            </a>
                          </div>
                        )}
                        {sub.webhookUrl && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Webhook:</span>
                            <span className="text-cyan-300 font-bold truncate max-w-[180px]">{sub.webhookUrl}</span>
                          </div>
                        )}
                        {sub.apiKey && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">API Key:</span>
                            <span className="text-amber-400 font-bold">{sub.apiKey}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-slate-800/50">
                          <span className="text-slate-500">Monthly Price:</span>
                          <span className="text-emerald-400 font-bold">{formatPrice(sub.monthlyPrice)} / mo</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {sub.category === 'n8n' ? (
                          <button
                            onClick={() => setSidebarTab('n8n_automations')}
                            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2"
                          >
                            <Workflow className="w-4 h-4" />
                            <span>Launch n8n Workflow Studio</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast(`Accessing Control Panel for ${sub.title}...`, 'info')}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Manage Plan Settings</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Active Hosting Accounts</div>
                  <div className="text-2xl font-black text-white">{hostingAccounts.length} Sites</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">100% Operational</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Registered Domains</div>
                  <div className="text-2xl font-black text-white">{domains.length} Domains</div>
                  <div className="text-[11px] text-cyan-400 font-semibold">DNS Zone Active</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Professional Mailboxes</div>
                  <div className="text-2xl font-black text-white">{userEmails.length} Emails</div>
                  <div className="text-[11px] text-amber-400 font-semibold">SpamGuard Active</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Open Support Tickets</div>
                  <div className="text-2xl font-black text-purple-400">{tickets.filter(t => t.status !== 'Resolved').length} Active</div>
                  <div className="text-[11px] text-slate-400">Response &lt; 10 min</div>
                </div>
              </div>

              {/* Active Hosting Accounts List */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base text-white">Your Hosting Services</div>
                  <button
                    onClick={() => setCurrentView('hosting')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Purchase New Hosting</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hostingAccounts.map(host => (
                    <div key={host.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-base text-white">{host.domain}</div>
                          <div className="text-xs text-slate-400">{host.planName} • {host.datacenter}</div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded-lg">
                        <div>IP: <span className="text-white">{host.serverIp}</span></div>
                        <div>Renew: <span className="text-white">{new Date(host.renewAt).toLocaleDateString()}</span></div>
                      </div>

                      <button
                        onClick={() => setSelectedHostingCpanel(host)}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Open hPanel / cPanel</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: WEBSITES / WORDPRESS / HORIZONS / BUILDER / WEB APPS / PHP / MIGRATIONS */}
          {['websites', 'wordpress', 'horizons', 'builder', 'webapps', 'php', 'migrations'].includes(sidebarTab) && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-lg text-white capitalize flex items-center gap-2">
                    <Layout className="w-5 h-5 text-purple-400" />
                    <span>
                      {sidebarTab === 'websites' && 'Websites & Hosting Manager'}
                      {sidebarTab === 'wordpress' && '1-Click WordPress Manager'}
                      {sidebarTab === 'horizons' && 'Horizons No-Code AI Builder'}
                      {sidebarTab === 'builder' && 'Drag-and-Drop Website Builder'}
                      {sidebarTab === 'webapps' && 'Web Apps & Node.js / Python Deployer'}
                      {sidebarTab === 'php' && 'PHP / HTML Settings & File Manager'}
                      {sidebarTab === 'migrations' && 'Automated Website Migration Service'}
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentView('hosting')}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Website</span>
                  </button>
                </div>

                {/* Sub-tab Specific Content */}
                {(sidebarTab === 'builder' || sidebarTab === 'horizons' || sidebarTab === 'webapps') && (
                  <div className="pt-2">
                    <AiWebsiteBuilderHub initialAgent={sidebarTab === 'horizons' ? 'brand' : sidebarTab === 'webapps' ? 'db' : 'builder'} />
                  </div>
                )}

                {sidebarTab === 'wordpress' && (
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="font-bold text-sm text-purple-300">WordPress Auto-Installer</div>
                    <p className="text-slate-400">Install WordPress 6.7 with WP-CLI, LiteSpeed Cache, SSL, and Staging Environment in 1-Click.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <button
                        onClick={() => showToast('WordPress core installed successfully on techventure.in!', 'success')}
                        className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 font-bold text-center"
                      >
                        Install WordPress
                      </button>
                      <button
                        onClick={() => showToast('Staging environment created: staging.techventure.in', 'info')}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-center hover:bg-slate-800"
                      >
                        Create Staging Site
                      </button>
                      <button
                        onClick={() => showToast('Flushed LiteSpeed Cache on all domains', 'success')}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-center hover:bg-slate-800"
                      >
                        Purge LSCache
                      </button>
                    </div>
                  </div>
                )}

                {sidebarTab === 'migrations' && (
                  <form onSubmit={handleStartMigration} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                    <div className="font-bold text-sm text-emerald-400">Request Free Website Migration</div>
                    <p className="text-slate-400">Transfer your website from Hostinger, Bluehost, GoDaddy or cPanel with 0 downtime.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={migrationDomain}
                        onChange={e => setMigrationDomain(e.target.value)}
                        placeholder="Domain to Migrate (e.g. mysite.com)"
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={migrationSourceUrl}
                        onChange={e => setMigrationSourceUrl(e.target.value)}
                        placeholder="Current cPanel/wp-admin URL"
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                    >
                      Submit Migration Request
                    </button>
                  </form>
                )}

                {/* Websites List */}
                <div className="space-y-3 pt-2">
                  {hostingAccounts.map(host => (
                    <div key={host.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{host.domain}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">WordPress 6.7</span>
                        </div>
                        <div className="text-slate-400 mt-1">PHP 8.3 • LiteSpeed Enterprise • SSL Active</div>
                      </div>
                      <button
                        onClick={() => setSelectedHostingCpanel(host)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                      >
                        Manage Website
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: DOMAINS */}
          {sidebarTab === 'domains' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg text-white">Registered Domain Names</div>
                <button
                  onClick={() => setCurrentView('domains')}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Domain</span>
                </button>
              </div>

              <div className="space-y-3">
                {domains.map(dom => (
                  <div key={dom.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-lg text-white">{dom.domainName}</div>
                      <div className="text-xs text-slate-400">
                        Expires: {dom.expiresAt} • WHOIS Privacy: <span className="text-emerald-400 font-bold">ENABLED</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDnsDomain(dom)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span>DNS & Nameservers</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 4: EMAILS */}
          {sidebarTab === 'emails' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="font-bold text-base text-white">Create Business Mailbox</div>
                <form onSubmit={handleCreateEmailAccount} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3">
                    <input
                      type="text"
                      value={newEmailUser}
                      onChange={e => setNewEmailUser(e.target.value)}
                      placeholder="support"
                      className="p-2.5 bg-transparent text-xs text-white focus:outline-none flex-1"
                    />
                    <span className="text-xs text-slate-500 font-bold">@</span>
                    <select
                      value={newEmailDomain}
                      onChange={e => setNewEmailDomain(e.target.value)}
                      className="bg-transparent text-xs text-purple-400 font-bold focus:outline-none p-2"
                    >
                      {domains.map(d => (
                        <option key={d.id} value={d.domainName} className="bg-slate-900 text-white">
                          {d.domainName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Create Account
                  </button>
                </form>

                <div className="space-y-2 pt-3">
                  <div className="font-bold text-xs text-slate-400">Active Mailboxes</div>
                  {userEmails.map(m => (
                    <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-white">{m.address}</div>
                        <div className="text-[11px] text-slate-500">{m.quota} Storage • Webmail SSL Active</div>
                      </div>
                      <button
                        onClick={() => window.open('https://webmail.onehost.cloud', '_blank')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Webmail</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: MORE SERVICES */}
          {sidebarTab === 'more_services' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="font-bold text-base text-white">More Services & Security Addons</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <Lock className="w-6 h-6 text-emerald-400" />
                  <div className="font-bold text-sm text-white">Wildcard SSL Certificate</div>
                  <p className="text-xs text-slate-400">Lifetime Let's Encrypt SSL with auto-renewal on all subdomains.</p>
                  <button
                    onClick={() => showToast('Wildcard SSL re-issued for all domains!', 'success')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                  >
                    Re-issue SSL
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <Zap className="w-6 h-6 text-amber-400" />
                  <div className="font-bold text-sm text-white">Edge CDN & DDoS Guard</div>
                  <p className="text-xs text-slate-400">Global Cloudflare Enterprise edge caching and 1.2 Tbps DDoS mitigation.</p>
                  <button
                    onClick={() => showToast('Edge CDN cache purged across 18 edge nodes', 'info')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-amber-600/20 text-amber-300 border border-amber-500/30 text-xs font-bold"
                  >
                    Purge CDN Cache
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: EMAIL MARKETING & ECOMMERCE & AI AGENTS */}
          {sidebarTab === 'email_marketing' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="font-bold text-base text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <span>OneHost Email Marketing Suite</span>
              </div>
              <p className="text-xs text-slate-400">Send up to 50,000 automated emails/month to your web visitors with built-in analytics.</p>
              <button
                onClick={() => showToast('Email Campaign Builder initialized!', 'success')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Create Email Campaign
              </button>
            </div>
          )}

          {sidebarTab === 'ecommerce' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="font-bold text-base text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-400" />
                <span>OneHost Ecommerce Store Creator</span>
              </div>
              <p className="text-xs text-slate-400">Launch an online store with Razorpay UPI payment gateway, inventory management, and zero commission.</p>
              <button
                onClick={() => showToast('Store setup wizard launched!', 'success')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Launch Store Wizard
              </button>
            </div>
          )}

          {sidebarTab === 'ai_agents' && (
            <div className="animate-in fade-in duration-200">
              <AiWebsiteBuilderHub initialAgent="builder" />
            </div>
          )}

          {/* VIEW 7: BILLING & AI CREDITS */}
          {sidebarTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* TOP BACK BUTTON BAR */}
              <div className="flex items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-md">
                <button
                  onClick={() => setSidebarTab('home')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-extrabold border border-purple-500/30 transition-all group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-1 transition-transform" />
                  <span>← Back to Dashboard Home</span>
                </button>
                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                  Need custom enterprise plans? <span className="text-purple-400 hover:underline cursor-pointer font-bold" onClick={() => setSidebarTab('tickets')}>Contact Support</span>
                </div>
              </div>

              {/* AI CREDITS MONETIZATION BOX */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border border-purple-500/40 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/50 pb-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase">
                      <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>PLANS & AI CREDITS (2X DOUBLE LIMITS)</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">Choose Your Plan or Credit Pack</h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Get <strong className="text-emerald-400 font-bold">DOUBLE the AI Agent limits</strong> of Cursor & v0! Power AI website builds, Deep Research, bug fixing, and live server hosting.
                    </p>
                  </div>

                  <div className="px-5 py-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-center shrink-0">
                    <span className="text-[10px] text-purple-300 uppercase font-black block">Your Current AI Balance</span>
                    <span className="text-2xl font-black text-white">{user?.aiCredits ?? 100} Credits</span>
                  </div>
                </div>

                {/* RATE CHART & CAPACITY */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-purple-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>AI Credit Usage Rate Chart & Capacity:</span>
                    </span>
                    <span className="text-emerald-400 font-black text-[11px]">✓ 1-Click Free Hosting & SSL Included</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Website Build (Flash)</span>
                      <strong className="text-amber-300 text-xs">500 Credits / build</strong>
                      <span className="text-[9px] text-slate-400 block mt-0.5">~20 Websites in Starter</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Web App / SaaS (Pro Vibe)</span>
                      <strong className="text-purple-300 text-xs">1,000 Credits / build</strong>
                      <span className="text-[9px] text-purple-300 block mt-0.5">~50 Web Apps in Pro</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Deep Research Agent</span>
                      <strong className="text-cyan-300 text-xs">1,500 Credits / query</strong>
                      <span className="text-[9px] text-cyan-300 block mt-0.5">System Architecture</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Bug Fixer & Express DDL</span>
                      <strong className="text-emerald-300 text-xs">400 - 600 Credits / action</strong>
                      <span className="text-[9px] text-emerald-400 block mt-0.5">Refactoring & Schema</span>
                    </div>
                  </div>
                </div>

                {/* SUBSCRIPTION TIERS VS CREDIT PACKS GRID */}
                <div className="space-y-6">
                  {/* TAB HEADER */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-black text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span>Monthly Subscription Plans (2X DOUBLE Limits)</span>
                    </h4>
                    <span className="text-xs text-emerald-400 font-extrabold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      🔥 200% Capacity Compared to Cursor
                    </span>
                  </div>

                  {/* CURSOR-BASED PLANS WITH DOUBLE LIMITS */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Hobby Free */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-black uppercase">
                          Hobby
                        </span>
                        <div>
                          <h4 className="text-2xl font-black text-white">Free</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">₹0 / month</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> No credit card required</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Limited Agent requests</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Access to Composer 2.5</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 1-Click Free Web Hosting</li>
                        </ul>
                      </div>
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs cursor-default"
                      >
                        Current Plan
                      </button>
                    </div>

                    {/* Individual Pro */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-4 flex flex-col justify-between relative bg-gradient-to-b from-purple-950/20 to-slate-950">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider">
                        2X LIMITS INCLUDED
                      </span>
                      <div className="space-y-3 pt-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                          Individual Pro
                        </span>
                        <div>
                          <h4 className="text-2xl font-black text-amber-300">₹1,699 <span className="text-xs font-medium text-slate-400">($20/mo)</span></h4>
                          <span className="text-[10px] text-emerald-400 font-extrabold block mt-0.5">200,000 AI Credits (2x Cursor Pro)</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>2x DOUBLE Agent Limits</strong></li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Generous limits for Grok & Sonnet</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Access to Frontier AI Models</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> MCPs, Skills & Webhooks</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Cloud Agents & Bugbot Auditor</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            id: 'sub_ind_pro',
                            type: 'hosting',
                            title: 'Individual Pro Plan (2x Limits)',
                            subtitle: 'Monthly AI Builder Subscription ($20/mo)',
                            billingCycle: 'monthly',
                            price: 1699,
                            details: '200,000 AI Credits added every month (2x Cursor Limit)'
                          });
                          showToast('🛒 Individual Pro Plan added to cart!', 'success');
                        }}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all shadow-md"
                      >
                        Subscribe Pro (₹1,699/mo)
                      </button>
                    </div>

                    {/* Individual Pro+ */}
                    <div className="p-5 rounded-2xl bg-slate-950 border-2 border-amber-500/70 space-y-4 flex flex-col justify-between relative bg-gradient-to-b from-amber-950/20 to-slate-950 shadow-xl shadow-amber-500/10">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                        6X AGENT CAPACITY
                      </span>
                      <div className="space-y-3 pt-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                          Individual Pro+
                        </span>
                        <div>
                          <h4 className="text-2xl font-black text-amber-300">₹4,999 <span className="text-xs font-medium text-slate-400">($60/mo)</span></h4>
                          <span className="text-[10px] text-emerald-400 font-extrabold block mt-0.5">600,000 AI Credits (6x Cursor Limit)</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>6x Pro Limits on Agent</strong></li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Gemini Deep Research Coder</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Access to Sonnet 5 & Grok 4.6</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Custom Domains & Free SSL</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> GitHub Repository Sync</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            id: 'sub_ind_pro_plus',
                            type: 'hosting',
                            title: 'Individual Pro+ Plan (6x Limits)',
                            subtitle: 'Monthly Pro+ AI Builder Subscription ($60/mo)',
                            billingCycle: 'monthly',
                            price: 4999,
                            details: '600,000 AI Credits added every month (6x Cursor Limit)'
                          });
                          showToast('🛒 Individual Pro+ Plan added to cart!', 'success');
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-slate-950 font-black text-xs transition-all shadow-md"
                      >
                        Subscribe Pro+ (₹4,999/mo)
                      </button>
                    </div>

                    {/* Individual Ultra */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-4 flex flex-col justify-between relative bg-gradient-to-b from-cyan-950/20 to-slate-950">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] font-black uppercase tracking-wider">
                        40X ULTRA CAPACITY
                      </span>
                      <div className="space-y-3 pt-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                          Individual Ultra
                        </span>
                        <div>
                          <h4 className="text-2xl font-black text-amber-300">₹16,999 <span className="text-xs font-medium text-slate-400">($200/mo)</span></h4>
                          <span className="text-[10px] text-emerald-400 font-extrabold block mt-0.5">2,500,000 AI Credits (40x Limit)</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> <strong>40x Pro Limits on Agent</strong></li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> ALL Frontier AI Models Unrestricted</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Bugbot Code Auditor & Fixer</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> High-Speed Compute Queue</li>
                          <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> 24/7 Priority VIP Support</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => {
                          addToCart({
                            id: 'sub_ind_ultra',
                            type: 'hosting',
                            title: 'Individual Ultra Plan (40x Limits)',
                            subtitle: 'Monthly Ultra Agency Subscription ($200/mo)',
                            billingCycle: 'monthly',
                            price: 16999,
                            details: '2,500,000 AI Credits added every month (40x Cursor Limit)'
                          });
                          showToast('🛒 Individual Ultra Plan added to cart!', 'success');
                        }}
                        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-all shadow-md"
                      >
                        Subscribe Ultra (₹16,999/mo)
                      </button>
                    </div>
                  </div>

                  {/* TEAMS & ENTERPRISE BANNER */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Teams Plan */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase">
                          Teams Plan
                        </span>
                        <span className="text-xs font-bold text-indigo-300">₹3,299 / user / mo ($40/mo)</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Includes <strong>10x Standard Agent Limits</strong> (Double Cursor Teams limit!), Centralized team billing, Team marketplace for rules & skills, Agentic code reviews with Bugbot, and shared team context.
                      </p>
                      <button
                        onClick={() => {
                          addToCart({
                            id: 'sub_teams_40',
                            type: 'hosting',
                            title: 'Teams Plan (10x Double Limits)',
                            subtitle: 'Per User Team Subscription ($40/user/mo)',
                            billingCycle: 'monthly',
                            price: 3299,
                            details: '10x Agent Limits per team member with shared workspace'
                          });
                          showToast('🛒 Teams Plan added to cart!', 'success');
                        }}
                        className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs transition-all"
                      >
                        Add Teams Seat (₹3,299/mo)
                      </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                          Enterprise Custom
                        </span>
                        <span className="text-xs font-bold text-cyan-300">Custom Billing</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Pooled usage, Invoice/PO billing, SCIM seat management, Repository & model access controls, Auto-run & network controls, Audit logs, and dedicated account manager.
                      </p>
                      <button
                        onClick={() => setSidebarTab('tickets')}
                        className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-bold text-xs transition-all"
                      >
                        Contact Enterprise Team
                      </button>
                    </div>
                  </div>

                  {/* TOP-UP CREDIT PACKS SECTION */}
                  <div className="border-t border-slate-800 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <span>Instant Top-Up Credit Packs (Lifetime Validity)</span>
                      </h4>
                      <span className="text-xs text-slate-400">One-Time Payment • No Monthly Expiry</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Starter Pack */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/50 hover:border-amber-400 space-y-3 text-center transition-all flex flex-col justify-between shadow-lg ring-1 ring-amber-500/20">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                              STARTER PACK
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold">
                              2X DOUBLE CREDITS
                            </span>
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-amber-300">1,000 Credits</h4>
                            <div className="flex items-center justify-center gap-2 mt-1">
                              <span className="text-xs text-slate-500 line-through font-bold">₹1,499</span>
                              <span className="text-xl font-black text-emerald-400">₹499</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">Build ~3 Full Websites or ~2 Web Apps</span>
                            <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 text-left border-t border-slate-800/80 pt-2">
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free Subdomain Included</div>
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free Cloud Hosting</div>
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free 1-Click Deployment</div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCreditPack({
                              name: '1,000 AI Credits Starter Pack',
                              credits: 1000,
                              price: 499
                            });
                            setIsRazorpayOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                        >
                          Buy Starter Pack (₹499)
                        </button>
                      </div>

                      {/* Pro Pack */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-3 text-center transition-all flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                            PRO VIBE BUILDER
                          </span>
                          <div>
                            <h4 className="text-2xl font-black text-amber-300">2,000 Credits</h4>
                            <div className="text-lg font-black text-purple-300 mt-0.5">₹999</div>
                            <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">Build ~6 Full Websites or ~4 Web Apps</span>
                            <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 text-left border-t border-slate-800/80 pt-2">
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free Subdomain Included</div>
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free Cloud Hosting</div>
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free 1-Click Deployment</div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCreditPack({
                              name: '2,000 AI Credits Pro Pack',
                              credits: 2000,
                              price: 999
                            });
                            setIsRazorpayOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                        >
                          Buy Pro Pack (₹999)
                        </button>
                      </div>

                      {/* Agency Ultra */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-3 text-center transition-all flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                            AGENCY ULTRA
                          </span>
                          <div>
                            <h4 className="text-2xl font-black text-amber-300">5,000 Credits</h4>
                            <div className="text-lg font-black text-cyan-400 mt-0.5">₹2,499</div>
                            <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">Build ~16 Full Websites or ~10 Web Apps</span>
                            <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 text-left border-t border-slate-800/80 pt-2">
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free Subdomain Included</div>
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free Cloud Hosting</div>
                              <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Free 1-Click Deployment</div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedCreditPack({
                              name: '5,000 AI Credits Agency Pack',
                              credits: 5000,
                              price: 2499
                            });
                            setIsRazorpayOpen(true);
                          }}
                          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                        >
                          Buy Agency Pack (₹2,499)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM BACK BUTTON FOR EASY NAVIGATION */}
                <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between">
                  <button
                    onClick={() => setSidebarTab('home')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-purple-400" />
                    <span>← Back to Dashboard Home</span>
                  </button>
                  <span className="text-xs text-slate-400 font-mono">100% Secure Checkout via Razorpay / Stripe</span>
                </div>
              </div>

              {/* GST INVOICES & BILLING HISTORY */}
              <div className="space-y-4">
                <div className="font-bold text-lg text-white">Billing History & GST Invoices</div>
                <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                        <th className="p-3">Invoice ID</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">PDF Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-950/50">
                          <td className="p-3 font-mono font-bold text-white">{inv.id}</td>
                          <td className="p-3 text-slate-400">{new Date(inv.date).toLocaleDateString()}</td>
                          <td className="p-3 text-slate-200">{inv.description}</td>
                          <td className="p-3 font-bold text-white">{formatPrice(inv.totalAmount)}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedInvoicePdf(inv)}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 ml-auto"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View PDF</span>
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

          {/* VIEW 8: TICKETS */}
          {sidebarTab === 'tickets' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="font-bold text-base text-white">Create Priority Support Ticket</div>
                <form onSubmit={handleCreateTicket} className="space-y-3">
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    placeholder="Issue Subject (e.g. SSL Certificate Renewal)"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                  <textarea
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    placeholder="Describe your request..."
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <div className="font-bold text-base text-white">Ticket History</div>
                {tickets.map(tck => (
                  <div key={tck.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-base text-white">#{tck.id}: {tck.subject}</div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {tck.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {tck.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl text-xs space-y-1 ${
                            msg.sender === 'user'
                              ? 'bg-purple-950/60 border border-purple-500/20 text-slate-200'
                              : 'bg-slate-950 border border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="font-bold text-purple-400">{msg.senderName}</div>
                          <div>{msg.content}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ticketReplyText}
                        onChange={e => setTicketReplyText(e.target.value)}
                        placeholder="Type reply..."
                        className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleReplyTicket(tck.id)}
                        className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 9: PROFILE & SECURITY SETTINGS */}
          {sidebarTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-cyan-400" />
                      <span>Account Details & Profile Settings</span>
                    </h2>
                    <p className="text-xs text-slate-400">Manage your contact information, phone number, GSTIN, and security preferences.</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    REAL ACCOUNT
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Phone Number (+91...)</label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">GSTIN Number (For Tax Invoices)</label>
                      <input
                        type="text"
                        value={editGstin}
                        onChange={e => setEditGstin(e.target.value)}
                        placeholder="07AAAAA0000A1Z5"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <span>Security & Password Update</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">New Password (Leave blank to keep current)</label>
                        <input
                          type="password"
                          value={profilePass}
                          onChange={e => setProfilePass(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={profileConfirmPass}
                          onChange={e => setProfileConfirmPass(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-white">Two-Factor Authentication (SMS / Mobile OTP)</div>
                        <p className="text-[11px] text-slate-400">Require 6-digit OTP code sent to your registered mobile phone on every sign-in.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          twoFactor
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {twoFactor ? 'ENABLED 🛡️' : 'DISABLED ⚠️'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* VIEW: N8N AUTOMATION WORKFLOWS HUB */}
          {sidebarTab === 'n8n_automations' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Active User Workflows Bar */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-purple-400" />
                      <span>Your Active n8n Workflows ({user?.n8nWorkflows?.length || 0})</span>
                    </h3>
                    <p className="text-xs text-slate-400">All active workflows run on your dedicated high-speed n8n instance.</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ENGINE ONLINE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(user?.n8nWorkflows || []).map(wf => (
                    <div key={wf.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{wf.name}</span>
                        <button
                          onClick={() => {
                            toggleN8nWorkflow(wf.id);
                            showToast(`Toggled ${wf.name} status`, 'info');
                          }}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-black border transition-all ${
                            wf.active
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {wf.active ? 'ACTIVE 🟢' : 'PAUSED ⏸️'}
                        </button>
                      </div>

                      <p className="text-xs text-slate-400">{wf.description}</p>

                      <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 flex justify-between items-center">
                        <span className="truncate max-w-[200px]">{wf.webhookUrl}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(wf.webhookUrl);
                            showToast('Webhook copied!', 'success');
                          }}
                          className="text-[10px] text-purple-400 font-bold hover:underline shrink-0"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                        <span>Executions: <strong className="text-white">{wf.executionsCount}</strong></span>
                        <span>Nodes: <strong className="text-purple-300">{wf.nodesCount}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Interactive n8n Automation Studio */}
              <N8nAutomationHub />
            </div>
          )}

          {/* VIEW: INVITE & EARN CASH REWARDS HUB */}
          {sidebarTab === 'invites' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* TOP HERO BANNER */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-purple-950 border border-amber-500/40 space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
                      <Gift className="w-8 h-8 animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-white">Invite & Earn Cash Rewards</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                          DIRECT BANK TRANSFER
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Invite developers, students, or business owners. Earn up to <strong className="text-amber-300">₹10,000 Cash</strong> transferred straight to your bank account or UPI!
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invites Completed</span>
                    <span className="text-2xl font-black text-amber-300">{user?.invitedCount || 520} Users</span>
                  </div>
                </div>

                {/* REFERRAL LINK & CODE SHARING BOX */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Your Unique Referral Code
                    </label>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 font-mono font-black text-amber-300 text-sm flex items-center justify-between">
                      <span>{user?.referralCode || 'RAJ500'}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">100% Verified</span>
                    </div>
                  </div>

                  <div className="md:col-span-7 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        const url = `https://onehost.cloud/join?ref=${user?.referralCode || 'RAJ500'}`;
                        navigator.clipboard.writeText(url);
                        showToast('Referral link copied to clipboard!', 'success');
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Referral Link</span>
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Hey! Build AI apps & websites in 60 seconds with OneHost AI. Join using my referral code ${user?.referralCode || 'RAJ500'} to get free AI credits! https://onehost.cloud/join?ref=${user?.referralCode || 'RAJ500'}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <span>💬 Share on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* REWARD TIERS MILESTONES GRID */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Invite Milestone Cash Rewards (Direct Bank Payouts)</span>
                  </h3>
                  <span className="text-xs text-slate-400">Guaranteed Cash for Every Milestone</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Tier 1 */}
                  <div className={`p-4 rounded-2xl border space-y-3 text-center flex flex-col justify-between transition-all ${
                    (user?.invitedCount || 520) >= 500
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 opacity-80'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">
                          MILESTONE 1
                        </span>
                        {(user?.invitedCount || 520) >= 500 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black">
                            UNLOCKED 🔓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">LOCKED 🔒</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">500 Invites</h4>
                        <div className="text-2xl font-black text-amber-400 mt-0.5">₹1,000 Cash</div>
                      </div>
                      <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Progress</span>
                        <span>{Math.min(user?.invitedCount || 520, 500)} / 500</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${Math.min(((user?.invitedCount || 520) / 500) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tier 2 */}
                  <div className={`p-4 rounded-2xl border space-y-3 text-center flex flex-col justify-between transition-all ${
                    (user?.invitedCount || 520) >= 1000
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">
                          MILESTONE 2
                        </span>
                        {(user?.invitedCount || 520) >= 1000 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black">
                            UNLOCKED 🔓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">IN PROGRESS</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">1,000 Invites</h4>
                        <div className="text-2xl font-black text-purple-400 mt-0.5">₹2,000 Cash</div>
                      </div>
                      <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Progress</span>
                        <span>{Math.min(user?.invitedCount || 520, 1000)} / 1000</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${Math.min(((user?.invitedCount || 520) / 1000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tier 3 */}
                  <div className={`p-4 rounded-2xl border space-y-3 text-center flex flex-col justify-between transition-all ${
                    (user?.invitedCount || 520) >= 3000
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">
                          MILESTONE 3
                        </span>
                        {(user?.invitedCount || 520) >= 3000 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black">
                            UNLOCKED 🔓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">IN PROGRESS</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">3,000 Invites</h4>
                        <div className="text-2xl font-black text-cyan-400 mt-0.5">₹6,000 Cash</div>
                      </div>
                      <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Progress</span>
                        <span>{Math.min(user?.invitedCount || 520, 3000)} / 3000</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${Math.min(((user?.invitedCount || 520) / 3000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tier 4 */}
                  <div className={`p-4 rounded-2xl border space-y-3 text-center flex flex-col justify-between transition-all ${
                    (user?.invitedCount || 520) >= 5000
                      ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">
                          MILESTONE 4
                        </span>
                        {(user?.invitedCount || 520) >= 5000 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black">
                            UNLOCKED 🔓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">IN PROGRESS</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white">5,000 Invites</h4>
                        <div className="text-2xl font-black text-emerald-400 mt-0.5">₹10,000 Cash</div>
                      </div>
                      <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Progress</span>
                        <span>{Math.min(user?.invitedCount || 520, 5000)} / 5000</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${Math.min(((user?.invitedCount || 520) / 5000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BANK DETAILS & UPI SAVING FORM */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <span>Bank Account & UPI Details (For Cash Transfers)</span>
                    </h3>
                    <p className="text-xs text-slate-400">Save your bank details & UPI ID where cash rewards will be transferred directly.</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🔒 SECURE ENCRYPTED
                  </span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!bankAccountName || !bankName || !bankAccountNumber || !bankIfsc || !bankUpiId) {
                      showToast('Please fill out all bank and UPI details', 'error');
                      return;
                    }
                    saveBankDetails({
                      accountName: bankAccountName,
                      bankName: bankName,
                      accountNumber: bankAccountNumber,
                      ifsc: bankIfsc,
                      upiId: bankUpiId,
                      phone: bankPhone
                    });
                    showToast('Bank Account & UPI details saved successfully!', 'success');
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Account Holder Name</label>
                      <input
                        type="text"
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        placeholder="Full Name as in Bank"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank, SBI, ICICI"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Bank Account Number</label>
                      <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="Enter Account Number"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">IFSC Code</label>
                      <input
                        type="text"
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001234"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none uppercase"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">UPI VPA ID (GPay / PhonePe / Paytm)</label>
                      <input
                        type="text"
                        value={bankUpiId}
                        onChange={(e) => setBankUpiId(e.target.value)}
                        placeholder="e.g. user@upi or 9876543210@paytm"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Mobile Phone Number</label>
                      <input
                        type="text"
                        value={bankPhone}
                        onChange={(e) => setBankPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Bank & UPI Details</span>
                    </button>

                    {/* DIRECT PAYOUT CLAIM BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!user?.bankDetails) {
                          showToast('Please save your Bank Details & UPI ID first!', 'error');
                          return;
                        }
                        const success = requestPayout('500 Invites Milestone Reward', 1000, 500);
                        if (success) {
                          showToast('💸 Cash Payout Request submitted! Admin will transfer ₹1,000 to your bank shortly.', 'success');
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💸 Request Direct Cash Payout (₹1,000)</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* REFERRED CUSTOMERS & QUALIFIED PLAN PURCHASES TABLE */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Referred Customers & Qualified Plan Purchases</span>
                    </h3>
                    <p className="text-xs text-slate-400">When someone signs up via your link and buys a plan, it appears here and updates in Admin in real-time!</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    LIVE REFERRED SALES ({referralSales.filter(s => s.referrerCode === (user?.referralCode || 'RAJ500')).length})
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Sale ID</th>
                        <th className="py-2.5 px-3">Referred Customer</th>
                        <th className="py-2.5 px-3">Purchased Plan</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3 text-right">Referral Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
                      {referralSales.filter(s => s.referrerCode === (user?.referralCode || 'RAJ500')).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500 italic">
                            No plan purchases recorded yet. Share your link and ask customers to pick a plan!
                          </td>
                        </tr>
                      ) : (
                        referralSales.filter(s => s.referrerCode === (user?.referralCode || 'RAJ500')).map(sale => (
                          <tr key={sale.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-white">{sale.id}</td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-white block">{sale.referredCustomerName}</span>
                              <span className="text-[10px] text-slate-400 block">{sale.referredCustomerEmail}</span>
                            </td>
                            <td className="py-3 px-3 font-bold text-amber-300">{sale.planName}</td>
                            <td className="py-3 px-3 font-extrabold text-emerald-400">₹{sale.amount.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-3 text-slate-400">{new Date(sale.purchasedAt).toLocaleString()}</td>
                            <td className="py-3 px-3 text-right">
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

              {/* PAYOUT REQUEST HISTORY TABLE */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your Cash Payout Requests & Transfer History</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Request ID</th>
                        <th className="py-2.5 px-3">Reward Tier</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Bank / UPI Destination</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
                      {(user?.payoutRequests || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500 italic">
                            No payout requests submitted yet. Complete 500 invites & save bank details to request cash payout!
                          </td>
                        </tr>
                      ) : (
                        (user?.payoutRequests || []).map(po => (
                          <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-white">{po.id}</td>
                            <td className="py-3 px-3 text-amber-300 font-bold">{po.rewardTier}</td>
                            <td className="py-3 px-3 font-extrabold text-emerald-400">₹{po.amount.toLocaleString('en-IN')}</td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-white block">{po.bankDetails.bankName}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                A/C: {po.bankDetails.accountNumber} • UPI: {po.bankDetails.upiId}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400">{new Date(po.requestedAt).toLocaleDateString()}</td>
                            <td className="py-3 px-3 text-right">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                                po.status === 'APPROVED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : po.status === 'REJECTED'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}>
                                {po.status === 'APPROVED' ? 'TRANSFERRED ✅' : po.status === 'REJECTED' ? 'REJECTED ❌' : 'PENDING APPROVAL ⏳'}
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
        </main>
      </div>

      {/* Modals */}
      <DNSManagerModal
        domain={selectedDnsDomain}
        onClose={() => setSelectedDnsDomain(null)}
        onUpdated={() => loadDashboardData()}
      />

      <HostingControlPanelModal
        hosting={selectedHostingCpanel}
        onClose={() => setSelectedHostingCpanel(null)}
      />

      <InvoicePdfModal
        invoice={selectedInvoicePdf}
        onClose={() => setSelectedInvoicePdf(null)}
      />

      {selectedCreditPack && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => {
            setIsRazorpayOpen(false);
            setSelectedCreditPack(null);
          }}
          onBack={() => {
            setIsRazorpayOpen(false);
            setSelectedCreditPack(null);
          }}
          subtotal={selectedCreditPack.price}
          discount={0}
          items={[{ name: selectedCreditPack.name, price: selectedCreditPack.price, qty: 1 }]}
          onSuccess={() => {
            addAiCredits(selectedCreditPack.credits);
            showToast(`Success! ${selectedCreditPack.credits.toLocaleString()} AI Credits added to your balance!`, 'success');
            setSelectedCreditPack(null);
          }}
        />
      )}
    </div>
  );
};
