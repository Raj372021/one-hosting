import React, { useState } from 'react';
import { ShieldCheck, QrCode, CreditCard, Building, Wallet, CheckCircle2, Lock, X, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createBillingOrder } from '../services/api';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  items: any[];
  onSuccess: (invoice: any) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  onBack,
  subtotal,
  discount,
  appliedCoupon,
  items,
  onSuccess
}) => {
  const { formatPrice, user, checkoutCartAndActivatePlans } = useAuth();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('raj@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');

  if (!isOpen) return null;

  const handleBack = onBack || onClose;

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
        checkoutCartAndActivatePlans();
        showToast('Payment successful! Plan instantly activated in your profile.', 'success');
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
              type="button"
              onClick={handleBack}
              className="p-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold border border-slate-700 cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Back</span>
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
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-5 h-5 text-purple-400" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
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
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-3.5 relative">
              {/* Internal Back Button for UPI/QR */}
              <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>Instant UPI / QR Code Payment</span>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-extrabold border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>← Back</span>
                </button>
              </div>

              <div className="p-3 bg-white rounded-2xl shadow-xl ring-4 ring-indigo-500/20">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=onehost@razorpay&pn=OneHostCloud&am=${grandTotal}&cu=INR`}
                  alt="UPI QR Code"
                  className="w-32 h-32"
                />
              </div>

              <div className="text-xs text-slate-300 space-y-0.5">
                <div className="font-bold text-white">Scan with any UPI App</div>
                <div className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, BHIM, or CRED</div>
              </div>

              <div className="w-full max-w-sm space-y-1.5 pt-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                  Or Enter UPI VPA ID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="e.g. name@upi"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handlePayNow}
                    disabled={isProcessing}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Pay
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>Card Details</span>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-extrabold border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>← Back</span>
                </button>
              </div>

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
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Building className="w-4 h-4 text-purple-400" />
                  <span>Select Bank</span>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-extrabold border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>← Back</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 font-semibold">
                <button type="button" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-indigo-500 text-slate-200 cursor-pointer">
                  HDFC Bank
                </button>
                <button type="button" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-indigo-500 text-slate-200 cursor-pointer">
                  State Bank of India
                </button>
                <button type="button" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-indigo-500 text-slate-200 cursor-pointer">
                  ICICI Bank
                </button>
                <button type="button" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left hover:border-indigo-500 text-slate-200 cursor-pointer">
                  Axis Bank
                </button>
              </div>
            </div>
          )}

          {paymentMethod === 'wallet' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span>OneHost Wallet Balance</span>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white text-xs font-extrabold border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>← Back</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Available Balance:</span>
                <span className="font-bold text-emerald-400 text-sm">{formatPrice(user?.walletBalance || 0)}</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Sufficient funds available in your account wallet balance.
              </p>
            </div>
          )}

          {/* Submit Payment CTA with Back Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={isProcessing}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>← Back</span>
            </button>

            <button
              type="button"
              onClick={handlePayNow}
              disabled={isProcessing}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Razorpay Webhook...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
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
