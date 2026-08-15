import React from 'react';
import {
  Server,
  Globe,
  Rocket,
  CreditCard,
  Plus,
  Settings,
  ExternalLink,
  ShieldCheck,
  Activity,
  HardDrive,
  Clock,
  Sparkles,
  Zap,
  Workflow,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HostingAccount, RegisteredDomain } from '../../types';

interface OverviewHomeViewProps {
  hostingAccounts: HostingAccount[];
  domains: RegisteredDomain[];
  onOpenCpanel: (host: HostingAccount) => void;
  onSelectTab: (tab: string) => void;
}

export const OverviewHomeView: React.FC<OverviewHomeViewProps> = ({
  hostingAccounts,
  domains,
  onOpenCpanel,
  onSelectTab
}) => {
  const { user, formatPrice, setCurrentView } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. ACTIVE CUSTOMER SUBSCRIPTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <span>Active Cloud Subscriptions & Plans</span>
          </h2>
          <button
            onClick={() => setCurrentView('pricing')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>+ Upgrade / Add Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(user?.subscriptions || []).map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE SUBSCRIPTION
                  </span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Renews: {sub.renewAt}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    {sub.category === 'n8n' ? <Workflow className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{sub.title}</h3>
                    <p className="text-xs text-slate-400">{sub.details}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="text-xs font-bold text-slate-300 font-mono">
                  {formatPrice(sub.monthlyPrice)} / {sub.billingCycle}
                </div>

                {sub.category === 'n8n' ? (
                  <button
                    onClick={() => onSelectTab('n8n_automations')}
                    className="py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>Launch n8n Studio</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (hostingAccounts.length > 0) {
                        onOpenCpanel(hostingAccounts[0]);
                      } else {
                        onSelectTab('websites');
                      }
                    }}
                    className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Manage Plan Settings</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectTab('websites')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1 shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Active Websites</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{hostingAccounts.length}</div>
          <div className="text-[11px] text-emerald-400 font-medium">● 100% Server Uptime</div>
        </div>

        <div
          onClick={() => onSelectTab('domains')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1 shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Managed Domains</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{domains.length}</div>
          <div className="text-[11px] text-cyan-400 font-medium">● Cloudflare DNS Active</div>
        </div>

        <div
          onClick={() => onSelectTab('credits')}
          className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 transition-all cursor-pointer space-y-1 shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>AI Credits</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{(user?.aiCredits ?? 2500).toLocaleString()}</div>
          <div className="text-[11px] text-amber-400 font-medium">+ Click to Buy More</div>
        </div>

        <div
          onClick={() => onSelectTab('credits')}
          className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer space-y-1 shadow-md"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Wallet Balance</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{formatPrice(user?.walletBalance ?? 2450)}</div>
          <div className="text-[11px] text-emerald-400 font-medium">+ Add Funds</div>
        </div>
      </div>

      {/* 3. ACTIVE HOSTING ACCOUNTS TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Active Hosting Services & Server Deployments</span>
            </h3>
            <p className="text-xs text-slate-400">Manage LiteSpeed Web Server, PHP Versions, SSL Certificates and databases.</p>
          </div>
          <button
            onClick={() => setCurrentView('hosting')}
            className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Purchase New Hosting</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Primary Domain</th>
                <th className="py-3 px-3">Server Location</th>
                <th className="py-3 px-3">Hosting Plan</th>
                <th className="py-3 px-3">Storage Used</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">hPanel / cPanel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
              {hostingAccounts.map((host) => (
                <tr key={host.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">{host.domain}</span>
                    <span className="text-[10px] text-slate-400 font-mono">IP: {host.ip}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">{host.serverLocation}</span>
                  </td>
                  <td className="py-3 px-3 text-indigo-300 font-bold">{host.plan}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{host.diskUsage}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {host.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenCpanel(host)}
                      className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 ml-auto transition-all cursor-pointer border border-slate-700 hover:border-indigo-500"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Open Control Panel</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
