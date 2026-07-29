import { HostingPlan } from '../types';

export const HOSTING_PLANS: HostingPlan[] = [
  {
    id: 'single',
    name: 'Single',
    category: 'web',
    originalPriceINR: 399,
    monthlyPriceINR: 69,
    monthlyPriceUSD: 0.89,
    renewalPriceINR: 289,
    renewalPriceUSD: 3.49,
    discountTag: 'SAVE 82%',
    websites: '1 website',
    storage: '10 GB of SSD storage',
    bandwidth: '100 GB Bandwidth',
    freeDomain: false,
    freeSSL: true,
    freeEmail: '1 mailbox / site - 1 yr. free',
    mailboxes: '1 mailbox / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    features: [
      '1 website',
      '10 GB of SSD storage',
      '1 mailbox / site - 1 yr. free',
      '5 vibe coding credits',
      'Free Unlimited SSL Certificate',
      'LiteSpeed Web Server with LSCache',
      'Weekly Automatic Backups'
    ],
    specs: {
      ram: '1GB RAM',
      cpu: '1 vCPU Core',
      nvmeSSD: false,
      dailyBackup: false,
      sshAccess: false,
      gitNodeDocker: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    category: 'web',
    badge: 'MOST POPULAR',
    popular: true,
    originalPriceINR: 599,
    monthlyPriceINR: 139,
    monthlyPriceUSD: 1.79,
    renewalPriceINR: 449,
    renewalPriceUSD: 5.99,
    discountTag: 'SAVE 77%',
    websites: '3 websites',
    storage: '20 GB of SSD storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '2 mailboxes / site - 1 yr. free',
    mailboxes: '2 mailboxes / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    features: [
      '3 websites',
      '20 GB of SSD storage',
      '2 mailboxes / site - 1 yr. free',
      '5 vibe coding credits',
      'Free domain for 1 year',
      'WordPress sites maintained for you',
      'Free email marketing for 1 year'
    ],
    specs: {
      ram: '2GB RAM',
      cpu: '2 vCPU Cores',
      nvmeSSD: false,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
  {
    id: 'business',
    name: 'Business',
    category: 'web',
    badge: 'PERFORMANCE PACK',
    originalPriceINR: 699,
    monthlyPriceINR: 199,
    monthlyPriceUSD: 2.49,
    renewalPriceINR: 649,
    renewalPriceUSD: 8.99,
    discountTag: 'SAVE 71%',
    websites: '50 websites',
    storage: '50 GB of NVMe storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '5 mailboxes / site - 1 yr. free',
    mailboxes: '5 mailboxes / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    webApps: '5 Web Apps',
    features: [
      '50 websites',
      '50 GB of NVMe storage',
      '5 mailboxes / site - 1 yr. free',
      '5 vibe coding credits',
      'Free domain for 1 year',
      '5 Web Apps',
      'Build an ecommerce site with AI',
      'Daily & on-demand backups',
      'AI Agent for WordPress (Free)',
      'Create ready-to-go WordPress sites with AI',
      'Free CDN for maximum speed',
      'WordPress Multisite support'
    ],
    specs: {
      ram: '4GB RAM',
      cpu: '4 vCPU Cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
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
    websites: '100 websites',
    storage: '100 GB of NVMe storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '10 mailboxes / site - 1 yr. free',
    mailboxes: '10 mailboxes / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    webApps: '10 Web Apps',
    features: [
      '100 websites',
      '100 GB of NVMe storage',
      '10 mailboxes / site - 1 yr. free',
      '5 vibe coding credits',
      'Free domain for 1 year',
      '4 CPU cores',
      '4 GB RAM',
      '2M inodes',
      '10 Web Apps'
    ],
    specs: {
      ram: '4 GB RAM',
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
    websites: '100 websites',
    storage: '200 GB of NVMe storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '10 mailboxes / site - 1 yr. free',
    mailboxes: '10 mailboxes / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    webApps: '10 Web Apps',
    features: [
      '100 websites',
      '200 GB of NVMe storage',
      '10 mailboxes / site - 1 yr. free',
      '5 vibe coding credits',
      'Free domain for 1 year',
      '5 CPU cores',
      '6 GB RAM',
      '3M inodes',
      '10 Web Apps'
    ],
    specs: {
      ram: '6 GB RAM',
      cpu: '5 CPU cores',
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
    websites: '100 websites',
    storage: '300 GB of NVMe storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: '10 mailboxes / site - 1 yr. free',
    mailboxes: '10 mailboxes / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    webApps: '10 Web Apps',
    features: [
      '100 websites',
      '300 GB of NVMe storage',
      '10 mailboxes / site - 1 yr. free',
      '5 vibe coding credits',
      'Free domain for 1 year',
      '6 CPU cores',
      '12 GB RAM',
      '4M inodes',
      '10 Web Apps',
      'Priority expert support 24/7',
      'Handle peak traffic with power boost',
      'Dedicated IP address'
    ],
    specs: {
      ram: '12 GB RAM',
      cpu: '6 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  },
  {
    id: 'agency-plans',
    name: 'Agency Plans',
    category: 'cloud',
    badge: 'AGENCY & ENTERPRISE',
    originalPriceINR: 3999,
    monthlyPriceINR: 1999,
    monthlyPriceUSD: 24.99,
    renewalPriceINR: 3499,
    renewalPriceUSD: 44.99,
    discountTag: '50% OFF',
    websites: 'Up to 300 websites',
    storage: 'Up to 700 GB of NVMe storage',
    bandwidth: 'Unlimited Bandwidth',
    freeDomain: true,
    freeSSL: true,
    freeEmail: 'Up to 30 mailboxes / site - 1 yr. free',
    mailboxes: 'Up to 30 mailboxes / site - 1 yr. free',
    vibeCredits: '5 vibe coding credits',
    webApps: 'Web Apps',
    features: [
      'Up to 300 websites',
      'Up to 700 GB of NVMe storage',
      'Up to 30 mailboxes / site - 1 yr. free',
      '5 vibe coding credits',
      'Free domain for 1 year',
      'Up to 10 CPU cores',
      'Up to 30 GB RAM',
      'Up to 8M inodes',
      'Web Apps',
      'Full website isolation',
      'Access sharing per site'
    ],
    specs: {
      ram: '30 GB RAM',
      cpu: '10 CPU cores',
      nvmeSSD: true,
      dailyBackup: true,
      sshAccess: true,
      gitNodeDocker: true
    }
  }
];

export const VPS_PLANS = [
  { name: 'Cloud VPS 1', ram: '4GB', vcpu: '2 Cores', storage: '50GB NVMe', bandwidth: '4TB', priceINR: 799, priceUSD: 9.99 },
  { name: 'Cloud VPS 2', ram: '8GB', vcpu: '4 Cores', storage: '100GB NVMe', bandwidth: '8TB', priceINR: 1499, priceUSD: 18.99 },
  { name: 'Cloud VPS 3', ram: '16GB', vcpu: '8 Cores', storage: '200GB NVMe', bandwidth: '12TB', priceINR: 2899, priceUSD: 36.99 },
  { name: 'Cloud VPS 4', ram: '32GB', vcpu: '16 Cores', storage: '400GB NVMe', bandwidth: '16TB', priceINR: 4999, priceUSD: 64.99 }
];

export const DEDICATED_PLANS = [
  { name: 'Bare Metal Entry', ram: '32GB DDR5', cpu: 'Intel Xeon E-2388', storage: '1TB NVMe RAID-1', priceINR: 2999, priceUSD: 39.99 },
  { name: 'Bare Metal Pro', ram: '64GB DDR5', cpu: 'AMD EPYC 7702P', storage: '2x 2TB NVMe RAID-1', priceINR: 6999, priceUSD: 89.99 }
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
