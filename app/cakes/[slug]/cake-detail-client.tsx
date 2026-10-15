'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Check,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  Heart,
  Share2,
  Package,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CakeProduct } from '../../../lib/types';
import { CAKE_PRODUCTS, SAMPLE_DELIVERY_SLOTS, BAKERY_INFO } from '../../../lib/data';
import { useCart } from '../../../lib/cart-context';
import { HorizontalCakeSlider } from '../../../components/HorizontalCakeSlider';

export function CakeDetailClient({ cake }: { cake: CakeProduct }) {
  const router = useRouter();
  const { addItem, setIsCartDrawerOpen } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(cake.weights[0]?.value || '0.5kg');
  const [selectedFlavor, setSelectedFlavor] = useState(cake.flavors[0]?.id || '');
  const [isEggless, setIsEggless] = useState(cake.isEggless);
  const [customMessage, setCustomMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(SAMPLE_DELIVERY_SLOTS[0].time);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'reviews'>('details');
  const [recentlyViewed, setRecentlyViewed] = useState<CakeProduct[]>([]);

  // Recently Viewed Cakes tracking via localStorage
  useEffect(() => {
    try {
      const STORAGE_KEY = 'bakeistry_recently_viewed';
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: string[] = stored ? JSON.parse(stored) : [];

      // Find previously viewed products (excluding current cake)
      const previous = list
        .filter((slug) => slug !== cake.slug)
        .map((slug) => CAKE_PRODUCTS.find((p) => p.slug === slug))
        .filter((p): p is CakeProduct => Boolean(p));

      setRecentlyViewed(previous);

      // Prepend current cake to history without duplicates
      const updatedList = [cake.slug, ...list.filter((slug) => slug !== cake.slug)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to update recently viewed cakes:', err);
    }
  }, [cake.slug]);

  // Dynamic price calculation
  const weightObj = cake.weights.find((w) => w.value === selectedWeight) || cake.weights[0];
  const flavorObj = cake.flavors.find((f) => f.id === selectedFlavor) || cake.flavors[0];
  const unitPrice = Math.round(cake.price * (weightObj?.multiplier || 1) + (flavorObj?.extraPrice || 0));
  const totalPrice = unitPrice * quantity;

  // Compute intelligently ranked Similar Cakes
  const similarCakes = useMemo(() => {
    return CAKE_PRODUCTS.filter((c) => c.id !== cake.id)
      .map((c) => {
        let score = 0;
        // Same category is top priority
        if (c.category === cake.category) score += 5;
        // Matching eggless dietary preference
        if (c.isEggless === cake.isEggless) score += 2;
        // Shared flavor profiles
        const sharedFlavors = c.flavors.filter((f) =>
          cake.flavors.some(
            (cf) => cf.name.toLowerCase() === f.name.toLowerCase() || cf.id === f.id
          )
        );
        score += sharedFlavors.length * 2;
        if (c.isBestseller) score += 1;
        return { cake: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.cake)
      .slice(0, 8);
  }, [cake]);

  const handleAddToCart = () => {
    addItem({
      type: 'cake',
      productId: cake.id,
      slug: cake.slug,
      title: cake.name,
      image: cake.images[0],
      unitPrice,
      quantity,
      weight: weightObj?.label.split(' ')[0] || selectedWeight,
      flavor: flavorObj?.name || 'Signature',
      isEggless,
      customMessage: customMessage.trim() || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      deliveryDate: selectedDate,
      deliverySlot: selectedSlot,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#8A796F]">
        <Link href="/" className="hover:text-[#2C1810]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#C27838]" />
        <Link href="/cakes" className="hover:text-[#2C1810]">Cakes</Link>
        <ChevronRight className="w-3 h-3 text-[#C27838]" />
        <span className="text-[#2C1810] font-semibold truncate max-w-xs">{cake.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery & Badges */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-[#F5ECE1] border border-[#E8DEC8] shadow-md">
            <Image
              src={cake.images[0]}
              alt={cake.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {cake.isBestseller && (
                <span className="bg-[#2C1810] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Bestseller
                </span>
              )}
              {cake.isEggless && (
                <span className="bg-[#F0FDF4] text-[#15803D] text-xs font-semibold px-3 py-1 rounded-full border border-[#BBF7D0] backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  100% Pure Eggless
                </span>
              )}
            </div>

            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DE9E62]" />
              <span>Artisan Formulation</span>
            </div>
          </div>

          {/* Value Badges Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-[#E8DEC8] text-center text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-[#2C1810] block">Pure Callebaut</span>
              <span className="text-[10px] text-[#8A796F]">70% Cocoa Butter</span>
            </div>
            <div className="space-y-0.5 border-x border-[#E8DEC8]">
              <span className="font-semibold text-[#2C1810] block">Chilled Transit</span>
              <span className="text-[10px] text-[#8A796F]">Van Delivered</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-[#2C1810] block">No Premixes</span>
              <span className="text-[10px] text-[#8A796F]">Slow Baked Fresh</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Configuration Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8A796F] mb-2">
              <span className="text-[#C27838] font-bold uppercase tracking-wider">
                {cake.category}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4 text-[#F59E0B] fill-current" />
                  <span className="font-bold text-[#2C1810]">{cake.rating}</span>
                </div>
                <span>({cake.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810] leading-tight">
              {cake.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#8A796F] mt-2 leading-relaxed">
              {cake.tagline}
            </p>
          </div>

          {/* Dynamic Price Display */}
          <div className="p-4 bg-white rounded-2xl border border-[#E8DEC8] flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] text-[#8A796F] block">Total for {quantity} item(s)</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-bold text-3xl text-[#2C1810]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {cake.originalPrice && (
                  <span className="text-xs text-[#8A796F] line-through">
                    ₹{(cake.originalPrice * (weightObj?.multiplier || 1) * quantity).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs bg-[#F5ECE1] text-[#A85D22] px-2.5 py-1 rounded-full font-semibold">
              Taxes Included
            </span>
          </div>

          {/* Customization 1: Weight / Servings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                1. Select Weight / Servings
              </label>
              <span className="text-[11px] text-[#C27838] font-medium">{cake.servings}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cake.weights.map((w) => (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setSelectedWeight(w.value)}
                  className={`p-3 rounded-xl text-left border transition-all text-xs ${
                    selectedWeight === w.value
                      ? 'border-[#2C1810] bg-[#F5ECE1] font-semibold text-[#2C1810] shadow-xs ring-1 ring-[#2C1810]'
                      : 'border-[#E8DEC8] hover:border-[#C27838] bg-white text-[#8A796F]'
                  }`}
                >
                  <span className="font-bold text-[#2C1810] block">{w.label.split(' ')[0]} {w.label.split(' ')[1]}</span>
                  <span className="text-[10px] text-[#8A796F]">
                    {w.label.includes('Serves') ? w.label.split('(')[1].replace(')', '') : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Customization 2: Flavor Infusion */}
          {cake.flavors.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider block">
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
                        ? 'border-[#2C1810] bg-[#F5ECE1] font-semibold text-[#2C1810] ring-1 ring-[#2C1810]'
                        : 'border-[#E8DEC8] hover:border-[#C27838] bg-white text-[#8A796F]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[#2C1810] block">{fl.name}</span>
                      <span className="text-[10px] text-[#8A796F]">{fl.notes}</span>
                    </div>
                    {fl.extraPrice > 0 && (
                      <span className="text-xs font-bold text-[#C27838]">
                        +₹{fl.extraPrice}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization 3: Dietary Preference */}
          {cake.egglessChoiceAvailable && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider block">
                3. Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEggless(true)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    isEggless
                      ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D] shadow-xs'
                      : 'border-[#E8DEC8] bg-white text-[#8A796F]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  100% Eggless
                </button>
                <button
                  type="button"
                  onClick={() => setIsEggless(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    !isEggless
                      ? 'border-[#2C1810] bg-[#F5ECE1] text-[#2C1810] shadow-xs'
                      : 'border-[#E8DEC8] bg-white text-[#8A796F]'
                  }`}
                >
                  Classic (With Eggs)
                </button>
              </div>
            </div>
          )}

          {/* Customization 4: Message on Cake */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider flex items-center justify-between">
              <span>4. Message on Cake (Optional)</span>
              <span className="text-[10px] text-[#8A796F] font-normal">
                {customMessage.length}/32 chars
              </span>
            </label>
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value.slice(0, 32))}
              placeholder="e.g. Happy 25th Birthday Rhea!"
              maxLength={32}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] bg-white focus:outline-none focus:border-[#C27838] text-[#2C1810]"
            />
          </div>

          {/* Customization 5: Delivery Schedule Slot */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider flex items-center justify-between">
              <span>5. Delivery Date & Time Window</span>
              <span className="text-[10px] text-[#C27838] flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3" /> {cake.preparationTime}
              </span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'Day After'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedDate === d
                      ? 'border-[#2C1810] bg-[#F5ECE1] text-[#2C1810]'
                      : 'border-[#E8DEC8] bg-white text-[#8A796F]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] bg-white text-[#2C1810] font-medium focus:outline-none focus:border-[#C27838]"
            >
              {SAMPLE_DELIVERY_SLOTS.map((slot) => (
                <option key={slot.id} value={slot.time}>
                  {slot.time} ({slot.label})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Ordering Actions */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border-2 border-[#E8DEC8] rounded-2xl bg-white px-2 py-1.5 gap-2 shrink-0 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#F5ECE1] text-sm font-bold text-[#2C1810] flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-sm font-bold text-[#2C1810] w-6 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#F5ECE1] text-sm font-bold text-[#2C1810] flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-md active:scale-[0.98] ${
                  added
                    ? 'bg-[#15803D] text-white scale-[1.01]'
                    : 'bg-[#2C1810] hover:bg-[#3E2014] text-white hover:shadow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • ₹{totalPrice.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Instant Checkout Button */}
            <button
              onClick={() => {
                handleAddToCart();
                router.push('/checkout');
              }}
              className="w-full py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold tracking-wide bg-[#C27838] hover:bg-[#A85D22] text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              <span>Instant Checkout (Order via WhatsApp & Sheet) →</span>
            </button>

            {/* Local Delivery Note */}
            <div className="flex items-center gap-2 text-xs text-[#6B4F3B] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C27838] shrink-0" />
              <span>
                {BAKERY_INFO.name} • {BAKERY_INFO.deliveryNote}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabs: Story, Ingredients, Storage */}
      <div className="bg-white rounded-3xl border border-[#E8DEC8] p-6 sm:p-10 space-y-6">
        <div className="flex border-b border-[#E8DEC8] gap-6 text-sm">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'details'
                ? 'text-[#2C1810]'
                : 'text-[#8A796F] hover:text-[#2C1810]'
            }`}
          >
            The Pastry Story & Description
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C27838]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === 'ingredients'
                ? 'text-[#2C1810]'
                : 'text-[#8A796F] hover:text-[#2C1810]'
            }`}
          >
            Ingredients & Care
            {activeTab === 'ingredients' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C27838]" />
            )}
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-4 text-xs sm:text-sm text-[#6B4F3B] leading-relaxed">
            <p>{cake.description}</p>
            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DEC8]">
              <h4 className="font-serif font-bold text-[#2C1810] text-sm mb-1">
                Chef Mitali&apos;s Formulation Note
              </h4>
              <p className="text-xs text-[#8A796F]">{cake.story}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-[#2C1810] uppercase tracking-wider mb-2">
                Pure Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {cake.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1 bg-[#FAF6F0] border border-[#E8DEC8] rounded-full text-[#2C1810]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-[#2C1810] uppercase tracking-wider mb-1">
                Storage & Serving
              </h4>
              <p className="text-[#6B4F3B] leading-relaxed">{cake.storage}</p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl">
              <strong>Allergen Notice:</strong> Contains {cake.allergens.join(', ')}. Prepared in an artisanal patisserie studio that handles nuts and dairy.
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Slider 1: Similar Cakes */}
      <div className="pt-2">
        <HorizontalCakeSlider
          title="Similar Cakes You'll Love"
          subtitle={`Freshly baked ${cake.category.toLowerCase()} and patisserie with matching notes`}
          cakes={similarCakes}
          badge="Curated For You"
          viewAllHref={`/cakes?category=${encodeURIComponent(cake.category)}`}
        />
      </div>

      {/* Horizontal Slider 2: Recently Viewed Cakes */}
      {recentlyViewed.length > 0 && (
        <div className="pt-4 border-t border-[#E8DEC8]">
          <HorizontalCakeSlider
            title="Recently Viewed Cakes"
            subtitle="Pick up right where you left off"
            cakes={recentlyViewed}
            badge="History"
            viewAllHref="/cakes"
          />
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#FAF6F0]/95 backdrop-blur-md px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] border-t border-[#E8DEC8] flex items-center justify-between gap-3 lg:hidden shadow-[0_-8px_30px_rgba(44,24,16,0.12)]">
        <div>
          <span className="text-[10px] text-[#8A796F] block leading-tight">
            {selectedWeight} {isEggless ? '• 100% Eggless' : ''}
          </span>
          <span className="font-serif font-bold text-lg text-[#2C1810]">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={handleAddToCart}
            className="py-3 px-4 bg-[#F5ECE1] text-[#2C1810] text-xs font-bold rounded-2xl border border-[#E8DEC8] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              handleAddToCart();
              router.push('/checkout');
            }}
            className="py-3 px-4 bg-[#2C1810] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform hover:bg-[#3E2014]"
          >
            <span>Order Now →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

