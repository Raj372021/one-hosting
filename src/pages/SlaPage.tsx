import React from 'react';
import { ShieldCheck, Zap, Activity, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SlaPage: React.FC = () => {
  const { setCurrentView } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Current Network Uptime: 99.998%</span>
          </span>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-slate-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Service Level Agreement (SLA)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            99.99% Uptime SLA Commitment
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            OneHost provides an ironclad 99.99% Network & Infrastructure Uptime Guarantee backed by automated service credits in case of unscheduled outages.
          </p>
        </div>

        {/* SLA Credits Table */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Service Credit Compensation Matrix</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Monthly Uptime Percentage</th>
                  <th className="p-4">Service Credit Refund Percentage</th>
                  <th className="p-4">Credited Directly To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-emerald-400">99.90% - 99.99%</td>
                  <td className="p-4 font-bold text-white">10% Credit</td>
                  <td className="p-4 text-slate-400">Account Wallet / Next Renewal</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-amber-400">98.00% - 99.89%</td>
                  <td className="p-4 font-bold text-white">25% Credit</td>
                  <td className="p-4 text-slate-400">Account Wallet / Next Renewal</td>
                </tr>
                <tr className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-rose-400">Below 98.00%</td>
                  <td className="p-4 font-bold text-white">50% - 100% Credit</td>
                  <td className="p-4 text-slate-400">Full Monthly Credit / Direct Refund</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SLA Core Pillars */}
        <div className="space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-base">Redundant Tier-4 Infrastructure</h3>
            <p>
              Every OneHost hosting node is equipped with Dual N+2 Redundant Power Supplies, Multi-Homed 100Gbps BGP Fiber Uplinks, and Automated Real-Time Failover mechanisms to ensure zero single point of failure.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-base">24/7/365 NOC Monitoring</h3>
            <p>
              Our Network Operations Center (NOC) monitors edge latency, memory allocation, SSD health, and ping availability every 10 seconds across all 6 worldwide zones.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-sm">Need a Custom Enterprise SLA with Dedicated Account Manager?</h3>
            <p className="text-xs text-slate-400">Contact our enterprise solutions desk at enterprise@onehost.cloud</p>
          </div>
          <button
            onClick={() => setCurrentView('contact')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
          >
            Contact Enterprise Desk
          </button>
        </div>
      </div>
    </div>
  );
};
