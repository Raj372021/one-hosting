import React, { useState } from 'react';
import {
  Workflow,
  Zap,
  Play,
  CheckCircle2,
  Sparkles,
  Bot,
  MessageSquare,
  Mail,
  Share2,
  Database,
  Globe,
  Plus,
  ArrowRight,
  Code2,
  Check,
  Server,
  Terminal,
  ShieldCheck,
  Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { N8nWorkflow } from '../types';

interface N8nAutomationHubProps {
  onPlanSelected?: (planName: string, price: number) => void;
}

const PREBUILT_TEMPLATES = [
  {
    id: 'tmpl-whatsapp',
    name: 'WhatsApp AI Auto-Responder',
    category: 'whatsapp',
    description: 'Auto-reply to incoming customer inquiries on WhatsApp using Gemini AI 2.5 and capture lead info.',
    triggerType: 'webhook',
    nodesCount: 5,
    popular: true,
    nodes: ['WhatsApp Trigger', 'Gemini AI Parser', 'Lead Filter', 'Google Sheets Log', 'WhatsApp Sender']
  },
  {
    id: 'tmpl-lead-crm',
    name: 'Lead Auto-Capture & CRM Sync',
    category: 'crm',
    description: 'Instantly sync web form submissions & webhook leads into Google Sheets, Airtable, and send Slack alert.',
    triggerType: 'webhook',
    nodesCount: 4,
    popular: true,
    nodes: ['Webhook Receiver', 'Data Cleaner', 'Google Sheets Writer', 'Slack / Telegram Alert']
  },
  {
    id: 'tmpl-email-ai',
    name: 'AI Email Classifier & Auto-Draft',
    category: 'ai',
    description: 'Scan incoming emails, summarize message content with AI, and draft personalized smart replies.',
    triggerType: 'cron',
    nodesCount: 6,
    popular: false,
    nodes: ['IMAP / Gmail Trigger', 'Gemini AI Summarizer', 'Sentiment Filter', 'Draft Creator', 'Log History']
  },
  {
    id: 'tmpl-ecom-sync',
    name: 'WooCommerce Order & Invoice Sync',
    category: 'ecommerce',
    description: 'Automatically generate GST invoice PDF and send WhatsApp tracking update when a new order arrives.',
    triggerType: 'event',
    nodesCount: 5,
    popular: false,
    nodes: ['WooCommerce Order Event', 'Razorpay Sync', 'PDF Invoice Gen', 'WhatsApp Notification', 'Airtable Sync']
  },
  {
    id: 'tmpl-social-post',
    name: 'Social Media AI Auto-Publisher',
    category: 'social',
    description: 'Generate weekly AI social posts and publish automatically across Twitter, LinkedIn, and Facebook.',
    triggerType: 'cron',
    nodesCount: 4,
    popular: false,
    nodes: ['Cron Scheduler', 'Gemini Content Gen', 'Image Generator', 'Multi-Social Publisher']
  }
];

export const N8nAutomationHub: React.FC<N8nAutomationHubProps> = ({ onPlanSelected }) => {
  const { user, addToCart, formatPrice, setCurrentView, activateSubscription, addN8nWorkflow } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'workflows' | 'builder' | 'plans'>('plans');
  const [selectedTemplate, setSelectedTemplate] = useState(PREBUILT_TEMPLATES[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Builder State
  const [customName, setCustomName] = useState('My Custom n8n Workflow');
  const [customNodes, setCustomNodes] = useState(['Webhook Trigger', 'Gemini AI Node', 'HTTP Request']);
  const [newNodeName, setNewNodeName] = useState('');

  const handleTestWorkflow = (tmplName: string) => {
    setIsExecuting(true);
    setLogs([`[0.00s] ⚡ Initializing n8n workflow engine instance...`]);

    setTimeout(() => {
      setLogs(prev => [...prev, `[0.15s] 📥 Received webhook payload from client trigger.`]);
    }, 400);

    setTimeout(() => {
      setLogs(prev => [...prev, `[0.45s] 🤖 Executing Gemini 2.5 Flash AI transformation node.`]);
    }, 900);

    setTimeout(() => {
      setLogs(prev => [...prev, `[0.80s] 💾 Writing data payload to connected database / API.`]);
      setLogs(prev => [...prev, `[1.10s] ✅ Workflow execution #94822 completed successfully in 1.1s (0 errors)!`]);
      setIsExecuting(false);
      showToast(`⚡ Workflow "${tmplName}" test execution succeeded!`, 'success');
    }, 1400);
  };

  const handleAddCustomNode = () => {
    if (!newNodeName.trim()) return;
    setCustomNodes([...customNodes, newNodeName.trim()]);
    setNewNodeName('');
    showToast(`Added node "${newNodeName}" to workflow!`, 'info');
  };

  const handleActivateWorkflow = (tmpl: typeof PREBUILT_TEMPLATES[0]) => {
    const newWf: Omit<N8nWorkflow, 'id' | 'executionsCount'> = {
      name: tmpl.name,
      description: tmpl.description,
      category: tmpl.category,
      active: true,
      triggerType: tmpl.triggerType as any,
      webhookUrl: `https://n8n.onehost.cloud/webhook/usr_${user?.id || '1'}_${tmpl.id}`,
      nodesCount: tmpl.nodesCount
    };

    addN8nWorkflow(newWf);
    showToast(`🚀 Workflow "${tmpl.name}" activated in your profile!`, 'success');
    setCurrentView('dashboard');
  };

  const handleBuyN8nPlan = (planName: string, priceINR: number, cycle: 'monthly' | 'yearly' | '4years' = 'monthly') => {
    addToCart({
      id: 'cart_n8n_' + planName.toLowerCase().replace(/\s+/g, '_'),
      type: 'hosting',
      title: `${planName} (Managed n8n)`,
      subtitle: `Unlimited Webhooks & Dedicated n8n Server (@ ${formatPrice(priceINR)}/mo)`,
      billingCycle: cycle,
      price: priceINR,
      details: 'Instant n8n Instance Deployment with Custom Webhook Endpoints & 24/7 SLA'
    });

    // Also auto activate directly into profile for seamless experience
    activateSubscription({
      title: `${planName} Instance`,
      category: 'n8n',
      planName: planName,
      monthlyPrice: priceINR,
      billingCycle: 'monthly',
      instanceUrl: `https://n8n-${user?.id || 'raj'}.onehost.cloud`,
      webhookUrl: `https://n8n-${user?.id || 'raj'}.onehost.cloud/webhook/v1`,
      apiKey: `n8n_sec_key_${Math.random().toString(36).substring(2, 12)}`,
      details: 'Active Managed n8n Automation Engine with 24/7 Executions'
    });

    showToast(`🎉 ${planName} activated! You can now use all n8n workflows.`, 'success');
    setActiveTab('workflows');
    if (onPlanSelected) onPlanSelected(planName, priceINR);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 sm:p-6">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border border-purple-800/40 p-8 shadow-2xl text-slate-100">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>N8N AUTOMATION ENGINE & WORKFLOW BUILDER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Build & Host Unlimited <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">n8n Workflows</span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Automate business tasks, connect WhatsApp, CRM, AI Models (Gemini 2.5), Webhooks, and WooCommerce without writing code. Choose a plan and deploy instantly with 24/7 uptime guarantee!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Server className="w-4 h-4 text-emerald-400" />
              <span>n8n Cloud Plans (Step 1)</span>
            </button>
            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'workflows'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Ready Workflows (Step 2)</span>
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'builder'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Visual Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. READY WORKFLOWS CATALOG & PLANS */}
      {activeTab === 'workflows' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-400" />
              <span>Template Catalog</span>
            </h3>

            <div className="space-y-3">
              {PREBUILT_TEMPLATES.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedTemplate.id === tmpl.id
                      ? 'bg-purple-950/60 border-purple-500/80 text-white shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                      {tmpl.category}
                    </span>
                    {tmpl.popular && (
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white">{tmpl.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{tmpl.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Detail & Tester */}
          <div className="lg:col-span-2 space-y-6 bg-slate-950 border border-slate-800 p-6 rounded-3xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">
                  Selected Template
                </span>
                <h3 className="text-2xl font-black text-white">{selectedTemplate.name}</h3>
                <p className="text-xs text-slate-400 pt-1">{selectedTemplate.description}</p>
              </div>

              <button
                onClick={() => handleActivateWorkflow(selectedTemplate)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Activate in Profile</span>
              </button>
            </div>

            {/* Workflow Node Pipeline */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase">
                Workflow Visual Nodes Pipeline ({selectedTemplate.nodesCount} Nodes)
              </label>
              <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                {selectedTemplate.nodes.map((node, i) => (
                  <React.Fragment key={i}>
                    <div className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{node}</span>
                    </div>
                    {i < selectedTemplate.nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Webhook Endpoint */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-400">Trigger Webhook Endpoint URL</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">● ACTIVE & LISTENING</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://n8n.onehost.cloud/webhook/usr_${user?.id || '1'}_${selectedTemplate.id}`}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://n8n.onehost.cloud/webhook/usr_${user?.id || '1'}_${selectedTemplate.id}`);
                    setCopiedWebhook(true);
                    showToast('Webhook URL copied to clipboard!', 'success');
                    setTimeout(() => setCopiedWebhook(false), 2000);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Interactive Test Terminal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Execution Test Console</span>
                </label>
                <button
                  onClick={() => handleTestWorkflow(selectedTemplate.name)}
                  disabled={isExecuting}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecuting ? 'Running...' : 'Run Test Execution'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 h-40 overflow-y-auto space-y-1">
                {logs.length === 0 ? (
                  <div className="text-slate-600 italic">Click "Run Test Execution" to trigger real-time test run logs...</div>
                ) : (
                  logs.map((log, idx) => <div key={idx}>{log}</div>)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MANAGED N8N CLOUD HOSTING PLANS (ALWAYS VISIBLE FOR CUSTOMER CONVERSION) */}
        <div className="pt-6 border-t border-slate-800/80 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
              ⚡ DEDICATED N8N SERVERS
            </span>
            <h2 className="text-2xl font-black text-white">Managed n8n Cloud Hosting Plans</h2>
            <p className="text-xs text-slate-400">High-speed dedicated n8n servers with pre-configured webhooks, SSL, and instant profile activation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">n8n Starter Cloud</h3>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-extrabold">ENTRY</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{formatPrice(199)}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 10,000 Executions / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 5 Active Workflows</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Built-in Webhook & Trigger Listeners</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Free SSL & Shared Server Instance</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Community Node Support</div>
                </div>
              </div>

              <button
                onClick={() => handleBuyN8nPlan('n8n Starter Cloud', 199)}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Select & Activate Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Plan 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border-2 border-purple-500/80 hover:border-purple-400 transition-all flex flex-col justify-between space-y-6 shadow-2xl relative bg-gradient-to-b from-purple-950/30 to-slate-950">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider">
                MOST POPULAR FOR BUSINESS
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">n8n Pro Automation</h3>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">SAVE 70%</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{formatPrice(499)}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <div className="space-y-2 text-xs text-slate-200 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 100,000 Executions / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> UNLIMITED Workflows & Webhooks</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Gemini AI & OpenAI Vector DB Nodes</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> WhatsApp & Telegram API Connectors</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Memory Instance (4GB RAM)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Priority Processing Queue & 24/7 SLA</div>
                </div>
              </div>

              <button
                onClick={() => handleBuyN8nPlan('n8n Pro Automation', 499)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-black text-xs shadow-xl shadow-purple-600/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Select & Activate Plan</span>
              </button>
            </div>

            {/* Plan 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">n8n Enterprise Cloud</h3>
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold">DEDICATED</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{formatPrice(999)}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> UNLIMITED Executions / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> 100% Dedicated n8n Docker Server</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Custom Python & Node.js Code Execution</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Dedicated IP & High-Volume Webhooks</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> 24/7 Priority Tech Support Desk</div>
                </div>
              </div>

              <button
                onClick={() => handleBuyN8nPlan('n8n Enterprise Cloud', 999)}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Select & Activate Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* 2. VISUAL WORKFLOW BUILDER */}
      {activeTab === 'builder' && (
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-black text-white">Visual Drag-and-Drop n8n Workflow Canvas</h3>
              <p className="text-xs text-slate-400">Design custom automation flows with AI triggers and REST Webhook connectors.</p>
            </div>
            <button
              onClick={() => {
                const newWf: Omit<N8nWorkflow, 'id' | 'executionsCount'> = {
                  name: customName,
                  description: `Custom flow with ${customNodes.length} nodes`,
                  category: 'custom',
                  active: true,
                  triggerType: 'webhook',
                  webhookUrl: `https://n8n.onehost.cloud/webhook/usr_${user?.id || '1'}_custom_${Date.now()}`,
                  nodesCount: customNodes.length
                };
                addN8nWorkflow(newWf);
                showToast(`🚀 Custom workflow "${customName}" saved & activated!`, 'success');
                setCurrentView('dashboard');
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Deploy Custom Workflow</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 block">Workflow Name</label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none"
              />
            </div>

            {/* Nodes Pipeline */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Active Node Pipeline</label>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-4 min-h-[120px]">
                {customNodes.map((node, idx) => (
                  <React.Fragment key={idx}>
                    <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1 shadow-lg text-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <span className="font-extrabold text-xs text-white">{node}</span>
                      </div>
                      <button
                        onClick={() => setCustomNodes(customNodes.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-red-400 text-xs font-bold"
                        title="Remove node"
                      >
                        ×
                      </button>
                    </div>
                    {idx < customNodes.length - 1 && <ArrowRight className="w-5 h-5 text-purple-400 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Add Node Input */}
            <div className="flex items-center gap-3 max-w-md">
              <input
                type="text"
                value={newNodeName}
                onChange={e => setNewNodeName(e.target.value)}
                placeholder="Enter node name (e.g. OpenAI / MySQL / WhatsApp)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
              />
              <button
                onClick={handleAddCustomNode}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Node</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. N8N MANAGED CLOUD HOSTING PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl font-black text-white">Managed n8n Cloud Hosting Plans</h2>
            <p className="text-xs text-slate-400">High-speed dedicated n8n servers with pre-configured webhooks, SSL, and instant profile activation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan 1 */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">n8n Starter Cloud</h3>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-extrabold">ENTRY</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{formatPrice(199)}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 10,000 Executions / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 5 Active Workflows</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Built-in Webhook & Trigger Listeners</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Free SSL & Shared Server Instance</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Community Node Support</div>
                </div>
              </div>

              <button
                onClick={() => handleBuyN8nPlan('n8n Starter Cloud', 199)}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Select & Activate Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Plan 2 */}
            <div className="p-8 rounded-3xl bg-slate-950 border-2 border-purple-500/80 hover:border-purple-400 transition-all flex flex-col justify-between space-y-6 shadow-2xl relative bg-gradient-to-b from-purple-950/30 to-slate-950">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider">
                MOST POPULAR FOR BUSINESS
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">n8n Pro Automation</h3>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">SAVE 70%</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{formatPrice(499)}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <div className="space-y-2 text-xs text-slate-200 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 100,000 Executions / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> UNLIMITED Workflows & Webhooks</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Gemini AI & OpenAI Vector DB Nodes</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> WhatsApp & Telegram API Connectors</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Memory Instance (4GB RAM)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Priority Processing Queue & 24/7 SLA</div>
                </div>
              </div>

              <button
                onClick={() => handleBuyN8nPlan('n8n Pro Automation', 499)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-black text-xs shadow-xl shadow-purple-600/40 flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Select & Activate Plan</span>
              </button>
            </div>

            {/* Plan 3 */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-6 shadow-xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">n8n Enterprise Cloud</h3>
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold">DEDICATED</span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{formatPrice(999)}</span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-900">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> UNLIMITED Executions / month</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> 100% Dedicated n8n Docker Server</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Custom Python & Node.js Code Execution</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Dedicated IP & High-Volume Webhooks</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> 24/7 Priority Tech Support Desk</div>
                </div>
              </div>

              <button
                onClick={() => handleBuyN8nPlan('n8n Enterprise Cloud', 999)}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Select & Activate Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
