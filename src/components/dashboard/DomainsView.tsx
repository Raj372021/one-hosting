import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Lock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RegisteredDomain } from '../../types';
import { DNSManagerModal } from '../DNSManagerModal';

interface DomainsViewProps {
  domains: RegisteredDomain[];
  onReload: () => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({ domains, onReload }) => {
  const { setCurrentView } = useAuth();
  const { showToast } = useToast();
  const [selectedDnsDomain, setSelectedDnsDomain] = useState<RegisteredDomain | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="domains-manager-view">
      {/* TOP BANNER */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            <span>Registered Domains & Cloudflare DNS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your domain names, configure A/CNAME/MX/TXT records, DNSSEC, WHOIS privacy, and custom nameservers.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('domains')}
          className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Domain</span>
        </button>
      </div>

      {/* DOMAINS LIST TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Domains Portfolio ({domains.length})</span>
          </h3>
          <span className="text-xs text-slate-400">DNSSEC & Privacy Protected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Domain Name</th>
                <th className="py-3 px-3">Registration Date</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Auto-Renew</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">DNS Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    No registered domains found. Register your first domain above!
                  </td>
                </tr>
              ) : (
                domains.map((dom) => (
                  <tr key={dom.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-black text-white text-sm block">{dom.name}</span>
                      <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-0.5">
                        <Lock className="w-3 h-3 text-emerald-400" /> Free WHOIS Privacy Enabled
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{dom.registrationDate}</td>
                    <td className="py-3 px-3 text-amber-300 font-mono">{dom.expiryDate}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {dom.autoRenew ? 'ON 🟢' : 'OFF ⏸️'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {dom.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedDnsDomain(dom)}
                        className="py-1.5 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>DNS & Nameservers</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DNS MODAL */}
      <DNSManagerModal
        domain={selectedDnsDomain}
        onClose={() => setSelectedDnsDomain(null)}
        onUpdated={onReload}
      />
    </div>
  );
};
