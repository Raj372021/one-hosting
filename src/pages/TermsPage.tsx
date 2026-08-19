import React from 'react';
import { FileCheck, Shield, AlertTriangle, Scale, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TermsPage: React.FC = () => {
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
          <span className="text-xs text-slate-500 font-mono">Effective: February 2026</span>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-slate-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Master Service Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Terms of Service & Usage Agreement
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Please read these Terms of Service carefully before utilizing OneHost Cloud hosting infrastructure, domain registration services, automated deployment pipelines, or AI application builder tools.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Acceptance */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">01</span>
              <span>Acceptance of Agreement</span>
            </h2>
            <p>
              By accessing OneHost, creating an account, or purchasing any cloud hosting or domain service, you agree to be legally bound by these terms. If you are entering into this agreement on behalf of a company, you represent that you have the authority to bind such entity.
            </p>
          </div>

          {/* Section 2: Acceptable Use Policy (AUP) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">02</span>
              <span>Acceptable Use Policy (AUP)</span>
            </h2>
            <p>
              OneHost servers must be used solely for lawful purposes. The following activities are strictly prohibited and will result in immediate suspension without refund:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Hosting malicious software, ransomware, phishing landing pages, or crypto-mining scripts.</li>
              <li>Transmitting unsolicited commercial bulk emails (SPAM) or operating open mail relays.</li>
              <li>Engaging in denial-of-service (DDoS) attacks or unauthorized vulnerability scanning.</li>
              <li>Distributing unauthorized copyright-infringing media or pirated content.</li>
            </ul>
          </div>

          {/* Section 3: Domain Registrations */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">03</span>
              <span>Domain Registration & Renewals</span>
            </h2>
            <p>
              Domain registrations (.IN, .COM, .AI, .IO, .STORE) are registered through accredited ICANN and NIXI registry channels. Once registered, domain registration fees are non-refundable as registry fees are immediately committed. Domain owners are responsible for maintaining accurate contact details and renewing registrations prior to expiration.
            </p>
          </div>

          {/* Section 4: Billing & Subscriptions */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">04</span>
              <span>Billing, Taxes & Invoices</span>
            </h2>
            <p>
              Services are billed in Indian Rupees (INR) with applicable 18% GST for Indian customers. Automated tax invoices are generated instantly upon payment through Razorpay and available in your User Dashboard for tax compliance.
            </p>
          </div>

          {/* Section 5: Uptime & SLA */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">05</span>
              <span>Service Level Agreement (SLA)</span>
            </h2>
            <p>
              We provide a 99.99% monthly network uptime commitment across all cloud hosting tiers. In the event of unscheduled downtime exceeding the SLA threshold, customers are eligible for hosting service credits as detailed in our SLA policy.
            </p>
          </div>

          {/* Support CTA */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-sm">Need Legal Assistance or Custom Enterprise MSA?</h3>
              <p className="text-xs text-slate-400">Reach our legal team at legal@onehost.cloud</p>
            </div>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
