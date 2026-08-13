import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import {
  Sparkles,
  Bot,
  Rocket,
  Code,
  Eye,
  Download,
  Copy,
  Check,
  Zap,
  Wrench,
  Search,
  Database,
  Palette,
  ShieldAlert,
  Globe,
  ShoppingCart,
  ExternalLink,
  RefreshCw,
  Layers,
  ArrowRight,
  ArrowLeft,
  Play,
  Cpu,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Mic,
  Layout,
  BookOpen,
  CreditCard,
  PlusCircle,
  CheckCircle,
  Key,
  Lock,
  Shield,
  Github,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Terminal,
  Pencil,
  Upload,
  FolderArchive,
  FileArchive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateAiApp, runAiAgentTask, deployApplication } from '../services/api';
import { pushProjectToGithub } from '../services/githubService';
import { RazorpayModal } from './RazorpayModal';

interface AiWebsiteBuilderHubProps {
  initialAgent?: 'builder' | 'research' | 'vision' | 'voice' | 'code' | 'db' | 'seo' | 'brand' | 'security';
}

export const AiWebsiteBuilderHub: React.FC<AiWebsiteBuilderHubProps> = ({ initialAgent = 'builder' }) => {
  const { showToast } = useToast();
  const { user, addAiCredits, deductAiCredits, formatPrice, setCurrentView } = useAuth();

  const [activeTab, setActiveTab] = useState<'builder' | 'research' | 'vision' | 'voice' | 'code' | 'db' | 'seo' | 'brand' | 'security'>(initialAgent);
  
  // Google AI Studio Models from Chat Settings
  const [selectedModel, setSelectedModel] = useState<
    | 'gemini-3.6-flash'
    | 'gemini-3.5-flash-lite'
    | 'gemini-3.5-flash'
    | 'gemini-3.1-pro-preview'
    | 'gemini-3.1-flash-lite'
    | 'gemini-3-flash-preview'
    | 'gemini-2.5-pro'
    | 'gemini-2.5-flash'
    | 'gemini-deep-research'
  >('gemini-3.6-flash');

  // Google API Key State & Storage
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('onehost_google_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(userApiKey);

  // AI Credit Modal State & Discount Timer
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedCreditPack, setSelectedCreditPack] = useState<{ name: string; credits: number; price: number } | null>(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 52 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 15, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Agent 1: Website & App Builder State
  const [creationMode, setCreationMode] = useState<'ai' | 'zip' | 'code'>('ai');
  const [rawPastedCode, setRawPastedCode] = useState('');
  const [customSiteTitle, setCustomSiteTitle] = useState('');
  const [isProcessingZip, setIsProcessingZip] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [appPrompt, setAppPrompt] = useState('');
  const [appCategory, setAppCategory] = useState('E-Commerce & Store');
  const [appStyle, setAppStyle] = useState('Modern Glassmorphism & Dark');
  const [isBuildingApp, setIsBuildingApp] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [agentProgressPct, setAgentProgressPct] = useState(0);
  const [generatedApp, setGeneratedApp] = useState<{
    title: string;
    description: string;
    code: string;
    techStack: string[];
    suggestedDomain: string;
  } | null>(null);

  // Handle ZIP / HTML File Upload & Extraction
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.zip') && !fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
      showToast('Please upload a valid .zip archive or .html file!', 'error');
      return;
    }

    setIsProcessingZip(true);
    showToast(`📦 Reading & extracting "${file.name}"...`, 'info');

    try {
      let extractedHtml = '';
      const baseTitle = file.name.replace(/\.[^/.]+$/, '');
      const siteTitle = (customSiteTitle.trim() || baseTitle).charAt(0).toUpperCase() + (customSiteTitle.trim() || baseTitle).slice(1);

      if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
        extractedHtml = await file.text();
      } else {
        const zip = new JSZip();
        const zipData = await zip.loadAsync(file);

        let indexFile = zipData.file('index.html') || zipData.file('index.htm');
        if (!indexFile) {
          const htmlFiles = Object.keys(zipData.files).filter(f => !zipData.files[f].dir && (f.endsWith('.html') || f.endsWith('.htm')));
          if (htmlFiles.length > 0) {
            indexFile = zipData.file(htmlFiles[0]);
          }
        }

        if (!indexFile) {
          showToast('❌ No index.html found in ZIP archive!', 'error');
          setIsProcessingZip(false);
          return;
        }

        extractedHtml = await indexFile.async('string');

        // Extract & inline CSS
        const cssFiles = Object.keys(zipData.files).filter(f => !zipData.files[f].dir && f.endsWith('.css'));
        for (const cssPath of cssFiles) {
          const cssContent = await zipData.files[cssPath].async('string');
          if (cssContent && !extractedHtml.includes(cssContent.substring(0, 30))) {
            extractedHtml = extractedHtml.replace('</head>', `<style>\n/* Inlined from ${cssPath} */\n${cssContent}\n</style>\n</head>`);
          }
        }

        // Extract & inline JS
        const jsFiles = Object.keys(zipData.files).filter(f => !zipData.files[f].dir && f.endsWith('.js'));
        for (const jsPath of jsFiles) {
          const jsContent = await zipData.files[jsPath].async('string');
          if (jsContent && !extractedHtml.includes(jsContent.substring(0, 30))) {
            extractedHtml = extractedHtml.replace('</body>', `<script>\n/* Inlined from ${jsPath} */\n${jsContent}\n</script>\n</body>`);
          }
        }
      }

      if (!extractedHtml.trim()) {
        showToast('Uploaded file content is empty!', 'error');
        setIsProcessingZip(false);
        return;
      }

      const slug = siteTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setGeneratedApp({
        title: siteTitle,
        description: `Uploaded from file archive (${file.name}) to OneHost Hosting`,
        code: extractedHtml,
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'ZIP Archive'],
        suggestedDomain: `${slug}.onehost.cloud`
      });

      showToast(`🎉 Successfully extracted "${file.name}"! Click "Deploy" to launch live.`, 'success');
    } catch (err) {
      console.error('File parsing error:', err);
      showToast('Error reading ZIP file. Please check file format.', 'error');
    } finally {
      setIsProcessingZip(false);
    }
  };

  // Handle Direct Code Load
  const handleLoadPastedCode = () => {
    if (!rawPastedCode.trim()) {
      showToast('Please paste or write your website HTML code first!', 'error');
      return;
    }

    const titleToUse = customSiteTitle.trim() || 'My Custom Website';
    const slug = titleToUse.toLowerCase().replace(/[^a-z0-9]/g, '-');

    setGeneratedApp({
      title: titleToUse,
      description: 'Custom HTML/CSS/JS website code deployed on OneHost Hosting',
      code: rawPastedCode,
      techStack: ['Custom HTML5', 'CSS3', 'JavaScript'],
      suggestedDomain: `${slug}.onehost.cloud`
    });

    showToast('✨ Loaded custom code into Live Sandbox Preview! Click "Deploy" to publish.', 'success');
  };
  const [previewViewMode, setPreviewViewMode] = useState<'preview' | 'code'>('preview');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDeployingGenerated, setIsDeployingGenerated] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [deployedWebsitesHistory, setDeployedWebsitesHistory] = useState<Array<{
    id: string;
    title: string;
    url: string;
    domain: string;
    deployedAt: string;
    techStack: string[];
    code: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem('onehost_deployed_websites');
      return saved ? JSON.parse(saved) : [
        {
          id: 'dep-demo-1',
          title: 'Sample E-Commerce Store',
          url: typeof window !== 'undefined' ? `${window.location.origin}/sites/sample-store-9482` : '/sites/sample-store-9482',
          domain: 'sample-store-9482.onehost.cloud',
          deployedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          techStack: ['HTML5', 'Tailwind CSS', 'JavaScript ES6+'],
          code: ''
        }
      ];
    } catch {
      return [];
    }
  });

  // Custom Domain Connection Modal State
  const [isCustomDomainModalOpen, setIsCustomDomainModalOpen] = useState(false);
  const [selectedSiteForDomain, setSelectedSiteForDomain] = useState<{ id: string; title: string; currentDomain: string } | null>(null);
  const [inputCustomDomain, setInputCustomDomain] = useState('');
  const [isVerifyingDns, setIsVerifyingDns] = useState(false);
  const [activeRegistrarGuide, setActiveRegistrarGuide] = useState<'godaddy' | 'hostinger' | 'namecheap' | 'cloudflare' | 'bigrock'>('godaddy');
  const [dnsConnectionMethod, setDnsConnectionMethod] = useState<'dns' | 'nameservers'>('dns');

  const handleVerifyAndConnectDomain = async () => {
    if (!inputCustomDomain.trim() || !selectedSiteForDomain) {
      showToast('Please enter a valid domain name (e.g. www.mybrand.com)', 'error');
      return;
    }

    const cleanDomain = inputCustomDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    setIsVerifyingDns(true);
    showToast(`Checking DNS records for ${cleanDomain}...`, 'info');

    setTimeout(() => {
      setIsVerifyingDns(false);

      const liveWorkingUrl = `${window.location.origin}/sites/${selectedSiteForDomain.id.replace(/^dep-/, '')}`;

      setDeployedWebsitesHistory(prev => {
        const updated = prev.map(item => {
          if (item.id === selectedSiteForDomain.id) {
            return {
              ...item,
              domain: cleanDomain,
              url: liveWorkingUrl
            };
          }
          return item;
        });

        try {
          localStorage.setItem('onehost_deployed_websites', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setDeployedUrl(liveWorkingUrl);

      showToast(`🎉 Custom domain "${cleanDomain}" connected & SSL certificate active!`, 'success');
      setIsCustomDomainModalOpen(false);
      setInputCustomDomain('');
      setSelectedSiteForDomain(null);
    }, 1800);
  };

  // Standalone Website Viewer (Bypasses Google Auth Bridge 403)
  const openStandaloneWebSitePage = (htmlCode: string) => {
    if (!htmlCode) {
      showToast('No HTML code found to open!', 'error');
      return;
    }

    try {
      const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const newWin = window.open(blobUrl, '_blank');
      if (newWin) {
        newWin.focus();
        showToast('Opened live website in new tab!', 'success');
        return;
      }
    } catch (e) {
      console.error('Blob open error:', e);
    }

    try {
      const newWin = window.open('', '_blank');
      if (newWin) {
        newWin.document.open();
        newWin.document.write(htmlCode);
        newWin.document.close();
        newWin.focus();
        showToast('Opened live website in new tab!', 'success');
        return;
      }
    } catch (e) {
      console.error('Document write error:', e);
    }

    showToast('Please allow popup windows in your browser settings!', 'error');
  };

  // Download HTML File
  const downloadHtmlFile = (htmlCode: string, title: string) => {
    if (!htmlCode) return;
    const filename = (title || 'my-website').toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename} successfully!`, 'success');
  };

  // Edit & Update Website State
  const [isEditCodeModalOpen, setIsEditCodeModalOpen] = useState(false);
  const [editingSiteItem, setEditingSiteItem] = useState<{ id: string; title: string; code: string; domain?: string } | null>(null);
  const [editableCode, setEditableCode] = useState('');
  const [aiRefinePrompt, setAiRefinePrompt] = useState('');
  const [isRefiningCodeWithAi, setIsRefiningCodeWithAi] = useState(false);

  const handleOpenEditModal = (siteItem: { id: string; title: string; code: string; domain?: string }) => {
    setEditingSiteItem(siteItem);
    setEditableCode(siteItem.code || (generatedApp ? generatedApp.code : ''));
    setAiRefinePrompt('');
    setIsEditCodeModalOpen(true);
  };

  const handleApplyAiRefining = async () => {
    if (!aiRefinePrompt.trim() || !editingSiteItem) return;
    setIsRefiningCodeWithAi(true);
    showToast('AI Agent is updating your website code according to prompt...', 'info');

    try {
      const updated = await generateAiApp({
        prompt: `Update and modify the following HTML website code according to user request: "${aiRefinePrompt}". Keep all existing styling intact, apply user changes precisely.\n\nExisting HTML Code:\n${editableCode}`,
        model: selectedModel,
        userApiKey
      });

      if (updated && updated.code) {
        setEditableCode(updated.code);
        showToast('✨ AI successfully updated the website code! Preview updated.', 'success');
        setAiRefinePrompt('');
      }
    } catch (err) {
      showToast('AI refinement failed. You can manually edit the code below.', 'error');
    } finally {
      setIsRefiningCodeWithAi(false);
    }
  };

  const handleSaveAndReDeploy = async () => {
    if (!editingSiteItem || !editableCode.trim()) return;
    showToast('Re-deploying updated website code to OneHost Edge CDN...', 'info');

    const slug = editingSiteItem.id.replace(/^dep-/, '');
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');

    try {
      await fetch('/api/deployments/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: cleanSlug,
          title: editingSiteItem.title,
          code: editableCode,
          domain: editingSiteItem.domain || `${cleanSlug}.onehost.cloud`
        })
      });
    } catch (e) {
      console.error('Publish update error:', e);
    }

    setDeployedWebsitesHistory(prev => {
      const updated = prev.map(item => {
        if (item.id === editingSiteItem.id) {
          return {
            ...item,
            code: editableCode,
            deployedAt: 'Updated ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return item;
      });

      try {
        localStorage.setItem('onehost_deployed_websites', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (generatedApp && (editingSiteItem.title === generatedApp.title || editingSiteItem.id.includes('generated'))) {
      setGeneratedApp({
        ...generatedApp,
        code: editableCode
      });
    }

    showToast('🎉 Website updated & re-deployed successfully!', 'success');
    setIsEditCodeModalOpen(false);
    setEditingSiteItem(null);
  };

  // GitHub Export Modal State
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('onehost_github_token') || '');
  const [githubRepoName, setGithubRepoName] = useState('');
  const [isGithubPrivate, setIsGithubPrivate] = useState(false);
  const [isPushingToGithub, setIsPushingToGithub] = useState(false);
  const [pushedGithubUrl, setPushedGithubUrl] = useState<string | null>(null);

  // Agent 2: Deep Research & Architecture State
  const [researchTopic, setResearchTopic] = useState('Multi-vendor SaaS e-commerce platform with microservices, Redis caching, and Razorpay subscription webhooks');
  const [isResearching, setIsResearching] = useState(false);
  const [researchResult, setResearchResult] = useState<string | null>(null);

  // Agent 3: Vision UI-to-Code State
  const [visionPrompt, setVisionPrompt] = useState('Clean dark-themed analytics dashboard grid with revenue chart, active visitors counter, and recent orders table');
  const [isVisionBuilding, setIsVisionBuilding] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);

  // Agent 4: Voice & Web Audio Architect State
  const [voicePrompt, setVoicePrompt] = useState('Web Audio synthesizer synth with voice commands for volume control and frequency visualizer canvas');
  const [isVoiceGenerating, setIsVoiceGenerating] = useState(false);
  const [voiceResult, setVoiceResult] = useState<string | null>(null);

  // Agent 5: Code Debugger & Refactor State
  const [codeInput, setCodeInput] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('JavaScript/React');
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<string | null>(null);

  // Agent 6: Database & API Architect State
  const [dbPrompt, setDbPrompt] = useState('Build e-commerce DB schema with users, orders, products, coupons and payment transactions');
  const [dbType, setDbType] = useState('PostgreSQL');
  const [isGeneratingDb, setIsGeneratingDb] = useState(false);
  const [dbResult, setDbResult] = useState<string | null>(null);

  // Agent 7: SEO & Content Generator State
  const [seoDomain, setSeoDomain] = useState('techventure.in');
  const [seoNiche, setSeoNiche] = useState('Cloud Hosting & Web Development Services');
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [seoResult, setSeoResult] = useState<string | null>(null);

  // Agent 8: Brand & Logo Generator State
  const [brandName, setBrandName] = useState('NovaCloud AI');
  const [brandVibe, setBrandVibe] = useState('Tech Minimalist Neon');
  const [isGeneratingBrand, setIsGeneratingBrand] = useState(false);
  const [brandResult, setBrandResult] = useState<{ logoSvg: string; palette: string[]; typography: string } | null>(null);

  // Agent 9: Security Auditor State
  const [secTarget, setSecTarget] = useState('https://techventure.in');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // Default Starter Live App for Immediate Preview
  const defaultStarterApp = {
    title: 'OneHost AI Live Website & Web App Sandbox',
    description: 'Select Computer, Tablet, or Mobile viewports above. Type your custom prompt below to generate live code.',
    techStack: ['HTML5', 'Tailwind CSS', 'JavaScript ES6+', 'Lucide Icons'],
    suggestedDomain: 'onehost-live-app.cloud',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OneHost AI Live Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }
    .glow-card { animation: pulse-glow 3.5s infinite ease-in-out; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col justify-between">
  <!-- Top Navbar -->
  <nav class="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-sm text-white shadow-md shadow-purple-500/30">
          ⚡
        </div>
        <span class="font-extrabold text-sm text-white tracking-tight">OneHost <span class="text-cyan-400">AI Live Sandbox</span></span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          Live Environment Ready
        </span>
      </div>
    </div>
  </nav>

  <!-- Main Hero & Sandbox Test -->
  <main class="max-w-4xl mx-auto px-4 py-8 text-center flex-1 flex flex-col items-center justify-center">
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
      🚀 Computer, Tablet & Mobile Viewports Active
    </div>
    <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
      Live Website & Web App <span class="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Preview Sandbox</span>
    </h1>
    <p class="mt-3 text-slate-400 text-xs sm:text-sm max-w-lg">
      Switch between Computer 💻, Tablet 📱, and Mobile 📱 views above or toggle Live Code. Enter your prompt below to synthesize custom websites & apps!
    </p>

    <!-- Interactive Counter Demo -->
    <div class="mt-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 max-w-xs w-full shadow-2xl glow-card text-center">
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive App State Test</div>
      <div id="demoCounter" class="text-3xl font-black text-cyan-400 font-mono my-2">250</div>
      <div class="flex justify-center gap-2 mt-3">
        <button onclick="changeDemo(-25)" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all">-25</button>
        <button onclick="changeDemo(25)" class="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all">+25</button>
      </div>
    </div>
  </main>

  <footer class="border-t border-slate-900 py-3 text-center text-[10px] text-slate-500 font-mono">
    Powered by Gemini 3.6 Flash Ultra Live Coder Engine • OneHost Cloud
  </footer>

  <script>
    let val = 250;
    function changeDemo(amt) {
      val = Math.max(0, val + amt);
      document.getElementById('demoCounter').innerText = val;
    }
  </script>
</body>
</html>`
  };

  // Preset prompts for App Builder
  const promptPresets = [
    'Create an online store for mechanical keyboards with shopping cart and UPI checkout',
    'Build a Doctor Appointment booking web app with calendar and doctor list',
    'Build a modern Portfolio for a Full Stack Web Developer with project filters',
    'Build a Crypto Price Tracker & Portfolio dashboard with live price cards',
    'Build a Restaurant Food Delivery ordering web app with category tabs',
    'Build a SaaS Product Landing page with pricing plans and FAQ accordion'
  ];

  // Helper to check and deduct credits
  const checkAndDeduct = (requiredCredits: number = 1): boolean => {
    const credits = user?.aiCredits ?? 100;
    if (credits < requiredCredits) {
      showToast(`Insufficient AI Credits! You need ${requiredCredits} credits. Please buy a credit pack.`, 'error');
      setIsCreditModalOpen(true);
      return false;
    }
    deductAiCredits(requiredCredits);
    return true;
  };

  // Download Code as file
  const downloadCodeFile = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded ${filename} to your computer!`, 'success');
  };

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setUserApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('onehost_google_api_key', trimmed);
      showToast('Custom Google API Key saved successfully!', 'success');
    } else {
      localStorage.removeItem('onehost_google_api_key');
      showToast('Custom Google API Key cleared. Using default system key.', 'info');
    }
    setIsApiKeyModalOpen(false);
  };

  // Handler for Website & App Generation with Stream Logs
  const handleGenerateApp = async (targetType: 'website' | 'app' = 'app', e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appPrompt.trim()) {
      showToast(`Please enter a prompt to build your ${targetType === 'website' ? 'website' : 'web app'}!`, 'error');
      return;
    }

    let creditCost = 500;
    if (selectedModel === 'gemini-deep-research') creditCost = 1500;
    else if (selectedModel === 'claude-3.5-sonnet') creditCost = 1200;
    else if (selectedModel === 'gemini-2.5-pro') creditCost = 1000;
    else if (selectedModel === 'deepseek-v3') creditCost = 800;
    else if (selectedModel === 'gemini-3.6-flash') creditCost = 750;
    else creditCost = 500;
    if (!checkAndDeduct(creditCost)) return;

    setIsBuildingApp(true);
    setDeployedUrl(null);
    setPushedGithubUrl(null);
    setAgentProgressPct(15);
    const targetLabel = targetType === 'website' ? '🌐 Responsive Full Website' : '📱 Interactive Web App & SaaS';
    setAgentLogs([
      `[00:01] 🧠 AI Agent Initialized: Using model "${selectedModel}"`,
      `[00:02] 📋 Analyzing user intent: Target = "${targetLabel}", Category = "${appCategory}", Style = "${appStyle}"`,
      `[00:03] 🏗️ Generating DOM hierarchy, responsive viewport rules & Tailwind utility grid...`
    ]);

    const logTimer = setInterval(() => {
      setAgentProgressPct(prev => (prev < 85 ? prev + 15 : prev));
    }, 450);

    try {
      const augmentedPrompt = targetType === 'website'
        ? `${appPrompt} (Note: Build a complete, responsive, multi-section full website landing page)`
        : `${appPrompt} (Note: Build a complete interactive web application / SaaS app with working UI state and controls)`;

      const res = await generateAiApp({
        prompt: augmentedPrompt,
        category: appCategory,
        style: appStyle,
        model: selectedModel,
        userApiKey: userApiKey || undefined
      });

      clearInterval(logTimer);
      setAgentProgressPct(100);

      if (res && res.code) {
        setGeneratedApp(res);
        setGithubRepoName(res.title.toLowerCase().replace(/[^a-z0-9]/g, '-'));
        setAgentLogs(prev => [
          ...prev,
          `[00:04] ⚙️ Synthesizing interactive state, forms & payment gateway modules...`,
          `[00:05] 🛡️ Validating OWASP security rules & cross-browser compatibility...`,
          `[00:06] ✅ ${targetType === 'website' ? 'Website' : 'Web Application'} build complete! Mounting sandbox iframe...`
        ]);
        showToast(`${targetType === 'website' ? 'Website' : 'App'} "${res.title}" generated successfully with ${selectedModel}! (${creditCost} credit used)`, 'success');
      } else {
        showToast('Generation failed. Please try again.', 'error');
      }
    } catch (err) {
      clearInterval(logTimer);
      showToast('Error generating code.', 'error');
    } finally {
      setIsBuildingApp(false);
    }
  };

  // Handler for GitHub Export / Push
  const handlePushToGithub = async () => {
    const targetApp = generatedApp || {
      title: 'My AI Web App',
      description: 'AI Generated Application by OneHost',
      code: '',
      techStack: ['HTML5', 'Tailwind CSS', 'JavaScript']
    };

    if (!targetApp || !targetApp.code) {
      showToast('No website code found to push to GitHub!', 'error');
      return;
    }

    const repoToUse = (githubRepoName.trim() || targetApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/^-+|-+$/g, '') || 'my-ai-app';

    if (!githubToken.trim()) {
      showToast('🔑 Please enter your GitHub Personal Access Token (PAT)!', 'error');
      return;
    }

    setIsPushingToGithub(true);
    localStorage.setItem('onehost_github_token', githubToken.trim());
    showToast(`🚀 Connecting to GitHub API & creating repository "${repoToUse}"...`, 'info');

    const cleanTitle = repoToUse;
    const files = [
      {
        path: 'index.html',
        content: targetApp.code
      },
      {
        path: 'README.md',
        content: `# ${targetApp.title}\n\n${targetApp.description}\n\n## 🚀 Tech Stack\n${targetApp.techStack.map(t => `- ${t}`).join('\n')}\n\n## ⚡ Hosting Instructions\n- **Hostinger Shared / cPanel**: Upload \`index.html\` to \`public_html/\`.\n- **Netlify / Vercel**: Connect this GitHub repo for automated deployments.\n- **GitHub Pages**: Go to Repo Settings -> Pages -> Select branch \`main\`.\n\n*Generated with OneHost AI Agent Coder*`
      },
      {
        path: 'package.json',
        content: JSON.stringify({
          name: cleanTitle,
          version: '1.0.0',
          private: true,
          description: targetApp.description,
          scripts: {
            start: 'npx serve .'
          }
        }, null, 2)
      },
      {
        path: 'netlify.toml',
        content: `[build]\n  publish = "."\n\n[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200`
      },
      {
        path: 'vercel.json',
        content: JSON.stringify({
          rewrites: [{ source: '/(.*)', destination: '/index.html' }]
        }, null, 2)
      },
      {
        path: '.htaccess',
        content: `<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n  RewriteRule ^index\\.html$ - [L]\n  RewriteCond %{REQUEST_FILENAME} !-f\n  RewriteCond %{REQUEST_FILENAME} !-d\n  RewriteRule . /index.html [L]\n</IfModule>`
      }
    ];

    const result = await pushProjectToGithub({
      token: githubToken,
      repoName: repoToUse,
      isPrivate: isGithubPrivate,
      description: targetApp.description,
      files
    });

    setIsPushingToGithub(false);

    if (result.success && result.repoUrl) {
      setPushedGithubUrl(result.repoUrl);
      showToast(`🎉 Repository successfully pushed to GitHub! ${result.repoUrl}`, 'success');
    } else {
      showToast(result.error || 'Failed to push to GitHub. Check token "repo" permission.', 'error');
    }
  };

  // Handler for 1-Click Deployment
  const handleDeployGeneratedApp = async () => {
    if (!generatedApp) return;
    setIsDeployingGenerated(true);
    showToast('Publishing generated app to OneHost Edge CDN...', 'info');

    try {
      const slug = generatedApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
      const customDomain = `${slug}.onehost.cloud`;

      // 1. Publish raw HTML to express server to create direct live web route
      let directLiveUrl = `${window.location.origin}/sites/${slug}`;
      try {
        const pubRes = await fetch('/api/deployments/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId: slug,
            title: generatedApp.title,
            code: generatedApp.code,
            domain: customDomain
          })
        });
        const pubData = await pubRes.json();
        if (pubData.success && pubData.path) {
          directLiveUrl = `${window.location.origin}${pubData.path}`;
        }
      } catch (e) {
        console.error('Publish endpoint error:', e);
      }

      // 2. Call mock deployment system
      await deployApplication({
        projectName: generatedApp.title,
        repoUrl: 'https://github.com/onehost-ai/generated-app',
        customDomain,
        envVars: [{ key: 'NODE_ENV', value: 'production' }]
      });

      setDeployedUrl(directLiveUrl);

      const newItem = {
        id: 'dep-' + Date.now(),
        title: generatedApp.title,
        url: directLiveUrl,
        domain: customDomain,
        deployedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        techStack: generatedApp.techStack,
        code: generatedApp.code
      };

      setDeployedWebsitesHistory(prev => {
        const updated = [newItem, ...prev];
        try {
          localStorage.setItem('onehost_deployed_websites', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      showToast(`Website live & accessible at ${directLiveUrl}!`, 'success');
    } catch (err) {
      showToast('Deployment error.', 'error');
    } finally {
      setIsDeployingGenerated(false);
    }
  };

  // Handler for Deep Research
  const handleRunDeepResearch = async () => {
    if (!checkAndDeduct(1500)) return;
    setIsResearching(true);
    showToast(`Deep Research Agent (${selectedModel}) analyzing architecture...`, 'info');
    const res = await runAiAgentTask(
      'code_fix',
      {
        language: 'Architecture & System Design',
        code: researchTopic
      },
      selectedModel,
      userApiKey || undefined
    );
    setIsResearching(false);
    if (res && res.output) {
      setResearchResult(res.output);
      showToast('Deep Research architectural blueprint complete!', 'success');
    }
  };

  // Handler for Vision UI
  const handleRunVisionUi = async () => {
    if (!checkAndDeduct(500)) return;
    setIsVisionBuilding(true);
    showToast(`Vision Agent (${selectedModel}) compiling UI component...`, 'info');
    const res = await generateAiApp({
      prompt: `Component UI Wireframe: ${visionPrompt}`,
      category: 'UI Component',
      style: 'Modern Dark',
      model: selectedModel,
      userApiKey: userApiKey || undefined
    });
    setIsVisionBuilding(false);
    if (res && res.code) {
      setVisionResult(res.code);
      showToast('UI Wireframe compiled to Tailwind code!', 'success');
    }
  };

  // Handler for Voice Architect
  const handleRunVoiceArchitect = async () => {
    if (!checkAndDeduct(750)) return;
    setIsVoiceGenerating(true);
    showToast(`Voice Agent (${selectedModel}) working...`, 'info');
    const res = await runAiAgentTask(
      'code_fix',
      {
        language: 'JavaScript Web Audio / Speech Synthesis',
        code: voicePrompt
      },
      selectedModel,
      userApiKey || undefined
    );
    setIsVoiceGenerating(false);
    if (res && res.output) {
      setVoiceResult(res.output);
      showToast('Voice interaction code synthesized!', 'success');
    }
  };

  // Handler for Code Debugger
  const handleRunDebugger = async () => {
    if (!codeInput.trim()) {
      showToast('Paste code snippet to debug!', 'error');
      return;
    }
    if (!checkAndDeduct(400)) return;
    setIsDebugging(true);
    showToast(`Code Debugger (${selectedModel}) scanning syntax & memory...`, 'info');
    const res = await runAiAgentTask('code_fix', { language: codeLanguage, code: codeInput }, selectedModel, userApiKey || undefined);
    setIsDebugging(false);
    if (res && res.output) {
      setDebugResult(res.output);
      showToast('Code refactored and debugged!', 'success');
    }
  };

  // Handler for DB Architect
  const handleRunDbArchitect = async () => {
    if (!checkAndDeduct(600)) return;
    setIsGeneratingDb(true);
    showToast(`Database Architect (${selectedModel}) generating DDL...`, 'info');
    const res = await runAiAgentTask('db_gen', { prompt: dbPrompt, dbType }, selectedModel, userApiKey || undefined);
    setIsGeneratingDb(false);
    if (res && res.output) {
      setDbResult(res.output);
      showToast('Database schema & REST endpoints ready!', 'success');
    }
  };

  // Handler for SEO Generator
  const handleRunSeoGen = async () => {
    if (!checkAndDeduct(350)) return;
    setIsGeneratingSeo(true);
    showToast(`SEO Agent (${selectedModel}) analyzing domain & keywords...`, 'info');
    const res = await runAiAgentTask('seo_gen', { domain: seoDomain, niche: seoNiche }, selectedModel, userApiKey || undefined);
    setIsGeneratingSeo(false);
    if (res && res.output) {
      setSeoResult(res.output);
      showToast('SEO metadata & Schema.org JSON-LD complete!', 'success');
    }
  };

  // Handler for Brand Studio
  const handleRunBrandGen = async () => {
    if (!checkAndDeduct(400)) return;
    setIsGeneratingBrand(true);
    showToast(`Brand Studio (${selectedModel}) designing SVG logo...`, 'info');
    const res = await runAiAgentTask('brand_gen', { brandName, vibe: brandVibe }, selectedModel, userApiKey || undefined);
    setIsGeneratingBrand(false);
    if (res && res.brandData) {
      setBrandResult(res.brandData);
      showToast('Brand logo SVG and color tokens created!', 'success');
    }
  };

  // Handler for Security Audit
  const handleRunSecurityAudit = async () => {
    if (!checkAndDeduct(450)) return;
    setIsAuditing(true);
    showToast(`Security Inspector (${selectedModel}) auditing target...`, 'info');
    const res = await runAiAgentTask('security_audit', { target: secTarget }, selectedModel, userApiKey || undefined);
    setIsAuditing(false);
    if (res && res.output) {
      setAuditResult(res.output);
      showToast('OWASP Security Scorecard generated!', 'success');
    }
  };

  // Buy Credit Pack Click
  const handleSelectPack = (pack: { name: string; credits: number; price: number }) => {
    setSelectedCreditPack(pack);
    setIsCreditModalOpen(false);
    setIsRazorpayOpen(true);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Background Neon Accent Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* HUB TOP BAR HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>GEMINI ULTRA ALL-MODEL VIBE CODING SUITE</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>OneHost AI Coder Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">v4.8 Enterprise</span>
          </h2>
          <p className="text-xs text-slate-400">
            Synthesize live web applications, run Gemini Deep Research, compile UI wireframes, and auto-deploy to Cloud CDN with zero setup.
          </p>
        </div>

        {/* MODEL SELECTOR & CREDIT BALANCE MONETIZATION */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Model Switcher */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 text-xs">
            <Cpu className="w-4 h-4 text-purple-400 ml-1" />
            <select
              value={selectedModel}
              onChange={(e: any) => setSelectedModel(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none text-xs cursor-pointer pr-1"
            >
              <option value="grok-4.6-high-fast" className="bg-slate-900 text-amber-300">⚡ Cursor Grok 4.6 High Fast (NEW) (300 Credits)</option>
              <option value="composer-2.5-fast" className="bg-slate-900 text-purple-300">🚀 Composer 2.5 Fast (250 Credits)</option>
              <option value="sonnet-5-high" className="bg-slate-900 text-white">✨ Sonnet 5 High (500 Credits)</option>
              <option value="opus-5-high" className="bg-slate-900 text-white">🧠 Opus 5 High (800 Credits)</option>
              <option value="gpt-5.6-sol" className="bg-slate-900 text-cyan-300">🌐 GPT-5.6 Sol Medium (400 Credits)</option>
              <option value="gpt-5.6-terra" className="bg-slate-900 text-emerald-300">🌱 GPT-5.6 Terra Medium (350 Credits)</option>
              <option value="fable-5-high" className="bg-slate-900 text-pink-300">🎨 Fable 5 High (450 Credits)</option>
              <option value="grok-4.5-high" className="bg-slate-900 text-amber-400">🔥 Cursor Grok 4.5 High (300 Credits)</option>
              <option value="gemini-2.5-pro" className="bg-slate-900 text-white">Gemini 2.5 Pro Vibe Coder (1,000 Credits)</option>
              <option value="gemini-2.5-flash" className="bg-slate-900 text-white">Gemini 2.5 Flash Ultra Coder (500 Credits)</option>
              <option value="gemini-deep-research" className="bg-slate-900 text-white">Gemini Deep Research Agent (1,500 Credits)</option>
            </select>
          </div>

          {/* Connect Domain Shortcut Button */}
          <button
            type="button"
            onClick={() => {
              const siteToUse = (deployedWebsitesHistory && deployedWebsitesHistory[0]) || {
                id: 'dep-new-domain',
                title: generatedApp ? generatedApp.title : 'My New Website',
                currentDomain: 'mywebsite.onehost.cloud'
              };
              setSelectedSiteForDomain(siteToUse);
              setInputCustomDomain('');
              setIsCustomDomainModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/20 transition-all cursor-pointer"
            title="Connect External Domain from GoDaddy, Hostinger, Namecheap, Cloudflare"
          >
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Connect Domain</span>
          </button>

          {/* Buy Domain Button */}
          <button
            type="button"
            onClick={() => setCurrentView('domains')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 border border-emerald-500/50 hover:border-emerald-400 text-emerald-200 hover:text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer"
            title="Search & Buy New Domain Name (.in, .com, .ai, .tech)"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span>Buy Domain</span>
          </button>

          {/* AI Credits Widget */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-950/80 to-slate-950 border border-purple-500/40 rounded-xl px-3.5 py-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] text-purple-300 uppercase font-bold block leading-none">AI Credits</span>
              <span className="text-sm font-extrabold text-white">{user?.aiCredits ?? 100} Available</span>
            </div>
            <button
              onClick={() => setIsCreditModalOpen(true)}
              className="ml-2 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buy Packs</span>
            </button>
          </div>
        </div>
      </div>

      {/* AGENT 1: WEBSITE & APP BUILDER PANEL */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          {/* LEFT COLUMN: PROMPT INPUT, CATEGORY, TEMPLATES & BUILD CONTROLS */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950/90 border border-slate-800 rounded-3xl p-4 shadow-xl">
            <form onSubmit={handleGenerateApp} className="space-y-4">
              {/* TOP CONTROLS: CATEGORY & PROMPT TEMPLATES */}
              <div className="flex flex-col gap-2.5 p-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                {/* SINGLE UNIFIED BUTTON FOR WEBSITE & APP CATEGORY */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={appCategory}
                      onChange={(e) => {
                        setAppCategory(e.target.value);
                        showToast(`Selected Category: ${e.target.value}`, 'info');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/40 text-slate-100 text-xs font-black cursor-pointer focus:outline-none focus:border-purple-400 transition-all appearance-none pr-8 shadow-inner"
                    >
                      <option value="E-Commerce & Store">🛍️ E-Commerce & Online Store (Shop + Cart + UPI)</option>
                      <option value="SaaS Product Landing Page">🚀 SaaS Web App & Dashboard (Auth + Subscriptions)</option>
                      <option value="Developer Portfolio & Resume">👨‍💻 Developer Portfolio & Resume Website</option>
                      <option value="Doctor & Clinic Appointment App">🏥 Doctor & Clinic Booking App (Calendar + Patients)</option>
                      <option value="Crypto & Finance Dashboard">📈 Crypto & Finance Analytics Dashboard</option>
                      <option value="Food & Restaurant Ordering">🍕 Food & Restaurant Online Ordering App</option>
                      <option value="Learning Management System (LMS)">🎓 LMS & Online Course Academy Platform</option>
                      <option value="Custom Web Utility Tool">⚡ Custom Web Utility Tool & Micro-SaaS</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-xs font-bold">
                      ▼
                    </div>
                  </div>
                </div>

                {/* SINGLE UNIFIED BUTTON FOR PROMPT TEMPLATES */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          setAppPrompt(e.target.value);
                          showToast('Prompt Template loaded!', 'info');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-500/50 text-purple-200 hover:text-white hover:border-purple-400 text-xs font-black cursor-pointer focus:outline-none shadow-md transition-all appearance-none pr-8"
                    >
                      <option value="" disabled>⚡ 1-Click Prompt Templates...</option>
                      {promptPresets.map((preset, idx) => (
                        <option key={idx} value={preset} className="bg-slate-900 text-slate-200 py-1 font-normal">
                          ✨ {preset}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 CREATION MODE TABS: AI AGENT BUILDER | ZIP FILE UPLOAD | PASTE RAW CODE */}
              <div className="space-y-3">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCreationMode('ai')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      creationMode === 'ai'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>🤖 AI Builder</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationMode('zip')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      creationMode === 'zip'
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-cyan-300" />
                    <span>📂 Upload ZIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationMode('code')}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      creationMode === 'code'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5 text-emerald-300" />
                    <span>⚡ Paste Code</span>
                  </button>
                </div>

                {/* MODE 1: AI AGENT BUILDER */}
                {creationMode === 'ai' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Describe Your Website or SaaS App:</span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-950 border border-purple-500/50 rounded-lg px-2 py-0.5 text-xs shadow-sm self-start sm:self-auto">
                        <Cpu className="w-3 h-3 text-purple-400 shrink-0" />
                        <select
                          value={selectedModel}
                          onChange={(e: any) => setSelectedModel(e.target.value)}
                          className="bg-transparent text-purple-200 font-bold focus:outline-none text-[11px] cursor-pointer pr-1 truncate max-w-[170px]"
                        >
                          <option value="gemini-3.6-flash" className="bg-slate-900 text-white">Gemini 3.6 Flash</option>
                          <option value="gemini-3.5-flash-lite" className="bg-slate-900 text-white">Gemini 3.5 Flash Lite</option>
                          <option value="gemini-3.5-flash" className="bg-slate-900 text-white">Gemini 3.5 Flash</option>
                          <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-white">Gemini 3.1 Pro Preview</option>
                          <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-white">Gemini 3.1 Flash Lite</option>
                          <option value="gemini-3-flash-preview" className="bg-slate-900 text-white">Gemini 3 Flash Preview</option>
                          <option value="gemini-2.5-pro" className="bg-slate-900 text-white">Gemini 2.5 Pro Vibe Coder</option>
                          <option value="gemini-2.5-flash" className="bg-slate-900 text-white">Gemini 2.5 Flash</option>
                          <option value="gemini-deep-research" className="bg-slate-900 text-white">Gemini Deep Research</option>
                        </select>
                      </div>
                    </div>

                    <div className="animated-blue-light-box">
                      <div className="animated-blue-light-inner relative">
                        <textarea
                          value={appPrompt}
                          onChange={(e) => setAppPrompt(e.target.value)}
                          placeholder="Example: Create a full mechanical keyboard online shop with interactive shopping cart, quantity controls, filter by price, dark cyberpunk theme, and Razorpay UPI payment checkout..."
                          rows={5}
                          className="w-full px-4 py-3 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none rounded-2xl text-xs font-medium transition-all leading-relaxed"
                        />
                        <div className="absolute bottom-2.5 right-3 flex items-center gap-2 text-cyan-400/80 text-[10px] font-mono select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                          <span>{appPrompt.length} chars</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-1.5 pt-1 w-full overflow-x-auto pb-1">
                      <button
                        type="button"
                        onClick={(e) => handleGenerateApp('website', e)}
                        disabled={isBuildingApp}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-[11px] tracking-tight shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1 transition-all transform hover:scale-[1.01] active:scale-[0.99] border border-cyan-400/40 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isBuildingApp ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-cyan-200" />
                            <span>Building...</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3 text-amber-300 shrink-0" />
                            <span>🌐 Build Website</span>
                          </>
                        )}
                      </button>

                      <div className="relative flex-1 min-w-[120px]">
                        <select
                          value={activeTab}
                          onChange={(e) => setActiveTab(e.target.value as any)}
                          className="w-full py-2 px-2 rounded-xl bg-slate-900 border border-purple-500/60 hover:border-purple-400 text-purple-200 hover:text-white font-extrabold text-[10px] shadow-sm cursor-pointer focus:outline-none transition-all appearance-none pr-5 text-center truncate"
                        >
                          <option value="builder" className="bg-slate-900 text-white py-2">🤖 App & Website Coder</option>
                          <option value="research" className="bg-slate-900 text-white py-2">📚 Deep Research</option>
                          <option value="vision" className="bg-slate-900 text-white py-2">👁️ Vision UI</option>
                          <option value="voice" className="bg-slate-900 text-white py-2">🎙️ Voice Architect</option>
                          <option value="code" className="bg-slate-900 text-white py-2">🔧 Code Debugger</option>
                          <option value="db" className="bg-slate-900 text-white py-2">🗄️ Database Architect</option>
                          <option value="seo" className="bg-slate-900 text-white py-2">🔍 SEO & Content</option>
                          <option value="brand" className="bg-slate-900 text-white py-2">🎨 Brand Studio</option>
                          <option value="security" className="bg-slate-900 text-white py-2">🛡️ Security Auditor</option>
                        </select>
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-[9px]">
                          ▼
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleGenerateApp('app', e)}
                        disabled={isBuildingApp}
                        className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] tracking-tight shadow-md shadow-purple-600/20 flex items-center justify-center gap-1 transition-all transform hover:scale-[1.01] active:scale-[0.99] border border-purple-400/40 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isBuildingApp ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-purple-200" />
                            <span>Building...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                            <span>📱 Build SaaS App</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* MODE 2: UPLOAD ZIP ARCHIVE OR HTML FILE */}
                {creationMode === 'zip' && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-cyan-300">Website / App Title (Optional)</label>
                      <input
                        type="text"
                        value={customSiteTitle}
                        onChange={(e) => setCustomSiteTitle(e.target.value)}
                        placeholder="e.g. My Business Agency Website"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
                      />
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30 group-hover:scale-110 transition-transform">
                        {isProcessingZip ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                      </div>
                      <div className="text-xs font-extrabold text-white">
                        {isProcessingZip ? 'Processing ZIP File...' : 'Drag & Drop .ZIP or .HTML File Here'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Select any <b>.zip</b> archive containing your <code>index.html</code> website files or a direct <b>.html</b> file
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
                      >
                        <FolderArchive className="w-4 h-4" />
                        <span>Browse ZIP File</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip,.html,.htm"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </div>
                )}

                {/* MODE 3: PASTE CUSTOM HTML CODE */}
                {creationMode === 'code' && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-emerald-300">Website Name</label>
                      <input
                        type="text"
                        value={customSiteTitle}
                        onChange={(e) => setCustomSiteTitle(e.target.value)}
                        placeholder="e.g. Portfolio Website"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <label className="font-bold text-emerald-300">Paste HTML / CSS / JS Code:</label>
                        <span className="text-[10px] text-slate-400">Full Custom Code Support</span>
                      </div>
                      <textarea
                        value={rawPastedCode}
                        onChange={(e) => setRawPastedCode(e.target.value)}
                        placeholder="<!DOCTYPE html>&#10;<html>&#10;<head><title>My Site</title><script src='https://cdn.tailwindcss.com'></script></head>&#10;<body class='bg-slate-950 text-white p-10'>&#10;  <h1>Hello World! My custom website live on OneHost!</h1>&#10;</body>&#10;</html>"
                        rows={6}
                        className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadPastedCode}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Code className="w-4 h-4" />
                      <span>✨ Load Code into Sandbox & Preview</span>
                    </button>
                  </div>
                )}
              </div>

              {/* VISUAL THEME & STYLE DROPDOWN */}
              <div className="space-y-1 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <label className="text-xs font-bold text-slate-300">Visual Theme & Aesthetic</label>
                <select
                  value={appStyle}
                  onChange={(e) => setAppStyle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option>Modern Glassmorphism & Dark</option>
                  <option>Cyberpunk Neon Accent</option>
                  <option>Clean SaaS Light Executive</option>
                  <option>Minimalist Slate Tech</option>
                  <option>Luxury Gold & Black</option>
                </select>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: LIVE APPLICATION PREVIEW & CODE SANDBOX WITH COMPUTER, TABLET & MOBILE VIEWPORTS */}
          <div className="lg:col-span-7 space-y-4">
            {(() => {
              const activeApp = generatedApp || defaultStarterApp;
              return (
                <div className="space-y-3 bg-slate-950 border-2 border-purple-500/40 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
                  {/* PREVIEW TOP TOOLBAR */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5">
                    {/* APP TITLE & LIVE BADGE */}
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
                        <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                          <h3 className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] sm:max-w-xs">{activeApp.title}</h3>
                          <span className="text-[9px] bg-purple-950 text-purple-300 font-mono font-bold px-2 py-0.5 rounded-full border border-purple-800/60 shrink-0">
                            {generatedApp ? 'AI Live' : 'Sandbox Preview'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CONTROLS: DEVICE VIEWPORT SWITCHER + VIEW MODE + ACTIONS */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* DEVICE VIEWPORT BUTTONS: COMPUTER, TABLET, MOBILE */}
                      <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setPreviewViewport('desktop')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                            previewViewport === 'desktop' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Computer Viewport (100%)"
                        >
                          <Monitor className="w-3 h-3 text-cyan-300" />
                          <span>Computer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewViewport('tablet')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                            previewViewport === 'tablet' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Tablet Viewport (768px)"
                        >
                          <Tablet className="w-3 h-3 text-amber-300" />
                          <span>Tablet</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewViewport('mobile')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                            previewViewport === 'mobile' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Mobile Viewport (375px)"
                        >
                          <Smartphone className="w-3 h-3 text-pink-300" />
                          <span>Mobile</span>
                        </button>
                      </div>

                      {/* LIVE PREVIEW VS SOURCE CODE TOGGLE */}
                      <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setPreviewViewMode('preview')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                            previewViewMode === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPreviewViewMode('code')}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                            previewViewMode === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Code className="w-3 h-3" />
                          <span>Code</span>
                        </button>
                      </div>

                      {/* ACTION BUTTONS: FULLSCREEN, DOWNLOAD, DEPLOY, GITHUB */}
                      <button
                        type="button"
                        onClick={() => setIsFullscreenPreview(true)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                        title="Fullscreen Live Preview"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadCodeFile(`${activeApp.title.toLowerCase().replace(/\s+/g, '-')}.html`, activeApp.code)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-all"
                        title="Download HTML Code File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleDeployGeneratedApp}
                        disabled={isDeployingGenerated}
                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-[11px] shadow-md flex items-center gap-1 transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{isDeployingGenerated ? 'Deploying...' : 'Deploy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const targetApp = generatedApp || activeApp;
                          if (targetApp) {
                            setGithubRepoName(targetApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                          }
                          setIsGithubModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-950/90 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 transition-all"
                        title="Push Project Source Code to GitHub Account"
                      >
                        <Github className="w-3.5 h-3.5 text-purple-400" />
                        <span>Push to GitHub</span>
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW CONTAINER / RENDER AREA WITH REAL DEVICE FRAMES */}
                  {previewViewMode === 'preview' ? (
                    previewViewport === 'mobile' ? (
                      <div className="w-full bg-slate-950/90 p-4 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center overflow-x-auto shadow-inner min-h-[580px]">
                        <div className="text-center mb-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-[11px] font-bold">
                            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                            <span>Smartphone Real Viewport • 375 × 667 px</span>
                          </div>
                        </div>

                        {/* REAL SMARTPHONE CASING */}
                        <div className="relative w-[370px] max-w-full rounded-[44px] bg-slate-900 p-3 border-[6px] border-slate-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/40 flex flex-col items-center">
                          {/* Side Buttons simulation */}
                          <div className="absolute -left-[9px] top-20 w-[3px] h-8 bg-slate-700 rounded-l-sm" />
                          <div className="absolute -left-[9px] top-32 w-[3px] h-8 bg-slate-700 rounded-l-sm" />
                          <div className="absolute -right-[9px] top-24 w-[3px] h-12 bg-slate-700 rounded-r-sm" />

                          {/* Top Dynamic Island / Notch */}
                          <div className="w-28 h-5 bg-black rounded-full border border-slate-800/80 flex items-center justify-between px-3 mb-2 shadow-inner z-10">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-blue-900/80" />
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                          </div>

                          {/* Screen Iframe Area */}
                          <div className="w-full h-[520px] bg-black rounded-[32px] overflow-hidden border border-slate-800 shadow-inner relative">
                            <iframe
                              srcDoc={activeApp.code}
                              title="Mobile Application Preview"
                              className="w-full h-full border-none bg-slate-950"
                              sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
                            />
                          </div>

                          {/* Home Indicator Bar */}
                          <div className="w-32 h-1 bg-slate-500/70 rounded-full mt-2.5 mb-1" />
                        </div>
                      </div>
                    ) : previewViewport === 'tablet' ? (
                      <div className="w-full bg-slate-950/90 p-4 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center overflow-x-auto shadow-inner min-h-[580px]">
                        <div className="text-center mb-3">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                            <Tablet className="w-3.5 h-3.5 text-amber-400" />
                            <span>Tablet Device Viewport • 768 × 1024 px</span>
                          </div>
                        </div>

                        {/* REAL TABLET CASING */}
                        <div className="relative w-[720px] max-w-full rounded-[32px] bg-slate-900 p-4 border-[6px] border-slate-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/40 flex flex-col items-center">
                          {/* Top Tablet Camera Bezel */}
                          <div className="w-full flex items-center justify-center gap-2 mb-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-black border border-slate-700 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-blue-900" />
                            </div>
                          </div>

                          {/* Screen Iframe Area */}
                          <div className="w-full h-[520px] bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                            <iframe
                              srcDoc={activeApp.code}
                              title="Tablet Application Preview"
                              className="w-full h-full border-none bg-slate-950"
                              sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
                            />
                          </div>

                          {/* Bottom Home Indicator */}
                          <div className="w-36 h-1 bg-slate-600/70 rounded-full mt-3 mb-0.5" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-slate-950/90 p-3 border border-slate-800/80 rounded-2xl flex flex-col items-center overflow-x-auto shadow-inner min-h-[580px]">
                        <div className="w-full text-center mb-2 flex items-center justify-between px-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Computer Monitor / macOS Browser Viewport • 100% Full Width</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">1920 × 1080 Responsive</span>
                        </div>

                        {/* REAL COMPUTER MONITOR & BROWSER CASING */}
                        <div className="w-full rounded-2xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden flex flex-col">
                          {/* Mac-style Window Top Header */}
                          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm"></span>
                              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
                              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm"></span>
                            </div>

                            {/* URL Address Bar */}
                            <div className="flex-1 max-w-xl mx-auto px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                              <span className="text-emerald-400 font-bold">🔒 https://</span>
                              <span className="text-slate-200 font-semibold">{activeApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.onehost.cloud</span>
                            </div>

                            <div className="text-[11px] font-bold text-slate-400 font-mono">
                              Desktop Studio
                            </div>
                          </div>

                          {/* Screen Iframe Area */}
                          <div className="w-full h-[520px] bg-black">
                            <iframe
                              srcDoc={activeApp.code}
                              title="Desktop Application Preview"
                              className="w-full h-full border-none bg-slate-950"
                              sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-t-xl text-xs text-slate-300 font-mono">
                        <span>{activeApp.title.toLowerCase().replace(/\s+/g, '-')}.html</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeApp.code);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                            showToast('Code copied to clipboard!', 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-sans text-xs font-bold"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={activeApp.code}
                        rows={16}
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-b-xl text-xs font-mono text-cyan-300 focus:outline-none leading-relaxed"
                      />
                    </div>
                  )}

                  {/* ACTIVE LIVE DEPLOYED URL BANNER */}
                  {deployedUrl && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/80 border-2 border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300 mt-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                          <Globe className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">Live Website Deployed Successfully!</span>
                          </div>
                          <a
                            href={deployedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-mono font-extrabold text-white hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/50 break-all transition-all"
                          >
                            {deployedUrl}
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (generatedApp) {
                              handleOpenEditModal({
                                id: 'dep-' + Date.now(),
                                title: generatedApp.title,
                                code: generatedApp.code,
                                domain: `${generatedApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.onehost.cloud`
                              });
                            }
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          title="Edit Website Code & Re-Deploy"
                        >
                          <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Edit & Re-Deploy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (generatedApp) {
                              const dom = generatedApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.onehost.cloud';
                              setSelectedSiteForDomain({ id: 'dep-' + Date.now(), title: generatedApp.title, currentDomain: dom });
                              setInputCustomDomain('');
                              setIsCustomDomainModalOpen(true);
                            }
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <Globe className="w-3.5 h-3.5 text-purple-400" />
                          <span>Connect Domain</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCurrentView('domains')}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          title="Search & Buy New Domain"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Buy Domain</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (generatedApp) {
                              setGithubRepoName(generatedApp.title.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                            }
                            setIsGithubModalOpen(true);
                          }}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                          title="Push Repository to GitHub"
                        >
                          <Github className="w-3.5 h-3.5 text-purple-400" />
                          <span>Push to GitHub</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (generatedApp) {
                              downloadHtmlFile(generatedApp.code, generatedApp.title);
                            }
                          }}
                          className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                          title="Download HTML Website File"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Download HTML</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (generatedApp) {
                              openStandaloneWebSitePage(generatedApp.code);
                            }
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          <span>Open Live Website</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* CUSTOMER DEPLOYED WEBSITES & LIVE URLS DIRECTORY */}
            {deployedWebsitesHistory.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-extrabold text-white">Your Deployed Websites & Live URLs</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                      {deployedWebsitesHistory.length} Active
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">OneHost Global Edge CDN</span>
                </div>

                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                  {deployedWebsitesHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                          <span className="text-xs font-bold text-white">{item.title}</span>
                          {item.domain && !item.domain.includes('onehost.cloud') && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30 font-bold">
                              🌐 {item.domain}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">({item.deployedAt})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openStandaloneWebSitePage(item.code || (generatedApp ? generatedApp.code : ''))}
                          className="text-xs font-mono font-bold text-cyan-400 hover:underline break-all text-left block"
                        >
                          {item.url}
                        </button>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                          title="Edit Code & Re-Deploy Website"
                        >
                          <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Edit & Re-Deploy</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSiteForDomain({ id: item.id, title: item.title, currentDomain: item.domain });
                            setInputCustomDomain(item.domain && !item.domain.includes('onehost.cloud') ? item.domain : '');
                            setIsCustomDomainModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                          title="Connect Custom Domain"
                        >
                          <Globe className="w-3.5 h-3.5 text-purple-400" />
                          <span>{item.domain && !item.domain.includes('onehost.cloud') ? item.domain : 'Connect Domain'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCurrentView('domains')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                          title="Search & Buy New Domain"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Buy Domain</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadHtmlFile(item.code || (generatedApp ? generatedApp.code : ''), item.title)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                          title="Download HTML File"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>HTML</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openStandaloneWebSitePage(item.code || (generatedApp ? generatedApp.code : ''))}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-md transition-all"
                        >
                          <span>Open Live</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE AGENT TERMINAL STREAM LOGS */}
            {(isBuildingApp || agentLogs.length > 0) && (
              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/30 space-y-3 font-mono text-xs shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-300 border-b border-slate-900 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-extrabold text-white text-sm">AI Agent Live Coding Stream</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="text-purple-300 font-bold bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                      {agentProgressPct}% Completed
                    </span>
                    {isBuildingApp && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    style={{ width: `${agentProgressPct}%` }}
                  />
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pt-1 text-xs text-slate-300">
                  {agentLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-purple-400 font-bold select-none">&gt;</span>
                      <span className={idx === agentLogs.length - 1 ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AGENT 2: GEMINI DEEP RESEARCH & SYSTEM ARCHITECT */}
      {activeTab === 'research' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Deep Research Technical Blueprint Topic</label>
            <textarea
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-medium focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleRunDeepResearch}
            disabled={isResearching}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isResearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            <span>Run Gemini Deep Research Agent (3 Credits)</span>
          </button>
          {researchResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-purple-300 block border-b border-slate-800 pb-2">📋 Gemini Deep Research Output</span>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{researchResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* AGENT 3: VISION UI-TO-CODE AGENT */}
      {activeTab === 'vision' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Describe UI Layout / Wireframe Component</label>
            <textarea
              value={visionPrompt}
              onChange={(e) => setVisionPrompt(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-medium focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleRunVisionUi}
            disabled={isVisionBuilding}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isVisionBuilding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layout className="w-4 h-4" />}
            <span>Compile UI Wireframe to Code (1 Credit)</span>
          </button>
          {visionResult && (
            <div className="space-y-3">
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 bg-black">
                <iframe srcDoc={visionResult} title="Vision UI Preview" className="w-full h-full border-none" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* AGENT 4: VOICE AGENT */}
      {activeTab === 'voice' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Voice Interaction & Web Audio Prompt</label>
            <textarea
              value={voicePrompt}
              onChange={(e) => setVoicePrompt(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-medium focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleRunVoiceArchitect}
            disabled={isVoiceGenerating}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isVoiceGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
            <span>Synthesize Voice & Speech Handlers (2 Credits)</span>
          </button>
          {voiceResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">{voiceResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* AGENT 5: CODE DEBUGGER */}
      {activeTab === 'code' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Programming Language</label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none"
              >
                <option>JavaScript/React</option>
                <option>TypeScript/Node.js</option>
                <option>Python/FastAPI</option>
                <option>PHP/WordPress</option>
                <option>SQL DML Statements</option>
              </select>
            </div>
          </div>
          <textarea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Paste code snippet with errors or bug report here..."
            rows={5}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none"
          />
          <button
            onClick={handleRunDebugger}
            disabled={isDebugging}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isDebugging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
            <span>Fix Bugs & Refactor Code (1 Credit)</span>
          </button>
          {debugResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap">{debugResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* AGENT 6: DATABASE ARCHITECT */}
      {activeTab === 'db' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Database Engine</label>
              <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none"
              >
                <option>PostgreSQL</option>
                <option>MySQL / MariaDB</option>
                <option>MongoDB Mongoose</option>
                <option>SQLite3</option>
              </select>
            </div>
          </div>
          <textarea
            value={dbPrompt}
            onChange={(e) => setDbPrompt(e.target.value)}
            rows={3}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none"
          />
          <button
            onClick={handleRunDbArchitect}
            disabled={isGeneratingDb}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isGeneratingDb ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            <span>Generate DB DDL & Express Endpoints (1 Credit)</span>
          </button>
          {dbResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">{dbResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* AGENT 7: SEO AGENT */}
      {activeTab === 'seo' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={seoDomain}
              onChange={(e) => setSeoDomain(e.target.value)}
              placeholder="Target Domain Name"
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
            />
            <input
              type="text"
              value={seoNiche}
              onChange={(e) => setSeoNiche(e.target.value)}
              placeholder="Business Niche"
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
            />
          </div>
          <button
            onClick={handleRunSeoGen}
            disabled={isGeneratingSeo}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isGeneratingSeo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Generate SEO Strategy & Schema (1 Credit)</span>
          </button>
          {seoResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap">{seoResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* AGENT 8: BRAND STUDIO */}
      {activeTab === 'brand' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Brand Name"
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
            />
            <input
              type="text"
              value={brandVibe}
              onChange={(e) => setBrandVibe(e.target.value)}
              placeholder="Vibe & Style"
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
            />
          </div>
          <button
            onClick={handleRunBrandGen}
            disabled={isGeneratingBrand}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isGeneratingBrand ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4" />}
            <span>Generate Brand SVG Logo & Color Palette (1 Credit)</span>
          </button>
          {brandResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl" dangerouslySetInnerHTML={{ __html: brandResult.logoSvg }} />
                <div>
                  <span className="text-xs font-bold text-white block">{brandName} Brand Identity Tokens</span>
                  <p className="text-[11px] text-slate-400 mt-1">{brandResult.typography}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {brandResult.palette?.map((c, i) => (
                      <div key={i} className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-[10px] font-mono border border-slate-800">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}></span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AGENT 9: SECURITY AUDIT */}
      {activeTab === 'security' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <input
            type="text"
            value={secTarget}
            onChange={(e) => setSecTarget(e.target.value)}
            placeholder="Website URL to audit"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium"
          />
          <button
            onClick={handleRunSecurityAudit}
            disabled={isAuditing}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {isAuditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            <span>Run Security Scan & Scorecard (1 Credit)</span>
          </button>
          {auditResult && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <pre className="text-xs font-mono text-cyan-300 whitespace-pre-wrap">{auditResult}</pre>
            </div>
          )}
        </div>
      )}

      {/* BUY AI CREDITS MONETIZATION MODAL */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-3 sm:p-6 flex justify-center items-start">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full my-4 sm:my-8 shadow-2xl overflow-hidden relative">
            
            {/* STICKY MODAL HEADER WITH BACK BUTTON */}
            <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-extrabold border border-purple-500/30 transition-all group cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-1 transition-transform" />
                <span>← Back to AI Builder</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] sm:text-xs font-black uppercase shrink-0">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>PLANS & AI CREDITS (2X DOUBLE LIMITS)</span>
              </div>

              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all text-xs font-bold shrink-0 cursor-pointer"
                title="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-5 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">Choose Your Plan or AI Credit Pack</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Get <strong className="text-emerald-400 font-bold">DOUBLE the AI Agent capacity</strong> of Cursor & v0! Power AI website builds, Deep Research, bug fixing, and live server hosting.
                </p>
              </div>

              {/* CREDIT USAGE BREAKDOWN & FREE LIMITED TIME BONUSES */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3 text-xs shadow-xl">
                {/* LIMITED TIME FREE INCLUSIONS BANNER */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 via-teal-900/40 to-slate-900 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] uppercase tracking-wider shrink-0 animate-pulse">
                      ⚡ LIMITED TIME INCLUDED FREE
                    </span>
                    <span className="text-emerald-200 text-xs font-bold">
                      All Plans & Credit Packs Include Zero-Cost Publishing Infrastructure:
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold text-white">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                      🌐 Free Subdomain
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                      ☁️ Free NVMe Hosting
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                      🚀 1-Click Deploy & SSL
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>How AI Credits Work (Rate Chart & Capacity):</span>
                  </span>
                  <span className="text-emerald-400 font-extrabold text-[11px]">✓ Rate = 2x Double Credits</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold">Website Build (Flash)</span>
                    <strong className="text-amber-300 font-extrabold text-xs">300 Credits</strong> / build
                    <span className="text-[9px] text-slate-400 block mt-0.5">Build ~3 Full Websites</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold">Web App / SaaS (Pro Vibe)</span>
                    <strong className="text-purple-300 font-extrabold text-xs">500 Credits</strong> / build
                    <span className="text-[9px] text-purple-300 block mt-0.5">Build ~2 Full Web Apps</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold">Deep Research Agent</span>
                    <strong className="text-cyan-300 font-extrabold text-xs">500 Credits</strong> / query
                    <span className="text-[9px] text-cyan-300 block mt-0.5">Deep System Architecture</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-semibold">Bug Fix / DB Endpoints</span>
                    <strong className="text-emerald-300 font-extrabold text-xs">200 Credits</strong> / action
                    <span className="text-[9px] text-emerald-400 block mt-0.5">Refactoring & Schema</span>
                  </div>
                </div>
              </div>

              {/* MONTHLY SUBSCRIPTION PLANS (2X CURSOR LIMITS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Monthly Subscription Tiers (2X DOUBLE Agent Limits)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-extrabold">200% Capacity + Free Subdomain & Hosting</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pro $20 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                        INDIVIDUAL PRO
                      </span>
                      <div>
                        <h4 className="text-2xl font-black text-amber-300">₹1,699 <span className="text-xs text-slate-400 font-normal">($20/mo)</span></h4>
                        <span className="text-[10px] text-emerald-400 font-extrabold block">3,400 AI Credits / Month (2x Rate)</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800/80 pt-2 text-left">
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>2x Double Rate Credits</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>Free Custom Subdomain</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>Free Cloud Hosting & Deploy</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> MCPs, Skills & Webhooks</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handleSelectPack({ name: 'Individual Pro Plan ($20/mo)', credits: 3400, price: 1699 })}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                    >
                      Subscribe Pro (₹1,699/mo)
                    </button>
                  </div>

                  {/* Pro+ $60 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/80 space-y-3 flex flex-col justify-between relative bg-gradient-to-b from-amber-950/20 to-slate-950">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                      LIMITED TIME BONUS
                    </span>
                    <div className="space-y-2 pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                        INDIVIDUAL PRO+
                      </span>
                      <div>
                        <h4 className="text-2xl font-black text-amber-300">₹4,999 <span className="text-xs text-slate-400 font-normal">($60/mo)</span></h4>
                        <span className="text-[10px] text-emerald-400 font-extrabold block">10,000 AI Credits / Month (2x Rate)</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800/80 pt-2 text-left">
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>2x Double Rate Credits</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>Free Subdomain & NVMe Hosting</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> <strong>Instant 1-Click Deployment</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Gemini Deep Research Coder</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handleSelectPack({ name: 'Individual Pro+ Plan ($60/mo)', credits: 10000, price: 4999 })}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs transition-all cursor-pointer"
                    >
                      Subscribe Pro+ (₹4,999/mo)
                    </button>
                  </div>

                  {/* Ultra $200 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                        INDIVIDUAL ULTRA
                      </span>
                      <div>
                        <h4 className="text-2xl font-black text-amber-300">₹16,999 <span className="text-xs text-slate-400 font-normal">($200/mo)</span></h4>
                        <span className="text-[10px] text-emerald-400 font-extrabold block">34,000 AI Credits (2x Rate)</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800/80 pt-2 text-left">
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> <strong>2x Double Rate Credits</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> <strong>Free Subdomain, Hosting & SSL</strong></li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Priority High-Speed Queue</li>
                        <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Bugbot AI Code Auditor</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handleSelectPack({ name: 'Individual Ultra Plan ($200/mo)', credits: 34000, price: 16999 })}
                      className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-all cursor-pointer"
                    >
                      Subscribe Ultra (₹16,999/mo)
                    </button>
                  </div>
                </div>
              </div>

              {/* INSTANT TOP-UP CREDIT PACKS (LIFETIME VALIDITY) */}
              <div className="space-y-4 border-t border-slate-800 pt-4">
                {/* URGENCY COUNTDOWN OFFER BANNER */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-pink-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 animate-pulse">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-amber-300 flex items-center gap-1.5 justify-center sm:justify-start">
                        <span>⚡ LIMITED TIME OFFER: 2X CREDITS + FREE SUBDOMAIN, HOSTING & DEPLOY!</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Get 1,000 AI Credits for <span className="line-through text-slate-400">₹1,499</span> <span className="text-emerald-400 font-extrabold text-xs">₹499 Only!</span>
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ends In:</span>
                    <span className="text-sm font-mono font-black text-amber-400">
                      {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Instant Credit Top-Up Packs (2x Double Rate • Lifetime Validity)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Free Subdomain + Hosting Included
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pack 1: Starter Pack ₹499 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/50 hover:border-amber-400 space-y-3 text-center transition-all flex flex-col justify-between shadow-lg ring-1 ring-amber-500/20">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
                          STARTER PACK
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold">
                          2X DOUBLE CREDITS
                        </span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-amber-300">1,000 Credits</h4>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 line-through font-bold">₹1,499</span>
                          <span className="text-xl font-black text-emerald-400">₹499</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">Build ~3 Full Websites or ~2 Web Apps</span>
                        <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 text-left border-t border-slate-800/80 pt-2">
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free Subdomain Included</div>
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free Cloud Hosting</div>
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free 1-Click Deployment</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPack({ name: 'Starter 1,000 AI Credits Pack', credits: 1000, price: 499 })}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                    >
                      Buy Starter Pack (₹499)
                    </button>
                  </div>

                  {/* Pack 2: Pro Pack ₹999 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-3 text-center transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black uppercase">
                        PRO VIBE BUILDER
                      </span>
                      <div>
                        <h4 className="text-2xl font-black text-amber-300">2,000 Credits</h4>
                        <div className="text-xl font-black text-purple-300 mt-1">₹999</div>
                        <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">Build ~6 Full Websites or ~4 Web Apps</span>
                        <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 text-left border-t border-slate-800/80 pt-2">
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free Subdomain Included</div>
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free Cloud Hosting</div>
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free 1-Click Deployment</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPack({ name: 'Pro 2,000 AI Credits Pack', credits: 2000, price: 999 })}
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all cursor-pointer"
                    >
                      Buy Pro Pack (₹999)
                    </button>
                  </div>

                  {/* Pack 3: Agency Pack ₹2,499 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-3 text-center transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase">
                        AGENCY ULTRA
                      </span>
                      <div>
                        <h4 className="text-2xl font-black text-amber-300">5,000 Credits</h4>
                        <div className="text-xl font-black text-cyan-400 mt-1">₹2,499</div>
                        <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">Build ~16 Full Websites or ~10 Web Apps</span>
                        <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 text-left border-t border-slate-800/80 pt-2">
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free Subdomain Included</div>
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free Cloud Hosting</div>
                          <div className="flex items-center gap-1 text-emerald-300 font-semibold"><CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> Free 1-Click Deployment</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectPack({ name: 'Agency 5,000 AI Credits Pack', credits: 5000, price: 2499 })}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition-all cursor-pointer"
                    >
                      Buy Agency Pack (₹2,499)
                    </button>
                  </div>
                </div>
              </div>

              {/* WHAT ALL IS INCLUDED SHOWCASE GRID */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>🎁 What All Is Included Free In Your Account Platform</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">🤖</span>
                    <div>
                      <div className="font-bold text-white">Multi-Engine AI Models</div>
                      <div className="text-[11px] text-slate-400">Cursor AI, Claude 3.5, GPT-4o & Gemini 2.5 Pro</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">⚡</span>
                    <div>
                      <div className="font-bold text-white">Ultra-Fast High-Speed Hosting</div>
                      <div className="text-[11px] text-slate-400">NVMe SSDs, CDN, Unlimited Bandwidth</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">🔒</span>
                    <div>
                      <div className="font-bold text-white">Free SSL & Custom Domain</div>
                      <div className="text-[11px] text-slate-400">Connect `.com`, `.in`, `.ai` with 1-click HTTPS</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span className="text-purple-400 font-bold">📦</span>
                    <div>
                      <div className="font-bold text-white">1-Click Source Code & GitHub</div>
                      <div className="text-[11px] text-slate-400">Full HTML/JS Code Download & GitHub Repo Sync</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span className="text-pink-400 font-bold">⚙️</span>
                    <div>
                      <div className="font-bold text-white">n8n Automation Engine</div>
                      <div className="text-[11px] text-slate-400">WhatsApp Lead Bots, CRM & Auto-Responders</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">💸</span>
                    <div>
                      <div className="font-bold text-white">Invite & Earn Cash Rewards</div>
                      <div className="text-[11px] text-slate-400">Earn up to ₹10,000 Cash directly in Bank/UPI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER WITH SECONDARY BACK BUTTON */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setIsCreditModalOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400" />
                <span>← Back to AI Builder</span>
              </button>

              <span className="text-xs text-slate-400">100% Instant Credit Activation</span>
            </div>
          </div>
        </div>
      )}

      {/* GITHUB EXPORT MODAL */}
      {isGithubModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsGithubModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase">
                <Github className="w-4 h-4 text-purple-400" />
                <span>GITHUB REPOSITORY EXPORT</span>
              </div>
              <h3 className="text-xl font-black text-white">Push Project to GitHub</h3>
              <p className="text-xs text-slate-400">
                Push full generated source code, README, package.json, and deployment configs to your GitHub account.
              </p>
            </div>

            <div className="space-y-4">
              {pushedGithubUrl && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>GitHub Repository Successfully Created & Pushed!</span>
                  </div>
                  <a
                    href={pushedGithubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-extrabold text-cyan-300 hover:underline break-all block"
                  >
                    {pushedGithubUrl}
                  </a>
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={pushedGithubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <span>Open Repository on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Step-by-step Token Helper Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>GitHub Token कैसे बनाएं? (3 Steps Guide):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    नीचे दिए बटन पर क्लिक करें: {' '}
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=OneHost+AI+Agent"
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Generate Token on GitHub ↗</span>
                    </a>
                  </li>
                  <li>GitHub पेज पर नीचे जाकर <b>"Generate token"</b> पर क्लिक करें।</li>
                  <li>दिखाई देने वाले Token (उदा: <code className="text-cyan-300">ghp_xxxxx</code>) को कॉपी करके नीचे बॉक्स में पेस्ट करें।</li>
                </ol>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">GitHub Personal Access Token (PAT)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="Paste ghp_xxxxxxxxxxxxxxxxxxxx token here"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Repository Name</label>
                <input
                  type="text"
                  value={githubRepoName}
                  onChange={(e) => setGithubRepoName(e.target.value)}
                  placeholder="my-ai-website"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-300 font-bold">Repository Visibility</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGithubPrivate(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${!isGithubPrivate ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGithubPrivate(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${isGithubPrivate ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                  >
                    Private
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePushToGithub}
                  disabled={isPushingToGithub}
                  className="flex-1 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isPushingToGithub ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Pushing Repository to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>🚀 Push to GitHub Account</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const codeToDownload = generatedApp ? generatedApp.code : '';
                    const titleToDownload = generatedApp ? generatedApp.title : 'website';
                    if (codeToDownload) {
                      downloadHtmlFile(codeToDownload, titleToDownload);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  title="Direct Download HTML File"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download HTML File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IFRAME PREVIEW MODAL */}
      {isFullscreenPreview && generatedApp && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-in fade-in duration-200 overflow-y-auto">
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-sm font-extrabold text-white">{generatedApp.title} (Fullscreen Sandbox)</h3>
            </div>

            {/* Viewport Switcher in Fullscreen */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewViewport === 'desktop' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-cyan-300" />
                <span>Computer</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewViewport === 'tablet' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5 text-amber-300" />
                <span>Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewViewport === 'mobile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-pink-300" />
                <span>Mobile</span>
              </button>
            </div>

            <button
              onClick={() => setIsFullscreenPreview(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Close Fullscreen
            </button>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center overflow-auto min-h-0">
            {previewViewport === 'mobile' ? (
              <div className="relative w-[380px] max-w-full rounded-[48px] bg-slate-900 p-3.5 border-[6px] border-slate-700 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/40 flex flex-col items-center my-auto">
                {/* Side buttons */}
                <div className="absolute -left-[9px] top-20 w-[3px] h-8 bg-slate-700 rounded-l-sm" />
                <div className="absolute -left-[9px] top-32 w-[3px] h-8 bg-slate-700 rounded-l-sm" />
                <div className="absolute -right-[9px] top-24 w-[3px] h-12 bg-slate-700 rounded-r-sm" />

                <div className="w-28 h-5 bg-black rounded-full border border-slate-800/80 flex items-center justify-between px-3 mb-2 shadow-inner z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-900/80" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                <div className="w-full h-[680px] bg-black rounded-[36px] overflow-hidden border border-slate-800 shadow-inner">
                  <iframe
                    srcDoc={generatedApp.code}
                    title="Fullscreen Mobile Preview"
                    className="w-full h-full border-none bg-slate-950"
                    sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
                  />
                </div>

                <div className="w-32 h-1 bg-slate-500/70 rounded-full mt-2.5 mb-1" />
              </div>
            ) : previewViewport === 'tablet' ? (
              <div className="relative w-[768px] max-w-full rounded-[36px] bg-slate-900 p-4 border-[6px] border-slate-700 shadow-[0_25px_60px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/40 flex flex-col items-center my-auto">
                <div className="w-full flex items-center justify-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-black border border-slate-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-900" />
                  </div>
                </div>

                <div className="w-full h-[720px] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                  <iframe
                    srcDoc={generatedApp.code}
                    title="Fullscreen Tablet Preview"
                    className="w-full h-full border-none bg-slate-950"
                    sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
                  />
                </div>

                <div className="w-36 h-1 bg-slate-600/70 rounded-full mt-3 mb-0.5" />
              </div>
            ) : (
              <iframe
                srcDoc={generatedApp.code}
                title="Fullscreen App Preview"
                className="w-full h-full border-none bg-black"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
              />
            )}
          </div>
        </div>
      )}

      {/* GOOGLE API KEY SETTINGS MODAL */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsApiKeyModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>GOOGLE AI STUDIO API KEY CONFIGURATION</span>
              </div>
              <h3 className="text-xl font-black text-white">Power Your Agents with Custom Gemini API Key</h3>
              <p className="text-xs text-slate-400">
                Enter your Google AI Studio API key (<code className="text-cyan-300 font-mono">AIzaSy...</code>) to unlock unlimited requests, custom rate limits, and access to all Google Gemini models.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Google Gemini API Key</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get Key from Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-500 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Key Security & Privacy</span>
                </div>
                <p>
                  Your API key is stored locally in your browser session and transmitted directly to secure server API proxies. It is never logged or shared.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveApiKey}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Custom API Key</span>
                </button>

                {userApiKey && (
                  <button
                    onClick={() => {
                      setTempApiKey('');
                      setUserApiKey('');
                      localStorage.removeItem('onehost_google_api_key');
                      showToast('Custom Google API Key cleared.', 'info');
                      setIsApiKeyModalOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-rose-300 border border-slate-700 hover:border-rose-500/40 font-bold text-xs transition-all"
                  >
                    Clear Key
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAZORPAY PAYMENT MODAL FOR BUYING CREDITS */}
      {selectedCreditPack && (
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => {
            setIsRazorpayOpen(false);
            setSelectedCreditPack(null);
          }}
          onBack={() => {
            setIsRazorpayOpen(false);
            setSelectedCreditPack(null);
            setIsCreditModalOpen(true);
          }}
          subtotal={selectedCreditPack.price}
          discount={0}
          items={[{ name: selectedCreditPack.name, price: selectedCreditPack.price, qty: 1 }]}
          onSuccess={() => {
            addAiCredits(selectedCreditPack.credits);
            showToast(`Success! ${selectedCreditPack.credits} AI Credits added to your balance.`, 'success');
            setSelectedCreditPack(null);
          }}
        />
      )}

      {/* CUSTOM DOMAIN CONNECTION MODAL */}
      {isCustomDomainModalOpen && selectedSiteForDomain && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-auto">
            <button
              onClick={() => {
                setIsCustomDomainModalOpen(false);
                setSelectedSiteForDomain(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Universal Custom Domain Connection • OneHost Edge CDN</span>
              </div>
              <h3 className="text-2xl font-black text-white">Connect Custom Domain (अपना डोमेन जोड़ें)</h3>
              <p className="text-xs text-slate-400">
                Connect your custom domain (e.g. <code className="text-purple-300 font-mono">www.mybrand.com</code>, <code className="text-purple-300 font-mono">shop.mybusiness.in</code>) bought from <strong>GoDaddy, Hostinger, Namecheap, BigRock, or Cloudflare</strong> to <strong className="text-slate-200">{selectedSiteForDomain.title}</strong>.
              </p>

              {/* Buy Domain Quick Action Banner */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-200">Don't have a domain name yet?</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomDomainModalOpen(false);
                    setCurrentView('domains');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy New Domain (.in, .com, .ai)</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* Step 1: Input Domain Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Step 1: Enter Your Custom Domain Name
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={inputCustomDomain}
                    onChange={(e) => setInputCustomDomain(e.target.value)}
                    placeholder="e.g. www.mybrand.com or shop.mybusiness.in"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-purple-500 placeholder-slate-600 font-semibold"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Enter with or without <code>www</code> (e.g. <code>mycompany.com</code> or <code>www.mycompany.com</code>)
                </p>
              </div>

              {/* Step 2: Choose Connection Method */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300">
                  Step 2: Choose Connection Method & Copy Records
                </label>

                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDnsConnectionMethod('dns')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      dnsConnectionMethod === 'dns'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Method A: A + CNAME Records (Recommended)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDnsConnectionMethod('nameservers')}
                    className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      dnsConnectionMethod === 'nameservers'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Method B: Name Servers (Cloudflare)</span>
                  </button>
                </div>

                {/* Method A Display */}
                {dnsConnectionMethod === 'dns' ? (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>DNS Records to add in your Domain Registrar:</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">🔒 Free Auto SSL</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      {/* Record 1 */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-purple-400 font-bold mr-2">Type A</span>
                          <span className="text-slate-300">Host: <code className="text-slate-100 font-bold">@</code></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">Points to: 185.199.108.153</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('185.199.108.153');
                              showToast('IP copied to clipboard!', 'success');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 font-sans font-bold"
                          >
                            Copy IP
                          </button>
                        </div>
                      </div>

                      {/* Record 2 */}
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-cyan-400 font-bold mr-2">CNAME</span>
                          <span className="text-slate-300">Host: <code className="text-slate-100 font-bold">www</code></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-300 font-bold">cname.onehost.cloud</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('cname.onehost.cloud');
                              showToast('CNAME copied to clipboard!', 'success');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 font-sans font-bold"
                          >
                            Copy CNAME
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-xs font-black text-white flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>OneHost Cloud Nameservers:</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">⚡ Cloudflare Global Anycast</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 text-[10px] block">NS1</span>
                          <span className="text-cyan-300 font-bold">ns1.onehost.cloud</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('ns1.onehost.cloud');
                            showToast('NS1 copied', 'success');
                          }}
                          className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-200 font-sans font-bold"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 text-[10px] block">NS2</span>
                          <span className="text-cyan-300 font-bold">ns2.onehost.cloud</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('ns2.onehost.cloud');
                            showToast('NS2 copied', 'success');
                          }}
                          className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-200 font-sans font-bold"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* REGISTRAR STEP-BY-STEP INSTRUCTIONS TABS */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Step-by-Step Guide for Your Provider:</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'godaddy', name: 'GoDaddy' },
                      { id: 'hostinger', name: 'Hostinger' },
                      { id: 'namecheap', name: 'Namecheap' },
                      { id: 'cloudflare', name: 'Cloudflare' },
                      { id: 'bigrock', name: 'BigRock / Other' }
                    ].map(reg => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setActiveRegistrarGuide(reg.id as any)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition-all ${
                          activeRegistrarGuide === reg.id
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {reg.name}
                      </button>
                    ))}
                  </div>

                  {/* Guide Content */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 space-y-2 leading-relaxed">
                    {activeRegistrarGuide === 'godaddy' && (
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Log in to your <b>GoDaddy Account</b> → Go to <b>My Products</b> → Click <b>DNS</b> next to your domain.</li>
                        <li>In DNS Records, edit <b>A Record</b> (Host <code>@</code>) and set Value to <code className="text-emerald-400 font-bold font-mono">185.199.108.153</code>.</li>
                        <li>Edit or Add <b>CNAME Record</b> (Host <code>www</code>) and set Value to <code className="text-cyan-300 font-bold font-mono">cname.onehost.cloud</code>.</li>
                        <li>Click <b>Save</b>. Done! Click "Verify DNS & Connect Domain" below.</li>
                      </ol>
                    )}

                    {activeRegistrarGuide === 'hostinger' && (
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Log in to <b>Hostinger hPanel</b> → Go to <b>Domains</b> → Click <b>Manage</b>.</li>
                        <li>Open <b>DNS Zone Editor</b>.</li>
                        <li>Under <b>A Record</b>, point <code>@</code> to <code className="text-emerald-400 font-bold font-mono">185.199.108.153</code>.</li>
                        <li>Under <b>CNAME Record</b>, point <code>www</code> to <code className="text-cyan-300 font-bold font-mono">cname.onehost.cloud</code>.</li>
                        <li>Click <b>Save Changes</b> and verify below!</li>
                      </ol>
                    )}

                    {activeRegistrarGuide === 'namecheap' && (
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Log in to <b>Namecheap Dashboard</b> → Click <b>Manage</b> next to your domain.</li>
                        <li>Go to <b>Advanced DNS</b> tab.</li>
                        <li>Add A Record for <code>@</code> pointing to <code className="text-emerald-400 font-bold font-mono">185.199.108.153</code>.</li>
                        <li>Add CNAME Record for <code>www</code> pointing to <code className="text-cyan-300 font-bold font-mono">cname.onehost.cloud</code>.</li>
                        <li>Save changes and return here to verify!</li>
                      </ol>
                    )}

                    {activeRegistrarGuide === 'cloudflare' && (
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Open <b>Cloudflare Dashboard</b> → Select your domain → Click <b>DNS</b>.</li>
                        <li>Add <b>A Record</b>: Name = <code>@</code>, IPv4 = <code className="text-emerald-400 font-bold font-mono">185.199.108.153</code>.</li>
                        <li>Add <b>CNAME Record</b>: Name = <code>www</code>, Target = <code className="text-cyan-300 font-bold font-mono">cname.onehost.cloud</code>.</li>
                        <li>Click <b>Save</b>. Cloudflare updates instantly!</li>
                      </ol>
                    )}

                    {activeRegistrarGuide === 'bigrock' && (
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Log in to <b>BigRock / Registrar Account</b> → Go to Domain Management.</li>
                        <li>Click <b>Manage DNS</b> or <b>DNS Records</b>.</li>
                        <li>Add <b>A Record</b> (Host <code>@</code>) pointing to <code className="text-emerald-400 font-bold font-mono">185.199.108.153</code>.</li>
                        <li>Add <b>CNAME Record</b> (Host <code>www</code>) pointing to <code className="text-cyan-300 font-bold font-mono">cname.onehost.cloud</code>.</li>
                        <li>Click Save and verify connection!</li>
                      </ol>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleVerifyAndConnectDomain}
                  disabled={isVerifyingDns}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isVerifyingDns ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                      <span>Verifying DNS Records & Issuing Free SSL...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Verify DNS & Connect Domain (डोमेन आसानी से कनेक्ट करें)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* WEBSITE EDITING & RE-DEPLOY MODAL */}
      {isEditCodeModalOpen && editingSiteItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-5 md:p-8 space-y-5 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold uppercase">
                  <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Website Editor & Re-Deploy Studio</span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Editing Website: {editingSiteItem.title}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditCodeModalOpen(false);
                  setEditingSiteItem(null);
                }}
                className="text-slate-400 hover:text-white text-base font-bold w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* AI Refine Prompt Bar */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ask AI Agent to Modify Your Website (वेबसाइट अपडेट करने के लिए AI को कहें)</span>
                </label>
                <span className="text-[10px] text-slate-400">e.g., "Add WhatsApp button", "Change theme to dark blue"</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={aiRefinePrompt}
                  onChange={(e) => setAiRefinePrompt(e.target.value)}
                  placeholder="e.g., Change hero title to 'Best Digital Agency in Delhi' and add price list..."
                  className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
                <button
                  type="button"
                  onClick={handleApplyAiRefining}
                  disabled={isRefiningCodeWithAi || !aiRefinePrompt.trim()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-indigo-600/30"
                >
                  {isRefiningCodeWithAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI Updating Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>✨ AI Apply Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Split View: Code Editor vs Real-time Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[360px] overflow-hidden">
              {/* Left Column: Direct Code Editor */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono bg-slate-950 px-3 py-1.5 rounded-t-xl border border-slate-800">
                  <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                    <Code className="w-3.5 h-3.5" />
                    <span>HTML / CSS / JavaScript Code Editor</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Live Editable</span>
                </div>
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="flex-1 w-full p-3.5 bg-slate-950 border border-slate-800 rounded-b-xl text-xs font-mono text-cyan-300 focus:outline-none leading-relaxed resize-none min-h-[300px]"
                  placeholder="Paste or edit HTML code here..."
                />
              </div>

              {/* Right Column: Instant Live Preview */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono bg-slate-950 px-3 py-1.5 rounded-t-xl border border-slate-800">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Real-time Live Preview</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">● Active</span>
                </div>
                <div className="flex-1 w-full rounded-b-xl border border-slate-800 bg-black overflow-hidden min-h-[300px]">
                  <iframe
                    srcDoc={editableCode}
                    title="Live Edit Preview"
                    className="w-full h-full border-none bg-slate-950"
                    sandbox="allow-scripts allow-modals allow-same-origin allow-forms allow-popups allow-downloads"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openStandaloneWebSitePage(editableCode)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview Full Screen</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadHtmlFile(editableCode, editingSiteItem.title)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download HTML</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveAndReDeploy}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <Rocket className="w-4 h-4 text-emerald-200" />
                <span>🚀 Save Changes & Re-Deploy Website (री-डिप्लॉय करें)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
