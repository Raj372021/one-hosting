import React, { useState } from 'react';
import {
  Mail,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  HardDrive,
  Trash2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const EmailsView: React.FC = () => {
  const { showToast } = useToast();

  const [mailboxes, setMailboxes] = useState([
    {
      id: 'mb_1',
      email: 'contact@techventure.in',
      domain: 'techventure.in',
      quota: '10 GB',
      used: '1.2 GB',
      status: 'ACTIVE'
    },
    {
      id: 'mb_2',
      email: 'support@techventure.in',
      domain: 'techventure.in',
      quota: '10 GB',
      used: '3.4 GB',
      status: 'ACTIVE'
    }
  ]);

  const [newMailUser, setNewMailUser] = useState('');
  const [newMailDomain, setNewMailDomain] = useState('techventure.in');
  const [newMailPass, setNewMailPass] = useState('');

  const handleCreateMailbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMailUser || !newMailPass) {
      showToast('Please provide a username and password for the mailbox', 'error');
      return;
    }
    const fullEmail = `${newMailUser}@${newMailDomain}`;
    const newBox = {
      id: 'mb_' + Date.now(),
      email: fullEmail,
      domain: newMailDomain,
      quota: '10 GB',
      used: '0.0 GB',
      status: 'ACTIVE'
    };
    setMailboxes([...mailboxes, newBox]);
    showToast(`✉️ Mailbox ${fullEmail} created successfully! DKIM, SPF & DMARC active.`, 'success');
    setNewMailUser('');
    setNewMailPass('');
  };

  const handleOpenWebmail = (email: string) => {
    showToast(`🌐 Launching Webmail interface for ${email}...`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="business-emails-view">
      {/* TOP BANNER */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-400" />
            <span>Business Email Accounts & Webmail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create professional business email inboxes (you@yourdomain.com) with SpamAssassin, DKIM, SPF, and DMARC 100% deliverability.
          </p>
        </div>

        <button
          onClick={() => handleOpenWebmail('Roundcube Webmail')}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Launch Webmail Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CREATE MAILBOX FORM */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Create New Mailbox</span>
          </h3>

          <form onSubmit={handleCreateMailbox} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Mailbox Address</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newMailUser}
                  onChange={(e) => setNewMailUser(e.target.value)}
                  placeholder="e.g. hello, info, ceo"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  required
                />
                <span className="text-slate-400 text-xs font-mono">@{newMailDomain}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Mailbox Password</label>
              <input
                type="password"
                value={newMailPass}
                onChange={(e) => setNewMailPass(e.target.value)}
                placeholder="Strong mailbox password"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mailbox (10 GB NVMe Quota)</span>
            </button>
          </form>
        </div>

        {/* ACTIVE MAILBOXES TABLE */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Mailboxes ({mailboxes.length})</span>
          </h3>

          <div className="space-y-3">
            {mailboxes.map((mb) => (
              <div key={mb.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span>{mb.email}</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">ACTIVE</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Storage: {mb.used} / {mb.quota} • IMAP/SMTP/POP3 SSL Active
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenWebmail(mb.email)}
                    className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Webmail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
