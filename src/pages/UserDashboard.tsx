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
  Gift,
  Home,
  ArrowLeft,
  Mail,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Workflow,
  User as UserIcon,
  Database,
  Code
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  fetchUserDomains,
  fetchHostingAccounts,
  fetchDeployments,
  fetchInvoices,
  fetchTickets,
  createTicket,
  replyTicket
} from '../services/api';
import { RegisteredDomain, HostingAccount, DeploymentItem, InvoiceItem, SupportTicket } from '../types';

import { OverviewHomeView } from '../components/dashboard/OverviewHomeView';
import { AiCreditsView } from '../components/dashboard/AiCreditsView';
import { InvoicesView } from '../components/dashboard/InvoicesView';
import { WebsitesView } from '../components/dashboard/WebsitesView';
import { DomainsView } from '../components/dashboard/DomainsView';
import { EmailsView } from '../components/dashboard/EmailsView';
import { InvitesView } from '../components/dashboard/InvitesView';
import { TicketsView } from '../components/dashboard/TicketsView';
import { ProfileView } from '../components/dashboard/ProfileView';

import { AiWebsiteBuilderHub } from '../components/AiWebsiteBuilderHub';
import { N8nAutomationHub } from '../components/N8nAutomationHub';
import { HostingControlPanelModal } from '../components/HostingControlPanelModal';

export interface UserDashboardProps {
  initialTab?: string;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ initialTab = 'home' }) => {
  const { user, formatPrice, currentView, setCurrentView } = useAuth();
  const { showToast } = useToast();

  // Sidebar tab state
  const [sidebarTab, setSidebarTab] = useState<string>(initialTab);
  const [websitesExpanded, setWebsitesExpanded] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Data states
  const [domains, setDomains] = useState<RegisteredDomain[]>([]);
  const [hostingAccounts, setHostingAccounts] = useState<HostingAccount[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Modal State
  const [selectedHostingCpanel, setSelectedHostingCpanel] = useState<HostingAccount | null>(null);

  // Sync with initialTab or currentView changes
  useEffect(() => {
    if (initialTab) {
      setSidebarTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (currentView === 'credits') {
      setSidebarTab('credits');
    } else if (currentView === 'billing') {
      setSidebarTab('billing');
    } else if (currentView === 'tickets') {
      setSidebarTab('tickets');
    } else if (currentView === 'profile') {
      setSidebarTab('profile');
    } else if (currentView === 'deployments') {
      setSidebarTab('builder');
    } else if (currentView === 'dashboard') {
      setSidebarTab('home');
    }
  }, [currentView]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    try {
      const [domRes, hostRes, invRes, tktRes] = await Promise.all([
        fetchUserDomains(),
        fetchHostingAccounts(),
        fetchInvoices(),
        fetchTickets()
      ]);
      setDomains(domRes);
      setHostingAccounts(hostRes);
      setInvoices(invRes);
      setTickets(tktRes);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateTicket = async (subject: string, category: string, priority: 'Low' | 'Medium' | 'High', message: string) => {
    try {
      const res = await createTicket({
        subject,
        category,
        priority,
        message
      });
      if (res && res.ticket) {
        setTickets([res.ticket as SupportTicket, ...tickets]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReplyTicket = async (ticketId: string, message: string) => {
    try {
      await replyTicket(ticketId, message);
      setTickets(tickets.map(t => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: 'user' as const,
            senderName: user?.name || 'Customer',
            content: message,
            timestamp: 'Just now'
          };
          return {
            ...t,
            messages: [...(t.messages || []), newMsg]
          };
        }
        return t;
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* 1. TOP HEADER BANNER (hPanel Style) */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Dedicated Back to Home Button */}
          <button
            onClick={() => setCurrentView('home')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 transition-all border border-slate-700 shadow-md cursor-pointer group"
            title="Return to Main Homepage"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white">OneHost Cloud Console</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Logged in as <strong className="text-slate-200">{user?.name}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Direct Referral Copy */}
          <button
            onClick={() => {
              const url = `https://onehost.cloud/join?ref=${user?.referralCode || 'RAJ500'}`;
              navigator.clipboard.writeText(url);
              setCopiedReferral(true);
              showToast('Referral link copied! Share to earn cash rewards.', 'success');
              setTimeout(() => setCopiedReferral(false), 2000);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Ref: {user?.referralCode || 'RAJ500'}</span>
            {copiedReferral ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {/* AI Credits Button (Routes to dedicated Credits tab) */}
          <button
            onClick={() => setSidebarTab('credits')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-600/30 border border-purple-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Credits: {user?.aiCredits ?? 2500}</span>
            <span className="text-[10px] bg-purple-950/80 px-1.5 py-0.5 rounded text-amber-300 font-mono">+ Top Up</span>
          </button>

          {/* Wallet Balance (Routes to dedicated Credits/Wallet tab) */}
          <button
            onClick={() => setSidebarTab('credits')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatPrice(user?.walletBalance ?? 2450)}</span>
          </button>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN VIEW */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 lg:w-72 bg-slate-900/60 border-r border-slate-800 p-4 shrink-0 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3">
              Core Management
            </span>

            {/* 1. Home */}
            <button
              onClick={() => setSidebarTab('home')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-indigo-400" />
              <span>Home Overview</span>
            </button>

            {/* 2. Websites & Hosting (With Accordion Sub-Items) */}
            <div>
              <button
                onClick={() => {
                  setWebsitesExpanded(!websitesExpanded);
                  if (sidebarTab !== 'websites' && !['wordpress', 'horizons', 'builder', 'webapps', 'php', 'migrations'].includes(sidebarTab)) {
                    setSidebarTab('websites');
                  }
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  sidebarTab === 'websites' || ['wordpress', 'horizons', 'builder', 'webapps', 'php', 'migrations'].includes(sidebarTab)
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>Websites & Hosting</span>
                </div>
                {websitesExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {websitesExpanded && (
                <div className="pl-6 pr-1 pt-1.5 space-y-1 border-l border-slate-800 ml-4 mt-1">
                  <button
                    onClick={() => setSidebarTab('wordpress')}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      sidebarTab === 'wordpress' ? 'text-indigo-400 bg-indigo-500/10 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>● WordPress & LSCache</span>
                  </button>
                  <button
                    onClick={() => setSidebarTab('horizons')}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      sidebarTab === 'horizons' ? 'text-purple-400 bg-purple-500/10 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>● Horizons AI Builder</span>
                  </button>
                  <button
                    onClick={() => setSidebarTab('builder')}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      sidebarTab === 'builder' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>● AI Vibe Coder Studio</span>
                  </button>
                  <button
                    onClick={() => setSidebarTab('webapps')}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      sidebarTab === 'webapps' ? 'text-amber-400 bg-amber-500/10 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>● Fullstack Web Apps</span>
                  </button>
                  <button
                    onClick={() => setSidebarTab('php')}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      sidebarTab === 'php' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>● PHP & MySQL Database</span>
                  </button>
                  <button
                    onClick={() => setSidebarTab('migrations')}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      sidebarTab === 'migrations' ? 'text-rose-400 bg-rose-500/10 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>● Free Website Migration</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Domains */}
            <button
              onClick={() => setSidebarTab('domains')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'domains'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Domains & Cloudflare DNS</span>
            </button>

            {/* 4. Emails */}
            <button
              onClick={() => setSidebarTab('emails')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'emails'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Business Emails & Webmail</span>
            </button>

            {/* 5. AI Agents */}
            <button
              onClick={() => setSidebarTab('ai_agents')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'ai_agents'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Agents Studio</span>
            </button>

            {/* 6. n8n Automations */}
            <button
              onClick={() => setSidebarTab('n8n_automations')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'n8n_automations'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Workflow className="w-4 h-4 text-amber-400" />
              <span>n8n Cloud Workflows</span>
            </button>
          </div>

          {/* BILLING, CREDITS & ACCOUNT SECTION */}
          <div className="space-y-1 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3">
              Credits & Billing
            </span>

            {/* 7. DEDICATED AI CREDITS & WALLET */}
            <button
              onClick={() => setSidebarTab('credits')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                sidebarTab === 'credits'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 ring-1 ring-purple-400'
                  : 'text-amber-300 hover:bg-amber-950/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI Credits & Top-Up</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                RECHARGE
              </span>
            </button>

            {/* 8. GST Invoices */}
            <button
              onClick={() => setSidebarTab('billing')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'billing'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Invoices & GST Receipts</span>
            </button>

            {/* 9. Invite & Earn Cash */}
            <button
              onClick={() => setSidebarTab('invites')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'invites'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Invite & Earn ₹10,000</span>
            </button>

            {/* 10. Support Desk */}
            <button
              onClick={() => setSidebarTab('tickets')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'tickets'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>24/7 Support Desk</span>
            </button>

            {/* 11. Profile */}
            <button
              onClick={() => setSidebarTab('profile')}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                sidebarTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4 text-indigo-400" />
              <span>Account & Security</span>
            </button>
          </div>

          {/* SIDEBAR FOOTER: RETURN TO HOME */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer border border-slate-800 group"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Homepage</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4">
          {/* Sub-tab back navigation helper when not on Home Overview */}
          {sidebarTab !== 'home' && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
              <button
                onClick={() => setSidebarTab('home')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>← Back to Dashboard Overview</span>
              </button>

              <button
                onClick={() => setCurrentView('home')}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <Home className="w-3.5 h-3.5 text-purple-400" />
                <span>Homepage</span>
              </button>
            </div>
          )}

          {/* VIEW: HOME OVERVIEW */}
          {sidebarTab === 'home' && (
            <OverviewHomeView
              hostingAccounts={hostingAccounts}
              domains={domains}
              onOpenCpanel={(h) => setSelectedHostingCpanel(h)}
              onSelectTab={(t) => setSidebarTab(t)}
            />
          )}

          {/* VIEW: WEBSITES & HOSTING SUB-VIEWS */}
          {(sidebarTab === 'websites' || ['wordpress', 'horizons', 'builder', 'webapps', 'php', 'migrations'].includes(sidebarTab)) && (
            <WebsitesView
              subTab={sidebarTab === 'websites' ? 'wordpress' : (sidebarTab as any)}
              hostingAccounts={hostingAccounts}
              onOpenCpanel={(h) => setSelectedHostingCpanel(h)}
              onAddTicket={handleCreateTicket}
            />
          )}

          {/* VIEW: DOMAINS & DNS */}
          {sidebarTab === 'domains' && (
            <DomainsView
              domains={domains}
              onReload={loadDashboardData}
            />
          )}

          {/* VIEW: BUSINESS EMAILS */}
          {sidebarTab === 'emails' && (
            <EmailsView />
          )}

          {/* VIEW: AI AGENTS */}
          {sidebarTab === 'ai_agents' && (
            <AiWebsiteBuilderHub defaultAgent="brand" />
          )}

          {/* VIEW: N8N AUTOMATION STUDIO */}
          {sidebarTab === 'n8n_automations' && (
            <N8nAutomationHub />
          )}

          {/* VIEW: DEDICATED AI CREDITS & WALLET RECHARGE STUDIO (ONLY OPENS CREDITS VIEW) */}
          {sidebarTab === 'credits' && (
            <AiCreditsView />
          )}

          {/* VIEW: GST INVOICES & BILLING */}
          {sidebarTab === 'billing' && (
            <InvoicesView invoices={invoices} />
          )}

          {/* VIEW: INVITE & EARN CASH REWARDS */}
          {sidebarTab === 'invites' && (
            <InvitesView />
          )}

          {/* VIEW: SUPPORT TICKETS */}
          {sidebarTab === 'tickets' && (
            <TicketsView
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onReplyTicket={handleReplyTicket}
            />
          )}

          {/* VIEW: PROFILE & SECURITY */}
          {sidebarTab === 'profile' && (
            <ProfileView />
          )}
        </main>
      </div>

      {/* HOSTING CONTROL PANEL MODAL */}
      <HostingControlPanelModal
        hosting={selectedHostingCpanel}
        onClose={() => setSelectedHostingCpanel(null)}
      />
    </div>
  );
};
