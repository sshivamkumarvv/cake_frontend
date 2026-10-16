'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Check,
  ShoppingBag,
  Clock,
  Sparkles,
  ChevronRight,
  Heart,
  Share2,
  MapPin,
  Truck,
  ShieldCheck,
  Flame,
  Cake,
  Calendar,
} from 'lucide-react';
import { CakeProduct } from '../../../lib/types';
import { CAKE_PRODUCTS, SAMPLE_DELIVERY_SLOTS, BAKERY_INFO } from '../../../lib/data';
import { useCart } from '../../../lib/cart-context';
import { useLocation } from '../../../lib/location-context';
import { HorizontalCakeSlider } from '../../../components/HorizontalCakeSlider';

const QUICK_MESSAGES = [
  'Happy Birthday!',
  'Happy Anniversary!',
  'Congratulations!',
  'Best Wishes!',
  'I Love You ❤️',
];

export function CakeDetailClient({ cake }: { cake: CakeProduct }) {
  const router = useRouter();
  const { addItem, setIsCartDrawerOpen } = useCart();
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  const [selectedWeight, setSelectedWeight] = useState(cake.weights[0]?.value || '0.5kg');
  const [selectedFlavor, setSelectedFlavor] = useState(cake.flavors[0]?.id || '');
  const [isEggless, setIsEggless] = useState(cake.isEggless);
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState(SAMPLE_DELIVERY_SLOTS[0].time);
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'storage'>('details');
  const [recentlyViewed, setRecentlyViewed] = useState<CakeProduct[]>([]);

  // Wishlist sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bakeistry_wishlist');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.includes(cake.id)) {
          setIsFavorite(true);
        }
      }
    } catch {}
  }, [cake.id]);

  const handleToggleWishlist = () => {
    try {
      const saved = localStorage.getItem('bakeistry_wishlist');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];

      if (isFavorite) {
        list = list.filter((id) => id !== cake.id);
        setIsFavorite(false);
      } else {
        list.push(cake.id);
        setIsFavorite(true);
      }
      localStorage.setItem('bakeistry_wishlist', JSON.stringify(list));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: cake.name,
        text: `Order fresh ${cake.name} from ${BAKERY_INFO.shortName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Recently Viewed Cakes tracking via localStorage
  useEffect(() => {
    try {
      const STORAGE_KEY = 'bakeistry_recently_viewed';
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: string[] = stored ? JSON.parse(stored) : [];

      const previous = list
        .filter((slug) => slug !== cake.slug)
        .map((slug) => CAKE_PRODUCTS.find((p) => p.slug === slug))
        .filter((p): p is CakeProduct => Boolean(p));

      setRecentlyViewed(previous);

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
  const originalTotalPrice = cake.originalPrice
    ? Math.round(cake.originalPrice * (weightObj?.multiplier || 1) * quantity)
    : null;
  const discountPercent = originalTotalPrice
    ? Math.round(((originalTotalPrice - totalPrice) / originalTotalPrice) * 100)
    : 0;

  // Compute Similar Cakes
  const similarCakes = useMemo(() => {
    return CAKE_PRODUCTS.filter((c) => c.id !== cake.id)
      .map((c) => {
        let score = 0;
        if (c.category === cake.category) score += 5;
        if (c.isEggless === cake.isEggless) score += 2;
        if (c.isBestseller) score += 1;
        return { cake: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.cake)
      .slice(0, 8);
  }, [cake]);

  const handleAddToCart = (openDrawer = true) => {
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
      deliveryDate: selectedDate,
      deliverySlot: selectedSlot,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8 sm:space-y-12">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-1.5 truncate">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link href="/cakes" className="hover:text-neutral-900 transition-colors">
            Cakes
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-800 font-semibold truncate max-w-xs">{cake.name}</span>
        </div>

        {/* Location selector */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1 text-[11px] text-[#15803D] font-semibold hover:underline shrink-0"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentLocation.name.split(',')[0]}</span>
          <span className="text-neutral-400 hidden sm:inline">(⚡ {currentLocation.deliveryTime})</span>
        </button>
      </nav>

      {/* 2. Main Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Pure Cake Image Showcase */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF7F2] border border-neutral-200/80 shadow-xs">
            <Image
              src={cake.images[0]}
              alt={cake.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Top-Left: Veg Mark (Tiny & Clean) */}
            {isEggless && (
              <div
                className="absolute top-3 left-3 z-10 w-4 h-4 rounded-[3px] border border-[#15803D] bg-white flex items-center justify-center p-[2px] shadow-xs"
                title="100% Pure Vegetarian / Eggless"
              >
                <div className="w-2 h-2 rounded-full bg-[#15803D]" />
              </div>
            )}

            {/* Top-Right: Wishlist & Share buttons */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-all shadow-xs border border-neutral-100"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleWishlist}
                aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-xs border border-neutral-100"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? 'fill-[#E23744] text-[#E23744]' : 'text-neutral-600'
                  }`}
                />
              </button>
            </div>

            {copiedLink && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                Link copied to clipboard!
              </div>
            )}
          </div>

          {/* 4 Trust Highlights Below Image (Bakingo Style) */}
          <div className="grid grid-cols-4 gap-2 text-center text-neutral-600 pt-1">
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex flex-col items-center">
              <Truck className="w-4 h-4 text-[#E23744] mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 leading-tight">2-3 Hrs Delivery</span>
              <span className="text-[9px] text-neutral-400">Express slot</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex flex-col items-center">
              <Cake className="w-4 h-4 text-[#E23744] mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 leading-tight">Baked Fresh</span>
              <span className="text-[9px] text-neutral-400">On confirmed order</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex flex-col items-center">
              <Flame className="w-4 h-4 text-[#E23744] mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 leading-tight">Free Candles</span>
              <span className="text-[9px] text-neutral-400">&amp; cake knife</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-[#E23744] mb-1" />
              <span className="text-[11px] font-bold text-neutral-800 leading-tight">100% Certified</span>
              <span className="text-[9px] text-neutral-400">FSSAI licensed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Buying & Customization Panel */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-5">
          {/* Title & Reviews */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#E23744] font-bold uppercase tracking-wider text-[11px]">
                {cake.category}
              </span>
              <span className="text-neutral-300">•</span>
              <div className="flex items-center gap-1 text-neutral-700">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-bold text-neutral-900">{cake.rating}</span>
                <span className="text-neutral-400">({cake.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight">
              {cake.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              {cake.tagline}
            </p>
          </div>

          {/* Price Bar */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {originalTotalPrice && (
                  <span className="text-xs sm:text-sm text-neutral-400 line-through">
                    ₹{originalTotalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[11px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-400 block">Inclusive of all taxes</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#E23744] font-semibold flex items-center gap-1 justify-end">
                <Clock className="w-3.5 h-3.5" /> Earliest: In 2-3 hrs
              </span>
            </div>
          </div>

          {/* 1. Weight Selection (Bakingo Pill Style) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Select Weight
              </label>
              <span className="text-neutral-400 text-[11px]">{cake.servings}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cake.weights.map((w) => {
                const isSelected = selectedWeight === w.value;
                const calcPrice = Math.round(cake.price * (w.multiplier || 1));

                return (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => setSelectedWeight(w.value)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#E23744] bg-red-50/50 text-neutral-900 ring-2 ring-[#E23744]/20 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{w.label.split(' ')[0]} {w.label.split(' ')[1]}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#E23744] stroke-[3]" />}
                    </div>
                    <span className="text-[11px] text-neutral-500 font-medium block mt-0.5">
                      ₹{calcPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {w.label.includes('Serves') ? w.label.split('(')[1].replace(')', '') : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Dietary Preference (Eggless / Egg) */}
          {cake.egglessChoiceAvailable && (
            <div className="space-y-2">
              <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] block">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEggless(true)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isEggless
                      ? 'border-[#15803D] bg-emerald-50 text-[#15803D] ring-2 ring-[#15803D]/20 shadow-2xs'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                  <span>100% Pure Eggless</span>
                  {isEggless && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEggless(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    !isEggless
                      ? 'border-neutral-900 bg-neutral-100 text-neutral-900 ring-2 ring-neutral-900/10 shadow-2xs'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span>Classic (Contains Egg)</span>
                  {!isEggless && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            </div>
          )}

          {/* 3. Message on Cake with One-Click Preset Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Message on Cake (Optional)
              </label>
              <span className="text-[11px] text-neutral-400">
                {customMessage.length}/32 chars
              </span>
            </div>

            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value.slice(0, 32))}
              placeholder="e.g. Happy Birthday Rhea!"
              maxLength={32}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-none focus:border-[#E23744] focus:ring-1 focus:ring-[#E23744] text-neutral-900 placeholder-neutral-400"
            />

            {/* Quick autofill tags (High UX conversion) */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {QUICK_MESSAGES.map((msg) => (
                <button
                  key={msg}
                  type="button"
                  onClick={() => setCustomMessage(msg)}
                  className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-medium rounded-full transition-colors active:scale-95"
                >
                  + {msg}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Delivery Schedule Slot */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Delivery Date &amp; Slot
              </label>
              <span className="text-[11px] text-[#15803D] font-medium">⚡ Available Today</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['Today', 'Tomorrow', 'Day After'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDate(d)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDate === d
                      ? 'border-[#E23744] bg-red-50/50 text-[#E23744] ring-1 ring-[#E23744]'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-white text-neutral-800 font-medium focus:outline-none focus:border-[#E23744] cursor-pointer"
            >
              {SAMPLE_DELIVERY_SLOTS.map((slot) => (
                <option key={slot.id} value={slot.time}>
                  {slot.time} ({slot.label})
                </option>
              ))}
            </select>
          </div>

          {/* 5. Quantity & Order Action Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white px-2 py-1.5 gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm font-bold text-neutral-800 flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-sm font-bold text-neutral-900 w-6 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-sm font-bold text-neutral-800 flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => handleAddToCart(true)}
                className={`flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.98] ${
                  added
                    ? 'bg-[#15803D] text-white'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Instant Order Button (High converting brand red) */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold bg-[#E23744] hover:bg-[#c92f3b] text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
            >
              <span>Order Now • ₹{totalPrice.toLocaleString('en-IN')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Product Tabs: Story, Ingredients, Storage */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-8 space-y-5 shadow-xs">
        <div className="flex border-b border-neutral-200 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'details'
                ? 'text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Description &amp; Story
            {activeTab === 'details' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E23744]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'ingredients'
                ? 'text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Pure Ingredients
            {activeTab === 'ingredients' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E23744]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-3 font-semibold transition-colors relative cursor-pointer ${
              activeTab === 'storage'
                ? 'text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Storage &amp; Care
            {activeTab === 'storage' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E23744]" />
            )}
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>{cake.description}</p>
            {cake.story && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <h4 className="font-bold text-neutral-900 text-xs mb-1">
                  Chef Mitali&apos;s Formulation Note
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{cake.story}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-bold text-neutral-800 uppercase tracking-wider mb-2">
                Pure Ingredients List
              </h4>
              <div className="flex flex-wrap gap-2">
                {cake.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-3 py-1 bg-neutral-50 border border-neutral-200 rounded-full text-neutral-700 font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl">
              <strong>Allergen Notice:</strong> Contains {cake.allergens.join(', ')}. Prepared in an artisanal patisserie studio that handles nuts and dairy.
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
            <h4 className="font-bold text-neutral-800 uppercase tracking-wider">
              Handling &amp; Storage Guidelines
            </h4>
            <p>{cake.storage}</p>
            <p className="text-neutral-500">
              <strong>Shelf Life:</strong> {cake.shelfLife}
            </p>
          </div>
        )}
      </div>

      {/* 4. Similar Cakes You'll Love */}
      <div className="pt-2">
        <HorizontalCakeSlider
          title="Similar Cakes You'll Love"
          subtitle={`Freshly baked ${cake.category.toLowerCase()} and patisserie with matching notes`}
          cakes={similarCakes}
          badge="Curated For You"
          viewAllHref={`/cakes?category=${encodeURIComponent(cake.category)}`}
        />
      </div>

      {/* 5. Recently Viewed Cakes */}
      {recentlyViewed.length > 0 && (
        <div className="pt-4 border-t border-neutral-200">
          <HorizontalCakeSlider
            title="Recently Viewed Cakes"
            subtitle="Pick up right where you left off"
            cakes={recentlyViewed}
            badge="History"
            viewAllHref="/cakes"
          />
        </div>
      )}

      {/* 6. Sticky Mobile Bottom Bar (Bakingo Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] border-t border-neutral-200 flex items-center justify-between gap-3 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div>
          <span className="text-[10px] text-neutral-500 block leading-tight">
            {selectedWeight} {isEggless ? '• Eggless' : ''}
          </span>
          <span className="font-extrabold text-base text-neutral-900">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => handleAddToCart(true)}
            className="py-2.5 px-3.5 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-xl border border-neutral-200 flex items-center justify-center gap-1 active:scale-95 transition-transform"
          >
            {added ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{added ? 'Added' : 'Add'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="py-2.5 px-4 bg-[#E23744] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-transform hover:bg-[#c92f3b]"
          >
            <span>Order Now →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
