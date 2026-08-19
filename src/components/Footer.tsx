import React from 'react';
import { Server, ShieldCheck, Zap, Globe, CreditCard, Lock, Heart, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useAuth();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-white">NVMe Speed Boost</div>
            <div className="text-xs text-slate-500">LiteSpeed & Redis Caching</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-white">99.99% Uptime SLA</div>
            <div className="text-xs text-slate-500">Tier-4 Isolated Datacenters</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-white">Free Unlimited SSL</div>
            <div className="text-xs text-slate-500">Auto-Renew Let's Encrypt</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-white">Instant UPI & Razorpay</div>
            <div className="text-xs text-slate-500">Auto GST Invoice Included</div>
          </div>
        </div>
      </div>

      {/* Links Navigation Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              <Server className="w-4 h-4" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">OneHost</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
            OneHost is a next-generation cloud web hosting platform delivering ultra-fast NVMe SSD server performance, instant 1-click GitHub/ZIP deployments, domain registrations, and cPanel-grade hosting tools.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All Global Edge Nodes 100% Operational</span>
          </div>
        </div>

        <div>
          <div className="font-bold text-white text-sm mb-4">Hosting Plans</div>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => setCurrentView('hosting')} className="hover:text-indigo-400 transition-colors">Starter Hosting (₹99/mo)</button></li>
            <li><button onClick={() => setCurrentView('hosting')} className="hover:text-indigo-400 transition-colors">Premium Hosting (₹249/mo)</button></li>
            <li><button onClick={() => setCurrentView('hosting')} className="hover:text-indigo-400 transition-colors">Business Hosting (₹499/mo)</button></li>
            <li><button onClick={() => setCurrentView('hosting')} className="hover:text-indigo-400 transition-colors">Developer Cloud VPS (₹999/mo)</button></li>
            <li><button onClick={() => setCurrentView('hosting')} className="hover:text-indigo-400 transition-colors">Bare Metal Dedicated (₹2999/mo)</button></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-white text-sm mb-4">Popular TLDs</div>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => setCurrentView('domains')} className="hover:text-cyan-400 transition-colors">.in Domains (₹699/yr)</button></li>
            <li><button onClick={() => setCurrentView('domains')} className="hover:text-cyan-400 transition-colors">.com Domains (₹999/yr)</button></li>
            <li><button onClick={() => setCurrentView('domains')} className="hover:text-cyan-400 transition-colors">.ai Domains (₹6999/yr)</button></li>
            <li><button onClick={() => setCurrentView('domains')} className="hover:text-cyan-400 transition-colors">.io Domains (₹3499/yr)</button></li>
            <li><button onClick={() => setCurrentView('domains')} className="hover:text-cyan-400 transition-colors">.store Domains (₹399/yr)</button></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-white text-sm mb-4">Company & Legal</div>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => setCurrentView('about')} className="hover:text-indigo-400 transition-colors">About Us</button></li>
            <li><button onClick={() => setCurrentView('contact')} className="hover:text-indigo-400 transition-colors">Contact Us & Support</button></li>
            <li><button onClick={() => setCurrentView('privacy')} className="hover:text-indigo-400 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => setCurrentView('terms')} className="hover:text-indigo-400 transition-colors">Terms of Service</button></li>
            <li><button onClick={() => setCurrentView('refund')} className="hover:text-indigo-400 transition-colors">Refund & Cancellation</button></li>
            <li><button onClick={() => setCurrentView('sla')} className="hover:text-indigo-400 transition-colors">99.99% Uptime SLA</button></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Badges */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© 2026 OneHost Cloud Solutions Ltd. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-500">
            <button onClick={() => setCurrentView('about')} className="hover:text-slate-300 transition-colors cursor-pointer">About</button>
            <span>•</span>
            <button onClick={() => setCurrentView('contact')} className="hover:text-slate-300 transition-colors cursor-pointer">Contact</button>
            <span>•</span>
            <button onClick={() => setCurrentView('privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setCurrentView('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">Terms</button>
            <span>•</span>
            <button onClick={() => setCurrentView('refund')} className="hover:text-slate-300 transition-colors cursor-pointer">Refund Policy</button>
            <span>•</span>
            <button onClick={() => setCurrentView('sla')} className="hover:text-slate-300 transition-colors cursor-pointer">SLA</button>
            <span>•</span>
            <span className="text-slate-400 font-mono">GSTIN: 27AABCU9603R1ZM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
