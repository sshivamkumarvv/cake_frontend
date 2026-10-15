'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Cake,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { BAKERY_INFO } from '../../lib/data';

export function CartPageContent() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    deliveryFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCode('');
    }
  };

  const freeDeliveryThreshold = 1999;
  const diffToFree = freeDeliveryThreshold - subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#E6F0E2] text-[#6B8B62] flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#253322]">
            Your Tasting Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] max-w-md mx-auto">
            You haven&apos;t added any handcrafted celebration gateaux or baking masterclasses yet.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/cakes"
            className="px-8 py-3.5 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 shadow-sm"
          >
            <Cake className="w-4 h-4 text-[#9CB894]" /> Explore Cake Menu
          </Link>
          <Link
            href="/courses"
            className="px-8 py-3.5 bg-white hover:bg-[#E6F0E2] text-[#283625] text-xs font-bold uppercase tracking-wider rounded-full border border-[#D0E2CA] transition-colors"
          >
            Online Baking Academy
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#86A57D]">
          Bakeistry Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#253322] mt-1">
          Review Your Tasting Cart ({items.length} items)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items list */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery bar */}
          <div className="bg-[#E6F0E2] p-4 rounded-2xl border border-[#D0E2CA] text-xs space-y-2">
            <div className="flex items-center justify-between text-[#283625] font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#DE9E62]" />
                {diffToFree > 0
                  ? `Add ₹${diffToFree.toLocaleString('en-IN')} more to unlock FREE Local Delivery (${BAKERY_INFO.location})`
                  : 'You have unlocked FREE Fresh Local Delivery!'}
              </span>
              <span>{Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%</span>
            </div>
            <div className="w-full bg-[#D0E2CA] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#6B8B62] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Item Cards */}
          <div className="bg-white rounded-3xl border border-[#EFE9DF] divide-y divide-[#EFE9DF] overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={item.cartItemId} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E6F0E2]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.type === 'course' && (
                    <span className="absolute bottom-1 left-1 bg-[#283625]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Academy
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={item.type === 'cake' ? `/cakes/${item.slug}` : `/courses/${item.slug}`}
                          className="font-serif font-bold text-base sm:text-lg text-[#253322] hover:text-[#546F4D] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {item.weight && (
                            <span className="text-[10px] bg-[#FAF8F5] text-[#546F4D] border border-[#D0E2CA] px-2 py-0.5 rounded">
                              {item.weight}
                            </span>
                          )}
                          {item.isEggless && (
                            <span className="text-[10px] bg-[#E6F0E2] text-[#283625] px-2 py-0.5 rounded font-medium">
                              🌱 100% Eggless
                            </span>
                          )}
                          {item.flavor && (
                            <span className="text-[11px] text-[#736B63]">{item.flavor}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-[#736B63] hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.customMessage && (
                      <p className="text-xs text-[#6B8B62] italic mt-2 bg-[#FAF8F5] p-2 rounded-xl border border-[#EFE9DF]">
                        <strong>Message on cake:</strong> &quot;{item.customMessage}&quot;
                      </p>
                    )}

                    {item.deliverySlot && (
                      <p className="text-[11px] text-[#736B63] mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#9CB894]" />
                        <span>Slot: {item.deliveryDate} ({item.deliverySlot})</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#FAF8F5]">
                    <div className="flex items-center border border-[#D0E2CA] rounded-full bg-white px-2.5 py-1 gap-3">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-[#546F4D] hover:text-[#283625] text-xs font-bold"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#253322] w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-[#546F4D] hover:text-[#283625] text-xs font-bold"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-lg text-[#283625]">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-5">
          {/* Coupon Box */}
          <div className="bg-white p-5 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#253322] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#86A57D]" />
              Promo Code or Gift Voucher
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-[#E6F0E2] rounded-xl border border-[#D0E2CA] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#283625] block">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-[#546F4D]">{appliedCoupon.description}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FIRSTBAKE10"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D0E2CA] uppercase font-mono text-[#253322] focus:outline-none focus:border-[#6B8B62]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {couponFeedback && (
              <p
                className={`text-[11px] ${
                  couponFeedback.success ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {couponFeedback.message}
              </p>
            )}

            <div className="text-[10px] text-[#736B63] space-y-0.5 pt-1">
              <p>• Try <strong>FIRSTBAKE10</strong> for 10% off on first order</p>
              <p>• Try <strong>CHEFMITALI</strong> for ₹300 off above ₹1,500</p>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white p-6 rounded-3xl border border-[#EFE9DF] shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#253322]">
              Order Breakdown
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#736B63]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#253322]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#6B8B62] font-semibold">
                  <span>Special Coupon Savings</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#736B63]">
                <span>Estimated Local Delivery (≤ {BAKERY_INFO.deliveryRadiusKm} km)</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#6B8B62] font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EFE9DF] flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-[#253322]">
                  Payable Total
                </span>
                <span className="font-serif font-bold text-2xl text-[#283625]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#283625]/15 hover:scale-[1.02]"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="space-y-2 pt-2 text-[10px] text-[#736B63]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6B8B62]" />
                <span>Zero food preservative commitment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8B62]" />
                <span>100% money back delivery damage guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] border-t border-[#D0E2CA] lg:hidden shadow-[0_-8px_30px_rgba(40,54,37,0.12)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#736B63] block leading-tight">Payable Total</span>
          <span className="font-serif font-bold text-lg text-[#283625]">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
        <Link
          href="/checkout"
          className="flex-1 max-w-[210px] py-3.5 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>Checkout</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function CartPage() {
  return <CartPageContent />;
}
