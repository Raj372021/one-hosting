import {
  DomainSearchResult,
  RegisteredDomain,
  HostingAccount,
  DeploymentItem,
  InvoiceItem,
  SupportTicket,
  AdminStats,
  DNSRecord
} from '../types';

export async function checkDomainAvailability(query: string): Promise<DomainSearchResult[]> {
  try {
    const res = await fetch('/api/domains/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    console.error('API checkDomainAvailability error', e);
    return [];
  }
}

export async function fetchUserDomains(): Promise<RegisteredDomain[]> {
  try {
    const res = await fetch('/api/domains');
    const data = await res.json();
    return data.domains || [];
  } catch (e) {
    return [];
  }
}

export async function updateDomainDNS(domainId: string, dnsRecords: DNSRecord[]): Promise<boolean> {
  try {
    const res = await fetch(`/api/domains/${domainId}/dns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dnsRecords })
    });
    const data = await res.json();
    return data.success;
  } catch (e) {
    return false;
  }
}

export async function fetchHostingAccounts(): Promise<HostingAccount[]> {
  try {
    const res = await fetch('/api/hosting');
    const data = await res.json();
    return data.hostingAccounts || [];
  } catch (e) {
    return [];
  }
}

export async function createHostingAccount(payload: {
  domain: string;
  planType: string;
  planName: string;
  monthlyPrice: number;
}): Promise<HostingAccount | null> {
  try {
    const res = await fetch('/api/hosting/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.hosting || null;
  } catch (e) {
    return null;
  }
}

export async function performHostingAction(hostingId: string, action: string, payload?: any) {
  try {
    const res = await fetch(`/api/hosting/${hostingId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

export async function fetchDeployments(): Promise<DeploymentItem[]> {
  try {
    const res = await fetch('/api/deployments');
    const data = await res.json();
    return data.deployments || [];
  } catch (e) {
    return [];
  }
}

export async function deployApplication(payload: {
  projectName: string;
  repoUrl: string;
  customDomain: string;
  envVars: { key: string; value: string }[];
}): Promise<DeploymentItem | null> {
  try {
    const res = await fetch('/api/deployments/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data.deployment || null;
  } catch (e) {
    return null;
  }
}

export async function fetchInvoices(): Promise<InvoiceItem[]> {
  try {
    const res = await fetch('/api/billing/invoices');
    const data = await res.json();
    return data.invoices || [];
  } catch (e) {
    return [];
  }
}

export async function createBillingOrder(payload: any) {
  try {
    const res = await fetch('/api/billing/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

export async function fetchTickets(): Promise<SupportTicket[]> {
  try {
    const res = await fetch('/api/tickets');
    const data = await res.json();
    return data.tickets || [];
  } catch (e) {
    return [];
  }
}

export async function createTicket(payload: { subject: string; category: string; priority: string; message: string }) {
  try {
    const res = await fetch('/api/tickets/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

export async function replyTicket(ticketId: string, content: string) {
  try {
    const res = await fetch(`/api/tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

export async function fetchAdminStats(): Promise<AdminStats | null> {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    return data.stats || null;
  } catch (e) {
    return null;
  }
}

export async function runAiDiagnostic(prompt: string, domain?: string): Promise<string> {
  try {
    const res = await fetch('/api/ai/diagnostics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, domain })
    });
    const data = await res.json();
    return data.analysis || 'Analysis complete.';
  } catch (e) {
    return 'Analysis engine error.';
  }
}
