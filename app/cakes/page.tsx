'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpDown,
  MapPin,
  Clock,
  Cake,
  Leaf,
  Star,
  Sparkles,
  X,
  Check,
  ShieldCheck,
  Truck,
  Heart,
} from 'lucide-react';
import { CAKE_PRODUCTS } from '../../lib/data';
import { CakeProduct } from '../../lib/types';
import { CakeCard } from '../../components/CakeCard';
import { useLocation } from '../../lib/location-context';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  count: number;
}

function CakesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under-1500' | 'above-1500'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Sync when URL query parameter changes
  React.useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
      if (cat === 'Eggless Collection') {
        setEgglessOnly(true);
      } else if (cat === 'Bestsellers') {
        setBestsellerOnly(true);
      }
    }
  }, [searchParams]);

  // Bakingo-style Visual Categories with Thumbnails
  const visualCategories: CategoryItem[] = [
    {
      id: 'All',
      name: 'All Cakes',
      image: '/images/cakes/belgian-truffle.jpg',
      count: CAKE_PRODUCTS.length,
    },
    {
      id: 'Bestsellers',
      name: 'Bestsellers',
      image: '/images/cakes/salted-caramel-biscoff.jpg',
      count: CAKE_PRODUCTS.filter((c) => c.isBestseller).length,
    },
    {
      id: 'Chocolate Decadence',
      name: 'Chocolaterie',
      image: '/images/cakes/black-forest.jpg',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Chocolate Decadence').length,
    },
    {
      id: 'Celebration Cakes',
      name: 'Celebrations',
      image: '/images/cakes/pistachio-raspberry.jpg',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Celebration Cakes').length,
    },
    {
      id: 'Eggless Collection',
      name: '100% Eggless',
      image: '/images/cakes/eggless-fudge.jpg',
      count: CAKE_PRODUCTS.filter((c) => c.isEggless).length,
    },
    {
      id: 'Birthday Cakes',
      name: 'Birthday',
      image: '/images/cakes/french-vanilla-berry.jpg',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Birthday Cakes').length,
    },
    {
      id: 'Custom & Wedding',
      name: 'Custom & Tiered',
      image: '/images/cakes/vintage-lambeth.jpg',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Custom & Wedding').length,
    },
  ];

  // Quick Tags
  const quickTags = [
    { id: 'All', label: 'All' },
    { id: 'eggless', label: '🌱 100% Eggless', isToggle: true, active: egglessOnly },
    { id: 'bestseller', label: '⭐ Bestsellers', isToggle: true, active: bestsellerOnly },
    { id: 'Chocolate Decadence', label: '🍫 Chocolaterie' },
    { id: 'Celebration Cakes', label: '🎂 Celebrations' },
    { id: 'Birthday Cakes', label: '🎉 Birthday' },
    { id: 'Custom & Wedding', label: '👑 Custom & Tiers' },
    { id: 'under-1500', label: 'Under ₹1,500', isPrice: true, active: priceRange === 'under-1500' },
    { id: 'above-1500', label: '₹1,500+', isPrice: true, active: priceRange === 'above-1500' },
  ];

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'Eggless Collection') {
      setEgglessOnly(true);
    } else if (catId === 'Bestsellers') {
      setBestsellerOnly(true);
    } else {
      setEgglessOnly(false);
      setBestsellerOnly(false);
    }
    router.replace(`/cakes?category=${encodeURIComponent(catId)}`, { scroll: false });
  };

  const handleTagClick = (tag: (typeof quickTags)[0]) => {
    if (tag.id === 'All') {
      setSelectedCategory('All');
      setEgglessOnly(false);
      setBestsellerOnly(false);
      setPriceRange('all');
      router.replace('/cakes', { scroll: false });
    } else if (tag.id === 'eggless') {
      setEgglessOnly((prev) => !prev);
    } else if (tag.id === 'bestseller') {
      setBestsellerOnly((prev) => !prev);
    } else if (tag.id === 'under-1500') {
      setPriceRange((prev) => (prev === 'under-1500' ? 'all' : 'under-1500'));
    } else if (tag.id === 'above-1500') {
      setPriceRange((prev) => (prev === 'above-1500' ? 'all' : 'above-1500'));
    } else {
      handleSelectCategory(tag.id);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setEgglessOnly(false);
    setBestsellerOnly(false);
    setPriceRange('all');
    setSortBy('featured');
    router.replace('/cakes', { scroll: false });
  };

  const isAnyFilterActive =
    selectedCategory !== 'All' ||
    egglessOnly ||
    bestsellerOnly ||
    priceRange !== 'all' ||
    sortBy !== 'featured';

  // Filtered & Sorted cakes
  const filteredCakes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return CAKE_PRODUCTS.filter((cake) => {
      // Search keyword match if q is provided
      if (q) {
        const matchesQ =
          cake.name.toLowerCase().includes(q) ||
          cake.description.toLowerCase().includes(q) ||
          cake.category.toLowerCase().includes(q) ||
          (q.includes('eggless') && cake.isEggless) ||
          cake.flavors.some((f) => f.name.toLowerCase().includes(q));
        if (!matchesQ) return false;
      }

      // Category match
      if (selectedCategory === 'Eggless Collection') {
        if (!cake.isEggless) return false;
      } else if (selectedCategory === 'Bestsellers') {
        if (!cake.isBestseller) return false;
      } else if (selectedCategory !== 'All' && cake.category !== selectedCategory) {
        return false;
      }

      // Eggless filter toggle
      if (egglessOnly && !cake.isEggless) {
        return false;
      }

      // Bestseller filter toggle
      if (bestsellerOnly && !cake.isBestseller) {
        return false;
      }

      // Price range filter
      if (priceRange === 'under-1500' && cake.price >= 1500) {
        return false;
      }
      if (priceRange === 'above-1500' && cake.price < 1500) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [selectedCategory, egglessOnly, bestsellerOnly, priceRange, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* 1. Breadcrumb & Location Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
        <div className="flex items-center gap-1.5 truncate">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/cakes" className="hover:text-neutral-900 transition-colors">
            Cakes
          </Link>
          {selectedCategory !== 'All' && (
            <>
              <span>/</span>
              <span className="font-semibold text-neutral-800 truncate">
                {selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* Location selector (Bakingo style) */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1 text-[11px] text-[#15803D] font-semibold hover:underline shrink-0"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{currentLocation.name.split(',')[0]}</span>
          <span className="text-neutral-400 hidden sm:inline">
            (⚡ {currentLocation.deliveryTime})
          </span>
        </button>
      </div>

      {/* 2. Bakingo-Style Page Title */}
      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">
          {searchQuery ? `Search Results: "${searchQuery}"` : 'Order Freshly Baked Cakes'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Handcrafted luxury gateaux baked fresh on order •{' '}
          <strong className="text-neutral-800 font-semibold">{filteredCakes.length} Cakes</strong>{' '}
          available for delivery
        </p>
      </div>

      {/* 3. "Explore more" Category Showcase (Bakingo Image 2 signature) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/70 shadow-xs space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900 tracking-tight">
            Explore more
          </h2>
          <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">
            Scroll to explore &rarr;
          </span>
        </div>

        <div className="flex items-start gap-4 sm:gap-7 overflow-x-auto scrollbar-none py-1.5 px-1">
          {visualCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer"
              >
                {/* Round Category Thumbnail with Smooth Hover and Active Ring */}
                <div
                  className={`relative w-18 h-18 sm:w-22 sm:h-22 rounded-full overflow-hidden transition-all duration-300 shadow-xs ${
                    isSelected
                      ? 'ring-3 ring-[#E23744] ring-offset-2 scale-105 shadow-md'
                      : 'border border-neutral-200 group-hover:border-neutral-400 group-hover:scale-105'
                  }`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 72px, 88px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Category Label */}
                <span
                  className={`text-xs text-center transition-colors whitespace-nowrap leading-tight ${
                    isSelected
                      ? 'font-bold text-[#E23744]'
                      : 'font-medium text-neutral-700 group-hover:text-neutral-900'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Sorting and Quick Filter Tags (Bakingo Clean Single / Responsive Bar) */}
      <div className="sticky top-16 sm:top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md py-2 -mx-3.5 px-3.5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-neutral-200/60 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        {/* Sort Dropdown Button (First in Line) */}
        <div className="flex items-center bg-white border border-neutral-300 rounded-full px-3 py-1.5 gap-1.5 text-xs shrink-0 shadow-2xs font-semibold text-neutral-800 hover:border-neutral-400 transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#E23744]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer pr-1"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
          </select>
        </div>

        {/* Filter Tags */}
        {quickTags.map((tag) => {
          const isSelected =
            tag.id === 'All'
              ? selectedCategory === 'All' && !egglessOnly && !bestsellerOnly && priceRange === 'all'
              : tag.active || selectedCategory === tag.id;

          return (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 flex items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
            >
              <span>{tag.label}</span>
              {isSelected && tag.id !== 'All' && (
                <Check className="w-3 h-3 stroke-[3] text-emerald-400" />
              )}
            </button>
          );
        })}

        {/* Clear Filters Button (If any active) */}
        {isAnyFilterActive && (
          <button
            onClick={clearAllFilters}
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#E23744] hover:bg-red-50 transition-colors shrink-0 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 5. Product Items Grid */}
      {filteredCakes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
          <Cake className="w-12 h-12 text-neutral-400 mx-auto" />
          <h3 className="font-bold text-lg text-neutral-800">
            No cakes matched your selected filters
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try resetting your filters or browsing our complete collection of freshly baked artisan cakes.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            View All Cakes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      )}

      {/* 6. Bakingo-Style "Our Promise" Trust Guarantee Strip (From Screenshot 1) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 text-center space-y-6 mt-8 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
            Our Promise
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            There&apos;s no secret spell—only honest, handcrafted perfection!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {/* Promise 1 */}
          <div className="flex flex-col items-center text-center space-y-1.5 p-3 rounded-xl bg-neutral-50">
            <div className="w-10 h-10 rounded-full bg-[#E23744]/10 text-[#E23744] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-800">On-Time Delivery</h3>
            <p className="text-[11px] text-neutral-500 leading-tight">
              Because no one likes late surprises
            </p>
          </div>

          {/* Promise 2 */}
          <div className="flex flex-col items-center text-center space-y-1.5 p-3 rounded-xl bg-neutral-50">
            <div className="w-10 h-10 rounded-full bg-[#E23744]/10 text-[#E23744] flex items-center justify-center">
              <Cake className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-800">500+ Designs</h3>
            <p className="text-[11px] text-neutral-500 leading-tight">
              Wishes come in all shapes &amp; sizes
            </p>
          </div>

          {/* Promise 3 */}
          <div className="flex flex-col items-center text-center space-y-1.5 p-3 rounded-xl bg-neutral-50">
            <div className="w-10 h-10 rounded-full bg-[#E23744]/10 text-[#E23744] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-neutral-800">Baked Fresh Daily</h3>
            <p className="text-[11px] text-neutral-500 leading-tight">
              Zero gelatin, authentic Valrhona &amp; Belgian butter
            </p>
          </div>

          {/* Promise 4 */}
          <div className="flex flex-col items-center text-center space-y-1.5 p-3 rounded-xl bg-neutral-50">
            <div className="w-10 h-10 rounded-full bg-[#E23744]/10 text-[#E23744] flex items-center justify-center">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-xs font-bold text-neutral-800">4.95★ Customer Love</h3>
            <p className="text-[11px] text-neutral-500 leading-tight">
              Loved across 10,000+ celebrations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CakesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-neutral-400">
          Loading cakes catalog...
        </div>
      }
    >
      <CakesCatalogContent />
    </Suspense>
  );
}
