'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpDown,
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Cake,
  Leaf,
  Star,
} from 'lucide-react';
import { CAKE_PRODUCTS } from '../../lib/data';
import { CakeProduct } from '../../lib/types';
import { CakeCard } from '../../components/CakeCard';
import { useLocation } from '../../lib/location-context';

interface CategoryTag {
  id: string;
  label: string;
  count: number;
}

function CakesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const { currentLocation, setIsLocationModalOpen } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Sync when URL query parameter changes
  React.useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
      if (cat === 'Eggless Collection') {
        setEgglessOnly(true);
      } else {
        setEgglessOnly(false);
      }
    }
  }, [searchParams]);

  // All Category tags
  const tags: CategoryTag[] = [
    { id: 'All', label: 'All Cakes', count: CAKE_PRODUCTS.length },
    { id: 'Celebration Cakes', label: '🎂 Celebrations', count: CAKE_PRODUCTS.filter((c) => c.category === 'Celebration Cakes').length },
    { id: 'Chocolate Decadence', label: '🍫 Chocolaterie', count: CAKE_PRODUCTS.filter((c) => c.category === 'Chocolate Decadence').length },
    { id: 'Eggless Collection', label: '🌱 100% Eggless', count: CAKE_PRODUCTS.filter((c) => c.isEggless).length },
    { id: 'Custom & Wedding', label: '👑 Tiered & Custom', count: CAKE_PRODUCTS.filter((c) => c.category === 'Custom & Wedding').length },
    { id: 'Bestsellers', label: '⭐ Bestsellers', count: CAKE_PRODUCTS.filter((c) => c.isBestseller).length },
  ];

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

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [selectedCategory, egglessOnly, sortBy, searchQuery]);

  const categoryTitles: Record<string, { title: string; subtitle: string }> = {
    'All': { title: 'All Handcrafted Cakes', subtitle: 'Browse our entire signature patisserie collection' },
    'Celebration Cakes': { title: 'Celebration Cakes', subtitle: 'Perfect centerpieces for birthdays, parties & milestones' },
    'Chocolate Decadence': { title: 'Chocolate Decadence', subtitle: '70% Valrhona & Callebaut dark ganache creations' },
    'Eggless Collection': { title: '100% Pure Eggless Cakes', subtitle: 'Zero gelatin certified vegetarian patisserie' },
    'Custom & Wedding': { title: 'Custom & Tiered Cakes', subtitle: 'Grand wedding & bespoke celebration designs' },
    'Bestsellers': { title: 'Chef Signature Bestsellers', subtitle: 'Our most loved and highly rated cakes' },
  };

  const headerInfo = searchQuery
    ? {
        title: `Search: "${searchQuery}"`,
        subtitle: `Showing cakes matching your craving`,
      }
    : categoryTitles[selectedCategory] || {
        title: selectedCategory,
        subtitle: 'Fresh daily gateaux calibrated to order',
      };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-[#8A796F]">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#2C1810]">Home</Link>
          <span>/</span>
          <Link href="/cakes" className="hover:text-[#2C1810]">Cakes</Link>
          <span>/</span>
          <span className="font-semibold text-[#2C1810]">{headerInfo.title}</span>
        </div>

        {/* Location pill */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-1 text-[11px] text-[#15803D] font-semibold hover:underline"
        >
          <MapPin className="w-3 h-3" />
          <span>{currentLocation.name.split(',')[0]}</span>
          <span className="text-[10px] text-[#8A796F] hidden sm:inline">(⚡ {currentLocation.deliveryTime})</span>
        </button>
      </div>

      {/* Category Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8DEC8] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl sm:text-3xl font-bold text-[#2C1810]">
            {headerInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#8A796F] mt-1">
            {headerInfo.subtitle} • <strong className="text-[#2C1810]">{filteredCakes.length} Cakes</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#15803D] bg-[#E8F8EE] px-3 py-1 rounded-full font-semibold border border-[#15803D]/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Same Day Delivery Available
          </span>
        </div>
      </div>

      {/* Single Line with Sort Button and Tags */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* Sort Button / Dropdown (First in line) */}
        <div className="flex items-center bg-white border border-[#E8DEC8] rounded-full px-3 py-1.5 gap-1.5 text-xs shrink-0 shadow-2xs font-semibold text-[#2C1810]">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C27838]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-[#2C1810] focus:outline-none cursor-pointer pr-1"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Category Tags in the SAME Single Line */}
        {tags.map((tag) => {
          const isSelected = selectedCategory === tag.id;

          return (
            <button
              key={tag.id}
              onClick={() => {
                setSelectedCategory(tag.id);
                router.replace(`/cakes?category=${encodeURIComponent(tag.id)}`);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 active:scale-95 flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#2C1810] text-white shadow-2xs'
                  : 'bg-white hover:bg-[#FAF6F0] text-[#3E2014] border border-[#E8DEC8]'
              }`}
            >
              <span>{tag.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF6F0] text-[#8A796F]'
                }`}
              >
                {tag.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cakes Grid */}
      {filteredCakes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-12 text-center space-y-3">
          <Cake className="w-10 h-10 text-[#C27838] mx-auto" />
          <h3 className="font-serif font-bold text-lg text-[#2C1810]">
            No cakes found in this category
          </h3>
          <p className="text-xs text-[#8A796F]">
            Try viewing All Cakes or message our kitchen for custom creations.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-4 py-2 bg-[#2C1810] text-white text-xs font-semibold rounded-full"
          >
            View All Cakes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CakesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#736B63]">Loading Cakes...</div>}>
      <CakesCatalogContent />
    </Suspense>
  );
}
