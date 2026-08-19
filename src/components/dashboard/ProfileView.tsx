import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Check,
  Lock,
  Mail,
  Phone,
  Building,
  Key,
  Shield,
  ExternalLink,
  Crown,
  Activity,
  Server,
  Users,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, setCurrentView, login, loginWithGoogle, logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [gstin, setGstin] = useState(user?.gstin || '27AABCU9603R1ZM');
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileApiKey, setProfileApiKey] = useState(() => localStorage.getItem('onehost_google_api_key') || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileApiKey.trim()) {
      localStorage.setItem('onehost_google_api_key', profileApiKey.trim());
    } else {
      localStorage.removeItem('onehost_google_api_key');
    }
    updateProfile({
      name,
      email,
      phone,
      gstin,
      twoFactorEnabled: twoFactor
    });
    showToast('✅ Account profile, API key, and security preferences updated successfully!', 'success');
  };

  const handleToggleAdminRole = () => {
    if (user?.role === 'admin') {
      updateProfile({ role: 'user' });
      showToast('Switched to Standard User Role', 'info');
    } else {
      updateProfile({ role: 'admin' });
      showToast('🌟 Super Admin Privileges Activated!', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="account-profile-view">
      {/* TOP HEADER */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{user?.name || 'Account Settings'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                VERIFIED ACCOUNT ✅
              </span>
              {user?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" />
                  SUPER ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • Account ID: #{user?.id || 'usr_1'}</p>
          </div>
        </div>

        {/* Quick Admin Access Button */}
        <button
          type="button"
          onClick={() => setCurrentView('admin')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer transition-all hover:scale-105"
        >
          <Shield className="w-4 h-4 text-amber-300" />
          <span>Launch Admin Command Center</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>

      {/* ADMIN PANEL INSIDE ACCOUNT PROFILE */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Admin Panel & System Governance</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  MANAGEMENT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Access full system analytics, profit margins, user directory, server health, and affiliate payouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAdminRole}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                user?.role === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {user?.role === 'admin' ? 'Role: SUPER ADMIN 👑' : 'Grant Admin Privileges'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setCurrentView('admin')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300" />
            </div>
            <div className="font-bold text-xs text-white">Users & Hosting Accounts</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Manage customer plans, VPS nodes, and registrations</div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('admin')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300" />
            </div>
            <div className="font-bold text-xs text-white">Price Margins & Revenue</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Control dynamic pricing, GST tax, and profit markups</div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('admin')}
            className="p-4 rounded-2xl bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Server className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300" />
            </div>
            <div className="font-bold text-xs text-white">Affiliate Payout Approvals</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Review UPI and bank transfer rewards requests</div>
          </button>
        </div>
      </div>

      {/* PROFILE DETAILS FORM */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            <span>Personal & Business Information</span>
          </h3>
          <p className="text-xs text-slate-400">Update your primary contact details and GST identification number for invoices.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Email Address (Login ID)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Mobile Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Company / GSTIN Number (Optional)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27AABCU9603R1ZM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none uppercase font-mono"
              />
            </div>
          </div>

          {/* TWO FACTOR AUTH & SECURITY */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-400">Protect your account with OTP verification on every login.</span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  twoFactor
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {twoFactor ? 'ENABLED 🟢' : 'DISABLED ⏸️'}
              </button>
            </div>
          </div>

          {/* GOOGLE CONNECTED ACCOUNT STATUS */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Google OAuth Authentication</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">CONNECTED</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Linked to {user?.email || 'rajsahani.RgcS@gmail.com'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginWithGoogle('rajsahani.RgcS@gmail.com', 'Raj Sahani');
                    showToast('✅ Re-authenticated with Google OAuth', 'success');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Google</span>
                </button>
              </div>
            </div>
          </div>

          {/* GOOGLE GEMINI AI API KEY CONFIGURATION */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Google Gemini API Key</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      profileApiKey ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {profileApiKey ? 'CUSTOM KEY ACTIVE' : 'FREE SYSTEM TIER'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Custom Google AI Studio API key used across all AI builders and tools</span>
                </div>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type="password"
                value={profileApiKey}
                onChange={(e) => setProfileApiKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to use default system key)"
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
              />
              {profileApiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileApiKey('');
                    localStorage.removeItem('onehost_google_api_key');
                    showToast('Custom API Key cleared.', 'info');
                  }}
                  className="absolute right-2 top-2 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[10px] font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Save Profile & Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                showToast('Signed out of OneHost Cloud successfully', 'info');
              }}
              className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-red-100 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
