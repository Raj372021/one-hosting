import React from 'react';
import { Server, Globe, Zap, ShieldCheck, Cpu, Users, Award, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation */}
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
            <span>Infrastructure 100% Operational</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Pioneering Next-Gen Cloud Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Empowering Builders with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Ultra-Fast Cloud Hosting</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            OneHost was founded with a singular mission: to make enterprise-grade NVMe cloud hosting, instant 1-click deployments, and cutting-edge Gemini AI vibe coding accessible, lightning-fast, and transparent for developers, businesses, and creators globally.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400 font-mono">99.99%</div>
            <div className="text-xs font-bold text-white">Uptime SLA Guaranteed</div>
            <div className="text-[11px] text-slate-500">Tier-4 Datacenters</div>
          </div>
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">18+</div>
            <div className="text-xs font-bold text-white">Global Edge CDN Nodes</div>
            <div className="text-[11px] text-slate-500">Sub-15ms latency in Asia</div>
          </div>
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">50,000+</div>
            <div className="text-xs font-bold text-white">Websites & Apps Hosted</div>
            <div className="text-[11px] text-slate-500">Trusted by startups & creators</div>
          </div>
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">12 min</div>
            <div className="text-xs font-bold text-white">Avg Support Response</div>
            <div className="text-[11px] text-slate-500">24/7 Level-3 Engineers</div>
          </div>
        </div>

        {/* Datacenter & Infrastructure Highlights */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-8">
          <div className="space-y-2">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Enterprise Architecture</div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Why OneHost Performs Faster</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">AMD EPYC™ 9004 Processors</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by latest-gen 128-core AMD EPYC server CPUs with PCIe Gen5 NVMe drives achieving 7,200 MB/s read/write speeds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">LiteSpeed & Redis Caching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Native LiteSpeed Web Server architecture with HTTP/3 QUIC support for 10x faster dynamic WordPress & PHP execution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Gemini AI Vibe Coder Co-Pilot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-prompt AI application builder, SEO generator, security audit analyzer, and database schema synthesizer built-in.
              </p>
            </div>
          </div>
        </div>

        {/* Global Locations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white text-center">Global Tier-4 Datacenter Presence</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              { city: 'Mumbai', country: 'India (BOM)', ping: '12ms' },
              { city: 'Singapore', country: 'Singapore (SIN)', ping: '28ms' },
              { city: 'Frankfurt', country: 'Germany (FRA)', ping: '84ms' },
              { city: 'London', country: 'United Kingdom (LHR)', ping: '92ms' },
              { city: 'Virginia', country: 'United States (IAD)', ping: '140ms' },
              { city: 'San Jose', country: 'United States (SJC)', ping: '155ms' }
            ].map((loc, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-white text-sm">{loc.city}</div>
                <div className="text-[10px] text-slate-400">{loc.country}</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">{loc.ping}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Ready to Experience Ultra-Fast Hosting?</h3>
            <p className="text-xs text-slate-400">Launch your site in under 60 seconds with instant activation.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentView('hosting')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Explore Hosting Plans
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              Contact Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
