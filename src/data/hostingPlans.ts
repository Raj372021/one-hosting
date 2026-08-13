import { HostingPlan } from '../types';

export const HOSTING_PLANS: HostingPlan[] = [
  // 1. WEB HOSTING PLANS
  {
    id: 'single',
    name: 'Single Web Hosting',
    category: 'web',
    originalPriceINR: 399,
    monthlyPriceINR: 69,
    monthlyPriceUSD: 0.89,
    renewalPriceINR: 289,
    renewalPriceUSD: 3.49,
    discountTag: 'SAVE 82%',
    websites: '1 website',
    storage: '10 GB Ultra-Fast NVMe SSD',
    bandwidth: '100 GB Bandwidth',
    freeDomain: false,
    freeSSL: true,
    freeEmail: '1 Business Mailbox (1 yr. free)',
    mailboxes: '1 Business Mailbox',
    vibeCredits: '10 AI Builder Credits',
    features: [
      '1 Website',
      '10 GB NVMe SSD Super-Fast Storage',
      '1 Business Mailbox (Free 1st Year)',
      '10 AI Website Builder Credits',
      'Free Unlimited SSL Certificate',
      'LiteSpeed Enterprise Web Server + LSCache',
      'Weekly Automatic Backups & 1-Click Restore',
      '99.99% Guaranteed Uptime SLA',
      'Free DDoS Protection & AI Security Shield',
      '1-Click WordPress & PHP Auto-Installer'
    ],
    specs: {
      ram: '1.5GB DDR5 RAM',
      cpu: '1 vCPU Core',
      nvmeSSD: true,
      dailyBackup: false,
      sshAccess: false,
      gitNodeDocker: false
    }
  },
  {
    id: 'premium',
    name: 'Premium Web Hosting',
    category: 'web',
    badge: 'MOST POPULAR',
    popular: true,
    originalPriceINR: 599,
    monthlyPriceINR: 139,
    monthlyPriceUSD: 1.79,
    renewalPriceINR: 449,
    renewalPriceUSD: 5.99,
    discountTag: 'SAVE 77%',
    websites: '100 websites',
    storage: '100 GB Ultra-Fast NVMe SSD',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '10 Free Mailboxes / site',
    mailboxes: '10 Free Mailboxes / site',
    vibeCredits: '50 AI Builder Credits',
    features: [
      '100 Websites',
      '100 GB Gen4 NVMe SSD Storage',
      'FREE Custom Domain Name (.com, .in, .shop) for 1 Year',
      'FREE Unlimited SSL Certificates for All Websites',
      '10 Free Business Email Addresses per site',
      '50 AI Website & App Builder Credits',
      'Free Global CDN for 3x Faster Page Speed',
      'LiteSpeed + Object Cache Acceleration',
      'Daily Automatic Backups & On-Demand Snapshots',
      'E-commerce & WooCommerce Ready with Auto-Setup',
      'Free Unlimited Website Migration with Zero Downtime',
      'Managed WordPress Auto-Updates & Security'
    ],
    specs: {
      ram: '3GB DDR5 RAM',
      cpu: '2 vCPU Cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
  {
    id: 'business',
    name: 'Business Pro Hosting',
    category: 'web',
    badge: 'PERFORMANCE PACK',
    originalPriceINR: 699,
    monthlyPriceINR: 199,
    monthlyPriceUSD: 2.49,
    renewalPriceINR: 649,
    renewalPriceUSD: 8.99,
    discountTag: 'SAVE 71%',
    websites: '200 websites',
    storage: '200 GB NVMe Gen4 Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '50 Free Mailboxes / site',
    mailboxes: '50 Free Mailboxes / site',
    vibeCredits: '100 AI Builder Credits',
    webApps: '10 Web Apps / SaaS',
    features: [
      '200 Websites',
      '200 GB NVMe Gen4 Ultra-Fast Storage',
      'FREE Custom Domain Name (.com, .in, .ai, .shop)',
      'FREE Unlimited SSL Certificates',
      '50 Business Email Mailboxes per site',
      '100 AI Agent Builder Credits',
      '10 Full-Stack Web Apps / SaaS Containers',
      'Free Global CDN & Dedicated IP Ready',
      'LiteSpeed Enterprise + Redis Object Caching',
      'Daily Backups & 1-Click Disaster Recovery',
      'AI Cyber Security & Real-Time Malware Scanner',
      'Priority 24/7 Expert Technical Support via Chat & WhatsApp'
    ],
    specs: {
      ram: '6GB DDR5 RAM',
      cpu: '4 vCPU Cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
  {
    id: 'ultra-business',
    name: 'Ultra Turbo Pro',
    category: 'web',
    badge: 'MAX SPEED & POWER',
    originalPriceINR: 999,
    monthlyPriceINR: 299,
    monthlyPriceUSD: 3.79,
    renewalPriceINR: 899,
    renewalPriceUSD: 11.99,
    discountTag: 'SAVE 70%',
    websites: 'UNLIMITED websites',
    storage: '300 GB NVMe SSD Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'UNLIMITED Mailboxes',
    mailboxes: 'UNLIMITED Mailboxes',
    vibeCredits: 'UNLIMITED AI Builder Credits',
    webApps: '25 Web Apps',
    features: [
      'UNLIMITED Websites',
      '300 GB Ultra NVMe Gen4 Storage',
      'FREE Premium Domain Name (.com, .in, .ai) for 1 Year',
      'FREE Unlimited Auto-Renewing SSL Certificates',
      'UNLIMITED Business Email Addresses',
      'UNLIMITED AI Website Builder Credits',
      '25 Full-Stack Web Apps / Node.js / Python Containers',
      'Free Dedicated IP Address included',
      'Boost Mode: Handles 500,000+ Visitors / Month',
      'VIP 24/7 Priority Support & Direct WhatsApp Desk'
    ],
    specs: {
      ram: '8GB DDR5 RAM',
      cpu: '6 vCPU Cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },

  // 2. WORDPRESS HOSTING PLANS
  {
    id: 'wp-starter',
    name: 'WordPress Starter',
    category: 'wordpress',
    originalPriceINR: 499,
    monthlyPriceINR: 99,
    monthlyPriceUSD: 1.29,
    renewalPriceINR: 349,
    renewalPriceUSD: 4.49,
    discountTag: 'SAVE 80%',
    websites: '1 WordPress site',
    storage: '25 GB NVMe Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '5 Mailboxes',
    features: [
      '1 Managed WordPress Site',
      '25 GB Ultra-Fast NVMe Storage',
      'FREE Domain Name for 1 Year',
      'FREE Unlimited SSL & Auto-Updates',
      'WordPress AI Content & Theme Generator',
      'LiteSpeed Cache (LSCWP) Plugin pre-configured',
      'Automatic Daily Security Scans & Backups'
    ],
    specs: {
      ram: '2GB RAM',
      cpu: '2 vCPU Cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: false
    }
  },
  {
    id: 'wp-business',
    name: 'Managed WP Pro',
    category: 'wordpress',
    badge: 'BEST FOR E-COMMERCE',
    popular: true,
    originalPriceINR: 899,
    monthlyPriceINR: 249,
    monthlyPriceUSD: 3.19,
    renewalPriceINR: 699,
    renewalPriceUSD: 8.99,
    discountTag: 'SAVE 72%',
    websites: '100 WordPress sites',
    storage: '150 GB NVMe Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'Free Mailboxes',
    features: [
      '100 Managed WordPress / WooCommerce Sites',
      '150 GB Gen4 NVMe Storage',
      'FREE Domain + Free Unlimited SSL',
      'WooCommerce Auto-Optimization & Payment Gateways',
      'Object Cache Pro (Redis) Included Free',
      'Staging Environment for Testing',
      'WP-CLI, Git Integration & SSH Access'
    ],
    specs: {
      ram: '4GB DDR5 RAM',
      cpu: '4 vCPU Cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },

  // 3. CLOUD HOSTING PLANS
  {
    id: 'cloud-startup',
    name: 'Cloud Startup',
    category: 'cloud',
    badge: 'CLOUD ENTRY',
    originalPriceINR: 1699,
    monthlyPriceINR: 599,
    monthlyPriceUSD: 7.49,
    renewalPriceINR: 1599,
    renewalPriceUSD: 19.99,
    discountTag: '65% OFF',
    websites: '300 websites',
    storage: '150 GB NVMe Gen4 Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '100 Mailboxes / site',
    mailboxes: '100 Mailboxes / site',
    vibeCredits: '100 AI Builder Credits',
    webApps: '15 Web Apps',
    features: [
      '300 Websites',
      '150 GB Gen4 NVMe Storage',
      'Dedicated Cloud Server Resources (No Sharing)',
      'FREE Custom Domain Name for 1 Year',
      'FREE Unlimited SSL Certificates',
      '4 vCPU Cores & 6 GB DDR5 RAM',
      'Handles 1,000,000+ Requests / Day',
      'Free Global CDN & Anycast DNS',
      'Daily Automated Backups & 1-Click Restore',
      '24/7 Priority Cloud Support Desk'
    ],
    specs: {
      ram: '6 GB DDR5 RAM',
      cpu: '4 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
  {
    id: 'cloud-professional',
    name: 'Cloud Professional',
    category: 'cloud',
    badge: 'MOST POPULAR CLOUD',
    popular: true,
    originalPriceINR: 3499,
    monthlyPriceINR: 899,
    monthlyPriceUSD: 11.49,
    renewalPriceINR: 3299,
    renewalPriceUSD: 39.99,
    discountTag: '74% OFF',
    websites: '500 websites',
    storage: '300 GB NVMe Gen4 Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'Free Mailboxes',
    mailboxes: 'Free Mailboxes',
    vibeCredits: '200 AI Builder Credits',
    webApps: '30 Web Apps',
    features: [
      '500 Websites',
      '300 GB Gen4 NVMe Enterprise Storage',
      'FREE Premium Domain for 1 Year',
      'FREE Dedicated IP Address Included',
      '6 vCPU Cores & 12 GB DDR5 RAM',
      'In-Memory Redis & Memcached Caching',
      'Handles Peak High Traffic smoothly',
      'Daily Backups & On-Demand Cloud Snapshots',
      'Guaranteed 99.99% Uptime SLA',
      '24/7 VIP Priority Cloud Engineers'
    ],
    specs: {
      ram: '12 GB DDR5 RAM',
      cpu: '6 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
  {
    id: 'cloud-enterprise',
    name: 'Cloud Enterprise',
    category: 'cloud',
    badge: 'MAXIMUM POWER',
    originalPriceINR: 5499,
    monthlyPriceINR: 1899,
    monthlyPriceUSD: 23.99,
    renewalPriceINR: 5199,
    renewalPriceUSD: 64.99,
    discountTag: '65% OFF',
    websites: 'UNLIMITED websites',
    storage: '600 GB NVMe Gen4 Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'UNLIMITED Mailboxes',
    mailboxes: 'UNLIMITED Mailboxes',
    vibeCredits: 'UNLIMITED AI Builder Credits',
    webApps: '50 Web Apps',
    features: [
      'UNLIMITED Websites',
      '600 GB Gen4 NVMe High-Speed Storage',
      'FREE Domain + Free Dedicated IP Address',
      '10 vCPU Cores & 24 GB DDR5 RAM',
      '20 Gbps High-Bandwidth Redundant Network',
      'AI Cyber Security Guard & Cloud DDoS Shield',
      'Free Staging & Instant Cloning Engine',
      'Dedicated Account Manager & 24/7 WhatsApp Tech Desk'
    ],
    specs: {
      ram: '24 GB DDR5 RAM',
      cpu: '10 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },

  // 4. RESELLER & AGENCY HOSTING
  {
    id: 'agency-plans',
    name: 'Agency & Reseller Cloud',
    category: 'reseller',
    badge: 'AGENCY & ENTERPRISE',
    originalPriceINR: 3999,
    monthlyPriceINR: 1999,
    monthlyPriceUSD: 24.99,
    renewalPriceINR: 3499,
    renewalPriceUSD: 44.99,
    discountTag: '50% OFF',
    websites: '1,000 Client Accounts',
    storage: '1 TB NVMe Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'UNLIMITED Mailboxes',
    mailboxes: 'UNLIMITED Mailboxes',
    vibeCredits: 'UNLIMITED AI Builder Credits',
    webApps: '100 Web Apps',
    features: [
      'Host Up to 1,000 Separate Client Accounts',
      '1 TB Gen4 NVMe Storage',
      'White-Label Control Panel for Your Clients',
      'FREE Domain for 1 Year + Free Auto SSL',
      '16 vCPU Cores & 32 GB DDR5 RAM',
      'Complete Website & Account Isolation',
      'Client Access Management per Website',
      'Integrated WHMCS / Billing Module Ready'
    ],
    specs: {
      ram: '32 GB DDR5 RAM',
      cpu: '16 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },

  // 5. AI AGENT & SAAS HOSTING
  {
    id: 'ai-agent-pro',
    name: 'AI Agent & SaaS Host',
    category: 'ai_agent',
    badge: 'AI APP SPECIALIST',
    popular: true,
    originalPriceINR: 1499,
    monthlyPriceINR: 499,
    monthlyPriceUSD: 6.29,
    renewalPriceINR: 1299,
    renewalPriceUSD: 16.49,
    discountTag: '66% OFF',
    websites: '50 AI Apps & SaaS',
    storage: '100 GB NVMe Storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'Free Mailboxes',
    vibeCredits: '500 AI Agent Credits',
    features: [
      '50 Full-Stack AI SaaS Apps / Web Containers',
      '100 GB Gen4 NVMe Storage',
      'Built-in Gemini 1.5/2.5 & OpenAI API Proxy Server',
      'FREE Domain + Free Unlimited SSL',
      '500 AI Agent Builder Credits',
      'Auto GitHub Commit-to-Deploy CI/CD Pipeline',
      'Live Server Logs & Environment Variable Secrets Vault'
    ],
    specs: {
      ram: '8 GB DDR5 RAM',
      cpu: '4 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  }
];

export const VPS_PLANS = [
  { name: 'Cloud VPS 1', ram: '4GB DDR5', vcpu: '2 Cores', storage: '80GB NVMe', bandwidth: '4TB', priceINR: 599, priceUSD: 7.49, discount: 'SAVE 50%' },
  { name: 'Cloud VPS 2', nameBadge: 'MOST POPULAR', ram: '8GB DDR5', vcpu: '4 Cores', storage: '160GB NVMe', bandwidth: '8TB', priceINR: 1199, priceUSD: 14.99, discount: 'SAVE 60%' },
  { name: 'Cloud VPS 3', ram: '16GB DDR5', vcpu: '8 Cores', storage: '320GB NVMe', bandwidth: '12TB', priceINR: 2199, priceUSD: 27.99, discount: 'SAVE 55%' },
  { name: 'Cloud VPS 4', ram: '32GB DDR5', vcpu: '16 Cores', storage: '640GB NVMe', bandwidth: '16TB', priceINR: 3999, priceUSD: 49.99, discount: 'SAVE 50%' }
];

export const DEDICATED_PLANS = [
  { name: 'Bare Metal Entry', ram: '32GB DDR5', cpu: 'Intel Xeon E-2388 (8C/16T)', storage: '1TB NVMe RAID-1', bandwidth: '20TB @ 10Gbps', priceINR: 2999, priceUSD: 39.99, discount: 'BEST VALUE' },
  { name: 'Bare Metal Pro', nameBadge: 'HIGH POWER', ram: '64GB DDR5', cpu: 'AMD EPYC 7702P (64C/128T)', storage: '2x 2TB NVMe RAID-1', bandwidth: '50TB @ 10Gbps', priceINR: 6999, priceUSD: 89.99, discount: '60% OFF' },
  { name: 'Bare Metal Enterprise', ram: '128GB DDR5', cpu: 'Dual AMD EPYC 9654 (192C/384T)', storage: '4x 3.84TB NVMe RAID-10', bandwidth: '100TB Unmetered @ 20Gbps', priceINR: 12999, priceUSD: 159.99, discount: 'MAX POWER' }
];

export interface DomainPricingItem {
  tld: string;
  registerINR: number;
  renewINR: number;
  transferINR: number;
  originalINR: number;
  discountTag: string;
  category: 'Popular TLDs' | 'India & Asia' | 'Tech & AI' | 'Business & Shop' | 'Cheap / Budget TLDs';
  popular: boolean;
  features: string[];
}

export const DOMAIN_PRICING: DomainPricingItem[] = [
  {
    tld: '.in',
    registerINR: 149,
    renewINR: 799,
    transferINR: 499,
    originalINR: 999,
    discountTag: 'SAVE 85% (MOST POPULAR)',
    category: 'India & Asia',
    popular: true,
    features: ['Free Privacy Protection', 'Free DNS Records', 'Free Email Forwarding', 'Theft Protection Lock']
  },
  {
    tld: '.com',
    registerINR: 499,
    renewINR: 1199,
    transferINR: 899,
    originalINR: 1399,
    discountTag: 'SAVE 65%',
    category: 'Popular TLDs',
    popular: true,
    features: ['Free Privacy Protection', 'Free DNS Records', 'Free Email Forwarding', 'Domain Lock']
  },
  {
    tld: '.co.in',
    registerINR: 149,
    renewINR: 499,
    transferINR: 399,
    originalINR: 799,
    discountTag: 'SAVE 80%',
    category: 'India & Asia',
    popular: false,
    features: ['Free Privacy Protection', 'Free DNS Records', 'India Business Identity']
  },
  {
    tld: '.shop',
    registerINR: 79,
    renewINR: 1299,
    transferINR: 1199,
    originalINR: 1499,
    discountTag: 'SAVE 95%',
    category: 'Business & Shop',
    popular: true,
    features: ['E-Commerce Standard', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.online',
    registerINR: 79,
    renewINR: 1199,
    transferINR: 1099,
    originalINR: 1399,
    discountTag: 'SAVE 95%',
    category: 'Cheap / Budget TLDs',
    popular: true,
    features: ['Super Low Price', 'Free Privacy Protection', 'Free DNS Management']
  },
  {
    tld: '.site',
    registerINR: 79,
    renewINR: 1099,
    transferINR: 999,
    originalINR: 1299,
    discountTag: 'SAVE 95%',
    category: 'Cheap / Budget TLDs',
    popular: false,
    features: ['Universal Website TLD', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.store',
    registerINR: 79,
    renewINR: 1499,
    transferINR: 1399,
    originalINR: 1599,
    discountTag: 'SAVE 95%',
    category: 'Business & Shop',
    popular: false,
    features: ['Online Store Identity', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.tech',
    registerINR: 99,
    renewINR: 1299,
    transferINR: 1199,
    originalINR: 1499,
    discountTag: 'SAVE 93%',
    category: 'Tech & AI',
    popular: true,
    features: ['Great for Developers', 'Free Privacy Protection', 'Free DNS Management']
  },
  {
    tld: '.xyz',
    registerINR: 99,
    renewINR: 499,
    transferINR: 499,
    originalINR: 699,
    discountTag: 'SAVE 85%',
    category: 'Cheap / Budget TLDs',
    popular: true,
    features: ['Web3 & Next-Gen', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.info',
    registerINR: 149,
    renewINR: 1199,
    transferINR: 1099,
    originalINR: 1299,
    discountTag: 'SAVE 88%',
    category: 'Cheap / Budget TLDs',
    popular: false,
    features: ['Information & Portals', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.me',
    registerINR: 149,
    renewINR: 999,
    transferINR: 899,
    originalINR: 1099,
    discountTag: 'SAVE 86%',
    category: 'Popular TLDs',
    popular: false,
    features: ['Personal Portfolio & Blog', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.cloud',
    registerINR: 199,
    renewINR: 1299,
    transferINR: 1199,
    originalINR: 1499,
    discountTag: 'SAVE 87%',
    category: 'Tech & AI',
    popular: false,
    features: ['Cloud Services & SaaS', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.digital',
    registerINR: 199,
    renewINR: 1399,
    transferINR: 1299,
    originalINR: 1499,
    discountTag: 'SAVE 87%',
    category: 'Business & Shop',
    popular: false,
    features: ['Digital Agencies & Media', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.dev',
    registerINR: 499,
    renewINR: 1399,
    transferINR: 1199,
    originalINR: 1499,
    discountTag: 'SAVE 66%',
    category: 'Tech & AI',
    popular: true,
    features: ['HTTPS Enforced by Default', 'Google Registry TLD', 'Free Privacy Protection']
  },
  {
    tld: '.app',
    registerINR: 499,
    renewINR: 1399,
    transferINR: 1199,
    originalINR: 1499,
    discountTag: 'SAVE 66%',
    category: 'Tech & AI',
    popular: false,
    features: ['HTTPS Enforced by Default', 'Mobile & Web Apps', 'Free Privacy Protection']
  },
  {
    tld: '.org',
    registerINR: 799,
    renewINR: 1199,
    transferINR: 999,
    originalINR: 1299,
    discountTag: 'SAVE 38%',
    category: 'Popular TLDs',
    popular: false,
    features: ['Non-Profit & Community', 'Free Privacy Protection', 'Free DNS Management']
  },
  {
    tld: '.net',
    registerINR: 799,
    renewINR: 1299,
    transferINR: 1099,
    originalINR: 1399,
    discountTag: 'SAVE 42%',
    category: 'Popular TLDs',
    popular: false,
    features: ['Network & Infrastructure', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.co',
    registerINR: 999,
    renewINR: 1899,
    transferINR: 1699,
    originalINR: 2099,
    discountTag: 'SAVE 52%',
    category: 'Popular TLDs',
    popular: false,
    features: ['Company Short Domain', 'Free Privacy Protection', 'Free DNS Records']
  },
  {
    tld: '.io',
    registerINR: 2999,
    renewINR: 3799,
    transferINR: 3499,
    originalINR: 4199,
    discountTag: 'SAVE 28%',
    category: 'Tech & AI',
    popular: true,
    features: ['SaaS & Dev Preferred', 'Free Privacy Protection', 'Free DNS Management']
  },
  {
    tld: '.ai',
    registerINR: 4799,
    renewINR: 6999,
    transferINR: 4799,
    originalINR: 8499,
    discountTag: 'SAVE 43% (BEST PRICE)',
    category: 'Tech & AI',
    popular: true,
    features: ['#1 Choice for AI Startups', 'Free Privacy Protection', 'Instant DNS Propagation']
  }
];

export const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Founder & CTO at FinEdge',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    content: 'Migrating 45 client sites to OneHost cut our loading times by 68%. The automated SSL, Let’s Encrypt auto-renew, and instant Git deployments are unmatched.',
    rating: 5,
    domain: 'finedge.tech'
  },
  {
    name: 'Marcus Vance',
    role: 'Lead Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    content: 'The Cloud VPS SSH terminal and built-in Node/Docker deployment manager gave our engineering team total control. Outstanding 99.99% uptime SLA.',
    rating: 5,
    domain: 'vancestudio.io'
  },
  {
    name: 'Ananya Reddy',
    role: 'E-commerce Operator',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    content: 'During our Diwali flash sale, our store handled over 80,000 visitors smoothly. The Redis object caching and NVMe speed kept response times under 20ms.',
    rating: 5,
    domain: 'desicrafts.in'
  }
];

export const FAQS = [
  {
    q: 'How fast is website migration to OneHost?',
    a: 'Our automated migration tool and dedicated DevOps team transfer your websites, databases, and emails within 15 minutes with zero downtime guarantee.'
  },
  {
    q: 'Does OneHost include free SSL and Domain name?',
    a: 'Yes! Every Premium, Business, and Developer plan includes a free annual domain name registration (.com, .in, or .ai) and unlimited automated Let’s Encrypt SSL certificates.'
  },
  {
    q: 'Can I deploy Node.js, Next.js, and Docker applications?',
    a: 'Absolutely. Our Developer Cloud VPS and Business Hosting support Node.js, Python, Ruby, Go, Docker containers, and 1-click GitHub repository auto-builds.'
  },
  {
    q: 'What payment methods are supported on OneHost?',
    a: 'We accept Razorpay, UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking (All Indian & Global Banks), Wallet, and automated GST Invoicing.'
  },
  {
    q: 'Where are the OneHost datacenters located?',
    a: 'We operate high-speed tier-4 datacenters in Asia (Mumbai, Singapore, Tokyo), US East/West, Europe (Frankfurt, London), and Australia with 10Gbps redundant network uplinks.'
  }
];
