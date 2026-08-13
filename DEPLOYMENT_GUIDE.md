# 🚀 Universal Deployment Guide (Hostinger, Netlify, Vercel, GitHub Pages, Docker)

OneHost Application is optimized to run smoothly on **ANY** hosting provider or cloud platform with zero code changes needed.

---

## 1. 🌐 Hostinger Deployment Guide

### Option A: Hostinger Shared Hosting (cPanel / hPanel Upload)
1. Run build command in terminal:
   ```bash
   npm run build
   ```
2. Go to Hostinger **hPanel** -> **File Manager** -> Open `public_html`.
3. Upload all contents inside the **`dist/`** folder directly into `public_html`.
4. The included `.htaccess` file inside `public/` automatically handles single-page routing without 404 errors on page refresh!

---

### Option B: Hostinger VPS / Node.js Application
1. Connect to VPS via SSH.
2. Clone repository & install dependencies:
   ```bash
   npm install
   npm run build
   ```
3. Start Node application with PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/server.cjs --name "onehost-app"
   ```

---

## 2. ⚡ Netlify Deployment Guide
1. Push repository to GitHub or drag-and-drop the `dist` folder on [Netlify Drop](https://app.netlify.com/drop).
2. Connect repository to Netlify:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Netlify will automatically detect `netlify.toml` and configure SPA redirects (`/*` -> `/index.html`).

---

## 3. ▲ Vercel Deployment Guide
1. Import repository on [Vercel Dashboard](https://vercel.com/new).
2. Framework Preset: **Vite / Other**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**. Vercel will automatically use `vercel.json` for routing!

---

## 4. 🐙 GitHub Pages Deployment Guide
1. In `package.json`, ensure `"build": "vite build"`.
2. Push code to GitHub.
3. Install `gh-pages` package (optional) or create a GitHub Action workflow to deploy `dist/` folder to `gh-pages` branch.
4. Set GitHub Repository Settings -> Pages -> Source: `gh-pages` branch.

---

## 5. 🐳 Docker / Render / Railway Container Deployment
1. Build & run Docker container locally or on cloud:
   ```bash
   docker build -t onehost-app .
   docker run -p 3000:3000 onehost-app
   ```
2. Render / Railway will auto-detect `Dockerfile` and deploy the Node production server.

---

## 💡 Client-Side AI Fallback Feature
Even on purely static hosts (like Hostinger Shared Hosting or GitHub Pages where Node.js server isn't running), users can enter their **Google AI Studio API Key** in the UI settings, and all 9 Gemini AI Agents will run **100% directly inside the user's browser**!
