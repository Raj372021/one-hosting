import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Check,
  Lock,
  Mail,
  Phone,
  Building,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [gstin, setGstin] = useState(user?.gstin || '27AABCU9603R1ZM');
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      gstin,
      twoFactorEnabled: twoFactor
    });
    showToast('✅ Account profile and security preferences updated successfully!', 'success');
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
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • Role: {user?.role?.toUpperCase()}</p>
          </div>
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

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile & Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
};
