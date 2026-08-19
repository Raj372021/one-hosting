export type Currency = 'INR' | 'USD';
export type ThemeMode = 'dark' | 'light';

export interface UserSubscription {
  id: string;
  title: string;
  category: 'n8n' | 'hosting' | 'vps' | 'wordpress' | 'domain' | 'ai_saas' | string;
  planName: string;
  status: 'ACTIVE' | 'PROVISIONING' | 'EXPIRED';
  monthlyPrice: number;
  billingCycle: string;
  activatedAt: string;
  renewAt: string;
  instanceUrl?: string;
  webhookUrl?: string;
  apiKey?: string;
  serverIp?: string;
  details?: string;
}

export interface N8nWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'whatsapp' | 'ai' | 'ecommerce' | 'social' | 'custom' | string;
  active: boolean;
  triggerType: 'webhook' | 'cron' | 'event' | 'manual';
  executionsCount: number;
  lastExecutionAt?: string;
  webhookUrl: string;
  nodesCount: number;
  flowJson?: string;
}

export interface UserBankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  phone: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  rewardTier: string;
  invitesMilestone: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  bankDetails: UserBankDetails;
}

export interface ReferralSale {
  id: string;
  referrerCode: string;
  referrerName: string;
  referredCustomerName: string;
  referredCustomerEmail: string;
  planName: string;
  amount: number;
  purchasedAt: string;
  status: 'QUALIFIED_PLAN_PURCHASE';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  authProvider?: 'google' | 'email' | 'phone';
  walletBalance: number;
  aiCredits?: number;
  verified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  phone?: string;
  gstin?: string;
  subscriptions?: UserSubscription[];
  n8nWorkflows?: N8nWorkflow[];
  referralCode?: string;
  invitedCount?: number;
  referralEarnings?: number;
  bankDetails?: UserBankDetails;
  payoutRequests?: PayoutRequest[];
  referralSales?: ReferralSale[];
}

export type HostingPlanType = 'single' | 'premium' | 'business' | 'cloud-startup' | 'cloud-professional' | 'cloud-enterprise' | string;

export interface HostingPlan {
  id: HostingPlanType;
  name: string;
  badge?: string;
  popular?: boolean;
  category?: 'web' | 'cloud' | 'vps' | 'wordpress' | 'dedicated' | 'reseller' | 'ai_agent' | string;
  originalPriceINR?: number;
  monthlyPriceINR: number;
  monthlyPriceUSD: number;
  renewalPriceINR: number;
  renewalPriceUSD: number;
  discountTag?: string;
  websites: string;
  storage: string;
  bandwidth: string;
  freeDomain: boolean;
  freeSSL: boolean;
  freeEmail: string;
  mailboxes?: string;
  vibeCredits?: string;
  webApps?: string;
  features: string[];
  specs: {
    ram: string;
    cpu: string;
    nvmeSSD: boolean;
    dailyBackup: boolean;
    sshAccess: boolean;
    gitNodeDocker: boolean;
  };
}

export interface HostingAccount {
  id: string;
  userId: string;
  domain: string;
  planName: string;
  planType: HostingPlanType;
  status: 'active' | 'suspended' | 'provisioning';
  serverIp: string;
  datacenter: string;
  monthlyPrice: number;
  diskUsedMb: number;
  diskTotalMb: number;
  bandwidthUsedGb: number;
  bandwidthTotalGb: number;
  cpuUsagePct: number;
  ramUsagePct: number;
  phpVersion: string;
  nodeVersion: string;
  sslActive: boolean;
  sslExpires: string;
  createdAt: string;
  renewAt: string;
  autoRenew: boolean;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'SRV' | 'CAA';
  name: string;
  value: string;
  priority?: number;
  ttl: number;
}

export interface RegisteredDomain {
  id: string;
  userId: string;
  domainName: string;
  tld: string;
  status: 'active' | 'expired' | 'pending';
  registeredAt: string;
  expiresAt: string;
  autoRenew: boolean;
  privacyProtected: boolean;
  priceYear: number;
  nameservers: string[];
  dnsRecords: DNSRecord[];
}

export interface DomainSearchResult {
  domain: string;
  tld: string;
  available: boolean;
  price: number;
  originalPrice: number;
  discountTag: string | null;
  isPopular?: boolean;
  statusText?: string;
  whoisNs?: string[];
}

export interface CartItem {
  id: string;
  type: 'hosting' | 'domain' | 'email' | 'ssl';
  title: string;
  subtitle?: string;
  billingCycle: 'monthly' | 'yearly' | '4years';
  price: number;
  details: string;
  domainName?: string;
}

export interface DeploymentItem {
  id: string;
  userId: string;
  hostingId: string;
  projectName: string;
  repoUrl: string;
  branch: string;
  status: 'deployed' | 'building' | 'failed';
  environment: 'production' | 'staging';
  commitMsg: string;
  commitHash: string;
  deployedAt: string;
  customDomain: string;
  envVars: { key: string; value: string }[];
  logs: string[];
}

export interface InvoiceItem {
  id: string;
  userId: string;
  date: string;
  amountSubtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  currency: 'INR' | 'USD';
  status: 'paid' | 'pending' | 'refunded';
  description: string;
  paymentMethod: string;
  transactionId: string;
  gstin?: string;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size: string;
  modified: string;
}

export interface DatabaseUser {
  id: string;
  hostingId: string;
  name: string;
  user: string;
  sizeMb: number;
  type: string;
}

export interface CronJob {
  id: string;
  hostingId: string;
  schedule: string;
  command: string;
  status: 'Active' | 'Paused';
}

export interface Coupon {
  code: string;
  discountPct: number;
  validTill: string;
  maxDiscount: number;
}

export interface AdminStats {
  totalUsers: number;
  monthlyRevenue: number;
  activeOrders: number;
  hostingAccounts: number;
  domainsRegistered: number;
  openTickets: number;
  serverUptimePct: number;
  avgResponseMs: number;
}
