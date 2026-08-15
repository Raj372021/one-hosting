import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  MarginSettings,
  INITIAL_MARGIN_SETTINGS,
  loadSavedMarginSettings,
  persistMarginSettings,
  DEFAULT_PLAN_MARGINS,
  DEFAULT_TLD_MARGINS,
  calculateSellingPrice,
  calculateProfitAmount,
  getCalculatedPlanPrice,
  getCalculatedTldPrice
} from '../services/marginService';
import { HostingPlan } from '../types';
import { HOSTING_PLANS, VPS_PLANS, DEDICATED_PLANS, DOMAIN_PRICING, DomainPricingItem } from '../data/hostingPlans';
import { useToast } from './ToastContext';

interface MarginContextType {
  margins: MarginSettings;
  hasUnsavedChanges: boolean;
  
  // Update actions
  updateGlobalHostingMargin: (marginPct: number) => void;
  updateGlobalDomainMargin: (marginPct: number) => void;
  updateGlobalVpsMargin: (marginPct: number) => void;
  updateGlobalDedicatedMargin: (marginPct: number) => void;
  updateGlobalAiMargin: (marginPct: number) => void;
  updateCategoryMargin: (category: keyof MarginSettings['categoryMargins'], marginPct: number) => void;
  
  updatePlanMargin: (planId: string, marginPct: number, wholesaleCostINR?: number) => void;
  updateTldMargin: (tld: string, marginPct: number, wholesaleCostINR?: number) => void;
  
  // Bulk application actions
  applyMarginToAllHostingPlans: (marginPct: number) => void;
  applyMarginToAllDomains: (marginPct: number) => void;
  
  // Save & Reset
  saveMargins: () => boolean;
  resetMargins: () => void;

  // Real-time calculated data
  dynamicHostingPlans: HostingPlan[];
  dynamicDomainPricing: DomainPricingItem[];
  dynamicVpsPlans: typeof VPS_PLANS;
  dynamicDedicatedPlans: typeof DEDICATED_PLANS;

  // Single item calculation helpers
  getPlanPrice: (planId: string) => { monthlyINR: number; wholesaleINR: number; marginPct: number; profitINR: number };
  getTldPrice: (tld: string) => { registerINR: number; wholesaleINR: number; marginPct: number; profitINR: number; originalINR: number };
}

const MarginContext = createContext<MarginContextType | undefined>(undefined);

export const MarginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [margins, setMargins] = useState<MarginSettings>(() => loadSavedMarginSettings());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const { showToast } = useToast();

  // Listen for cross-tab or external margin updates
  useEffect(() => {
    const handleUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<MarginSettings>;
      if (customEvent.detail) {
        setMargins(customEvent.detail);
        setHasUnsavedChanges(false);
      }
    };
    window.addEventListener('onehost:margins_updated', handleUpdated);
    return () => window.removeEventListener('onehost:margins_updated', handleUpdated);
  }, []);

  const updateGlobalHostingMargin = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => ({
      ...prev,
      globalHostingMarginPct: safePct
    }));
    setHasUnsavedChanges(true);
  };

  const updateGlobalDomainMargin = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => ({
      ...prev,
      globalDomainMarginPct: safePct
    }));
    setHasUnsavedChanges(true);
  };

  const updateGlobalVpsMargin = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => ({
      ...prev,
      globalVpsMarginPct: safePct
    }));
    setHasUnsavedChanges(true);
  };

  const updateGlobalDedicatedMargin = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => ({
      ...prev,
      globalDedicatedMarginPct: safePct
    }));
    setHasUnsavedChanges(true);
  };

  const updateGlobalAiMargin = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => ({
      ...prev,
      globalAiMarginPct: safePct
    }));
    setHasUnsavedChanges(true);
  };

  const updateCategoryMargin = (category: keyof MarginSettings['categoryMargins'], marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => ({
      ...prev,
      categoryMargins: {
        ...prev.categoryMargins,
        [category]: safePct
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updatePlanMargin = (planId: string, marginPct: number, wholesaleCostINR?: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => {
      const existing = prev.plans[planId] || DEFAULT_PLAN_MARGINS[planId] || { wholesaleCostINR: 30, marginPct: 80 };
      return {
        ...prev,
        plans: {
          ...prev.plans,
          [planId]: {
            wholesaleCostINR: wholesaleCostINR !== undefined ? Math.max(1, wholesaleCostINR) : existing.wholesaleCostINR,
            marginPct: safePct
          }
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const updateTldMargin = (tld: string, marginPct: number, wholesaleCostINR?: number) => {
    const key = tld.startsWith('.') ? tld : `.${tld}`;
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => {
      const existing = prev.tlds[key] || DEFAULT_TLD_MARGINS[key] || { wholesaleCostINR: 100, marginPct: 35 };
      return {
        ...prev,
        tlds: {
          ...prev.tlds,
          [key]: {
            wholesaleCostINR: wholesaleCostINR !== undefined ? Math.max(1, wholesaleCostINR) : existing.wholesaleCostINR,
            marginPct: safePct
          }
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const applyMarginToAllHostingPlans = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => {
      const updatedPlans: Record<string, { wholesaleCostINR: number; marginPct: number }> = {};
      Object.entries(prev.plans).forEach(([planId, data]) => {
        const item = data as { wholesaleCostINR: number; marginPct: number };
        updatedPlans[planId] = {
          wholesaleCostINR: item?.wholesaleCostINR ?? 28,
          marginPct: safePct
        };
      });
      return {
        ...prev,
        globalHostingMarginPct: safePct,
        plans: updatedPlans
      };
    });
    setHasUnsavedChanges(true);
    showToast(`Applied ${safePct}% profit margin to all hosting plans! Click Save to apply permanently.`, 'info');
  };

  const applyMarginToAllDomains = (marginPct: number) => {
    const safePct = Math.max(0, Math.min(1000, marginPct));
    setMargins(prev => {
      const updatedTlds: Record<string, { wholesaleCostINR: number; marginPct: number }> = {};
      Object.entries(prev.tlds).forEach(([tld, data]) => {
        const item = data as { wholesaleCostINR: number; marginPct: number };
        updatedTlds[tld] = {
          wholesaleCostINR: item?.wholesaleCostINR ?? 300,
          marginPct: safePct
        };
      });
      return {
        ...prev,
        globalDomainMarginPct: safePct,
        tlds: updatedTlds
      };
    });
    setHasUnsavedChanges(true);
    showToast(`Applied ${safePct}% profit margin to all domain extensions! Click Save to apply permanently.`, 'info');
  };

  const saveMargins = () => {
    const ok = persistMarginSettings(margins);
    if (ok) {
      setHasUnsavedChanges(false);
      showToast('✅ Profit margin settings successfully saved & applied to live store!', 'success');
      return true;
    } else {
      showToast('❌ Failed to save margin settings. Please try again.', 'error');
      return false;
    }
  };

  const resetMargins = () => {
    setMargins(INITIAL_MARGIN_SETTINGS);
    persistMarginSettings(INITIAL_MARGIN_SETTINGS);
    setHasUnsavedChanges(false);
    showToast('Reset all profit margins to default recommended values.', 'info');
  };

  const getPlanPrice = (planId: string) => {
    return getCalculatedPlanPrice(planId, margins);
  };

  const getTldPrice = (tld: string) => {
    return getCalculatedTldPrice(tld, margins);
  };

  // Dynamically compute hosting plans with active profit margins applied
  const dynamicHostingPlans = useMemo(() => {
    return HOSTING_PLANS.map(plan => {
      const calculated = getPlanPrice(plan.id);
      const monthlyINR = calculated.monthlyINR;
      const monthlyUSD = Math.round((monthlyINR / 83.5) * 100) / 100;
      const renewalPriceINR = Math.round(monthlyINR * 1.5);
      const renewalPriceUSD = Math.round((renewalPriceINR / 83.5) * 100) / 100;

      return {
        ...plan,
        monthlyPriceINR: monthlyINR,
        monthlyPriceUSD: monthlyUSD,
        renewalPriceINR: renewalPriceINR,
        renewalPriceUSD: renewalPriceUSD
      };
    });
  }, [margins]);

  // Dynamically compute domain pricing table with active profit margins applied
  const dynamicDomainPricing = useMemo(() => {
    return DOMAIN_PRICING.map(item => {
      const calculated = getTldPrice(item.tld);
      const registerINR = calculated.registerINR;
      const renewINR = Math.round(registerINR * 1.8);
      const transferINR = Math.round(registerINR * 1.2);

      return {
        ...item,
        registerINR: registerINR,
        renewINR: renewINR,
        transferINR: transferINR
      };
    });
  }, [margins]);

  // Dynamically compute VPS pricing
  const dynamicVpsPlans = useMemo(() => {
    return VPS_PLANS.map((vps, idx) => {
      const planId = `vps-${idx + 1}`;
      const calculated = getPlanPrice(planId);
      const priceINR = calculated.monthlyINR;
      const priceUSD = Math.round((priceINR / 83.5) * 100) / 100;

      return {
        ...vps,
        priceINR: priceINR,
        priceUSD: priceUSD
      };
    });
  }, [margins]);

  // Dynamically compute Dedicated Server pricing
  const dynamicDedicatedPlans = useMemo(() => {
    return DEDICATED_PLANS.map((ded, idx) => {
      const planId = `ded-${idx + 1}`;
      const calculated = getPlanPrice(planId);
      const priceINR = calculated.monthlyINR;
      const priceUSD = Math.round((priceINR / 83.5) * 100) / 100;

      return {
        ...ded,
        priceINR: priceINR,
        priceUSD: priceUSD
      };
    });
  }, [margins]);

  return (
    <MarginContext.Provider
      value={{
        margins,
        hasUnsavedChanges,
        updateGlobalHostingMargin,
        updateGlobalDomainMargin,
        updateGlobalVpsMargin,
        updateGlobalDedicatedMargin,
        updateGlobalAiMargin,
        updateCategoryMargin,
        updatePlanMargin,
        updateTldMargin,
        applyMarginToAllHostingPlans,
        applyMarginToAllDomains,
        saveMargins,
        resetMargins,
        dynamicHostingPlans,
        dynamicDomainPricing,
        dynamicVpsPlans,
        dynamicDedicatedPlans,
        getPlanPrice,
        getTldPrice
      }}
    >
      {children}
    </MarginContext.Provider>
  );
};

export const useMargins = () => {
  const context = useContext(MarginContext);
  if (!context) throw new Error('useMargins must be used within MarginProvider');
  return context;
};
