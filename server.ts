import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dnsPromises from 'node:dns/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory Database for OneHost SaaS
let db = {
  users: [
    {
      id: 'usr_1',
      name: 'Alex Rivera',
      email: 'alex@onehost.cloud',
      role: 'user', // 'user' | 'admin'
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      walletBalance: 2450,
      verified: true,
      twoFactorEnabled: true,
      createdAt: '2025-01-15T10:30:00Z',
      phone: '+91 98765 43210',
      gstin: '27AABCU9603R1ZM'
    },
    {
      id: 'usr_admin',
      name: 'Super Admin',
      email: 'admin@onehost.cloud',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      walletBalance: 50000,
      verified: true,
      twoFactorEnabled: true,
      createdAt: '2024-11-01T08:00:00Z',
      phone: '+91 90000 00000',
      gstin: '27ADMIN9603R1ZX'
    }
  ],
  hostingAccounts: [
    {
      id: 'host_101',
      userId: 'usr_1',
      domain: 'techventure.in',
      planName: 'Business Hosting',
      planType: 'business', // starter, premium, business, developer, vps, dedicated
      status: 'active', // active, suspended, provisioning
      serverIp: '185.199.108.153',
      datacenter: 'Mumbai, India (asia-south1)',
      monthlyPrice: 499,
      diskUsedMb: 14320,
      diskTotalMb: 102400,
      bandwidthUsedGb: 284,
      bandwidthTotalGb: 1000,
      cpuUsagePct: 24,
      ramUsagePct: 42,
      phpVersion: '8.3',
      nodeVersion: '20.11.0',
      sslActive: true,
      sslExpires: '2026-12-31',
      createdAt: '2025-02-10T14:20:00Z',
      renewAt: '2026-02-10T14:20:00Z',
      autoRenew: true
    },
    {
      id: 'host_102',
      userId: 'usr_1',
      domain: 'devstudio.ai',
      planName: 'Developer Cloud VPS',
      planType: 'developer',
      status: 'active',
      serverIp: '143.198.24.91',
      datacenter: 'Singapore (asia-southeast1)',
      monthlyPrice: 999,
      diskUsedMb: 45200,
      diskTotalMb: 256000,
      bandwidthUsedGb: 612,
      bandwidthTotalGb: 5000,
      cpuUsagePct: 18,
      ramUsagePct: 56,
      phpVersion: '8.3',
      nodeVersion: '22.2.0',
      sslActive: true,
      sslExpires: '2026-11-15',
      createdAt: '2025-03-01T09:15:00Z',
      renewAt: '2026-03-01T09:15:00Z',
      autoRenew: true
    }
  ],
  domains: [
    {
      id: 'dom_1',
      userId: 'usr_1',
      domainName: 'techventure.in',
      tld: '.in',
      status: 'active',
      registeredAt: '2025-02-10',
      expiresAt: '2026-02-10',
      autoRenew: true,
      privacyProtected: true,
      priceYear: 699,
      nameservers: ['ns1.onehost.cloud', 'ns2.onehost.cloud'],
      dnsRecords: [
        { id: 'dns_1', type: 'A', name: '@', value: '185.199.108.153', ttl: 3600 },
        { id: 'dns_2', type: 'CNAME', name: 'www', value: 'techventure.in', ttl: 3600 },
        { id: 'dns_3', type: 'MX', name: '@', value: 'mail.onehost.cloud', priority: 10, ttl: 3600 },
        { id: 'dns_4', type: 'TXT', name: '@', value: 'v=spf1 include:onehost.cloud ~all', ttl: 3600 }
      ]
    },
    {
      id: 'dom_2',
      userId: 'usr_1',
      domainName: 'devstudio.ai',
      tld: '.ai',
      status: 'active',
      registeredAt: '2025-03-01',
      expiresAt: '2026-03-01',
      autoRenew: true,
      privacyProtected: true,
      priceYear: 6999,
      nameservers: ['ns1.onehost.cloud', 'ns2.onehost.cloud'],
      dnsRecords: [
        { id: 'dns_5', type: 'A', name: '@', value: '143.198.24.91', ttl: 3600 },
        { id: 'dns_6', type: 'CNAME', name: 'api', value: 'devstudio.ai', ttl: 3600 }
      ]
    }
  ],
  deployments: [
    {
      id: 'dep_1',
      userId: 'usr_1',
      hostingId: 'host_102',
      projectName: 'DevStudio Next.js Portal',
      repoUrl: 'github.com/alexrivera/devstudio-portal',
      branch: 'main',
      status: 'deployed', // deployed, building, failed
      environment: 'production',
      commitMsg: 'feat: Add instant SSL auto-renewal and API rate limiters',
      commitHash: '7f3a9e1',
      deployedAt: '2026-07-27T18:42:10Z',
      customDomain: 'devstudio.ai',
      envVars: [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'DATABASE_URL', value: 'postgres://db_user:***@143.198.24.91:5432/devstudio' }
      ],
      logs: [
        ' [09:01:00] Cloning repository github.com/alexrivera/devstudio-portal (branch: main)...',
        ' [09:01:02] Installing dependencies with npm ci --prefer-offline...',
        ' [09:01:08] Running npm run build (Next.js 14.2 SSR compile)...',
        ' [09:01:14] Generating static pages (24/24)...',
        ' [09:01:18] Standalone build output optimized (38.4MB)',
        ' [09:01:20] Deploying container image to Cloud Edge Node: asia-southeast1-c...',
        ' [09:01:22] Provisioning Let’s Encrypt TLS Certificate for devstudio.ai...',
        ' [09:01:24] Healthcheck HTTP 200 OK passed.',
        ' [09:01:25] Deployment successfully completed in 25 seconds.'
      ]
    }
  ],
  invoices: [
    {
      id: 'INV-2026-8891',
      userId: 'usr_1',
      date: '2026-07-10T11:00:00Z',
      amountSubtotal: 499,
      gstRate: 0.18,
      gstAmount: 89.82,
      totalAmount: 588.82,
      currency: 'INR',
      status: 'paid', // paid, pending, refunded
      description: 'Business Hosting Renewal - 1 Month (techventure.in)',
      paymentMethod: 'Razorpay UPI (Google Pay)',
      transactionId: 'pay_P893120X91',
      gstin: '27AABCU9603R1ZM'
    },
    {
      id: 'INV-2026-7712',
      userId: 'usr_1',
      date: '2026-03-01T09:15:00Z',
      amountSubtotal: 6999,
      gstRate: 0.18,
      gstAmount: 1259.82,
      totalAmount: 8258.82,
      currency: 'INR',
      status: 'paid',
      description: 'Domain Registration - devstudio.ai (1 Year)',
      paymentMethod: 'Razorpay HDFC Net Banking',
      transactionId: 'pay_P102948A42',
      gstin: '27AABCU9603R1ZM'
    }
  ],
  tickets: [
    {
      id: 'TCK-4019',
      userId: 'usr_1',
      subject: 'Requesting SSH Key Access for Developer VPS',
      category: 'Technical',
      priority: 'High', // Low, Medium, High
      status: 'Open', // Open, In Progress, Resolved
      createdAt: '2026-07-28T07:30:00Z',
      updatedAt: '2026-07-28T08:15:00Z',
      messages: [
        {
          id: 'msg_1',
          sender: 'user',
          senderName: 'Alex Rivera',
          content: 'Hi support team, I would like to attach my public RSA key for root SSH access on my Cloud VPS instance (devstudio.ai).',
          timestamp: '2026-07-28T07:30:00Z'
        },
        {
          id: 'msg_2',
          sender: 'support',
          senderName: 'Siddharth (Senior DevOps)',
          content: 'Hello Alex! You can easily paste your SSH public key under "Hosting -> cPanel / SSH Settings" in your dashboard, or paste it here so we can inject it into ~/.ssh/authorized_keys for you.',
          timestamp: '2026-07-28T08:15:00Z'
        }
      ]
    }
  ],
  coupons: [
    { code: 'ONEHOST50', discountPct: 50, validTill: '2026-12-31', maxDiscount: 1000 },
    { code: 'FREEDOM2026', discountPct: 30, validTill: '2026-08-31', maxDiscount: 500 }
  ],
  files: {
    'host_101': [
      { name: 'public_html', type: 'folder', size: '-', modified: '2026-07-25 14:20' },
      { name: 'public_html/index.php', type: 'file', size: '2.4 KB', modified: '2026-07-27 10:11' },
      { name: 'public_html/style.css', type: 'file', size: '12.8 KB', modified: '2026-07-26 18:05' },
      { name: 'public_html/.htaccess', type: 'file', size: '840 B', modified: '2026-07-10 11:00' },
      { name: 'ssl', type: 'folder', size: '-', modified: '2026-07-01 09:00' }
    ],
    'host_102': [
      { name: 'app', type: 'folder', size: '-', modified: '2026-07-27 18:42' },
      { name: 'app/server.js', type: 'file', size: '4.1 KB', modified: '2026-07-27 18:42' },
      { name: 'app/package.json', type: 'file', size: '1.2 KB', modified: '2026-07-27 18:42' },
      { name: '.env', type: 'file', size: '310 B', modified: '2026-07-27 18:40' }
    ]
  },
  databases: [
    { id: 'db_1', hostingId: 'host_101', name: 'tech_wordpress_db', user: 'tech_wpuser', sizeMb: 42.5, type: 'MySQL 8.0' },
    { id: 'db_2', hostingId: 'host_102', name: 'devstudio_pg', user: 'dev_pgadmin', sizeMb: 128.4, type: 'PostgreSQL 16' }
  ],
  cronJobs: [
    { id: 'cron_1', hostingId: 'host_101', schedule: '0 0 * * *', command: 'php /home/public_html/wp-cron.php > /dev/null 2>&1', status: 'Active' }
  ]
};

// API ROUTES

// Auth endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role = 'user' } = req.body;
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || {
    id: role === 'admin' ? 'usr_admin' : 'usr_' + Date.now(),
    name: email ? email.split('@')[0].toUpperCase() : 'Valued Customer',
    email: email || 'customer@onehost.cloud',
    role: role,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    walletBalance: 1000,
    verified: true,
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
    phone: '+91 98765 00000',
    gstin: ''
  };
  res.json({ success: true, user, token: 'mock_jwt_token_' + Date.now() });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  res.json({ success: true, user: db.users[0] });
});

// Domain Availability Search
// Real Live Domain Availability Check via Global DNS Resolution with fast timeouts
async function checkLiveDomainDNS(domainName: string): Promise<{ isTaken: boolean; ns?: string[]; statusText: string }> {
  // Known registered tech/popular domains fallback list for instant lookup
  const knownTaken = ['google.com', 'onehost.com', 'amazon.com', 'facebook.com', 'github.com', 'microsoft.com', 'hostinger.com', 'godaddy.com', 'youtube.com', 'twitter.com'];
  if (knownTaken.includes(domainName)) {
    return { isTaken: true, statusText: 'TAKEN (Registered Domain)' };
  }

  const dnsTimeout = <T>(promise: Promise<T>, timeoutMs: number = 600): Promise<T | null> => {
    return Promise.race([
      promise,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs))
    ]);
  };

  try {
    const ns = await dnsTimeout(dnsPromises.resolveNs(domainName), 600);
    if (ns && Array.isArray(ns) && ns.length > 0) {
      return { isTaken: true, ns: ns.slice(0, 2), statusText: `TAKEN (Active NS: ${ns[0]})` };
    }
  } catch (e) {}

  try {
    const ips = await dnsTimeout(dnsPromises.resolve4(domainName), 600);
    if (ips && Array.isArray(ips) && ips.length > 0) {
      return { isTaken: true, statusText: `TAKEN (IP: ${ips[0]})` };
    }
  } catch (e) {}

  return { isTaken: false, statusText: 'AVAILABLE FOR REGISTRATION' };
}

app.post('/api/domains/check', async (req: Request, res: Response) => {
  try {
    const { query } = req.body || {};
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Domain query is required' });
    }

    const clean = query.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const parts = clean.split('.');
    const baseName = parts[0] || 'mysite';

    const tldPrices: Record<string, { price: number; original: number; tag: string }> = {
      '.in': { price: 149, original: 999, tag: 'SAVE 85%' },
      '.com': { price: 499, original: 1399, tag: 'SAVE 65%' },
      '.co.in': { price: 149, original: 799, tag: 'SAVE 80%' },
      '.shop': { price: 79, original: 1499, tag: 'SAVE 95%' },
      '.online': { price: 79, original: 1399, tag: 'SAVE 95%' },
      '.site': { price: 79, original: 1299, tag: 'SAVE 95%' },
      '.store': { price: 79, original: 1599, tag: 'SAVE 95%' },
      '.tech': { price: 99, original: 1499, tag: 'SAVE 93%' },
      '.xyz': { price: 99, original: 699, tag: 'SAVE 85%' },
      '.info': { price: 149, original: 1299, tag: 'SAVE 88%' },
      '.me': { price: 149, original: 1099, tag: 'SAVE 86%' },
      '.cloud': { price: 199, original: 1499, tag: 'SAVE 87%' },
      '.digital': { price: 199, original: 1499, tag: 'SAVE 87%' },
      '.dev': { price: 499, original: 1499, tag: 'SAVE 66%' },
      '.app': { price: 499, original: 1499, tag: 'SAVE 66%' },
      '.org': { price: 799, original: 1299, tag: 'SAVE 38%' },
      '.net': { price: 799, original: 1399, tag: 'SAVE 42%' },
      '.co': { price: 999, original: 2099, tag: 'SAVE 52%' },
      '.io': { price: 2999, original: 4199, tag: 'SAVE 28%' },
      '.ai': { price: 4799, original: 8499, tag: 'SAVE 43%' }
    };

    const tldList = Object.keys(tldPrices);

    // Perform real live DNS lookup in parallel with strict total timeout
    const results = await Promise.all(
      tldList.map(async (tld) => {
        const full = `${baseName}${tld}`;
        const meta = tldPrices[tld];
        const check = await checkLiveDomainDNS(full);

        return {
          domain: full,
          tld,
          available: !check.isTaken,
          price: meta.price,
          originalPrice: meta.original,
          discountTag: check.isTaken ? null : meta.tag,
          isPopular: ['.com', '.in', '.ai', '.tech', '.shop'].includes(tld),
          statusText: check.statusText,
          whoisNs: check.ns
        };
      })
    );

    return res.json({ success: true, search: baseName, results });
  } catch (err) {
    console.error('Error in /api/domains/check:', err);
    return res.status(500).json({ success: false, error: 'Failed to process domain check' });
  }
});

// Domain Management
app.get('/api/domains', (req: Request, res: Response) => {
  res.json({ success: true, domains: db.domains });
});

app.post('/api/domains/register', (req: Request, res: Response) => {
  const { domainName, tld, priceYear } = req.body;
  const newDomain = {
    id: 'dom_' + Date.now(),
    userId: 'usr_1',
    domainName,
    tld: tld || '.' + domainName.split('.').pop(),
    status: 'active',
    registeredAt: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    autoRenew: true,
    privacyProtected: true,
    priceYear: priceYear || 999,
    nameservers: ['ns1.onehost.cloud', 'ns2.onehost.cloud'],
    dnsRecords: [
      { id: 'dns_' + Date.now(), type: 'A', name: '@', value: '185.199.108.153', ttl: 3600 },
      { id: 'dns_' + (Date.now() + 1), type: 'CNAME', name: 'www', value: domainName, ttl: 3600 }
    ]
  };
  db.domains.push(newDomain);
  res.json({ success: true, domain: newDomain });
});

app.post('/api/domains/:id/dns', (req: Request, res: Response) => {
  const { id } = req.params;
  const { dnsRecords } = req.body;
  const dom = db.domains.find(d => d.id === id);
  if (dom && dnsRecords) {
    dom.dnsRecords = dnsRecords;
    return res.json({ success: true, dnsRecords: dom.dnsRecords });
  }
  res.status(404).json({ success: false, error: 'Domain not found' });
});

// Hosting Management & cPanel Action Simulation
app.get('/api/hosting', (req: Request, res: Response) => {
  res.json({ success: true, hostingAccounts: db.hostingAccounts });
});

app.post('/api/hosting/create', (req: Request, res: Response) => {
  const { domain, planType, planName, monthlyPrice } = req.body;
  const newHosting = {
    id: 'host_' + Date.now(),
    userId: 'usr_1',
    domain: domain || `site-${Date.now().toString().slice(-4)}.cloud`,
    planName: planName || 'Business Hosting',
    planType: planType || 'business',
    status: 'active',
    serverIp: `185.199.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`,
    datacenter: 'Mumbai, India (asia-south1)',
    monthlyPrice: monthlyPrice || 499,
    diskUsedMb: 120,
    diskTotalMb: 102400,
    bandwidthUsedGb: 2,
    bandwidthTotalGb: 1000,
    cpuUsagePct: 5,
    ramUsagePct: 12,
    phpVersion: '8.3',
    nodeVersion: '20.11.0',
    sslActive: true,
    sslExpires: '2026-12-31',
    createdAt: new Date().toISOString(),
    renewAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    autoRenew: true
  };
  db.hostingAccounts.push(newHosting);
  db.files[newHosting.id] = [
    { name: 'public_html', type: 'folder', size: '-', modified: '2026-07-28 09:00' },
    { name: 'public_html/index.html', type: 'file', size: '1.2 KB', modified: '2026-07-28 09:00' }
  ];
  res.json({ success: true, hosting: newHosting });
});

app.post('/api/hosting/:id/action', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, payload } = req.body;
  const host = db.hostingAccounts.find(h => h.id === id);

  if (!host) {
    return res.status(404).json({ success: false, error: 'Hosting account not found' });
  }

  if (action === 'suspend') host.status = 'suspended';
  if (action === 'activate') host.status = 'active';
  if (action === 'upgrade') {
    host.planName = payload?.planName || 'Developer Cloud VPS';
    host.diskTotalMb = 256000;
  }
  if (action === 'toggle-ssl') host.sslActive = !host.sslActive;

  res.json({ success: true, host });
});

// Deployments System
app.get('/api/deployments', (req: Request, res: Response) => {
  res.json({ success: true, deployments: db.deployments });
});

app.post('/api/deployments/deploy', (req: Request, res: Response) => {
  const { projectName, repoUrl, customDomain, environment = 'production', envVars = [] } = req.body;

  const newDep = {
    id: 'dep_' + Date.now(),
    userId: 'usr_1',
    hostingId: db.hostingAccounts[0]?.id || 'host_101',
    projectName: projectName || 'React E-Commerce Web App',
    repoUrl: repoUrl || 'github.com/onehost/sample-app',
    branch: 'main',
    status: 'deployed',
    environment,
    commitMsg: 'feat: Trigger instant production build & SSL handshake',
    commitHash: Math.random().toString(36).substring(2, 9),
    deployedAt: new Date().toISOString(),
    customDomain: customDomain || 'techventure.in',
    envVars,
    logs: [
      ' [09:00:01] Starting containerized build pipeline...',
      ' [09:00:03] Pulling source code from Git repository...',
      ' [09:00:07] Installing dependencies via pnpm install...',
      ' [09:00:12] Compiling assets with Vite & Tailwind CSS...',
      ' [09:00:15] Running security audit & zero-vulnerability checks...',
      ' [09:00:18] Generating edge CDN routing tables for ' + (customDomain || 'techventure.in'),
      ' [09:00:21] SSL Certificate issued successfully via Let’s Encrypt v3.',
      ' [09:00:22] Application successfully live on global edge CDN nodes!'
    ]
  };

  db.deployments.unshift(newDep);
  res.json({ success: true, deployment: newDep });
});

// Billing & Invoices
app.get('/api/billing/invoices', (req: Request, res: Response) => {
  res.json({ success: true, invoices: db.invoices });
});

app.post('/api/billing/create-order', (req: Request, res: Response) => {
  const { items, subtotal, couponCode, paymentMethod = 'Razorpay UPI' } = req.body;

  let discount = 0;
  if (couponCode && couponCode.toUpperCase() === 'ONEHOST50') {
    discount = Math.min(subtotal * 0.5, 1000);
  }

  const finalSub = Math.max(0, subtotal - discount);
  const gstAmount = Math.round(finalSub * 0.18 * 100) / 100;
  const totalAmount = Math.round((finalSub + gstAmount) * 100) / 100;

  const invoice = {
    id: 'INV-2026-' + Math.floor(1000 + Math.random() * 9000),
    userId: 'usr_1',
    date: new Date().toISOString(),
    amountSubtotal: finalSub,
    gstRate: 0.18,
    gstAmount,
    totalAmount,
    currency: 'INR',
    status: 'paid',
    description: items?.[0]?.name || 'Web Hosting & Domain Purchase',
    paymentMethod,
    transactionId: 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
    gstin: '27AABCU9603R1ZM'
  };

  db.invoices.unshift(invoice);
  res.json({ success: true, invoice, razorpayOrderId: 'order_' + Date.now() });
});

// Coupons
app.post('/api/billing/coupons/apply', (req: Request, res: Response) => {
  const { code, amount } = req.body;
  const found = db.coupons.find(c => c.code.toLowerCase() === (code || '').trim().toLowerCase());
  if (!found) {
    return res.status(400).json({ success: false, error: 'Invalid or expired promo code' });
  }

  const discountAmount = Math.min((amount * found.discountPct) / 100, found.maxDiscount);
  res.json({ success: true, coupon: found, discountAmount });
});

// Support Tickets
app.get('/api/tickets', (req: Request, res: Response) => {
  res.json({ success: true, tickets: db.tickets });
});

app.post('/api/tickets/create', (req: Request, res: Response) => {
  const { subject, category, priority, message } = req.body;
  const newTicket = {
    id: 'TCK-' + Math.floor(1000 + Math.random() * 9000),
    userId: 'usr_1',
    subject,
    category: category || 'Technical',
    priority: priority || 'Medium',
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg_' + Date.now(),
        sender: 'user',
        senderName: 'Alex Rivera',
        content: message,
        timestamp: new Date().toISOString()
      }
    ]
  };
  db.tickets.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});

app.post('/api/tickets/:id/reply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, sender = 'user' } = req.body;
  const ticket = db.tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

  ticket.messages.push({
    id: 'msg_' + Date.now(),
    sender,
    senderName: sender === 'user' ? 'Alex Rivera' : 'OneHost Support Specialist',
    content,
    timestamp: new Date().toISOString()
  });
  ticket.updatedAt = new Date().toISOString();

  // Auto-simulate quick AI assistant response if user replied
  if (sender === 'user') {
    setTimeout(() => {
      ticket.messages.push({
        id: 'msg_ai_' + Date.now(),
        sender: 'support',
        senderName: 'OneHost AI Assistant Bot',
        content: `Automated Diagnostic Check: We have received your update. Our senior network engineer has been assigned to ticket #${ticket.id}. Server health status: 100% operational.`,
        timestamp: new Date().toISOString()
      });
    }, 1500);
  }

  res.json({ success: true, ticket });
});

// Admin Analytics & Controls
app.get('/api/admin/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    stats: {
      totalUsers: 14280,
      monthlyRevenue: 1842900, // ₹ INR
      activeOrders: 894,
      hostingAccounts: db.hostingAccounts.length + 1240,
      domainsRegistered: db.domains.length + 3820,
      openTickets: db.tickets.filter(t => t.status !== 'Resolved').length + 14,
      serverUptimePct: 99.99,
      avgResponseMs: 18
    }
  });
});

// Gemini AI Diagnostic & Hosting Optimizer endpoint
app.post('/api/ai/diagnostics', async (req: Request, res: Response) => {
  try {
    const { prompt, domain } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        success: true,
        analysis: `### 🚀 OneHost Automated Optimization Insight for ${domain || 'your server'}
- **Caching & Compression:** Enabled Brotli compression and HTTP/3 QUIC protocol on Asia Edge nodes.
- **Database Query Indexing:** Detected 3 slow queries on wp_posts. Index added automatically.
- **SSL Security:** TLS 1.3 active with A+ SSL Security rating.
- **PHP Memory Limit:** Configured at 512MB for optimum speed.`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are the lead DevOps & Cloud System Architect for OneHost SaaS hosting platform.
Provide an intelligent, concise, high-value technical recommendation or diagnostic response for the hosting domain "${domain || 'cloud server'}".
User Query: "${prompt || 'How can I optimize page speed and SSL security for my website?'}"
Format output with Markdown bullet points and performance metric suggestions.`
    });

    res.json({
      success: true,
      analysis: response.text
    });
  } catch (err: any) {
    console.error('Gemini API Diagnostic Error:', err);
    res.json({
      success: true,
      analysis: '### 🌐 OneHost Performance Check\n- Global CDN Edge Nodes: Active (18 Locations)\n- NVMe SSD Read Speed: 7,200 MB/s\n- DDoS Protection: Layer 7 Cloudflare Shield Active.'
    });
  }
});

// Start Server with Vite Middleware in Dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OneHost SaaS Server running at http://localhost:${PORT}`);
  });
}

startServer();
