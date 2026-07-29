import React, { useState } from 'react';
import { ShieldCheck, QrCode, CreditCard, Building, Wallet, CheckCircle2, Lock, X, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createBillingOrder } from '../services/api';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  items: any[];
  onSuccess: (invoice: any) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  discount,
  appliedCoupon,
  items,
  onSuccess
}) => {
  const { formatPrice, user } = useAuth();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('raj@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');

  if (!isOpen) return null;

  const finalSubtotal = Math.max(0, subtotal - discount);
  const gstAmount = Math.round(finalSubtotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((finalSubtotal + gstAmount) * 100) / 100;

  const handlePayNow = async () => {
    setIsProcessing(true);

    // Simulate Razorpay Gateway API response latency
    setTimeout(async () => {
      const res = await createBillingOrder({
        items,
        subtotal: finalSubtotal,
        couponCode: appliedCoupon,
        paymentMethod: `Razorpay ${paymentMethod.toUpperCase()}`
      });

      setIsProcessing(false);
      if (res.success && res.invoice) {
        showToast('Payment successful! Auto GST Invoice generated.', 'success');
        onSuccess(res.invoice);
        onClose();
      } else {
        showToast('Payment processing failed. Please try again.', 'error');
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar with Back Button */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Go Back to Cart"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-base text-white flex items-center gap-2">
                  <span>Razorpay Checkout</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    256-BIT SECURE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">OneHost Cloud Payment Gateway</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Form Content */}
        <div className="p-6 space-y-6">
          {/* Order Calculation Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Items Subtotal:</span>
              <span className="text-slate-200 font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Promo Code Discount ({appliedCoupon}):</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>GST Tax Breakdown (18% CGST/SGST):</span>
              <span className="text-slate-200 font-medium">{formatPrice(gstAmount)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Grand Total Payable:</span>
              <span className="text-xl text-indigo-400">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <span>Cards</span>
              </button>

              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-5 h-5 text-purple-400" />
                <span>NetBanking</span>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                  paymentMethod === 'wallet'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Wallet className="w-5 h-5 text-cyan-400" />
                <span>Wallet</span>
              </button>
            </div>
          </div>

          {/* Method Details */}
          {paymentMethod === 'upi' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white rounded-xl shadow-lg">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=onehost@razorpay&pn=OneHostCloud&am=588.82&cu=INR"
                  alt="UPI QR Code"
                  className="w-28 h-28"
                />
              </div>
              <div className="text-xs text-slate-300">
                Scan with <span className="text-white font-bold">Google Pay, PhonePe, Paytm, or BHIM</span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="or enter VPA (e.g. name@upi)"
                className="w-full max-w-xs px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white text-center focus:outline-none"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none font-mono"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  defaultValue="12/28"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
                <input
                  type="password"
                  defaultValue="882"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400 font-medium">Select Bank:</div>
              <div className="grid grid-cols-2 gap-2 font-semibold">
                <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-indigo-500">
                  HDFC Bank
                </button>
                <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-indigo-500">
                  State Bank of India
                </button>
                <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-indigo-500">
                  ICICI Bank
                </button>
                <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-left hover:border-indigo-500">
                  Axis Bank
                </button>
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>OneHost Wallet Balance:</span>
                <span className="font-bold text-emerald-400">{formatPrice(user?.walletBalance || 0)}</span>
              </div>
              <div className="text-slate-500">
                Sufficient funds available in your account wallet balance.
              </div>
            </div>
          )}

          {/* Submit Payment CTA with Back Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Razorpay Webhook...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Pay {formatPrice(grandTotal)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
