import React, { useState } from 'react';
import {
  Server,
  Rocket,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Workflow,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DomainSearchBox } from '../components/DomainSearchBox';
import { AiWebsiteBuilderHub } from '../components/AiWebsiteBuilderHub';
import { HOSTING_PLANS, DOMAIN_PRICING, VPS_PLANS, DEDICATED_PLANS } from '../data/hostingPlans';

interface HomePageProps {
  onOpenCart?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenCart }) => {
  const { formatPrice, addToCart, setCurrentView } = useAuth();
  const { showToast } = useToast();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | '4years'>('4years');
  const [activeTab, setActiveTab] = useState<'web' | 'wordpress' | 'cloud' | 'reseller' | 'ai_agent' | 'vps' | 'dedicated'>('web');

  const getCycleRate = (basePriceINR: number) => {
    if (billingCycle === 'monthly') return Math.round(basePriceINR * 2);
    if (billingCycle === 'yearly') return Math.round(basePriceINR * 1.3);
    return basePriceINR;
  };

  const getCycleMonths = (planId: string) => {
    if (planId === 'agency-plans') return 24;
    if (billingCycle === 'monthly') return 1;
    if (billingCycle === 'yearly') return 12;
    return 48;
  };

  const getCycleTotal = (plan: typeof HOSTING_PLANS[0]) => {
    const rate = getCycleRate(plan.monthlyPriceINR);
    const months = getCycleMonths(plan.id);
    return rate * months;
  };

  const handleSelectPlan = (plan: typeof HOSTING_PLANS[0]) => {
    const rate = getCycleRate(plan.monthlyPriceINR);
    const months = getCycleMonths(plan.id);
    const totalPrice = getCycleTotal(plan);

    addToCart({
      id: 'cart_plan_' + plan.id + '_' + billingCycle,
      type: 'hosting',
      title: `${plan.name} (${months} Months Plan)`,
      subtitle: `${plan.websites} | ${plan.storage} (@ ${formatPrice(rate)}/mo)`,
      billingCycle,
      price: totalPrice,
      details: plan.freeDomain ? 'Includes FREE 1-Year Domain Name + Free SSL' : 'Includes Free Unlimited SSL'
    });
    showToast(`🛒 ${plan.name} (${months} Months) added to cart! Opening checkout...`, 'success');
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const handleSelectVpsPlan = (vps: typeof VPS_PLANS[0]) => {
    const months = billingCycle === 'monthly' ? 1 : billingCycle === 'yearly' ? 12 : 48;
    const rate = billingCycle === 'monthly' ? vps.priceINR * 1.5 : billingCycle === 'yearly' ? vps.priceINR * 1.2 : vps.priceINR;
    const totalPrice = rate * months;

    addToCart({
      id: 'cart_vps_' + vps.name.replace(/\s+/g, '_') + '_' + billingCycle,
      type: 'hosting',
      title: `${vps.name} Server (${months} Months)`,
      subtitle: `${vps.ram} | ${vps.vcpu} | ${vps.storage} (@ ${formatPrice(rate)}/mo)`,
      billingCycle,
      price: totalPrice,
      details: 'Includes Full Root SSH Access, Free Dedicated IP & DDoS Protection'
    });
    showToast(`🛒 ${vps.name} added to cart! Opening checkout...`, 'success');
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const handleSelectDedicatedPlan = (ded: typeof DEDICATED_PLANS[0]) => {
    const months = billingCycle === 'monthly' ? 1 : billingCycle === 'yearly' ? 12 : 48;
    const rate = billingCycle === 'monthly' ? ded.priceINR * 1.3 : billingCycle === 'yearly' ? ded.priceINR * 1.1 : ded.priceINR;
    const totalPrice = rate * months;

    addToCart({
      id: 'cart_ded_' + ded.name.replace(/\s+/g, '_') + '_' + billingCycle,
      type: 'hosting',
      title: `${ded.name} (${months} Months)`,
      subtitle: `${ded.cpu} | ${ded.ram} | ${ded.storage} (@ ${formatPrice(rate)}/mo)`,
      billingCycle,
      price: totalPrice,
      details: 'Includes Unmetered 10Gbps Network Port, KVM Remote Control & IPMI'
    });
    showToast(`🛒 ${ded.name} added to cart! Opening checkout...`, 'success');
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const filteredPlans = HOSTING_PLANS.filter(p => p.category === activeTab);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. TOP HERO: FRONT-PAGE AI WEBSITE & APP BUILDER AGENT */}
      <section className="relative pt-8 lg:pt-12 pb-6 overflow-hidden">
        {/* Glowing Background Radial Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[320px] bg-indigo-600/20 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>PRIMARY AI AGENT WEBSITE & APP BUILDER HUB</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
              Build Any Website or Full App from a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                Single AI Prompt
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
              Describe your dream website or SaaS app in natural language. Watch our AI Agent write live code, render a real-time preview, and export directly to your GitHub account or 1-Click Cloud Hosting!
            </p>
          </div>

          <AiWebsiteBuilderHub initialAgent="builder" />
        </div>
      </section>

      {/* 2. DOMAIN SEARCH SECTION */}
      <section className="relative pt-6 pb-10 overflow-hidden border-t border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Search & Register Your Real Domain Name</span>
          </div>

          {/* Display Headline */}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Register Your Custom Domain & Link to AI App
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Instant global DNS lookup, ultra-fast NVMe cloud hosting, and custom domain mapping for your AI-built apps.
          </p>

          {/* Domain Search Hero Widget */}
          <div className="pt-2">
            <DomainSearchBox />
          </div>

          {/* Popular Domain TLD Price Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-900/80 max-w-3xl mx-auto">
            {DOMAIN_PRICING.slice(0, 5).map(item => (
              <div key={item.tld} className="flex items-center gap-1.5 font-mono">
                <span className="font-extrabold text-white">{item.tld}</span>
                <span className="text-emerald-400 font-bold">{formatPrice(item.registerINR)}</span>
                <span className="text-slate-600">/yr</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. HOSTING PLANS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Guaranteed Lowest Price Web & Cloud Hosting</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Hosting Plan
          </h2>

          {/* Category Switcher Tabs (All Hosting Categories) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'web', name: 'Web Hosting', icon: Server, badge: 'SAVE 82%' },
              { id: 'wordpress', name: 'WordPress Hosting', icon: Zap, badge: 'FAST' },
              { id: 'cloud', name: 'Cloud Hosting', icon: Globe, badge: 'POWER' },
              { id: 'vps', name: 'Cloud VPS', icon: Server, badge: 'ROOT SSH' },
              { id: 'dedicated', name: 'Dedicated Bare Metal', icon: ShieldCheck, badge: 'RAW GPU' },
              { id: 'reseller', name: 'Reseller / Agency', icon: Sparkles, badge: '1000 SITES' },
              { id: 'ai_agent', name: 'AI SaaS Hosting', icon: Sparkles, badge: 'GEMINI AI' }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 border ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-xl shadow-purple-600/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 text-purple-400" />
                  <span>{tab.name}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 shadow-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-all ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'hover:text-white'
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl transition-all ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow' : 'hover:text-white'
              }`}
            >
              1 Year (SAVE 20%)
            </button>
            <button
              onClick={() => setBillingCycle('4years')}
              className={`px-4 py-2 rounded-xl transition-all ${
                billingCycle === '4years'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'hover:text-white'
              }`}
            >
              48 Months (MAX DISCOUNT) 🔥
            </button>
          </div>
        </div>

        {/* VPS GRID DISPLAY */}
        {activeTab === 'vps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {VPS_PLANS.map((vps, idx) => {
              const rate = billingCycle === 'monthly' ? vps.priceINR * 1.5 : billingCycle === 'yearly' ? vps.priceINR * 1.2 : vps.priceINR;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative">
                  {vps.nameBadge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase">
                      {vps.nameBadge}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white">{vps.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold">{vps.discount}</span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{formatPrice(rate)}</span>
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">RAM:</span>
                        <span className="text-purple-300 font-bold">{vps.ram}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">vCPU:</span>
                        <span className="text-cyan-300 font-bold">{vps.vcpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Storage:</span>
                        <span className="text-emerald-300 font-bold">{vps.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Bandwidth:</span>
                        <span className="text-amber-300 font-bold">{vps.bandwidth}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-400 pt-2">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full Root SSH Access</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dedicated IPv4 Address</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> KVM Virtualization</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Docker & Kubernetes Ready</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectVpsPlan(vps)}
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30"
                  >
                    <span>Configure VPS Server</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* DEDICATED BARE METAL DISPLAY */}
        {activeTab === 'dedicated' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {DEDICATED_PLANS.map((ded, idx) => {
              const rate = billingCycle === 'monthly' ? ded.priceINR * 1.3 : billingCycle === 'yearly' ? ded.priceINR * 1.1 : ded.priceINR;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative">
                  {ded.nameBadge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-black uppercase">
                      {ded.nameBadge}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-white">{ded.name}</h3>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold">{ded.discount}</span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">{formatPrice(rate)}</span>
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-300 pt-3 border-t border-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Processor:</span>
                        <span className="text-cyan-300 font-bold">{ded.cpu}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">RAM:</span>
                        <span className="text-purple-300 font-bold">{ded.ram}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Storage:</span>
                        <span className="text-emerald-300 font-bold">{ded.storage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Bandwidth:</span>
                        <span className="text-amber-300 font-bold">{ded.bandwidth}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-slate-400 pt-2">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 100% Dedicated Hardware - Zero Noisy Neighbors</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> IPMI & Out-of-Band Remote Management</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Enterprise RAID Hardware Controller</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 24/7 On-Site Hardware Replacement SLA</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectDedicatedPlan(ded)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/30"
                  >
                    <span>Deploy Bare Metal Server</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* STANDARD HOSTING PLANS DISPLAY */}
        {activeTab !== 'vps' && activeTab !== 'dedicated' && (
        <div className={`grid grid-cols-1 ${filteredPlans.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4 gap-5' : 'md:grid-cols-3 gap-8'} pt-4`}>
          {filteredPlans.map(plan => {
            const rate = getCycleRate(plan.monthlyPriceINR);
            const months = getCycleMonths(plan.id);
            const totalPrice = getCycleTotal(plan);

            return (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/90 via-slate-950 to-slate-950 border-indigo-500 shadow-2xl shadow-indigo-500/25 scale-105 z-20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-extrabold uppercase tracking-widest shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-slate-500 line-through text-sm font-semibold">
                        {formatPrice(plan.originalPriceINR || plan.monthlyPriceINR * 5)}
                      </span>
                      {plan.discountTag && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                          {plan.discountTag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Price Display */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {formatPrice(rate)}
                      </span>
                      <span className="text-sm font-semibold text-slate-400">/mo</span>
                    </div>
                    <div className="text-xs text-slate-400 pt-1 leading-snug">
                      <div className="font-semibold text-slate-300">
                        {months} mo. plan • {formatPrice(totalPrice)} (plus tax)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        After, renews at {formatPrice(plan.renewalPriceINR)}/mo for 1 yr.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white'
                    }`}
                  >
                    <span>Choose Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Feature Checklist */}
                  <div className="pt-6 border-t border-slate-800/80 space-y-3 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-200">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* 2.5 N8N AUTOMATION WORKFLOWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-950 to-indigo-950/80 border border-purple-500/40 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-2xl relative overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Workflow className="w-4 h-4 text-purple-400" />
              <span>N8N AUTOMATION WORKFLOW STUDIO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Build & Automate Anything with <span className="text-purple-400">n8n Cloud Workflows</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Connect WhatsApp Bots, Gemini AI Models, Google Sheets, Telegram, CRM, and WooCommerce. Choose any plan and start automating instantly with 24/7 server uptime and instant profile activation!
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>WhatsApp AI Auto-Responder</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Lead Auto-Capture & CRM Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Gemini 2.5 AI Email Classifier</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Unlimited Rest Webhooks</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setCurrentView('n8n')}
                className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-purple-600/30 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Open n8n Automation Studio</span>
              </button>
              <button
                onClick={() => {
                  addToCart({
                    id: 'cart_n8n_pro_home',
                    type: 'hosting',
                    title: 'n8n Pro Automation Cloud',
                    subtitle: 'Unlimited Webhooks & Dedicated Server Instance',
                    billingCycle: 'monthly',
                    price: 499,
                    details: '100,000 Executions/mo & Instant Profile Activation'
                  });
                  showToast('🛒 n8n Pro Plan added to cart!', 'success');
                  if (onOpenCart) onOpenCart();
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-extrabold text-xs transition-all"
              >
                Get n8n Pro (@ ₹499/mo)
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Active Workflow Example</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                RUNNING (1,420 Executions)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-white">
                <span>💬 WhatsApp Lead --&gt; 🤖 Gemini AI --&gt; 📊 Google Sheets</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Auto-replies to WhatsApp inquiries, extracts customer requirements with Gemini 2.5 Flash, and logs contact details into Google Sheets in 0.8s.
              </p>
              <div className="p-2 bg-slate-950 rounded text-[10px] font-mono text-purple-300 truncate">
                Webhook: https://n8n.onehost.cloud/webhook/whatsapp-bot-v1
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLOUD DEPLOYMENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border border-indigo-500/30 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Rocket className="w-4 h-4" />
              <span>INSTANT CLOUD DEPLOY ENGINE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              1-Click Deployment for React, Node & Web Apps
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Connect your GitHub repository or upload your project code. OneHost automatically compiles, secures with Let’s Encrypt SSL, and serves your app globally.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>GitHub Repository Deploy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Environment Variable Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live Terminal Build Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free SSL Certificate</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('deployments')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>Start Deploying Now</span>
            </button>
          </div>

          {/* Live Terminal Preview */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px]">onehost-cloud-deploy-v2</span>
            </div>

            <div className="space-y-1.5">
              <div className="text-slate-400">$ git push origin main</div>
              <div>[09:01:00] Fetching repository user/my-app...</div>
              <div>[09:01:04] Compiling web bundle with Vite & Node...</div>
              <div>[09:01:10] Issuing SSL Certificate for domain.com</div>
              <div className="text-cyan-400 font-bold">[09:01:12] App successfully LIVE at https://my-app.onehost.app ✨</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
