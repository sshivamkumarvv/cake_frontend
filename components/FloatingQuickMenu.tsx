'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UtensilsCrossed, X, Check, MapPin } from 'lucide-react';
import { CAKE_PRODUCTS } from '../lib/data';
import { useLocation } from '../lib/location-context';

interface SimpleCategory {
  id: string;
  name: string;
  count: number;
}

export function FloatingQuickMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Simple, clean categories like Swiggy / Zomato / Bakingo
  const categories: SimpleCategory[] = [
    {
      id: 'Bestsellers',
      name: 'Chef Bestsellers',
      count: CAKE_PRODUCTS.filter((c) => c.isBestseller).length,
    },
    {
      id: 'Celebration Cakes',
      name: 'Celebration Cakes',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Celebration Cakes').length,
    },
    {
      id: 'Chocolate Decadence',
      name: 'Chocolate Decadence',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Chocolate Decadence').length,
    },
    {
      id: 'Eggless Collection',
      name: '100% Eggless Cakes',
      count: CAKE_PRODUCTS.filter((c) => c.isEggless).length,
    },
    {
      id: 'Custom & Wedding',
      name: 'Custom & Tiered Cakes',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Custom & Wedding').length,
    },
    {
      id: 'All',
      name: 'All Cakes',
      count: CAKE_PRODUCTS.length,
    },
  ];

  // Sync active category from homepage
  useEffect(() => {
    const handleActiveChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCategory(customEvent.detail);
      }
    };
    window.addEventListener('bakeistry:active-category-changed', handleActiveChange);
    return () => {
      window.removeEventListener('bakeistry:active-category-changed', handleActiveChange);
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsOpen(false);

    if (pathname === '/') {
      // Dispatch category change event to homepage
      window.dispatchEvent(
        new CustomEvent('bakeistry:select-category', { detail: categoryId })
      );
      // Smoothly scroll to catalog section
      setTimeout(() => {
        const catalogEl = document.getElementById('cake-catalog');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      // Navigate to homepage with category query
      router.push(`/?category=${encodeURIComponent(categoryId)}#cake-catalog`);
    }
  };

  return (
    <>
      {/* Floating Menu Button (Swiggy / Zomato style Pill) */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open menu categories"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2 bg-[#2C1810] hover:bg-[#3E2014] text-white px-3.5 py-2.5 rounded-full shadow-xl shadow-[#2C1810]/30 border border-white/80 transition-all duration-200 active:scale-95"
      >
        <div className="w-5 h-5 rounded-full bg-[#F5ECE1] text-[#2C1810] flex items-center justify-center shrink-0">
          <UtensilsCrossed className="w-3 h-3" />
        </div>
        <span className="font-serif text-xs font-bold tracking-wide">
          Menu
        </span>
      </button>

      {/* Swiggy/Zomato-Style Minimal Category Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity p-0 sm:p-4">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-5 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Sheet Handle (mobile) */}
            <div className="w-8 h-1 bg-[#E8DEC8] rounded-full mx-auto mt-2 sm:hidden" />

            {/* Header */}
            <div className="px-5 py-3 border-b border-[#F5ECE1] flex items-center justify-between">
              <div>
                <span className="font-serif font-bold text-sm text-[#2C1810] tracking-wide uppercase">
                  Menu Categories
                </span>
                <p className="text-[10px] text-[#15803D] flex items-center gap-1 font-semibold mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  Delivering to {currentLocation.name.split(',')[0]}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-[#FAF6F0] text-[#8A796F] hover:text-[#2C1810] flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pure Category List (Like Pizza, Burger in Swiggy/Zomato) */}
            <div className="py-2 divide-y divide-[#F5ECE1]">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full px-5 py-3 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#F5ECE1] text-[#2C1810] font-bold'
                        : 'text-[#443E38] hover:bg-[#FAF6F0] font-medium'
                    }`}
                  >
                    <span className="text-sm">
                      {cat.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8A796F]">
                        {cat.count}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#C27838] text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
