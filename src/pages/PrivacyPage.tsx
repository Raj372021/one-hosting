import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Globe, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PrivacyPage: React.FC = () => {
  const { setCurrentView } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back Button & Top Badge */}
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
        <div className="space-y-4 text-center sm:text-left border-b border-slate-900 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>GDPR, ISO/IEC 27001 & India DPDP Act 2023 Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Privacy Policy & Data Security
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            At OneHost Cloud Solutions Ltd., we value your trust and are committed to protecting your personal data, server configurations, domain registrations, and financial transactions with military-grade encryption and complete transparency.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">01</span>
              <span>Information We Collect</span>
            </h2>
            <p>We collect only the essential information necessary to provision web hosting, register domain names, process billing via Razorpay, and execute AI app generation:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Account Identity:</strong> Full Name, Email Address, Phone Number, and Company details during account registration or Google OAuth sign-in.</li>
              <li><strong>Domain Registration Data:</strong> WHOIS contact information (Name, Address, Phone) required by ICANN and the .IN Registry (NIXI) to establish legal domain ownership. WHOIS Privacy is available to shield your personal details.</li>
              <li><strong>Billing & Invoicing:</strong> Billing address and GSTIN for tax invoice generation. Payment card and UPI details are securely tokenized directly by RBI-authorized payment gateways (Razorpay) and never stored on our plain servers.</li>
              <li><strong>AI Builder Prompts:</strong> Prompts submitted to the AI Coder suite are processed ephemerally using Google Gemini API and are not used to train public foundation models without consent.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">02</span>
              <span>How We Use & Process Your Data</span>
            </h2>
            <p>Your data is processed strictly under legitimate contractual obligations and cloud service delivery:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>To provision and manage NVMe cloud hosting containers, cPanel accounts, databases, and SSL certificates.</li>
              <li>To authenticate SSH, FTP, and web terminal sessions securely.</li>
              <li>To issue real-time service health alerts, renewal reminders, and GST compliance tax invoices.</li>
              <li>To detect and mitigate automated DDoS attacks, brute-force exploits, and spam traffic across edge firewalls.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">03</span>
              <span>Encryption & Infrastructure Security</span>
            </h2>
            <p>OneHost implements defense-in-depth security standards across all global datacenter nodes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>TLS 1.3 & AES-256</span>
                </div>
                <p className="text-slate-400 text-xs">All network transit and stored credentials are encrypted using AES-256 standard.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Layer 7 DDoS Shield</span>
                </div>
                <p className="text-slate-400 text-xs">Automated volumetric traffic scrubbing at 3.2 Tbps global edge capacity.</p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">04</span>
              <span>Your Data Rights & Control</span>
            </h2>
            <p>Under GDPR and Indian DPDP legislation, you have full ownership and control over your data:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li><strong>Right to Export:</strong> Download full cPanel backups, MySQL dumps, and billing receipts in 1-click anytime.</li>
              <li><strong>Right to Erasure:</strong> Request permanent deletion of your account and hosting containers upon service termination.</li>
              <li><strong>Right to Rectification:</strong> Update billing credentials, names, and contact details via your User Profile.</li>
            </ul>
          </div>

          {/* Contact DPO */}
          <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-white text-sm">Have Questions regarding Data Privacy?</h3>
              <p className="text-xs text-slate-400">Our Data Protection Officer is available at privacy@onehost.cloud</p>
            </div>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
            >
              Contact Support Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
