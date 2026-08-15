import React, { useState } from 'react';
import {
  CreditCard,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { InvoiceItem } from '../../types';
import { InvoicePdfModal } from '../InvoicePdfModal';

interface InvoicesViewProps {
  invoices: InvoiceItem[];
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ invoices }) => {
  const { user, formatPrice } = useAuth();
  const { showToast } = useToast();
  const [selectedInvoicePdf, setSelectedInvoicePdf] = useState<InvoiceItem | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="invoices-billing-view">
      {/* TOP HEADER */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <CreditCard className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white">GST Invoices & Billing History</h2>
          </div>
          <p className="text-xs text-slate-400">
            View, verify, and download official 18% GST Tax Invoices and transaction receipts for all hosting, domain, and AI credit purchases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Registered GSTIN</span>
            <span className="text-xs font-mono font-bold text-amber-300">{user?.gstin || '27AABCU9603R1ZM'}</span>
          </div>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Tax Invoices & Payment Records ({invoices.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Official GST Compliant Receipts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Service Description</th>
                <th className="py-3 px-3">Payment Method</th>
                <th className="py-3 px-3">Amount (Incl. GST)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-semibold">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No billing history found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-slate-400">{inv.date}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{inv.items}</span>
                      <span className="text-[10px] text-slate-400">Sac: 998315 • 18% GST</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {inv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-emerald-400">
                      {formatPrice(inv.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedInvoicePdf(inv)}
                        className="py-1.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 font-bold text-xs flex items-center gap-1.5 ml-auto transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View PDF</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF MODAL */}
      <InvoicePdfModal
        invoice={selectedInvoicePdf}
        onClose={() => setSelectedInvoicePdf(null)}
      />
    </div>
  );
};
