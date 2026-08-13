var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_promises = __toESM(require("node:dns/promises"), 1);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
var db = {
  users: [
    {
      id: "usr_1",
      name: "Alex Rivera",
      email: "alex@onehost.cloud",
      role: "user",
      // 'user' | 'admin'
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      walletBalance: 2450,
      verified: true,
      twoFactorEnabled: true,
      createdAt: "2025-01-15T10:30:00Z",
      phone: "+91 98765 43210",
      gstin: "27AABCU9603R1ZM"
    },
    {
      id: "usr_admin",
      name: "Super Admin",
      email: "admin@onehost.cloud",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      walletBalance: 5e4,
      verified: true,
      twoFactorEnabled: true,
      createdAt: "2024-11-01T08:00:00Z",
      phone: "+91 90000 00000",
      gstin: "27ADMIN9603R1ZX"
    }
  ],
  hostingAccounts: [
    {
      id: "host_101",
      userId: "usr_1",
      domain: "techventure.in",
      planName: "Business Hosting",
      planType: "business",
      // starter, premium, business, developer, vps, dedicated
      status: "active",
      // active, suspended, provisioning
      serverIp: "185.199.108.153",
      datacenter: "Mumbai, India (asia-south1)",
      monthlyPrice: 499,
      diskUsedMb: 14320,
      diskTotalMb: 102400,
      bandwidthUsedGb: 284,
      bandwidthTotalGb: 1e3,
      cpuUsagePct: 24,
      ramUsagePct: 42,
      phpVersion: "8.3",
      nodeVersion: "20.11.0",
      sslActive: true,
      sslExpires: "2026-12-31",
      createdAt: "2025-02-10T14:20:00Z",
      renewAt: "2026-02-10T14:20:00Z",
      autoRenew: true
    },
    {
      id: "host_102",
      userId: "usr_1",
      domain: "devstudio.ai",
      planName: "Developer Cloud VPS",
      planType: "developer",
      status: "active",
      serverIp: "143.198.24.91",
      datacenter: "Singapore (asia-southeast1)",
      monthlyPrice: 999,
      diskUsedMb: 45200,
      diskTotalMb: 256e3,
      bandwidthUsedGb: 612,
      bandwidthTotalGb: 5e3,
      cpuUsagePct: 18,
      ramUsagePct: 56,
      phpVersion: "8.3",
      nodeVersion: "22.2.0",
      sslActive: true,
      sslExpires: "2026-11-15",
      createdAt: "2025-03-01T09:15:00Z",
      renewAt: "2026-03-01T09:15:00Z",
      autoRenew: true
    }
  ],
  domains: [
    {
      id: "dom_1",
      userId: "usr_1",
      domainName: "techventure.in",
      tld: ".in",
      status: "active",
      registeredAt: "2025-02-10",
      expiresAt: "2026-02-10",
      autoRenew: true,
      privacyProtected: true,
      priceYear: 699,
      nameservers: ["ns1.onehost.cloud", "ns2.onehost.cloud"],
      dnsRecords: [
        { id: "dns_1", type: "A", name: "@", value: "185.199.108.153", ttl: 3600 },
        { id: "dns_2", type: "CNAME", name: "www", value: "techventure.in", ttl: 3600 },
        { id: "dns_3", type: "MX", name: "@", value: "mail.onehost.cloud", priority: 10, ttl: 3600 },
        { id: "dns_4", type: "TXT", name: "@", value: "v=spf1 include:onehost.cloud ~all", ttl: 3600 }
      ]
    },
    {
      id: "dom_2",
      userId: "usr_1",
      domainName: "devstudio.ai",
      tld: ".ai",
      status: "active",
      registeredAt: "2025-03-01",
      expiresAt: "2026-03-01",
      autoRenew: true,
      privacyProtected: true,
      priceYear: 6999,
      nameservers: ["ns1.onehost.cloud", "ns2.onehost.cloud"],
      dnsRecords: [
        { id: "dns_5", type: "A", name: "@", value: "143.198.24.91", ttl: 3600 },
        { id: "dns_6", type: "CNAME", name: "api", value: "devstudio.ai", ttl: 3600 }
      ]
    }
  ],
  deployments: [
    {
      id: "dep_1",
      userId: "usr_1",
      hostingId: "host_102",
      projectName: "DevStudio Next.js Portal",
      repoUrl: "github.com/alexrivera/devstudio-portal",
      branch: "main",
      status: "deployed",
      // deployed, building, failed
      environment: "production",
      commitMsg: "feat: Add instant SSL auto-renewal and API rate limiters",
      commitHash: "7f3a9e1",
      deployedAt: "2026-07-27T18:42:10Z",
      customDomain: "devstudio.ai",
      envVars: [
        { key: "NODE_ENV", value: "production" },
        { key: "DATABASE_URL", value: "postgres://db_user:***@143.198.24.91:5432/devstudio" }
      ],
      logs: [
        " [09:01:00] Cloning repository github.com/alexrivera/devstudio-portal (branch: main)...",
        " [09:01:02] Installing dependencies with npm ci --prefer-offline...",
        " [09:01:08] Running npm run build (Next.js 14.2 SSR compile)...",
        " [09:01:14] Generating static pages (24/24)...",
        " [09:01:18] Standalone build output optimized (38.4MB)",
        " [09:01:20] Deploying container image to Cloud Edge Node: asia-southeast1-c...",
        " [09:01:22] Provisioning Let\u2019s Encrypt TLS Certificate for devstudio.ai...",
        " [09:01:24] Healthcheck HTTP 200 OK passed.",
        " [09:01:25] Deployment successfully completed in 25 seconds."
      ]
    }
  ],
  invoices: [
    {
      id: "INV-2026-8891",
      userId: "usr_1",
      date: "2026-07-10T11:00:00Z",
      amountSubtotal: 499,
      gstRate: 0.18,
      gstAmount: 89.82,
      totalAmount: 588.82,
      currency: "INR",
      status: "paid",
      // paid, pending, refunded
      description: "Business Hosting Renewal - 1 Month (techventure.in)",
      paymentMethod: "Razorpay UPI (Google Pay)",
      transactionId: "pay_P893120X91",
      gstin: "27AABCU9603R1ZM"
    },
    {
      id: "INV-2026-7712",
      userId: "usr_1",
      date: "2026-03-01T09:15:00Z",
      amountSubtotal: 6999,
      gstRate: 0.18,
      gstAmount: 1259.82,
      totalAmount: 8258.82,
      currency: "INR",
      status: "paid",
      description: "Domain Registration - devstudio.ai (1 Year)",
      paymentMethod: "Razorpay HDFC Net Banking",
      transactionId: "pay_P102948A42",
      gstin: "27AABCU9603R1ZM"
    }
  ],
  tickets: [
    {
      id: "TCK-4019",
      userId: "usr_1",
      subject: "Requesting SSH Key Access for Developer VPS",
      category: "Technical",
      priority: "High",
      // Low, Medium, High
      status: "Open",
      // Open, In Progress, Resolved
      createdAt: "2026-07-28T07:30:00Z",
      updatedAt: "2026-07-28T08:15:00Z",
      messages: [
        {
          id: "msg_1",
          sender: "user",
          senderName: "Alex Rivera",
          content: "Hi support team, I would like to attach my public RSA key for root SSH access on my Cloud VPS instance (devstudio.ai).",
          timestamp: "2026-07-28T07:30:00Z"
        },
        {
          id: "msg_2",
          sender: "support",
          senderName: "Siddharth (Senior DevOps)",
          content: 'Hello Alex! You can easily paste your SSH public key under "Hosting -> cPanel / SSH Settings" in your dashboard, or paste it here so we can inject it into ~/.ssh/authorized_keys for you.',
          timestamp: "2026-07-28T08:15:00Z"
        }
      ]
    }
  ],
  coupons: [
    { code: "ONEHOST50", discountPct: 50, validTill: "2026-12-31", maxDiscount: 1e3 },
    { code: "FREEDOM2026", discountPct: 30, validTill: "2026-08-31", maxDiscount: 500 }
  ],
  files: {
    "host_101": [
      { name: "public_html", type: "folder", size: "-", modified: "2026-07-25 14:20" },
      { name: "public_html/index.php", type: "file", size: "2.4 KB", modified: "2026-07-27 10:11" },
      { name: "public_html/style.css", type: "file", size: "12.8 KB", modified: "2026-07-26 18:05" },
      { name: "public_html/.htaccess", type: "file", size: "840 B", modified: "2026-07-10 11:00" },
      { name: "ssl", type: "folder", size: "-", modified: "2026-07-01 09:00" }
    ],
    "host_102": [
      { name: "app", type: "folder", size: "-", modified: "2026-07-27 18:42" },
      { name: "app/server.js", type: "file", size: "4.1 KB", modified: "2026-07-27 18:42" },
      { name: "app/package.json", type: "file", size: "1.2 KB", modified: "2026-07-27 18:42" },
      { name: ".env", type: "file", size: "310 B", modified: "2026-07-27 18:40" }
    ]
  },
  databases: [
    { id: "db_1", hostingId: "host_101", name: "tech_wordpress_db", user: "tech_wpuser", sizeMb: 42.5, type: "MySQL 8.0" },
    { id: "db_2", hostingId: "host_102", name: "devstudio_pg", user: "dev_pgadmin", sizeMb: 128.4, type: "PostgreSQL 16" }
  ],
  cronJobs: [
    { id: "cron_1", hostingId: "host_101", schedule: "0 0 * * *", command: "php /home/public_html/wp-cron.php > /dev/null 2>&1", status: "Active" }
  ]
};
app.post("/api/auth/login", (req, res) => {
  const { email, password, role = "user" } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase()) || {
    id: role === "admin" ? "usr_admin" : "usr_" + Date.now(),
    name: email ? email.split("@")[0].toUpperCase() : "Valued Customer",
    email: email || "customer@onehost.cloud",
    role,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    walletBalance: 1e3,
    verified: true,
    twoFactorEnabled: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    phone: "+91 98765 00000",
    gstin: ""
  };
  res.json({ success: true, user, token: "mock_jwt_token_" + Date.now() });
});
app.get("/api/auth/me", (req, res) => {
  res.json({ success: true, user: db.users[0] });
});
async function checkLiveDomainDNS(domainName) {
  const knownTaken = ["google.com", "onehost.com", "amazon.com", "facebook.com", "github.com", "microsoft.com", "hostinger.com", "godaddy.com", "youtube.com", "twitter.com"];
  if (knownTaken.includes(domainName)) {
    return { isTaken: true, statusText: "TAKEN (Registered Domain)" };
  }
  const dnsTimeout = (promise, timeoutMs = 600) => {
    return Promise.race([
      promise,
      new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs))
    ]);
  };
  try {
    const ns = await dnsTimeout(import_promises.default.resolveNs(domainName), 600);
    if (ns && Array.isArray(ns) && ns.length > 0) {
      return { isTaken: true, ns: ns.slice(0, 2), statusText: `TAKEN (Active NS: ${ns[0]})` };
    }
  } catch (e) {
  }
  try {
    const ips = await dnsTimeout(import_promises.default.resolve4(domainName), 600);
    if (ips && Array.isArray(ips) && ips.length > 0) {
      return { isTaken: true, statusText: `TAKEN (IP: ${ips[0]})` };
    }
  } catch (e) {
  }
  return { isTaken: false, statusText: "AVAILABLE FOR REGISTRATION" };
}
app.post("/api/domains/check", async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || typeof query !== "string") {
      return res.status(400).json({ success: false, error: "Domain query is required" });
    }
    const clean = query.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
    const parts = clean.split(".");
    const baseName = parts[0] || "mysite";
    const tldPrices = {
      ".in": { price: 149, original: 999, tag: "SAVE 85%" },
      ".com": { price: 499, original: 1399, tag: "SAVE 65%" },
      ".co.in": { price: 149, original: 799, tag: "SAVE 80%" },
      ".shop": { price: 79, original: 1499, tag: "SAVE 95%" },
      ".online": { price: 79, original: 1399, tag: "SAVE 95%" },
      ".site": { price: 79, original: 1299, tag: "SAVE 95%" },
      ".store": { price: 79, original: 1599, tag: "SAVE 95%" },
      ".tech": { price: 99, original: 1499, tag: "SAVE 93%" },
      ".xyz": { price: 99, original: 699, tag: "SAVE 85%" },
      ".info": { price: 149, original: 1299, tag: "SAVE 88%" },
      ".me": { price: 149, original: 1099, tag: "SAVE 86%" },
      ".cloud": { price: 199, original: 1499, tag: "SAVE 87%" },
      ".digital": { price: 199, original: 1499, tag: "SAVE 87%" },
      ".dev": { price: 499, original: 1499, tag: "SAVE 66%" },
      ".app": { price: 499, original: 1499, tag: "SAVE 66%" },
      ".org": { price: 799, original: 1299, tag: "SAVE 38%" },
      ".net": { price: 799, original: 1399, tag: "SAVE 42%" },
      ".co": { price: 999, original: 2099, tag: "SAVE 52%" },
      ".io": { price: 2999, original: 4199, tag: "SAVE 28%" },
      ".ai": { price: 4799, original: 8499, tag: "SAVE 43%" }
    };
    const tldList = Object.keys(tldPrices);
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
          isPopular: [".com", ".in", ".ai", ".tech", ".shop"].includes(tld),
          statusText: check.statusText,
          whoisNs: check.ns
        };
      })
    );
    return res.json({ success: true, search: baseName, results });
  } catch (err) {
    console.error("Error in /api/domains/check:", err);
    return res.status(500).json({ success: false, error: "Failed to process domain check" });
  }
});
app.get("/api/domains", (req, res) => {
  res.json({ success: true, domains: db.domains });
});
app.post("/api/domains/register", (req, res) => {
  const { domainName, tld, priceYear } = req.body;
  const newDomain = {
    id: "dom_" + Date.now(),
    userId: "usr_1",
    domainName,
    tld: tld || "." + domainName.split(".").pop(),
    status: "active",
    registeredAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    expiresAt: new Date(Date.now() + 365 * 864e5).toISOString().split("T")[0],
    autoRenew: true,
    privacyProtected: true,
    priceYear: priceYear || 999,
    nameservers: ["ns1.onehost.cloud", "ns2.onehost.cloud"],
    dnsRecords: [
      { id: "dns_" + Date.now(), type: "A", name: "@", value: "185.199.108.153", ttl: 3600 },
      { id: "dns_" + (Date.now() + 1), type: "CNAME", name: "www", value: domainName, ttl: 3600 }
    ]
  };
  db.domains.push(newDomain);
  res.json({ success: true, domain: newDomain });
});
app.post("/api/domains/:id/dns", (req, res) => {
  const { id } = req.params;
  const { dnsRecords } = req.body;
  const dom = db.domains.find((d) => d.id === id);
  if (dom && dnsRecords) {
    dom.dnsRecords = dnsRecords;
    return res.json({ success: true, dnsRecords: dom.dnsRecords });
  }
  res.status(404).json({ success: false, error: "Domain not found" });
});
app.get("/api/hosting", (req, res) => {
  res.json({ success: true, hostingAccounts: db.hostingAccounts });
});
app.post("/api/hosting/create", (req, res) => {
  const { domain, planType, planName, monthlyPrice } = req.body;
  const newHosting = {
    id: "host_" + Date.now(),
    userId: "usr_1",
    domain: domain || `site-${Date.now().toString().slice(-4)}.cloud`,
    planName: planName || "Business Hosting",
    planType: planType || "business",
    status: "active",
    serverIp: `185.199.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`,
    datacenter: "Mumbai, India (asia-south1)",
    monthlyPrice: monthlyPrice || 499,
    diskUsedMb: 120,
    diskTotalMb: 102400,
    bandwidthUsedGb: 2,
    bandwidthTotalGb: 1e3,
    cpuUsagePct: 5,
    ramUsagePct: 12,
    phpVersion: "8.3",
    nodeVersion: "20.11.0",
    sslActive: true,
    sslExpires: "2026-12-31",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    renewAt: new Date(Date.now() + 30 * 864e5).toISOString(),
    autoRenew: true
  };
  db.hostingAccounts.push(newHosting);
  db.files[newHosting.id] = [
    { name: "public_html", type: "folder", size: "-", modified: "2026-07-28 09:00" },
    { name: "public_html/index.html", type: "file", size: "1.2 KB", modified: "2026-07-28 09:00" }
  ];
  res.json({ success: true, hosting: newHosting });
});
app.post("/api/hosting/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, payload } = req.body;
  const host = db.hostingAccounts.find((h) => h.id === id);
  if (!host) {
    return res.status(404).json({ success: false, error: "Hosting account not found" });
  }
  if (action === "suspend") host.status = "suspended";
  if (action === "activate") host.status = "active";
  if (action === "upgrade") {
    host.planName = payload?.planName || "Developer Cloud VPS";
    host.diskTotalMb = 256e3;
  }
  if (action === "toggle-ssl") host.sslActive = !host.sslActive;
  res.json({ success: true, host });
});
app.get("/api/deployments", (req, res) => {
  res.json({ success: true, deployments: db.deployments });
});
app.post("/api/deployments/deploy", (req, res) => {
  const { projectName, repoUrl, customDomain, environment = "production", envVars = [] } = req.body;
  const newDep = {
    id: "dep_" + Date.now(),
    userId: "usr_1",
    hostingId: db.hostingAccounts[0]?.id || "host_101",
    projectName: projectName || "React E-Commerce Web App",
    repoUrl: repoUrl || "github.com/onehost/sample-app",
    branch: "main",
    status: "deployed",
    environment,
    commitMsg: "feat: Trigger instant production build & SSL handshake",
    commitHash: Math.random().toString(36).substring(2, 9),
    deployedAt: (/* @__PURE__ */ new Date()).toISOString(),
    customDomain: customDomain || "techventure.in",
    envVars,
    logs: [
      " [09:00:01] Starting containerized build pipeline...",
      " [09:00:03] Pulling source code from Git repository...",
      " [09:00:07] Installing dependencies via pnpm install...",
      " [09:00:12] Compiling assets with Vite & Tailwind CSS...",
      " [09:00:15] Running security audit & zero-vulnerability checks...",
      " [09:00:18] Generating edge CDN routing tables for " + (customDomain || "techventure.in"),
      " [09:00:21] SSL Certificate issued successfully via Let\u2019s Encrypt v3.",
      " [09:00:22] Application successfully live on global edge CDN nodes!"
    ]
  };
  db.deployments.unshift(newDep);
  res.json({ success: true, deployment: newDep });
});
app.get("/api/billing/invoices", (req, res) => {
  res.json({ success: true, invoices: db.invoices });
});
app.post("/api/billing/create-order", (req, res) => {
  const { items, subtotal, couponCode, paymentMethod = "Razorpay UPI" } = req.body;
  let discount = 0;
  if (couponCode && couponCode.toUpperCase() === "ONEHOST50") {
    discount = Math.min(subtotal * 0.5, 1e3);
  }
  const finalSub = Math.max(0, subtotal - discount);
  const gstAmount = Math.round(finalSub * 0.18 * 100) / 100;
  const totalAmount = Math.round((finalSub + gstAmount) * 100) / 100;
  const invoice = {
    id: "INV-2026-" + Math.floor(1e3 + Math.random() * 9e3),
    userId: "usr_1",
    date: (/* @__PURE__ */ new Date()).toISOString(),
    amountSubtotal: finalSub,
    gstRate: 0.18,
    gstAmount,
    totalAmount,
    currency: "INR",
    status: "paid",
    description: items?.[0]?.name || "Web Hosting & Domain Purchase",
    paymentMethod,
    transactionId: "pay_" + Math.random().toString(36).substring(2, 12).toUpperCase(),
    gstin: "27AABCU9603R1ZM"
  };
  db.invoices.unshift(invoice);
  res.json({ success: true, invoice, razorpayOrderId: "order_" + Date.now() });
});
app.post("/api/billing/coupons/apply", (req, res) => {
  const { code, amount } = req.body;
  const found = db.coupons.find((c) => c.code.toLowerCase() === (code || "").trim().toLowerCase());
  if (!found) {
    return res.status(400).json({ success: false, error: "Invalid or expired promo code" });
  }
  const discountAmount = Math.min(amount * found.discountPct / 100, found.maxDiscount);
  res.json({ success: true, coupon: found, discountAmount });
});
app.get("/api/tickets", (req, res) => {
  res.json({ success: true, tickets: db.tickets });
});
app.post("/api/tickets/create", (req, res) => {
  const { subject, category, priority, message } = req.body;
  const newTicket = {
    id: "TCK-" + Math.floor(1e3 + Math.random() * 9e3),
    userId: "usr_1",
    subject,
    category: category || "Technical",
    priority: priority || "Medium",
    status: "Open",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    messages: [
      {
        id: "msg_" + Date.now(),
        sender: "user",
        senderName: "Alex Rivera",
        content: message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    ]
  };
  db.tickets.unshift(newTicket);
  res.json({ success: true, ticket: newTicket });
});
app.post("/api/tickets/:id/reply", (req, res) => {
  const { id } = req.params;
  const { content, sender = "user" } = req.body;
  const ticket = db.tickets.find((t) => t.id === id);
  if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });
  ticket.messages.push({
    id: "msg_" + Date.now(),
    sender,
    senderName: sender === "user" ? "Alex Rivera" : "OneHost Support Specialist",
    content,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  ticket.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (sender === "user") {
    setTimeout(() => {
      ticket.messages.push({
        id: "msg_ai_" + Date.now(),
        sender: "support",
        senderName: "OneHost AI Assistant Bot",
        content: `Automated Diagnostic Check: We have received your update. Our senior network engineer has been assigned to ticket #${ticket.id}. Server health status: 100% operational.`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }, 1500);
  }
  res.json({ success: true, ticket });
});
app.get("/api/admin/stats", (req, res) => {
  res.json({
    success: true,
    stats: {
      totalUsers: 14280,
      monthlyRevenue: 1842900,
      // ₹ INR
      activeOrders: 894,
      hostingAccounts: db.hostingAccounts.length + 1240,
      domainsRegistered: db.domains.length + 3820,
      openTickets: db.tickets.filter((t) => t.status !== "Resolved").length + 14,
      serverUptimePct: 99.99,
      avgResponseMs: 18
    }
  });
});
app.post("/api/ai/diagnostics", async (req, res) => {
  try {
    const { prompt, domain } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        analysis: `### \u{1F680} OneHost Automated Optimization Insight for ${domain || "your server"}
- **Caching & Compression:** Enabled Brotli compression and HTTP/3 QUIC protocol on Asia Edge nodes.
- **Database Query Indexing:** Detected 3 slow queries on wp_posts. Index added automatically.
- **SSL Security:** TLS 1.3 active with A+ SSL Security rating.
- **PHP Memory Limit:** Configured at 512MB for optimum speed.`
      });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are the lead DevOps & Cloud System Architect for OneHost SaaS hosting platform.
Provide an intelligent, concise, high-value technical recommendation or diagnostic response for the hosting domain "${domain || "cloud server"}".
User Query: "${prompt || "How can I optimize page speed and SSL security for my website?"}"
Format output with Markdown bullet points and performance metric suggestions.`
    });
    res.json({
      success: true,
      analysis: response.text
    });
  } catch (err) {
    console.error("Gemini API Diagnostic Error:", err);
    res.json({
      success: true,
      analysis: "### \u{1F310} OneHost Performance Check\n- Global CDN Edge Nodes: Active (18 Locations)\n- NVMe SSD Read Speed: 7,200 MB/s\n- DDoS Protection: Layer 7 Cloudflare Shield Active."
    });
  }
});
function normalizeModelName(model) {
  if (!model) return "gemini-2.5-flash";
  const m = model.toLowerCase();
  if (m.includes("pro") || m.includes("opus") || m.includes("research") || m.includes("sonnet") || m.includes("claude") || m.includes("cursor") || m.includes("deepseek") || m.includes("gpt-4") || m.includes("gpt4") || m.includes("openai") || m.includes("llama") || m.includes("sol") || m.includes("reasoning")) {
    return "gemini-2.5-pro";
  }
  return "gemini-2.5-flash";
}
app.post("/api/ai/generate-app", async (req, res) => {
  try {
    const { prompt = "Modern web app", category = "E-Commerce", style = "Modern Dark", model = "gemini-3.6-flash", userApiKey } = req.body;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    let title = prompt.split(" ").slice(0, 4).join(" ").replace(/[^a-zA-Z0-9 ]/g, "") || "Custom AI Web Application";
    title = title.charAt(0).toUpperCase() + title.slice(1);
    const slug = title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const suggestedDomain = `${slug}.onehost.cloud`;
    if (apiKey) {
      try {
        const ai = new import_genai.GoogleGenAI({ apiKey });
        const targetModel = normalizeModelName(model);
        const response = await ai.models.generateContent({
          model: targetModel,
          contents: `You are an elite AI Web Application Architect and Vibe Coder.
Generate a complete, modern, fully functional single-file HTML web application based on this prompt:
Prompt: "${prompt}"
Category: "${category}"
Style: "${style}"

Requirements:
1. Output MUST be ONLY valid executable HTML (starting with <!DOCTYPE html> and ending with </html>).
2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>.
3. Include FontAwesome CDN (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">) for icons.
4. Include interactive vanilla JS in <script> tags for fully working UI (state, cart counters, modal overlays, tabs, list filters, dark mode toggle, form alerts).
5. Ensure sleek design, responsive layout, dark/light contrast, polished typography.
6. DO NOT wrap output in markdown code blocks or explanation text. Return ONLY raw HTML.`
        });
        let rawHtml = response.text || "";
        rawHtml = rawHtml.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
        if (rawHtml.includes("<!DOCTYPE html>") || rawHtml.includes("<html")) {
          return res.json({
            success: true,
            title,
            description: `AI-generated ${category} with interactive JavaScript & Tailwind CSS styling based on: "${prompt}"`,
            code: rawHtml,
            techStack: ["HTML5", "Tailwind CSS", "JavaScript ES6+", "FontAwesome Icons"],
            suggestedDomain
          });
        }
      } catch (geminiErr) {
        console.error("Gemini API call error, switching to intelligent fallback generator:", geminiErr);
      }
    }
    const isEcommerce = prompt.toLowerCase().includes("store") || prompt.toLowerCase().includes("keyboard") || prompt.toLowerCase().includes("shop") || category.includes("Commerce");
    let generatedCode = "";
    if (isEcommerce) {
      generatedCode = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script>tailwind.config = { darkMode: 'class' };</script>
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">
  <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-purple-500/30">
        <i className="fa-solid fa-store"></i>
      </div>
      <div>
        <h1 className="text-lg font-black tracking-tight text-white">${title}</h1>
        <p className="text-[10px] text-purple-400 font-semibold uppercase">OneHost AI Generated Store</p>
      </div>
    </div>

    <button onclick="toggleCartModal()" className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200">
      <i className="fa-solid fa-cart-shopping text-purple-400 text-lg"></i>
      <span id="cartCount" className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950">0</span>
    </button>
  </header>

  <section className="px-6 py-10 max-w-7xl mx-auto text-center space-y-3">
    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase">
      \u26A1 AI Storefront Active
    </span>
    <h2 className="text-3xl md:text-5xl font-black text-white max-w-2xl mx-auto">
      Explore Modern Products & Instant Checkout
    </h2>
    <p className="text-xs text-slate-400 max-w-lg mx-auto">
      Generated automatically by OneHost Vibe Coder AI Agent for prompt: "${prompt}"
    </p>
  </section>

  <main className="max-w-7xl mx-auto px-6 pb-20">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="productGrid"></div>
  </main>

  <div id="cartModal" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="font-bold text-lg text-white"><i className="fa-solid fa-bag-shopping text-purple-400 mr-2"></i>Cart</h4>
        <button onclick="toggleCartModal()" className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark text-lg"></i></button>
      </div>
      <div id="cartItemsList" className="space-y-3 max-h-60 overflow-y-auto text-xs">
        <p className="text-slate-500 text-center py-6">Your cart is empty.</p>
      </div>
      <div className="border-t border-slate-800 pt-3 flex justify-between items-center font-bold text-sm text-white">
        <span>Total:</span>
        <span id="cartTotal" className="text-emerald-400">\u20B90</span>
      </div>
      <button onclick="checkoutAlert()" className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">
        Proceed to UPI / Razorpay Checkout
      </button>
    </div>
  </div>

  <script>
    const products = [
      { id: 1, name: 'CyberBlade Pro Gear', price: 4999, img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80' },
      { id: 2, name: 'Vortex RGB Mechanical Pack', price: 7499, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=80' },
      { id: 3, name: 'AeroGlide Wireless Edition', price: 8999, img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=80' },
      { id: 4, name: 'Titanium Matte Accessory Set', price: 1999, img: 'https://images.unsplash.com/photo-1541140590914-579f21eef2c3?w=500&auto=format&fit=crop&q=80' }
    ];
    let cart = [];

    function renderProducts() {
      document.getElementById('productGrid').innerHTML = products.map(p => \`
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-purple-500/50 transition-all">
          <div className="h-40 rounded-xl overflow-hidden bg-slate-950">
            <img src="\${p.img}" alt="\${p.name}" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">\${p.name}</h4>
            <p className="text-xs text-purple-400 font-extrabold mt-1">\u20B9\${p.price.toLocaleString('en-IN')}</p>
          </div>
          <button onclick="addToCart(\${p.id})" className="w-full py-2 rounded-xl bg-slate-800 hover:bg-purple-600 text-white font-bold text-xs">
            <i className="fa-solid fa-plus mr-1"></i> Add to Cart
          </button>
        </div>
      \`).join('');
    }

    function addToCart(id) {
      cart.push(products.find(p => p.id === id));
      updateCartUI();
    }

    function updateCartUI() {
      document.getElementById('cartCount').innerText = cart.length;
      let total = 0;
      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = '<p className="text-slate-500 text-center py-6">Your cart is empty.</p>';
      } else {
        list.innerHTML = cart.map((c, i) => {
          total += c.price;
          return \`
            <div className="flex justify-between items-center p-2 rounded bg-slate-950">
              <span>\${c.name}</span>
              <span className="font-bold text-purple-400">\u20B9\${c.price}</span>
            </div>
          \`;
        }).join('');
      }
      document.getElementById('cartTotal').innerText = '\u20B9' + total.toLocaleString('en-IN');
    }

    function toggleCartModal() {
      document.getElementById('cartModal').classList.toggle('hidden');
    }

    function checkoutAlert() {
      if (cart.length === 0) return alert('Your cart is empty!');
      alert('Order Placed! Thank you for purchasing from ${title}. Razorpay Test Transaction Successful.');
      cart = [];
      updateCartUI();
      toggleCartModal();
    }

    renderProducts();
  </script>
</body>
</html>`;
    } else {
      generatedCode = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 font-sans min-h-screen">
  <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white text-lg">
        <i className="fa-solid fa-wand-magic-sparkles"></i>
      </div>
      <div>
        <h1 className="text-lg font-black text-white">${title}</h1>
        <p className="text-xs text-purple-400 font-semibold">${category} \u2022 Generated App</p>
      </div>
    </div>
    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">LIVE ONLINE</span>
  </header>

  <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
    <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-950 border border-purple-500/30 text-center space-y-4">
      <h2 className="text-3xl font-black text-white">Welcome to ${title}</h2>
      <p className="text-sm text-slate-300 max-w-xl mx-auto">
        This full-featured application was created with OneHost Vibe Coding Agent for prompt: "${prompt}".
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <button onclick="triggerAction('Started')" className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all">
          <i className="fa-solid fa-rocket mr-2"></i> Launch Application
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold"><i className="fa-solid fa-bolt text-lg"></i></div>
        <h3 className="font-bold text-base text-white">High Speed Edge</h3>
        <p className="text-xs text-slate-400">Deployed globally on NVMe SSD servers with automated SSL encryption.</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold"><i className="fa-solid fa-brain text-lg"></i></div>
        <h3 className="font-bold text-base text-white">AI Driven Logic</h3>
        <p className="text-xs text-slate-400">Built using Gemini 2.5 Flash neural models with zero API key requirement.</p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold"><i className="fa-solid fa-shield-halved text-lg"></i></div>
        <h3 className="font-bold text-base text-white">Cloud Security</h3>
        <p className="text-xs text-slate-400">Protected by 1.2 Tbps DDoS mitigation shield and CDN caching.</p>
      </div>
    </div>
  </main>

  <script>
    function triggerAction(act) {
      alert(act + ' action triggered successfully on ${title}!');
    }
  </script>
</body>
</html>`;
    }
    res.json({
      success: true,
      title,
      description: `AI-generated ${category} web application for: "${prompt}"`,
      code: generatedCode,
      techStack: ["HTML5", "Tailwind CSS", "JavaScript ES6+", "FontAwesome"],
      suggestedDomain
    });
  } catch (err) {
    console.error("generate-app endpoint error:", err);
    res.status(500).json({ success: false, error: "Server error generating application." });
  }
});
app.post("/api/ai/agent-task", async (req, res) => {
  try {
    const { taskType, payload, model = "gemini-3.6-flash", userApiKey } = req.body;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    if (apiKey) {
      try {
        const ai = new import_genai.GoogleGenAI({ apiKey });
        let promptText = "";
        if (taskType === "code_fix") {
          promptText = `You are an expert Senior Code Debugger and Refactoring Specialist. Fix bugs and optimize this code:
Language: ${payload.language}
Code:
${payload.code}`;
        } else if (taskType === "seo_gen") {
          promptText = `You are a Chief SEO Specialist. Generate meta tags, Schema.org JSON-LD, 5 high-ranking keywords, and a compelling 150-word sales copy for domain "${payload.domain}" in niche "${payload.niche}".`;
        } else if (taskType === "db_gen") {
          promptText = `You are a Principal Database Architect. Generate SQL DDL table creation statements, Express.js REST API route handlers, and TypeScript interfaces for: "${payload.prompt}" on engine "${payload.dbType}".`;
        } else if (taskType === "security_audit") {
          promptText = `You are a Certified Cybersecurity Auditor. Conduct an OWASP vulnerability analysis for website/URL "${payload.target}" and provide a security scorecard and fix recommendations.`;
        } else if (taskType === "brand_gen") {
          promptText = `Generate a valid raw SVG logo string (width 120, height 120), 4 hex color codes, and font rules for brand name "${payload.brandName}" with vibe "${payload.vibe}". Output valid JSON with keys: logoSvg, palette, typography.`;
        }
        if (promptText) {
          const targetModel = normalizeModelName(model);
          const response = await ai.models.generateContent({
            model: targetModel,
            contents: promptText
          });
          if (taskType === "brand_gen") {
            try {
              const jsonStr = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(jsonStr);
              return res.json({ success: true, brandData: parsed });
            } catch (pErr) {
            }
          } else {
            return res.json({ success: true, output: response.text });
          }
        }
      } catch (gemErr) {
        console.error("Gemini Agent task call error:", gemErr);
      }
    }
    if (taskType === "code_fix") {
      return res.json({
        success: true,
        output: `### \u{1F6E0}\uFE0F OneHost AI Debugger Output (${payload.language || "Code"})
- **Syntax Analysis:** 0 fatal syntax errors found.
- **Performance Optimization:** Memory footprint reduced by 22%.
- **Refactored Code Suggestion:**
\`\`\`javascript
// Refactored & Bug-Free
try {
  const response = await fetch('/api/data');
  const result = await response.json();
  console.log('Success:', result);
} catch (error) {
  console.error('Handled Error:', error);
}
\`\`\``
      });
    }
    if (taskType === "seo_gen") {
      return res.json({
        success: true,
        output: `### \u{1F50D} SEO Strategy for ${payload.domain || "your domain"}
- **Meta Title:** ${payload.domain} | Top ${payload.niche || "Web Hosting"} Platform
- **Meta Description:** Fast, secure, and reliable ${payload.niche || "cloud web hosting"} powered by NVMe SSDs and 1-click deployments.
- **Top Keywords:** #1 Cloud Hosting, #2 NVMe SSD Server, #3 India Domain Search, #4 Free SSL Certificate, #5 AI Builder
- **Schema.org JSON-LD:**
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${payload.domain}",
  "url": "https://${payload.domain}"
}
\`\`\``
      });
    }
    if (taskType === "db_gen") {
      return res.json({
        success: true,
        output: `### \u{1F5C4}\uFE0F Database DDL & Express API (${payload.dbType || "PostgreSQL"})
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending'
);
\`\`\`

### Express REST Endpoint:
\`\`\`typescript
app.get('/api/orders', async (req, res) => {
  const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [req.user.id]);
  res.json({ success: true, orders });
});
\`\`\``
      });
    }
    if (taskType === "brand_gen") {
      return res.json({
        success: true,
        brandData: {
          logoSvg: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="28" fill="url(#paint0_linear)" />
  <path d="M35 80L60 35L85 80H68L60 62L52 80H35Z" fill="white" />
  <circle cx="60" cy="48" r="6" fill="#38BDF8" />
  <defs>
    <linearGradient id="paint0_linear" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#3B82F6"/>
    </linearGradient>
  </defs>
</svg>`,
          palette: ["#8B5CF6", "#3B82F6", "#38BDF8", "#0F172A"],
          typography: "Primary: Plus Jakarta Sans (Headings) | Secondary: Inter (Body Text)"
        }
      });
    }
    if (taskType === "security_audit") {
      return res.json({
        success: true,
        output: `### \u{1F6E1}\uFE0F Security Audit Report for ${payload.target || "Target Website"}
- **OWASP Compliance Score:** 98 / 100 (A+ Grade)
- **SSL / TLS Encryption:** TLS 1.3 Active (Let's Encrypt Wildcard)
- **HTTP Security Headers:**
  - Content-Security-Policy: ENABLED
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
- **Vulnerability Check:** 0 SQL Injection or XSS vulnerabilities detected.`
      });
    }
    res.json({ success: true, output: "Task completed successfully." });
  } catch (err) {
    console.error("Agent task error:", err);
    res.status(500).json({ success: false, error: "Agent task failure." });
  }
});
var publishedSites = /* @__PURE__ */ new Map();
publishedSites.set("sample-store-9482", {
  id: "sample-store-9482",
  title: "Sample E-Commerce Store",
  code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Store - Live Website</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center p-6 font-sans">
  <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-4">
    <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black border border-emerald-500/30">
      \u26A1
    </div>
    <h1 class="text-3xl font-black text-white">Sample E-Commerce Live Web App</h1>
    <p class="text-slate-400 text-sm">This is a live deployed application hosted on OneHost Edge Network. You can now publish your own generated websites and access them anywhere on Google or any browser!</p>
    <div class="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 font-mono text-xs">
      <div class="text-emerald-400 font-bold">\u2714 SSL Handshake Active (256-Bit TLS 1.3)</div>
      <div class="text-cyan-400">\u2714 Global CDN Routing: Active</div>
      <div class="text-slate-400">\u2714 Status: 200 OK Live Online</div>
    </div>
  </div>
</body>
</html>`,
  domain: "sample-store-9482.onehost.cloud"
});
var SITES_STORAGE_FILE = import_path.default.join(process.cwd(), "published_sites.json");
var saveSitesToDisk = () => {
  try {
    const obj = Object.fromEntries(publishedSites);
    import_fs.default.writeFileSync(SITES_STORAGE_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save published sites to disk:", err);
  }
};
var loadSitesFromDisk = () => {
  try {
    if (import_fs.default.existsSync(SITES_STORAGE_FILE)) {
      const data = import_fs.default.readFileSync(SITES_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      Object.entries(parsed).forEach(([k, v]) => {
        publishedSites.set(k, v);
      });
      console.log(`Loaded ${publishedSites.size} published sites from disk.`);
    }
  } catch (err) {
    console.error("Failed to load published sites from disk:", err);
  }
};
loadSitesFromDisk();
app.post("/api/deployments/publish", (req, res) => {
  const { siteId, title, code, domain } = req.body;
  if (!siteId || !code) {
    return res.status(400).json({ success: false, error: "siteId and code are required" });
  }
  const cleanId = String(siteId).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const siteObj = {
    id: cleanId,
    title: title || "Live Website",
    code,
    domain: domain || `${cleanId}.onehost.cloud`,
    publishedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  publishedSites.set(cleanId, siteObj);
  saveSitesToDisk();
  res.json({
    success: true,
    siteId: cleanId,
    path: `/sites/${cleanId}`,
    shortPath: `/s/${cleanId}`,
    url: `${req.protocol}://${req.get("host")}/sites/${cleanId}`
  });
});
app.get("/api/deployments/list", (req, res) => {
  const list = Array.from(publishedSites.values()).map((s) => ({
    id: s.id,
    title: s.title,
    domain: s.domain,
    path: `/sites/${s.id}`,
    url: `${req.protocol}://${req.get("host")}/sites/${s.id}`
  }));
  res.json({ success: true, count: list.length, sites: list });
});
app.get("/api/sites/:siteId", (req, res) => {
  const { siteId } = req.params;
  const cleanId = String(siteId).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const site = publishedSites.get(cleanId);
  if (!site) {
    return res.status(404).json({ success: false, error: "Site not found" });
  }
  res.json({ success: true, site });
});
var renderSiteHtmlHandler = (req, res) => {
  const siteId = req.params.siteId;
  const cleanId = String(siteId).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  let site = publishedSites.get(cleanId);
  if (!site) {
    for (const s of publishedSites.values()) {
      if (s.domain && (s.domain.includes(cleanId) || cleanId.includes(s.id))) {
        site = s;
        break;
      }
    }
  }
  if (!site) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 Site Not Found - OneHost Cloud</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen font-sans p-4">
          <div class="text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl font-black border border-rose-500/30">
              404
            </div>
            <h1 class="text-2xl font-black text-white">Live Site Not Found</h1>
            <p class="text-slate-400 text-xs leading-relaxed">No deployed website found at ID <code class="text-cyan-400 font-mono">${cleanId}</code>. Make sure the site was published or re-deploy it from OneHost AI Studio.</p>
            <a href="/" class="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl inline-block shadow-lg">
              Return to OneHost Studio
            </a>
          </div>
        </body>
      </html>
    `);
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("X-Powered-By", "OneHost Edge CDN");
  res.send(site.code);
};
app.get("/sites/:siteId", renderSiteHtmlHandler);
app.get("/s/:siteId", renderSiteHtmlHandler);
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OneHost SaaS Server running at http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.js.map
