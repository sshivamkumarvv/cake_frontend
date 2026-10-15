'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Check, ShoppingBag, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { CakeProduct } from '../lib/types';
import { useCart } from '../lib/cart-context';

interface QuickViewModalProps {
  cake: CakeProduct | null;
  onClose: () => void;
}

export function QuickViewModal({ cake, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(cake?.weights[0]?.value || '0.5kg');
  const [selectedFlavor, setSelectedFlavor] = useState(cake?.flavors[0]?.id || '');
  const [isEggless, setIsEggless] = useState(cake?.isEggless ?? true);
  const [customMessage, setCustomMessage] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (cake) {
      setSelectedWeight(cake.weights[0]?.value || '0.5kg');
      setSelectedFlavor(cake.flavors[0]?.id || '');
      setIsEggless(cake.isEggless);
      setCustomMessage('');
    }
  }, [cake]);

  if (!cake) return null;

  // Calculate dynamic price based on selected weight & flavor
  const weightObj = cake.weights.find((w) => w.value === selectedWeight) || cake.weights[0];
  const flavorObj = cake.flavors.find((f) => f.id === selectedFlavor) || cake.flavors[0];
  const calculatedPrice = Math.round(cake.price * (weightObj?.multiplier || 1) + (flavorObj?.extraPrice || 0));

  const handleAddToCart = () => {
    addItem({
      type: 'cake',
      productId: cake.id,
      slug: cake.slug,
      title: cake.name,
      image: cake.images[0],
      unitPrice: calculatedPrice,
      quantity: 1,
      weight: weightObj?.label.split(' ')[0] || selectedWeight,
      flavor: flavorObj?.name || 'Signature',
      isEggless,
      customMessage: customMessage.trim() || undefined,
      deliveryDate: 'Today / Select at checkout',
      deliverySlot: '06:00 PM - 09:00 PM',
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#D0E2CA] overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#253322] shadow-sm transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image & highlights */}
        <div className="h-44 sm:h-56 md:h-auto md:w-1/2 relative bg-[#F2EDE4] shrink-0">
          <Image
            src={cake.images[0]}
            alt={cake.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#283625]/80 px-2.5 py-1 rounded-full w-max border border-[#86A57D]/40 mb-2">
              {cake.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#E6F0E2]">
              <Clock className="w-3.5 h-3.5 text-[#DE9E62]" />
              <span>{cake.preparationTime}</span>
            </div>
          </div>
        </div>

        {/* Right: Customization & Add to Cart */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-5 bg-white">
          <div>
            <div className="flex items-center gap-1 text-xs text-[#736B63] mb-1">
              <Star className="w-3.5 h-3.5 text-[#DE9E62] fill-current" />
              <span className="font-semibold text-[#253322]">{cake.rating}</span>
              <span>({cake.reviewCount} customer reviews)</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-[#253322] leading-snug">
              {cake.name}
            </h3>
            <p className="text-xs text-[#736B63] mt-1 leading-relaxed">
              {cake.tagline}
            </p>
          </div>

          {/* Price display */}
          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E6F0E2] flex items-center justify-between">
            <span className="text-xs text-[#736B63] font-medium">Configured Price</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-2xl text-[#283625]">
                ₹{calculatedPrice.toLocaleString('en-IN')}
              </span>
              {cake.originalPrice && (
                <span className="text-xs text-[#736B63] line-through">
                  ₹{(cake.originalPrice * (weightObj?.multiplier || 1)).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Size / Weight Selector */}
          <div>
            <label className="block text-xs font-bold text-[#253322] mb-2 uppercase tracking-wider">
              1. Select Weight / Servings
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cake.weights.map((w) => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setSelectedWeight(w.value)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    selectedWeight === w.value
                      ? 'border-[#283625] bg-[#E6F0E2] font-semibold text-[#253322] shadow-xs'
                      : 'border-[#EFE9DF] hover:border-[#D0E2CA] text-[#736B63]'
                  }`}
                >
                  <span className="block font-medium text-[#253322]">{w.label.split(' ')[0]} {w.label.split(' ')[1]}</span>
                  <span className="text-[10px] text-[#736B63]">
                    {w.label.includes('Serves') ? w.label.split('(')[1].replace(')', '') : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Flavor Selection */}
          {cake.flavors.length > 1 && (
            <div>
              <label className="block text-xs font-bold text-[#253322] mb-2 uppercase tracking-wider">
                2. Flavor Infusion
              </label>
              <div className="space-y-1.5">
                {cake.flavors.map((fl) => (
                  <button
                    key={fl.id}
                    type="button"
                    onClick={() => setSelectedFlavor(fl.id)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                      selectedFlavor === fl.id
                        ? 'border-[#283625] bg-[#E6F0E2] font-semibold text-[#253322]'
                        : 'border-[#EFE9DF] hover:border-[#D0E2CA] text-[#736B63]'
                    }`}
                  >
                    <div>
                      <span className="font-medium text-[#253322] block">{fl.name}</span>
                      <span className="text-[10px] text-[#736B63]">{fl.notes}</span>
                    </div>
                    {fl.extraPrice > 0 && (
                      <span className="text-[11px] font-semibold text-[#6B8B62]">
                        +₹{fl.extraPrice}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Choice (Eggless) */}
          {cake.egglessChoiceAvailable && (
            <div>
              <label className="block text-xs font-bold text-[#253322] mb-1.5 uppercase tracking-wider">
                3. Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEggless(true)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    isEggless
                      ? 'border-[#6B8B62] bg-[#E6F0E2] text-[#283625]'
                      : 'border-[#EFE9DF] text-[#736B63]'
                  }`}
                >
                  <span>🌱 100% Eggless</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEggless(false)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    !isEggless
                      ? 'border-[#6B8B62] bg-[#E6F0E2] text-[#283625]'
                      : 'border-[#EFE9DF] text-[#736B63]'
                  }`}
                >
                  <span>Classic (With Eggs)</span>
                </button>
              </div>
            </div>
          )}

          {/* Custom Message on Cake */}
          <div>
            <label className="block text-xs font-bold text-[#253322] mb-1.5 uppercase tracking-wider">
              4. Message on Cake (Optional)
            </label>
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value.slice(0, 32))}
              placeholder="e.g. Happy 25th Birthday Rhea!"
              maxLength={32}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D0E2CA] focus:outline-none focus:border-[#6B8B62] text-[#253322]"
            />
            <span className="text-[10px] text-[#736B63] mt-0.5 block text-right">
              {customMessage.length}/32 characters
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
                added
                  ? 'bg-[#6B8B62] text-white scale-[1.02]'
                  : 'bg-[#283625] hover:bg-[#3E5239] text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added to Tasting Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Tasting Cart (₹{calculatedPrice.toLocaleString('en-IN')})
                </>
              )}
            </button>
            <div className="flex items-center justify-between text-[11px] text-[#736B63] mt-2.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6B8B62]" /> 100% Quality Guaranteed
              </span>
              <Link
                href={`/cakes/${cake.slug}`}
                onClick={onClose}
                className="text-[#6B8B62] hover:underline flex items-center gap-0.5"
              >
                Full Product Page <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
