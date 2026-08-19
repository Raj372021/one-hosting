import React, { useState } from 'react';
import {
  Server,
  Folder,
  Database,
  Terminal,
  ShieldCheck,
  Clock,
  HardDrive,
  Cpu,
  Activity,
  FileCode,
  Plus,
  Trash2,
  ExternalLink,
  Play,
  X,
  Lock,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { HostingAccount, FileItem, DatabaseUser, CronJob } from '../types';
import { useToast } from '../context/ToastContext';

interface HostingControlPanelModalProps {
  hosting: HostingAccount | null;
  onClose: () => void;
}

export const HostingControlPanelModal: React.FC<HostingControlPanelModalProps> = ({ hosting, onClose }) => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'metrics' | 'files' | 'databases' | 'terminal' | 'ssl' | 'cron'>('metrics');

  // File Manager State
  const [fileList, setFileList] = useState<FileItem[]>([
    { name: 'public_html', type: 'folder', size: '-', modified: '2026-07-28 09:00' },
    { name: 'public_html/index.php', type: 'file', size: '2.4 KB', modified: '2026-07-27 10:11' },
    { name: 'public_html/style.css', type: 'file', size: '12.8 KB', modified: '2026-07-26 18:05' },
    { name: 'public_html/.htaccess', type: 'file', size: '840 B', modified: '2026-07-10 11:00' },
    { name: 'ssl_certificates', type: 'folder', size: '-', modified: '2026-07-01 09:00' }
  ]);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState<string | null>(null);

  // Databases State
  const [dbList, setDbList] = useState<DatabaseUser[]>([
    { id: 'db_1', hostingId: hosting?.id || '', name: 'wp_techventure_db', user: 'wp_admin', sizeMb: 42.5, type: 'MySQL 8.0' },
    { id: 'db_2', hostingId: hosting?.id || '', name: 'app_analytics_db', user: 'db_user', sizeMb: 118.2, type: 'PostgreSQL 16' }
  ]);
  const [newDbName, setNewDbName] = useState('');
  const [newDbUser, setNewDbUser] = useState('');

  // SSH Terminal Simulator State
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Linux kernel 6.8.0-40-generic x86_64 x86_64 GNU/Linux',
    `Connected to OneHost Cloud Node: ${hosting?.serverIp || '185.199.108.153'} [${hosting?.datacenter || 'Mumbai'}]`,
    'Type "help" for a list of available SSH commands.'
  ]);
  const [terminalCommand, setTerminalCommand] = useState('');

  // SSL State
  const [sslActive, setSslActive] = useState(hosting?.sslActive ?? true);

  if (!hosting) return null;

  const handleRunTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalCommand.trim();
    if (!cmd) return;

    let output = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      output = 'Available commands: top, df -h, node -v, php -v, git status, ls -la, uname -a, ping, clear';
    } else if (lower === 'clear') {
      setTerminalHistory([]);
      setTerminalCommand('');
      return;
    } else if (lower === 'top') {
      output = 'CPU: 18.4% user, 4.2% sys | RAM: 2.1GB / 4.0GB Used (52%) | Processes: 42 running';
    } else if (lower === 'df -h') {
      output = 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p1  100G   14G   86G  14% /public_html';
    } else if (lower === 'node -v') {
      output = 'v20.11.0 (LTS Active)';
    } else if (lower === 'php -v') {
      output = 'PHP 8.3.10 (cli) (built: Jul 12 2026 14:02:18) (NTS)';
    } else if (lower === 'git status') {
      output = 'On branch main\nYour branch is up to date with "origin/main".\nnothing to commit, working tree clean';
    } else if (lower === 'ls -la') {
      output = 'drwxr-xr-x  4 root root 4096 Jul 28 09:00 .\ndrwxr-xr-x 12 root root 4096 Jul 28 09:00 ..\n-rw-r--r--  1 root root  840 Jul 10 11:00 .htaccess\n-rw-r--r--  1 root root 2420 Jul 27 10:11 index.php\n-rw-r--r--  1 root root 12800 Jul 26 18:05 style.css';
    } else {
      output = `bash: ${cmd}: command executed successfully with code 0.`;
    }

    setTerminalHistory(prev => [...prev, `$ ${cmd}`, output]);
    setTerminalCommand('');
  };

  const handleCreateDb = () => {
    if (!newDbName.trim() || !newDbUser.trim()) {
      showToast('Database name and username required', 'error');
      return;
    }
    const newDb: DatabaseUser = {
      id: 'db_' + Date.now(),
      hostingId: hosting.id,
      name: newDbName.trim(),
      user: newDbUser.trim(),
      sizeMb: 0.1,
      type: 'MySQL 8.0'
    };
    setDbList([...dbList, newDb]);
    setNewDbName('');
    setNewDbUser('');
    showToast(`Created database ${newDb.name}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-lg text-white flex items-center gap-2">
                <span>cPanel Hosting Control Panel</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {hosting.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Domain: {hosting.domain} | IP: {hosting.serverIp}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>← Back / Close</span>
          </button>
        </div>

        {/* Control Panel Tabs Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-slate-950/50 border-b border-slate-800 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-3 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'metrics'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Server Health</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-3 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'files'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>File Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('databases')}
            className={`px-4 py-3 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'databases'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Databases</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-4 py-3 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'terminal'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Web SSH Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab('ssl')}
            className={`px-4 py-3 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'ssl'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SSL & Security</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Metrics & Health */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Resource Gauge Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-indigo-400" /> CPU Usage</span>
                    <span className="font-bold text-white">{hosting.cpuUsagePct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${hosting.cpuUsagePct}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-purple-400" /> RAM Usage</span>
                    <span className="font-bold text-white">{hosting.ramUsagePct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${hosting.ramUsagePct}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-cyan-400" /> NVMe SSD</span>
                    <span className="font-bold text-white">{(hosting.diskUsedMb / 1024).toFixed(1)} GB / {(hosting.diskTotalMb / 1024).toFixed(0)} GB</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-400" /> Bandwidth</span>
                    <span className="font-bold text-white">{hosting.bandwidthUsedGb} GB / {hosting.bandwidthTotalGb} GB</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>
              </div>

              {/* Server Specifications */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="font-bold text-sm text-white">Cloud Instance Configuration</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500">Datacenter Region</div>
                    <div className="font-bold text-slate-200 mt-0.5">{hosting.datacenter}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">PHP Version</div>
                    <div className="font-bold text-slate-200 mt-0.5">PHP {hosting.phpVersion}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Node.js Engine</div>
                    <div className="font-bold text-slate-200 mt-0.5">Node {hosting.nodeVersion}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Auto Renewal</div>
                    <div className="font-bold text-emerald-400 mt-0.5">ENABLED ({new Date(hosting.renewAt).toLocaleDateString()})</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Web Server Engine</div>
                    <div className="font-bold text-slate-200 mt-0.5">LiteSpeed Enterprise</div>
                  </div>
                  <div>
                    <div className="text-slate-500">DDoS Mitigation</div>
                    <div className="font-bold text-cyan-400 mt-0.5">Cloudflare Magic Transit</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: File Manager */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400">Path: /home/{hosting.domain}/public_html</div>
                <button
                  onClick={() => showToast('File upload simulated successfully!', 'success')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>

              <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                      <th className="p-3">File / Folder Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Size</th>
                      <th className="p-3">Last Modified</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {fileList.map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="p-3 flex items-center gap-2 font-semibold text-white">
                          {file.type === 'folder' ? <Folder className="w-4 h-4 text-indigo-400" /> : <FileCode className="w-4 h-4 text-cyan-400" />}
                          <span>{file.name}</span>
                        </td>
                        <td className="p-3 text-slate-400 uppercase">{file.type}</td>
                        <td className="p-3 text-slate-400">{file.size}</td>
                        <td className="p-3 text-slate-400">{file.modified}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedFileContent(`<?php\n// OneHost Cloud Web Hosting File Editor\n// File: ${file.name}\necho "Hello from ${hosting.domain}!";\n?>`);
                              setEditingFileName(file.name);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 hover:bg-slate-700 font-sans text-[11px] font-bold mr-2"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Code Editor Modal View */}
              {editingFileName && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Editing File: {editingFileName}</span>
                    <button onClick={() => setEditingFileName(null)} className="text-slate-400 hover:text-white">
                      Close Editor
                    </button>
                  </div>
                  <textarea
                    value={selectedFileContent || ''}
                    onChange={e => setSelectedFileContent(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      showToast(`Saved changes to ${editingFileName}!`, 'success');
                      setEditingFileName(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Save File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Databases */}
          {activeTab === 'databases' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-400">Create MySQL / PostgreSQL Database</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newDbName}
                    onChange={e => setNewDbName(e.target.value)}
                    placeholder="Database Name (e.g. wp_db)"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newDbUser}
                    onChange={e => setNewDbUser(e.target.value)}
                    placeholder="Database Username"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={handleCreateDb}
                    className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create DB</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-400">Active Database Users ({dbList.length})</div>
                <div className="border border-slate-800 rounded-2xl bg-slate-950 overflow-hidden text-xs font-mono">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold">
                        <th className="p-3">Database Name</th>
                        <th className="p-3">DB User</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Size</th>
                        <th className="p-3 text-right">Tool</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dbList.map(db => (
                        <tr key={db.id} className="hover:bg-slate-900/50">
                          <td className="p-3 text-white font-bold">{db.name}</td>
                          <td className="p-3 text-slate-300">{db.user}</td>
                          <td className="p-3 text-indigo-400 font-bold">{db.type}</td>
                          <td className="p-3 text-slate-400">{db.sizeMb} MB</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => showToast('Opening phpMyAdmin Web Console...', 'info')}
                              className="px-3 py-1 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 font-sans text-[11px] font-bold flex items-center gap-1 ml-auto"
                            >
                              <span>phpMyAdmin</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Web SSH Terminal */}
          {activeTab === 'terminal' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 h-80 overflow-y-auto space-y-1">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">{line}</div>
                ))}
              </div>

              <form onSubmit={handleRunTerminalCommand} className="flex gap-2">
                <input
                  type="text"
                  value={terminalCommand}
                  onChange={e => setTerminalCommand(e.target.value)}
                  placeholder="Type command (e.g. top, node -v, git status, df -h, help)..."
                  className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Run Command
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: SSL & Security */}
          {activeTab === 'ssl' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Let’s Encrypt Wildcard SSL</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      TLS 1.3 ACTIVE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Automatic SSL Certificate Renewal for {hosting.domain}</div>
                </div>

                <button
                  onClick={() => {
                    setSslActive(!sslActive);
                    showToast(sslActive ? 'SSL Disabled' : 'Instant SSL Certificate Issued!', sslActive ? 'info' : 'success');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    sslActive ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {sslActive ? 'Re-Issue SSL' : 'Install Free SSL'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
