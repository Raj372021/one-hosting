import React from 'react';
import { Printer, Download, CheckCircle2, Building2, ShieldCheck, X, FileText } from 'lucide-react';
import { InvoiceItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface InvoicePdfModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
}

export const InvoicePdfModal: React.FC<InvoicePdfModalProps> = ({ invoice, onClose }) => {
  const { user, formatPrice } = useAuth();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 font-bold text-sm">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Tax Invoice #{invoice.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable GST Tax Invoice Body */}
        <div className="p-8 sm:p-10 space-y-8 print:p-0">
          {/* Company & Client Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <div className="text-2xl font-black tracking-tight text-indigo-900 flex items-center gap-2">
                <span>OneHost Cloud</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">TAX INVOICE</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">OneHost Cloud Solutions India Pvt. Ltd.</p>
              <p className="text-xs text-slate-500">Tier-4 Cloud Data Center, BKC, Mumbai - 400051</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">GSTIN: 27AABCU9603R1ZM</p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1">
              <div className="font-bold text-base text-slate-900">Invoice #{invoice.id}</div>
              <div className="text-slate-600">Date: {new Date(invoice.date).toLocaleDateString()}</div>
              <div className="text-slate-600">Transaction ID: {invoice.transactionId}</div>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                STATUS: PAID
              </div>
            </div>
          </div>

          {/* Billed To Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Billed To Customer:</div>
              <div className="font-bold text-sm text-slate-900">{user?.name || 'Raj Sahani'}</div>
              <div className="text-slate-600">{user?.email || 'rajsahani.RgcS@gmail.com'}</div>
              <div className="text-slate-600">Phone: +91 98765 43210</div>
            </div>
            <div>
              <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Customer GSTIN:</div>
              <div className="font-mono text-slate-800 font-bold">{invoice.gstin || '27AABCU9603R1ZM'}</div>
              <div className="text-slate-600 mt-1">Payment via: {invoice.paymentMethod}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-500 font-bold uppercase">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Taxable Amount</th>
                  <th className="py-2 text-right">GST Rate</th>
                  <th className="py-2 text-right">GST Amount</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 font-semibold text-slate-800">{invoice.description}</td>
                  <td className="py-3 text-right">{formatPrice(invoice.amountSubtotal)}</td>
                  <td className="py-3 text-right">18% (9% CGST + 9% SGST)</td>
                  <td className="py-3 text-right">{formatPrice(invoice.gstAmount)}</td>
                  <td className="py-3 text-right font-bold text-slate-900">{formatPrice(invoice.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-2 text-xs border-t border-slate-300 pt-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax):</span>
                <span>{formatPrice(invoice.amountSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>18% GST (CGST 9% + SGST 9%):</span>
                <span>{formatPrice(invoice.gstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                <span>Grand Total:</span>
                <span className="text-indigo-900">{formatPrice(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 text-center space-y-1">
            <p className="font-semibold text-slate-700">Thank you for choosing OneHost Cloud!</p>
            <p>This is a computer-generated tax invoice issued in accordance with Rule 46 of the CGST Rules, 2017.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
