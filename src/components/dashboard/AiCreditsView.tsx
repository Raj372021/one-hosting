import React, { useState } from 'react';
import {
  Sparkles,
  CreditCard,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Wallet,
  TrendingUp,
  Award,
  Layers,
  Code,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RazorpayModal } from '../RazorpayModal';

export const AiCreditsView: React.FC = () => {
  const { user, formatPrice, addAiCredits, topUpWallet } = useAuth();
  const { showToast } = useToast();

  // Custom Credit Stepper State
  const [customCredits, setCustomCredits] = useState<number>(1000);
  
  // Custom Wallet Top-Up State
  const [customWalletAmount, setCustomWalletAmount] = useState<number>(1000);

  // Razorpay Payment Modal State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [paymentItem, setPaymentItem] = useState<{
    name: string;
    price: number;
    creditsToAdd?: number;
    walletToAdd?: number;
  } | null>(null);

  // Credit Packages
  const CREDIT_PACKS = [
    {
      id: 'pack_starter',
      name: 'Starter AI Pack',
      tag: 'MOST POPULAR',
      credits: 1000,
      price: 499,
      perCredit: '₹0.50 / credit',
      features: [
        '1,000 High-Speed AI Builder Credits',
        'Build ~2 Full Web Applications / Landing Pages',
        'Gemini 2.5 Pro & Claude 3.7 Sonnet Coding',
        'Lifetime Validity (Never Expires)',
        'Full React & Tailwind Export'
      ],
      color: 'border-purple-500/50 bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-900'
    },
    {
      id: 'pack_pro',
      name: 'Pro Developer Pack',
      tag: 'BEST VALUE (2X BONUS)',
      credits: 2500,
      price: 999,
      perCredit: '₹0.40 / credit',
      features: [
        '2,500 High-Speed AI Builder Credits',
        'Build ~5 Fullstack SaaS & Database Apps',
        'Full Stack TypeScript + Backend APIs',
        'Zero Token Throttling & Priority Queue',
        'Lifetime Validity & 24/7 Priority Support'
      ],
      color: 'border-amber-500/60 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 ring-1 ring-amber-500/30'
    },
    {
      id: 'pack_agency',
      name: 'Agency Ultra Pack',
      tag: 'MAXIMUM CAPACITY',
      credits: 7000,
      price: 2499,
      perCredit: '₹0.35 / credit',
      features: [
        '7,000 High-Speed AI Builder Credits',
        'Build 15+ Client Projects & Portals',
        'Multi-Agent System Architecture & Research',
        'Unlimited Live Sandbox Testing & Previews',
        'Dedicated Cloud Compute Pipeline'
      ],
      color: 'border-cyan-500/50 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900'
    }
  ];

  const handleBuyCreditPack = (pack: typeof CREDIT_PACKS[0]) => {
    setPaymentItem({
      name: `${pack.name} (${pack.credits.toLocaleString()} AI Credits)`,
      price: pack.price,
      creditsToAdd: pack.credits
    });
    setIsRazorpayOpen(true);
  };

  const handleBuyCustomCredits = () => {
    if (customCredits < 100) {
      showToast('Minimum custom purchase is 100 AI credits', 'error');
      return;
    }
    const price = Math.round(customCredits * 0.45);
    setPaymentItem({
      name: `Custom AI Credits (${customCredits.toLocaleString()} Credits)`,
      price: price,
      creditsToAdd: customCredits
    });
    setIsRazorpayOpen(true);
  };

  const handleTopupWallet = (amount: number) => {
    if (amount <= 0) {
      showToast('Please enter a valid wallet top-up amount', 'error');
      return;
    }
    setPaymentItem({
      name: `OneHost Wallet Top-Up (₹${amount.toLocaleString('en-IN')})`,
      price: amount,
      walletToAdd: amount
    });
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!paymentItem) return;

    if (paymentItem.creditsToAdd) {
      addAiCredits(paymentItem.creditsToAdd, paymentItem.name, paymentItem.price);
      showToast(`🎉 Payment Successful! ${paymentItem.creditsToAdd.toLocaleString()} AI Credits added to your account!`, 'success');
    } else if (paymentItem.walletToAdd) {
      topUpWallet(paymentItem.walletToAdd);
      showToast(`🎉 Payment Successful! ₹${paymentItem.walletToAdd.toLocaleString('en-IN')} added to your OneHost Wallet!`, 'success');
    }

    setIsRazorpayOpen(false);
    setPaymentItem(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200" id="ai-credits-studio">
      {/* 1. TOP HERO: CURRENT LIVE BALANCE & WALLET BAR */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950 border border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">AI Credits & Wallet Recharge Studio</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                LIFETIME VALIDITY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Power your AI Website Builder, Fullstack Coder, and Autonomous Agents. Top up instant credits with 100% secure Razorpay UPI / Cards.
            </p>
          </div>

          {/* BALANCE DISPLAY CARDS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* AI Credits Available */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 shadow-lg space-y-1 min-w-[170px]">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
                <span>AI Credits Balance</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300">
                {(user?.aiCredits ?? 2500).toLocaleString()} <span className="text-xs font-semibold text-slate-400">Credits</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for AI Generation
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-lg space-y-1 min-w-[170px]">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
                <span>Wallet Balance</span>
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {formatPrice(user?.walletBalance ?? 2450)}
              </div>
              <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> Auto-Renewal Enabled
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FEATURED AI CREDIT PACKAGES */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Instant AI Credit Top-Up Packs</span>
            </h3>
            <p className="text-xs text-slate-400">Choose a package below to recharge your credits instantly via UPI, GPay, PhonePe, Cards or NetBanking.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            ⚡ Instant Credit Addition
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`p-6 rounded-3xl border ${pack.color} flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden transition-all hover:scale-[1.01]`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30">
                    {pack.tag}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{pack.perCredit}</span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-white">{pack.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-white">₹{pack.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-400">one-time</span>
                  </div>
                  <div className="text-lg font-bold text-amber-400 mt-1">
                    +{pack.credits.toLocaleString()} AI Credits
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-slate-800/80">
                  {pack.features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuyCreditPack(pack)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-cyan-400/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buy {pack.name} (₹{pack.price})</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CUSTOM CREDIT CALCULATOR & INSTANT WALLET RECHARGE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom AI Credit Calculator */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                <span>Custom AI Credits Calculator</span>
              </h3>
              <p className="text-xs text-slate-400">Need an exact custom number of credits? Calculate and purchase right here.</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              ₹0.45 / Credit
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>Credits Quantity</span>
                <span className="text-amber-300 font-mono font-bold">{customCredits.toLocaleString()} Credits</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomCredits(prev => Math.max(100, prev - 500))}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={customCredits}
                  onChange={(e) => setCustomCredits(Math.max(100, parseInt(e.target.value) || 100))}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-center text-sm focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCustomCredits(prev => prev + 500)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {[500, 1500, 3000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomCredits(amt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customCredits === amt
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Total Recharge Amount</span>
                <span className="text-2xl font-black text-emerald-400">₹{Math.round(customCredits * 0.45).toLocaleString('en-IN')}</span>
              </div>
              <button
                type="button"
                onClick={handleBuyCustomCredits}
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Recharge Custom</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instant Wallet Top-Up */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>OneHost Wallet Top-Up</span>
              </h3>
              <p className="text-xs text-slate-400">Add funds for hosting renewals, domains, SSL, and server upgrades.</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              0% Gateway Fee
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>Select Quick Amount</span>
                <span className="text-emerald-400 font-mono font-bold">₹{customWalletAmount.toLocaleString('en-IN')}</span>
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomWalletAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      customWalletAmount === amt
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={customWalletAmount}
                  onChange={(e) => setCustomWalletAmount(Math.max(100, parseInt(e.target.value) || 100))}
                  placeholder="Or enter custom amount in ₹"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-bold block">Wallet Amount to Add</span>
                <span className="text-2xl font-black text-emerald-400">₹{customWalletAmount.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="button"
                onClick={() => handleTopupWallet(customWalletAmount)}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Wallet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI USAGE RATE CARD */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>AI Builder Credit Consumption Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400">Transparent Credit Usage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Landing Page & UI</span>
              <Globe className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-amber-300">500 Credits</div>
            <p className="text-[11px] text-slate-400">Complete responsive multi-section landing page with Tailwind CSS & icons.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Fullstack Web App</span>
              <Code className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-amber-300">1,000 Credits</div>
            <p className="text-[11px] text-slate-400">Interactive SaaS app with state management, calculations, and live demo.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Deep AI Research</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-amber-300">1,500 Credits</div>
            <p className="text-[11px] text-slate-400">Deep architectural planning, multi-agent logic, and database schemas.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Code Audit & Fix</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-amber-300">400 Credits</div>
            <p className="text-[11px] text-slate-400">Surgical debugging, speed optimization, and security hardening.</p>
          </div>
        </div>
      </div>

      {/* RAZORPAY PAYMENT MODAL */}
      {paymentItem && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => {
            setIsRazorpayOpen(false);
            setPaymentItem(null);
          }}
          onBack={() => {
            setIsRazorpayOpen(false);
            setPaymentItem(null);
          }}
          subtotal={paymentItem.price}
          discount={0}
          items={[{ name: paymentItem.name, price: paymentItem.price, qty: 1 }]}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
