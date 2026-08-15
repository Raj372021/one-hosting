import React, { useState } from 'react';
import {
  Server,
  Globe,
  Rocket,
  Sparkles,
  CheckCircle2,
  Settings,
  ExternalLink,
  Plus,
  RefreshCw,
  FileCode,
  HardDrive,
  Database,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { HostingAccount } from '../../types';
import { AiWebsiteBuilderHub } from '../AiWebsiteBuilderHub';

interface WebsitesViewProps {
  subTab?: 'wordpress' | 'horizons' | 'builder' | 'webapps' | 'php' | 'migrations';
  hostingAccounts: HostingAccount[];
  onOpenCpanel: (host: HostingAccount) => void;
  onAddTicket?: (title: string, category: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT', message: string) => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  subTab = 'wordpress',
  hostingAccounts,
  onOpenCpanel,
  onAddTicket
}) => {
  const { setCurrentView } = useAuth();
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<string>(subTab);

  // WordPress Form State
  const [wpDomain, setWpDomain] = useState(hostingAccounts[0]?.domain || 'my-new-store.com');
  const [wpSiteTitle, setWpSiteTitle] = useState('My Awesome WordPress Site');
  const [wpAdminUser, setWpAdminUser] = useState('admin');
  const [wpAdminPass, setWpAdminPass] = useState('OneHost_SecPass@2026');
  const [isInstallingWp, setIsInstallingWp] = useState(false);
  const [installedWpSite, setInstalledWpSite] = useState<{ domain: string; title: string; user: string } | null>(null);

  // Migration Form State
  const [migSourceUrl, setMigSourceUrl] = useState('');
  const [migOldHost, setMigOldHost] = useState('GoDaddy / Hostinger / Bluehost');
  const [migBackupUrl, setMigBackupUrl] = useState('');
  const [migNotes, setMigNotes] = useState('');

  const handleInstallWordpress = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInstallingWp(true);
    setTimeout(() => {
      setIsInstallingWp(false);
      setInstalledWpSite({
        domain: wpDomain,
        title: wpSiteTitle,
        user: wpAdminUser
      });
      showToast(`✅ WordPress successfully installed on ${wpDomain}! LiteSpeed Cache & SSL configured.`, 'success');
    }, 1200);
  };

  const handlePurgeCache = () => {
    showToast('⚡ LiteSpeed Object & Opcode Cache purged globally across all edge nodes!', 'success');
  };

  const handleCreateStaging = () => {
    showToast(`🧪 Staging clone 'staging.${wpDomain}' created with 1-click sync enabled!`, 'success');
  };

  const handleMigrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!migSourceUrl) {
      showToast('Please enter your existing website domain', 'error');
      return;
    }
    if (onAddTicket) {
      onAddTicket(
        `Website Migration Request: ${migSourceUrl}`,
        'Hosting & Server Support',
        'HIGH',
        `Old Host: ${migOldHost}\nWebsite URL: ${migSourceUrl}\nBackup / cPanel Link: ${migBackupUrl}\nNotes: ${migNotes}`
      );
    }
    showToast('🚀 Migration ticket submitted! Our server engineers will transfer your website with 0 downtime.', 'success');
    setMigSourceUrl('');
    setMigBackupUrl('');
    setMigNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* SUB TABS NAVIGATION */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        {[
          { id: 'wordpress', label: 'WordPress & LSCache', icon: Globe },
          { id: 'horizons', label: 'Horizons AI Builder', icon: Sparkles },
          { id: 'builder', label: 'AI Vibe Coder Studio', icon: Rocket },
          { id: 'webapps', label: 'Fullstack Web Apps', icon: FileCode },
          { id: 'php', label: 'PHP & MySQL Database', icon: Database },
          { id: 'migrations', label: 'Free Website Migration', icon: RefreshCw }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. WORDPRESS MANAGER */}
      {activeSubTab === 'wordpress' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-indigo-400" />
                <span>Managed WordPress & LiteSpeed Accelerator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Install WordPress in 1-Click with automatic LiteSpeed Cache plugin, Redis Object Caching, and Auto-SSL.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handlePurgeCache}
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Purge LSCache</span>
              </button>
              <button
                onClick={handleCreateStaging}
                className="py-2 px-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🧪 Create Staging Clone</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1-Click WordPress Installer */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-indigo-400" />
                <span>1-Click WordPress Quick Installer</span>
              </h3>

              <form onSubmit={handleInstallWordpress} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Target Domain</label>
                  <input
                    type="text"
                    value={wpDomain}
                    onChange={(e) => setWpDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Website Title</label>
                  <input
                    type="text"
                    value={wpSiteTitle}
                    onChange={(e) => setWpSiteTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Admin Username</label>
                    <input
                      type="text"
                      value={wpAdminUser}
                      onChange={(e) => setWpAdminUser(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Admin Password</label>
                    <input
                      type="text"
                      value={wpAdminPass}
                      onChange={(e) => setWpAdminPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isInstallingWp}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isInstallingWp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Provisioning Database & WP Core...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Install WordPress 6.7 + Free SSL</span>
                    </>
                  )}
                </button>
              </form>

              {installedWpSite && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <span className="text-xs font-black text-emerald-300 block">🎉 Installation Active!</span>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div>Site URL: <strong className="text-white">https://{installedWpSite.domain}</strong></div>
                    <div>WP Admin: <strong className="text-indigo-300">https://{installedWpSite.domain}/wp-admin</strong></div>
                    <div>Username: <strong className="text-white">{installedWpSite.user}</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Existing WordPress Sites */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Installed WordPress Deployments</span>
              </h3>

              <div className="space-y-3">
                {hostingAccounts.map((host) => (
                  <div key={host.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{host.domain}</div>
                      <div className="text-[10px] text-slate-400">WP 6.7.1 • PHP 8.3 • LSCache Active</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenCpanel(host)}
                        className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HORIZONS AI BUILDER */}
      {activeSubTab === 'horizons' && (
        <AiWebsiteBuilderHub defaultAgent="brand" />
      )}

      {/* 3. AI VIBE CODER STUDIO */}
      {activeSubTab === 'builder' && (
        <AiWebsiteBuilderHub defaultAgent="builder" />
      )}

      {/* 4. WEB APPS */}
      {activeSubTab === 'webapps' && (
        <AiWebsiteBuilderHub defaultAgent="db" />
      )}

      {/* 5. PHP & MYSQL */}
      {activeSubTab === 'php' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <span>PHP Version & MySQL Database Manager</span>
              </h3>
              <p className="text-xs text-slate-400">Switch PHP runtimes, manage phpMyAdmin, and create MariaDB/MySQL databases.</p>
            </div>
            <button
              onClick={() => {
                if (hostingAccounts.length > 0) onOpenCpanel(hostingAccounts[0]);
              }}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
            >
              Open phpMyAdmin
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">PHP Runtime</span>
              <span className="text-lg font-black text-emerald-400 block">PHP 8.3 (FastCGI)</span>
              <p className="text-[10px] text-slate-500">OPcache & JIT Enabled</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Database Server</span>
              <span className="text-lg font-black text-indigo-400 block">MariaDB 10.11</span>
              <p className="text-[10px] text-slate-500">InnoDB Buffer: 2GB</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">Web Server</span>
              <span className="text-lg font-black text-cyan-400 block">LiteSpeed Enterprise</span>
              <p className="text-[10px] text-slate-500">HTTP/3 & QUIC Active</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">SSL Engine</span>
              <span className="text-lg font-black text-amber-400 block">Auto-Renewing SSL</span>
              <p className="text-[10px] text-slate-500">Let's Encrypt Wildcard</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. MIGRATIONS */}
      {activeSubTab === 'migrations' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-400" />
              <span>Zero-Downtime Automated Website Migration</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Moving from GoDaddy, Hostinger, SiteGround or Bluehost? Our expert DevOps team migrates your entire website, databases, and emails for free!
            </p>
          </div>

          <form onSubmit={handleMigrationSubmit} className="space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Website URL to Migrate</label>
              <input
                type="text"
                value={migSourceUrl}
                onChange={(e) => setMigSourceUrl(e.target.value)}
                placeholder="e.g. https://myclientwebsite.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Current Hosting Provider</label>
              <input
                type="text"
                value={migOldHost}
                onChange={(e) => setMigOldHost(e.target.value)}
                placeholder="e.g. GoDaddy, Hostinger, Namecheap, Bluehost"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">cPanel / Backup Download Link (Optional)</label>
              <input
                type="text"
                value={migBackupUrl}
                onChange={(e) => setMigBackupUrl(e.target.value)}
                placeholder="Google Drive link or cPanel backup link"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Special Instructions / Notes</label>
              <textarea
                value={migNotes}
                onChange={(e) => setMigNotes(e.target.value)}
                rows={3}
                placeholder="Specific databases, PHP version requirement, or mail accounts to preserve..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Rocket className="w-4 h-4" />
              <span>Submit Free Migration Request</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
