import React, { useState } from 'react';
import { Sparkles, Bot, Send, X, ShieldCheck, Zap, Activity, ArrowLeft } from 'lucide-react';
import { runAiDiagnostic } from '../services/api';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [domain, setDomain] = useState('techventure.in');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunDiagnostic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const result = await runAiDiagnostic(prompt || 'How can I optimize speed and SSL for my website?', domain);
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-lg text-white flex items-center gap-2">
                <span>OneHost AI Server Diagnostic & Optimizer</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GEMINI 3.7 FLASH
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent Server Health & Speed Optimizer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back / Close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Target Hosting Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="domain.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Optimization Focus</label>
              <select
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none font-medium"
              >
                <option value="How can I optimize page speed and SSL security for my website?">
                  Page Speed & Redis Caching
                </option>
                <option value="Analyze my database queries and suggest indexing strategies for WordPress/Next.js">
                  Database & Query Indexing
                </option>
                <option value="Recommend custom Cloudflare firewall rules for DDoS protection">
                  DDoS & Firewall Security
                </option>
              </select>
            </div>
          </div>

          <button
            onClick={() => handleRunDiagnostic()}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Deep AI Server Diagnostic...</span>
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run AI Optimization Diagnostic</span>
              </>
            )}
          </button>

          {/* Diagnostic Result */}
          {response && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300 max-h-64 overflow-y-auto">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Diagnostic Report Result</span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-slate-300">{response}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
