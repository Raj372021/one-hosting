import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  Zap,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const InvitesView: React.FC = () => {
  const { user, saveBankDetails, requestPayout, referralSales } = useAuth();
  const { showToast } = useToast();

  const [bankAccountName, setBankAccountName] = useState(user?.bankDetails?.accountName || 'Raj Sahani');
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || 'HDFC Bank');
  const [bankAccountNumber, setBankAccountNumber] = useState(user?.bankDetails?.accountNumber || '5010023948123');
  const [bankIfsc, setBankIfsc] = useState(user?.bankDetails?.ifsc || 'HDFC0001234');
  const [bankUpiId, setBankUpiId] = useState(user?.bankDetails?.upiId || 'rajsahani@upi');
  const [bankPhone, setBankPhone] = useState(user?.bankDetails?.phone || user?.phone || '+91 98765 43210');

  const userReferrals = referralSales.filter(s => s.referrerCode === (user?.referralCode || 'RAJ500'));

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="invites-rewards-hub">
      {/* TOP HERO BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-purple-950 border border-amber-500/40 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
              <Gift className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Invite & Earn Cash Rewards</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase">
                  DIRECT BANK TRANSFER
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Invite developers, students, or business owners. Earn up to <strong className="text-amber-300">₹10,000 Cash</strong> transferred straight to your bank account or UPI!
              </p>
            </div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invites Completed</span>
            <span className="text-2xl font-black text-amber-300">{user?.invitedCount || 520} Users</span>
          </div>
        </div>

        {/* REFERRAL LINK & CODE SHARING BOX */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 space-y-1">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Your Unique Referral Code
            </label>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 font-mono font-black text-amber-300 text-sm flex items-center justify-between">
              <span>{user?.referralCode || 'RAJ500'}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">100% Verified</span>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const url = `https://onehost.cloud/join?ref=${user?.referralCode || 'RAJ500'}`;
                navigator.clipboard.writeText(url);
                showToast('Referral link copied to clipboard!', 'success');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Referral Link</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hey! Build AI apps & websites in 60 seconds with OneHost AI. Join using my referral code ${user?.referralCode || 'RAJ500'} to get free AI credits! https://onehost.cloud/join?ref=${user?.referralCode || 'RAJ500'}`)}`}
              target="_blank"
              rel="noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>💬 Share on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* REWARD TIERS MILESTONES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Invite Milestone Cash Rewards (Direct Bank Payouts)</span>
          </h3>
          <span className="text-xs text-slate-400">Guaranteed Cash for Every Milestone</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Milestone 1 */}
          <div className="p-4 rounded-2xl border bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">MILESTONE 1</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black">UNLOCKED 🔓</span>
              </div>
              <h4 className="text-lg font-black text-white">500 Invites</h4>
              <div className="text-2xl font-black text-amber-400">₹1,000 Cash</div>
              <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">520 / 500 Completed</div>
          </div>

          {/* Milestone 2 */}
          <div className="p-4 rounded-2xl border bg-slate-950 border-slate-800 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">MILESTONE 2</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">IN PROGRESS</span>
              </div>
              <h4 className="text-lg font-black text-white">1,000 Invites</h4>
              <div className="text-2xl font-black text-purple-400">₹2,000 Cash</div>
              <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
            </div>
            <div className="text-[10px] text-slate-400 font-bold">520 / 1000 (52%)</div>
          </div>

          {/* Milestone 3 */}
          <div className="p-4 rounded-2xl border bg-slate-950 border-slate-800 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">MILESTONE 3</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">IN PROGRESS</span>
              </div>
              <h4 className="text-lg font-black text-white">3,000 Invites</h4>
              <div className="text-2xl font-black text-cyan-400">₹6,000 Cash</div>
              <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
            </div>
            <div className="text-[10px] text-slate-400 font-bold">520 / 3000 (17%)</div>
          </div>

          {/* Milestone 4 */}
          <div className="p-4 rounded-2xl border bg-slate-950 border-slate-800 space-y-3 text-center flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold">MILESTONE 4</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">IN PROGRESS</span>
              </div>
              <h4 className="text-lg font-black text-white">5,000 Invites</h4>
              <div className="text-2xl font-black text-emerald-400">₹10,000 Cash</div>
              <p className="text-[11px] text-slate-400">Direct Account Transfer</p>
            </div>
            <div className="text-[10px] text-slate-400 font-bold">520 / 5000 (10%)</div>
          </div>
        </div>
      </div>

      {/* BANK DETAILS & UPI SAVING FORM */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>Bank Account & UPI Details (For Cash Transfers)</span>
            </h3>
            <p className="text-xs text-slate-400">Save your bank details & UPI ID where cash rewards will be transferred directly.</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            🔒 SECURE ENCRYPTED
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!bankAccountName || !bankName || !bankAccountNumber || !bankIfsc || !bankUpiId) {
              showToast('Please fill out all bank and UPI details', 'error');
              return;
            }
            saveBankDetails({
              accountName: bankAccountName,
              bankName: bankName,
              accountNumber: bankAccountNumber,
              ifsc: bankIfsc,
              upiId: bankUpiId,
              phone: bankPhone
            });
            showToast('Bank Account & UPI details saved successfully!', 'success');
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Account Holder Name</label>
              <input
                type="text"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="Full Name as in Bank"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank, SBI, ICICI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Bank Account Number</label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">IFSC Code</label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none uppercase"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">UPI VPA ID (GPay / PhonePe / Paytm)</label>
              <input
                type="text"
                value={bankUpiId}
                onChange={(e) => setBankUpiId(e.target.value)}
                placeholder="e.g. user@upi or 9876543210@paytm"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Mobile Phone Number</label>
              <input
                type="text"
                value={bankPhone}
                onChange={(e) => setBankPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Bank & UPI Details</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user?.bankDetails) {
                  showToast('Please save your Bank Details & UPI ID first!', 'error');
                  return;
                }
                const success = requestPayout('500 Invites Milestone Reward', 1000, 500);
                if (success) {
                  showToast('💸 Cash Payout Request submitted! Admin will transfer ₹1,000 to your bank shortly.', 'success');
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💸 Request Direct Cash Payout (₹1,000)</span>
            </button>
          </div>
        </form>
      </div>

      {/* REFERRED SALES TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Referred Customers & Qualified Purchases ({userReferrals.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Live Referral Commission</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Sale ID</th>
                <th className="py-2.5 px-3">Referred Customer</th>
                <th className="py-2.5 px-3">Purchased Plan</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3 text-right">Referral Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
              {userReferrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                    No qualified purchases recorded yet. Share your referral link!
                  </td>
                </tr>
              ) : (
                userReferrals.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-white">{sale.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{sale.referredCustomerName}</span>
                      <span className="text-[10px] text-slate-400">{sale.referredCustomerEmail}</span>
                    </td>
                    <td className="py-3 px-3 text-amber-300 font-bold">{sale.planName}</td>
                    <td className="py-3 px-3 text-emerald-400 font-extrabold">₹{sale.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        QUALIFIED ✅
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
