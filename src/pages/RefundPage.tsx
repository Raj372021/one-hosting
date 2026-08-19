import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, CreditCard, ShieldCheck, ArrowLeft, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RefundPage: React.FC = () => {
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
          <span className="text-xs text-slate-500 font-mono">Last Updated: February 2026</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-slate-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Risk-Free 30-Day Money Back Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Refund & Cancellation Policy
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            At OneHost, customer satisfaction is our top priority. We offer a transparent, hassle-free 30-day money-back guarantee for all our shared and cloud hosting plans.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-emerald-400">30 Days</div>
            <div className="font-bold text-white text-xs">Hosting Money Back</div>
            <p className="text-slate-400 text-xs">Full refund on shared, cloud & WordPress hosting packages.</p>
          </div>
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-indigo-400">3-5 Days</div>
            <div className="font-bold text-white text-xs">UPI & Card Refund</div>
            <p className="text-slate-400 text-xs">Direct credit back to source bank account via Razorpay gateway.</p>
          </div>
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-cyan-400">1-Click</div>
            <div className="font-bold text-white text-xs">Instant Ticket Request</div>
            <p className="text-slate-400 text-xs">Submit refund requests effortlessly through your dashboard.</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Eligible Products */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Eligible for 100% Full Refund</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Starter Cloud Hosting Plans (within 30 days of first purchase).</li>
              <li>Premium and Business NVMe Hosting Plans (within 30 days of first purchase).</li>
              <li>Unused AI Builder token credit packs if no credits have been consumed.</li>
            </ul>
          </div>

          {/* Section 2: Non-Refundable Items */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>Non-Refundable Services</span>
            </h2>
            <p>Due to registry and upstream datacenter commitments, the following services cannot be refunded:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Domain Name Registrations & Transfers:</strong> As per ICANN and NIXI .IN registry guidelines, domain registrations cannot be cancelled once processed. You retain full 100% legal ownership of your domain.</li>
              <li><strong>Custom Bare Metal Dedicated Servers:</strong> Deployed hardware with dedicated provisioning costs.</li>
              <li><strong>Third-Party Commercial SSL Certificates & Software Add-ons:</strong> Third-party license costs.</li>
            </ul>
          </div>

          {/* Section 3: How to Claim Refund */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">How to Request a Refund in 3 Easy Steps</h2>
            <ol className="list-decimal pl-5 space-y-2 text-slate-400">
              <li>Log in to your <strong>OneHost Account</strong> and navigate to <strong>Support Tickets</strong>.</li>
              <li>Select department as <strong>"Billing & Refunds"</strong> and enter your Invoice Number (e.g. <code>#INV-2026-001</code>).</li>
              <li>Our billing department will process your request within 24 hours. Funds are credited back to your original payment method (UPI / Debit Card / NetBanking) within 3-5 business days.</li>
            </ol>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-sm">Need Help with Billing or Invoice Cancellation?</h3>
              <p className="text-xs text-slate-400">Our billing desk is available at billing@onehost.cloud</p>
            </div>
            <button
              onClick={() => setCurrentView('tickets')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
            >
              Open Billing Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
