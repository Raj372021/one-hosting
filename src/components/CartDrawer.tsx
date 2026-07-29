import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RazorpayModal } from './RazorpayModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvoice: (invoice: any) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenInvoice }) => {
  const { cart, removeFromCart, clearCart, formatPrice } = useAuth();
  const { showToast } = useToast();

  const [promoCode, setPromoCode] = useState('ONEHOST50');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('ONEHOST50');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Apply 50% promo code if active
  const calculatedDiscount = appliedCoupon ? Math.min(rawSubtotal * 0.5, 1000) : 0;
  const netSubtotal = Math.max(0, rawSubtotal - calculatedDiscount);
  const gstTax = Math.round(netSubtotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((netSubtotal + gstTax) * 100) / 100;

  const handleApplyCoupon = () => {
    if (promoCode.trim().toUpperCase() === 'ONEHOST50') {
      setAppliedCoupon('ONEHOST50');
      showToast('Promo code ONEHOST50 applied! 50% OFF unlocked.', 'success');
    } else {
      showToast('Invalid promo code. Try ONEHOST50', 'error');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
        <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-base text-white">Your Cart</div>
                  <div className="text-xs text-slate-400">{cart.length} item(s) selected</div>
                </div>
              </div>
            </div>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 stroke-1 text-slate-600" />
                <div className="font-semibold text-slate-300">Your cart is currently empty</div>
                <div className="text-xs">Explore hosting plans or search for domain names to add items.</div>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      {item.type}
                    </span>
                    <div className="font-bold text-sm text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.details}</div>
                    <div className="text-xs font-bold text-indigo-400 pt-1">{formatPrice(item.price)}</div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary & Checkout Bar */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
              {/* Promo Code Box */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono uppercase text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{formatPrice(rawSubtotal)}</span>
                </div>
                {calculatedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (ONEHOST50):</span>
                    <span>-{formatPrice(calculatedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>18% GST Tax:</span>
                  <span className="text-white font-medium">{formatPrice(gstTax)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Total Payable:</span>
                  <span className="text-lg text-indigo-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Razorpay Launch Button */}
              <button
                onClick={() => setIsRazorpayOpen(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Razorpay Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        subtotal={rawSubtotal}
        discount={calculatedDiscount}
        appliedCoupon={appliedCoupon || undefined}
        items={cart}
        onSuccess={invoice => {
          clearCart();
          onClose();
          onOpenInvoice(invoice);
        }}
      />
    </>
  );
};
