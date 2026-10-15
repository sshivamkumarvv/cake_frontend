'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../lib/cart-context';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    total,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 1999;
  const differenceToFreeDelivery = freeDeliveryThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FAF8F5] shadow-2xl flex flex-col z-10 border-l border-[#E6F0E2] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#EFE9DF] bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#283625]" />
            <h2 className="font-serif font-bold text-lg text-[#253322]">
              Your Tasting Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart"
            className="p-2 text-[#736B63] hover:text-[#253322] rounded-full hover:bg-[#F2EDE4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery banner progress */}
        <div className="bg-[#E6F0E2] px-5 py-2.5 border-b border-[#D0E2CA] text-xs">
          {differenceToFreeDelivery > 0 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[#283625] font-medium">
                <span>Add ₹{differenceToFreeDelivery} more for Free Delivery</span>
                <span>{Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%</span>
              </div>
              <div className="w-full bg-[#D0E2CA] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#6B8B62] h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#283625] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#DE9E62]" />
              <span>Congratulations! You unlocked Free Local Delivery.</span>
            </div>
          )}
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EFE9DF]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#E6F0E2] flex items-center justify-center text-[#6B8B62]">
                <ShoppingBag className="w-9 h-9" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#253322]">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#736B63] mt-1 max-w-xs mx-auto">
                  Treat yourself or a loved one to fresh handcrafted cakes or enroll in our online baking masterclasses.
                </p>
              </div>
              <Link
                href="/cakes"
                onClick={() => setIsCartDrawerOpen(false)}
                className="inline-flex items-center gap-2 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
              >
                Browse Cake Menu <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="py-4 first:pt-0 flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E6F0E2]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.type === 'course' && (
                    <span className="absolute bottom-1 left-1 bg-[#283625]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Course
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#253322] leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        aria-label="Remove item"
                        className="text-[#B0CEAA] hover:text-red-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.weight && (
                        <span className="text-[10px] bg-[#FAF8F5] text-[#546F4D] border border-[#D0E2CA] px-1.5 py-0.5 rounded">
                          {item.weight}
                        </span>
                      )}
                      {item.isEggless && (
                        <span className="text-[10px] bg-[#E6F0E2] text-[#283625] px-1.5 py-0.5 rounded font-medium">
                          🌱 100% Eggless
                        </span>
                      )}
                      {item.flavor && (
                        <span className="text-[10px] text-[#736B63] truncate max-w-[150px]">
                          {item.flavor}
                        </span>
                      )}
                    </div>

                    {item.customMessage && (
                      <p className="text-[10px] text-[#6B8B62] italic mt-1 bg-white p-1 rounded border border-[#EFE9DF]">
                        &quot;{item.customMessage}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#D0E2CA] rounded-full bg-white px-2 py-0.5 gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-[#546F4D] hover:text-[#253322] p-0.5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold text-[#253322] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-[#546F4D] hover:text-[#253322] p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-sm text-[#253322]">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals & checkout */}
        {items.length > 0 && (
          <div className="p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:pb-5 border-t border-[#EFE9DF] bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#736B63]">
                <span>Subtotal</span>
                <span className="font-medium text-[#253322]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#736B63]">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-[#6B8B62] font-semibold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-serif font-bold text-base text-[#253322] pt-2 border-t border-[#EFE9DF]">
                <span>Total</span>
                <span className="text-[#283625]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 px-4 text-center border border-[#9CB894] hover:bg-[#E6F0E2] text-[#283625] text-xs font-semibold rounded-full transition-colors"
              >
                View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 px-4 text-center bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Checkout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[10px] text-center text-[#736B63]">
              Temperature-controlled safe delivery • 100% handcrafted freshness
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
