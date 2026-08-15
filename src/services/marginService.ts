import { HostingPlan } from '../types';
import { DomainPricingItem } from '../data/hostingPlans';

export interface PlanMarginDetail {
  id: string;
  name: string;
  category: 'web' | 'wordpress' | 'cloud' | 'vps' | 'dedicated' | 'ai_agent' | 'reseller';
  wholesaleCostINR: number; // Base cost to us (server/data center/reseller)
  marginPct: number; // Profit margin percentage (e.g. 80 means +80%)
  retailPriceINR?: number; // Computed selling price
  originalRetailINR: number;
}

export interface TldMarginDetail {
  tld: string;
  category: string;
  wholesaleCostINR: number; // Base wholesale registry cost (NIXI/Verisign/Radix/CentralNic)
  marginPct: number; // Profit margin percentage (e.g. 35 means +35%)
  retailPriceINR?: number; // Computed selling price
  originalRetailINR: number;
  discountTag?: string;
  popular?: boolean;
}

export interface MarginSettings {
  lastUpdated: string;
  // Global category margins
  globalHostingMarginPct: number; // Default 80%
  globalDomainMarginPct: number;  // Default 35%
  globalVpsMarginPct: number;     // Default 60%
  globalDedicatedMarginPct: number;// Default 45%
  globalAiMarginPct: number;      // Default 85%

  categoryMargins: {
    web: number;
    wordpress: number;
    cloud: number;
    vps: number;
    dedicated: number;
    reseller: number;
    ai_agent: number;
  };

  // Plan-specific margins
  plans: Record<string, { wholesaleCostINR: number; marginPct: number }>;

  // TLD-specific margins
  tlds: Record<string, { wholesaleCostINR: number; marginPct: number }>;
}

export const DEFAULT_PLAN_MARGINS: Record<string, { name: string; category: any; wholesaleCostINR: number; marginPct: number; originalRetailINR: number }> = {
  // Web Hosting
  'single': { name: 'Single Web Hosting', category: 'web', wholesaleCostINR: 15, marginPct: 360, originalRetailINR: 399 },
  'premium': { name: 'Premium Web Hosting', category: 'web', wholesaleCostINR: 28, marginPct: 396, originalRetailINR: 599 },
  'business': { name: 'Business Pro Hosting', category: 'web', wholesaleCostINR: 45, marginPct: 342, originalRetailINR: 699 },
  'ultra-business': { name: 'Ultra Turbo Pro', category: 'web', wholesaleCostINR: 70, marginPct: 327, originalRetailINR: 999 },
  
  // WordPress Hosting
  'wp-starter': { name: 'WordPress Starter', category: 'wordpress', wholesaleCostINR: 22, marginPct: 350, originalRetailINR: 499 },
  'wp-business': { name: 'Managed WP Pro', category: 'wordpress', wholesaleCostINR: 55, marginPct: 352, originalRetailINR: 899 },
  
  // Cloud Hosting
  'cloud-startup': { name: 'Cloud Startup', category: 'cloud', wholesaleCostINR: 150, marginPct: 232, originalRetailINR: 1699 },
  'cloud-professional': { name: 'Cloud Professional', category: 'cloud', wholesaleCostINR: 280, marginPct: 221, originalRetailINR: 2499 },
  'cloud-enterprise': { name: 'Cloud Enterprise', category: 'cloud', wholesaleCostINR: 550, marginPct: 208, originalRetailINR: 3999 },

  // AI Agent & SaaS Hosting
  'ai-agent-pro': { name: 'AI Agent & SaaS Host', category: 'ai_agent', wholesaleCostINR: 90, marginPct: 454, originalRetailINR: 1499 },

  // VPS Hosting
  'vps-1': { name: 'Cloud VPS 1 (4GB RAM)', category: 'vps', wholesaleCostINR: 240, marginPct: 150, originalRetailINR: 999 },
  'vps-2': { name: 'Cloud VPS 2 (8GB RAM)', category: 'vps', wholesaleCostINR: 480, marginPct: 150, originalRetailINR: 1899 },
  'vps-3': { name: 'Cloud VPS 3 (16GB RAM)', category: 'vps', wholesaleCostINR: 880, marginPct: 150, originalRetailINR: 3499 },
  'vps-4': { name: 'Cloud VPS 4 (32GB RAM)', category: 'vps', wholesaleCostINR: 1600, marginPct: 150, originalRetailINR: 5999 },

  // Dedicated Servers
  'ded-1': { name: 'Bare Metal Entry', category: 'dedicated', wholesaleCostINR: 1500, marginPct: 100, originalRetailINR: 4999 },
  'ded-2': { name: 'Bare Metal Pro', category: 'dedicated', wholesaleCostINR: 3500, marginPct: 100, originalRetailINR: 9999 },
  'ded-3': { name: 'Bare Metal Enterprise', category: 'dedicated', wholesaleCostINR: 6500, marginPct: 100, originalRetailINR: 19999 }
};

export const DEFAULT_TLD_MARGINS: Record<string, { category: string; wholesaleCostINR: number; marginPct: number; originalRetailINR: number; popular: boolean }> = {
  '.in': { category: 'India & Asia', wholesaleCostINR: 110, marginPct: 35, originalRetailINR: 999, popular: true },
  '.com': { category: 'Popular TLDs', wholesaleCostINR: 380, marginPct: 31, originalRetailINR: 1399, popular: true },
  '.co.in': { category: 'India & Asia', wholesaleCostINR: 110, marginPct: 35, originalRetailINR: 799, popular: false },
  '.shop': { category: 'Business & Shop', wholesaleCostINR: 55, marginPct: 44, originalRetailINR: 1499, popular: true },
  '.online': { category: 'Cheap / Budget TLDs', wholesaleCostINR: 55, marginPct: 44, originalRetailINR: 1399, popular: true },
  '.site': { category: 'Cheap / Budget TLDs', wholesaleCostINR: 55, marginPct: 44, originalRetailINR: 1299, popular: false },
  '.store': { category: 'Business & Shop', wholesaleCostINR: 55, marginPct: 44, originalRetailINR: 1599, popular: false },
  '.tech': { category: 'Tech & AI', wholesaleCostINR: 70, marginPct: 41, originalRetailINR: 1499, popular: true },
  '.xyz': { category: 'Cheap / Budget TLDs', wholesaleCostINR: 70, marginPct: 41, originalRetailINR: 699, popular: true },
  '.info': { category: 'Cheap / Budget TLDs', wholesaleCostINR: 110, marginPct: 35, originalRetailINR: 1299, popular: false },
  '.me': { category: 'Popular TLDs', wholesaleCostINR: 110, marginPct: 35, originalRetailINR: 1099, popular: false },
  '.cloud': { category: 'Tech & AI', wholesaleCostINR: 140, marginPct: 42, originalRetailINR: 1499, popular: true },
  '.digital': { category: 'Tech & AI', wholesaleCostINR: 140, marginPct: 42, originalRetailINR: 1499, popular: false },
  '.dev': { category: 'Tech & AI', wholesaleCostINR: 360, marginPct: 38, originalRetailINR: 1499, popular: true },
  '.app': { category: 'Tech & AI', wholesaleCostINR: 360, marginPct: 38, originalRetailINR: 1499, popular: true },
  '.org': { category: 'Popular TLDs', wholesaleCostINR: 580, marginPct: 38, originalRetailINR: 1299, popular: true },
  '.net': { category: 'Popular TLDs', wholesaleCostINR: 580, marginPct: 38, originalRetailINR: 1399, popular: true },
  '.co': { category: 'Popular TLDs', wholesaleCostINR: 720, marginPct: 39, originalRetailINR: 2099, popular: false },
  '.io': { category: 'Tech & AI', wholesaleCostINR: 2200, marginPct: 36, originalRetailINR: 4199, popular: true },
  '.ai': { category: 'Tech & AI', wholesaleCostINR: 3500, marginPct: 37, originalRetailINR: 8499, popular: true }
};

export const INITIAL_MARGIN_SETTINGS: MarginSettings = {
  lastUpdated: new Date().toISOString(),
  globalHostingMarginPct: 80,
  globalDomainMarginPct: 35,
  globalVpsMarginPct: 60,
  globalDedicatedMarginPct: 45,
  globalAiMarginPct: 85,
  categoryMargins: {
    web: 80,
    wordpress: 75,
    cloud: 70,
    vps: 60,
    dedicated: 45,
    reseller: 80,
    ai_agent: 85
  },
  plans: Object.fromEntries(
    Object.entries(DEFAULT_PLAN_MARGINS).map(([k, v]) => [k, { wholesaleCostINR: v.wholesaleCostINR, marginPct: v.marginPct }])
  ),
  tlds: Object.fromEntries(
    Object.entries(DEFAULT_TLD_MARGINS).map(([k, v]) => [k, { wholesaleCostINR: v.wholesaleCostINR, marginPct: v.marginPct }])
  )
};

const STORAGE_KEY = 'onehost_profit_margins_v1';

export function calculateSellingPrice(wholesaleCost: number, marginPct: number): number {
  if (wholesaleCost <= 0) return 0;
  // Formula: Selling Price = Wholesale Cost * (1 + Margin% / 100)
  const price = wholesaleCost * (1 + marginPct / 100);
  return Math.max(1, Math.round(price));
}

export function calculateProfitAmount(wholesaleCost: number, marginPct: number): number {
  return calculateSellingPrice(wholesaleCost, marginPct) - wholesaleCost;
}

export function loadSavedMarginSettings(): MarginSettings {
  if (typeof window === 'undefined') return INITIAL_MARGIN_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MARGIN_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_MARGIN_SETTINGS,
      ...parsed,
      plans: { ...INITIAL_MARGIN_SETTINGS.plans, ...(parsed.plans || {}) },
      tlds: { ...INITIAL_MARGIN_SETTINGS.tlds, ...(parsed.tlds || {}) },
      categoryMargins: { ...INITIAL_MARGIN_SETTINGS.categoryMargins, ...(parsed.categoryMargins || {}) }
    };
  } catch (e) {
    console.error('Failed to load saved margin settings:', e);
    return INITIAL_MARGIN_SETTINGS;
  }
}

export function persistMarginSettings(settings: MarginSettings): boolean {
  if (typeof window === 'undefined') return false;
  try {
    settings.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Also broadcast to other tabs / components
    window.dispatchEvent(new CustomEvent('onehost:margins_updated', { detail: settings }));
    
    // Async push to server
    fetch('/api/admin/margins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(() => {});

    return true;
  } catch (e) {
    console.error('Failed to persist margin settings:', e);
    return false;
  }
}

export function getCalculatedPlanPrice(planId: string, currentSettings?: MarginSettings): { monthlyINR: number; wholesaleINR: number; marginPct: number; profitINR: number } {
  const settings = currentSettings || loadSavedMarginSettings();
  const planInfo = settings.plans[planId] || DEFAULT_PLAN_MARGINS[planId];
  if (!planInfo) {
    return { monthlyINR: 99, wholesaleINR: 20, marginPct: 80, profitINR: 79 };
  }
  const wholesaleINR = planInfo.wholesaleCostINR;
  const marginPct = planInfo.marginPct;
  const monthlyINR = calculateSellingPrice(wholesaleINR, marginPct);
  const profitINR = monthlyINR - wholesaleINR;
  return { monthlyINR, wholesaleINR, marginPct, profitINR };
}

export function getCalculatedTldPrice(tld: string, currentSettings?: MarginSettings): { registerINR: number; wholesaleINR: number; marginPct: number; profitINR: number; originalINR: number } {
  const settings = currentSettings || loadSavedMarginSettings();
  const tldKey = tld.startsWith('.') ? tld : `.${tld}`;
  const tldInfo = settings.tlds[tldKey] || DEFAULT_TLD_MARGINS[tldKey];
  const defaultMeta = DEFAULT_TLD_MARGINS[tldKey] || { originalRetailINR: 1499 };

  if (!tldInfo) {
    return { registerINR: 499, wholesaleINR: 350, marginPct: 35, profitINR: 149, originalINR: 1399 };
  }
  const wholesaleINR = tldInfo.wholesaleCostINR;
  const marginPct = tldInfo.marginPct;
  const registerINR = calculateSellingPrice(wholesaleINR, marginPct);
  const profitINR = registerINR - wholesaleINR;
  return { registerINR, wholesaleINR, marginPct, profitINR, originalINR: defaultMeta.originalRetailINR };
}
