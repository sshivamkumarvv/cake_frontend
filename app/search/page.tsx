'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  X,
  ChevronRight,
  MapPin,
  Sparkles,
  Cake,
  Leaf,
  Star,
} from 'lucide-react';
import { CAKE_PRODUCTS, BAKERY_INFO } from '../../lib/data';
import { useLocation } from '../../lib/location-context';
import { CakeCard } from '../../components/CakeCard';

interface CategoryExploreItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  queryParam: string;
}

const CATEGORIES_LIST: CategoryExploreItem[] = [
  {
    id: 'bestsellers',
    name: 'Chef Bestsellers',
    icon: '⭐',
    description: 'Top-rated signature gateaux',
    count: CAKE_PRODUCTS.filter((c) => c.isBestseller).length,
    queryParam: 'Bestsellers',
  },
  {
    id: 'celebrations',
    name: 'Celebration Cakes',
    icon: '🎂',
    description: 'Birthdays, anniversaries & festive milestones',
    count: CAKE_PRODUCTS.filter((c) => c.category === 'Celebration Cakes').length,
    queryParam: 'Celebration Cakes',
  },
  {
    id: 'chocolate',
    name: 'Chocolate Decadence',
    icon: '🍫',
    description: '70% Valrhona & Belgian Callebaut ganache',
    count: CAKE_PRODUCTS.filter((c) => c.category === 'Chocolate Decadence').length,
    queryParam: 'Chocolate Decadence',
  },
  {
    id: 'eggless',
    name: '100% Pure Eggless Cakes',
    icon: '🌱',
    description: 'Zero gelatin, certified vegetarian patisserie',
    count: CAKE_PRODUCTS.filter((c) => c.isEggless).length,
    queryParam: 'Eggless Collection',
  },
  {
    id: 'custom',
    name: 'Custom & Tiered Cakes',
    icon: '👑',
    description: 'Bespoke grand wedding & milestone designs',
    count: CAKE_PRODUCTS.filter((c) => c.category === 'Custom & Wedding').length,
    queryParam: 'Custom & Wedding',
  },
  {
    id: 'all',
    name: 'All Cakes & Gateaux',
    icon: '✨',
    description: 'Explore full artisanal collection',
    count: CAKE_PRODUCTS.length,
    queryParam: 'All',
  },
];

const QUICK_CATEGORY_TAGS = [
  { label: '🌱 100% Eggless', category: 'Eggless Collection' },
  { label: '⭐ Bestsellers', category: 'Bestsellers' },
  { label: '🎂 Celebrations', category: 'Celebration Cakes' },
  { label: '🍫 Chocolaterie', category: 'Chocolate Decadence' },
  { label: '👑 Custom & Wedding', category: 'Custom & Wedding' },
  { label: '✨ All Cakes', category: 'All' },
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  const handleNavigateToCategory = (category: string) => {
    router.push(`/cakes?category=${encodeURIComponent(category)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cakes?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const filteredCakes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return CAKE_PRODUCTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (q.includes('eggless') && c.isEggless) ||
        (q.includes('bestseller') && c.isBestseller) ||
        c.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-24">
      {/* Top Mobile Sticky Search Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E8DEC8] px-3.5 py-2.5 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 -ml-1 text-[#2C1810] hover:bg-[#F5ECE1] rounded-full transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C27838]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cakes, flavors, eggless..."
              className="w-full pl-9 pr-8 py-2 text-[16px] sm:text-sm rounded-full bg-[#FAF6F0] border border-[#E8DEC8] text-[#2C1810] placeholder-[#8A796F] focus:outline-none focus:border-[#C27838]"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="search"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8A796F] hover:text-[#2C1810] p-1"
                aria-label="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Location Indicator Strip */}
        <div className="flex items-center justify-between text-xs pt-2 max-w-2xl mx-auto text-[#2C1810]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            <span className="text-[11px] text-[#8A796F] shrink-0">Deliver to:</span>
            <span className="font-bold text-[11px] truncate">
              {currentLocation.name.split(',')[0]}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="text-[11px] text-[#15803D] font-bold hover:underline shrink-0 ml-2"
          >
            Change
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        {/* If Query is Empty: SHOW ONLY CATEGORIES (Like Bakingo/Swiggy) */}
        {!query && (
          <div className="space-y-4">
            {/* Quick Category Navigation Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A796F] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#DE9E62]" />
                Browse by Category
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CATEGORY_TAGS.map((tag) => (
                  <Link
                    key={tag.category}
                    href={`/cakes?category=${encodeURIComponent(tag.category)}`}
                    prefetch={true}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-[#F5ECE1] text-[#2C1810] border border-[#E8DEC8] transition-all active:scale-95 shadow-2xs inline-flex items-center gap-1 hover:border-[#C27838]"
                  >
                    <span>{tag.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Visual Category Grid (Bakingo/Swiggy style cards) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C27838]">
                  All Cake Categories
                </span>
                <Link
                  href="/cakes"
                  className="text-[11px] font-bold text-[#A85D22] hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIES_LIST.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/cakes?category=${encodeURIComponent(cat.queryParam)}`}
                    prefetch={true}
                    onClick={() => handleNavigateToCategory(cat.queryParam)}
                    className="p-3 bg-white hover:bg-[#FAF6F0] rounded-2xl border border-[#E8DEC8] hover:border-[#C27838] transition-all flex items-center justify-between group shadow-2xs active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#FAF6F0] group-hover:bg-[#F5ECE1] flex items-center justify-center text-xl shrink-0 border border-[#E8DEC8] transition-colors">
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif font-bold text-sm text-[#2C1810] group-hover:text-[#C27838] transition-colors leading-tight">
                          {cat.name}
                        </p>
                        <p className="text-[10px] text-[#8A796F] truncate mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold bg-[#F5ECE1] text-[#A85D22] px-2 py-0.5 rounded-full border border-[#E8DEC8]">
                        {cat.count}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#C27838] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* When User is Typing: Show matching cakes */}
        {query && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8A796F] px-1">
              <span>
                Found <strong className="text-[#2C1810]">{filteredCakes.length}</strong> cakes for &quot;{query}&quot;
              </span>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#C27838] font-semibold hover:underline"
              >
                Clear search
              </button>
            </div>

            {/* Quick link to see these in the full category page */}
            {filteredCakes.length > 0 && (
              <Link
                href={`/cakes?q=${encodeURIComponent(query)}`}
                className="block p-3 bg-white hover:bg-[#FAF6F0] rounded-xl border border-[#E8DEC8] text-xs font-semibold text-[#2C1810] text-center shadow-2xs hover:border-[#C27838] transition-colors"
              >
                View all results in Category Catalog with sorting &rarr;
              </Link>
            )}

            {filteredCakes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8DEC8] p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#C27838] flex items-center justify-center mx-auto">
                  <Cake className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#2C1810]">
                  No cakes found for &quot;{query}&quot;
                </h3>
                <p className="text-xs text-[#8A796F]">
                  Try searching for &quot;Truffle&quot;, &quot;Eggless&quot;, or browse our categories.
                </p>
                <div className="pt-2">
                  <Link
                    href="/cakes"
                    className="inline-block px-5 py-2.5 bg-[#2C1810] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#3E2014]"
                  >
                    Explore All Cakes
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {filteredCakes.map((cake) => (
                  <CakeCard key={cake.id} cake={cake} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#736B63]">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
