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
  ArrowRight
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

export const UserDashboard: React.FC = () => {
  const { user, formatPrice, topUpWallet, setCurrentView } = useAuth();
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
    | 'billing'
    | 'tickets'
  >('home');

  const [websitesExpanded, setWebsitesExpanded] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);

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

            {/* More Services */}
            <button
              onClick={() => setSidebarTab('more_services')}
              className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                sidebarTab === 'more_services'
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>More services</span>
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
              AI Agents
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

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400">Wallet: </span>
                <span className="font-bold text-emerald-400">{formatPrice(user?.walletBalance || 0)}</span>
              </div>

              <button
                onClick={() => {
                  topUpWallet(1000);
                  showToast('Added ₹1,000 to your wallet balance!', 'success');
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
              >
                + Add Funds
              </button>
            </div>
          </div>

          {/* VIEW 1: HOME */}
          {sidebarTab === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-200">
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
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="font-bold text-base text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-300" />
                <span>Vibe Coding & AI Assistant Agent</span>
              </div>
              <p className="text-xs text-slate-400">Prompt in plain Hindi or English to generate full websites, fix bugs, or optimize database queries automatically.</p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                AI Agent Status: <span className="text-emerald-400 font-bold">READY TO CODE</span>
              </div>
            </div>
          )}

          {/* VIEW 7: BILLING */}
          {sidebarTab === 'billing' && (
            <div className="space-y-4 animate-in fade-in duration-200">
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
    </div>
  );
};
