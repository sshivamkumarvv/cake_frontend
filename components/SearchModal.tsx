'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles, Cake, GraduationCap, Star, Clock, MapPin } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { useLocation } from '../lib/location-context';
import { CAKE_PRODUCTS, BAKING_COURSES } from '../lib/data';

const POPULAR_SEARCH_TAGS = [
  { label: '🌱 100% Eggless', href: '/cakes?category=Eggless%20Collection' },
  { label: '⭐ Bestsellers', href: '/cakes?category=Bestsellers' },
  { label: '🎂 Celebrations', href: '/cakes?category=Celebration%20Cakes' },
  { label: '🍫 Chocolaterie', href: '/cakes?category=Chocolate%20Decadence' },
  { label: '👑 Custom & Wedding', href: '/cakes?category=Custom%20%26%20Wedding' },
  { label: 'Belgian Truffle', query: 'Belgian Truffle' },
  { label: 'Pistachio', query: 'Pistachio' },
];

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'cakes' | 'courses'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus only on desktop to prevent mobile soft-keyboard zoom & layout jump
  useEffect(() => {
    if (isSearchOpen && typeof window !== 'undefined' && window.innerWidth >= 768) {
      const timer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Cmd+K or Ctrl+K & ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredCakes = q
    ? CAKE_PRODUCTS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (q.includes('eggless') && c.isEggless) ||
          (q.includes('bestseller') && c.isBestseller) ||
          c.ingredients.some((i) => i.toLowerCase().includes(q))
      )
    : [];

  const filteredCourses = q
    ? BAKING_COURSES.filter(
        (co) =>
          co.title.toLowerCase().includes(q) ||
          co.subtitle.toLowerCase().includes(q) ||
          co.category.toLowerCase().includes(q)
      )
    : [];

  const totalResults = filteredCakes.length + filteredCourses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      {/* Minimal Search Card */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E8DEC8] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Minimal Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#E8DEC8] flex items-center gap-3 bg-[#FAF6F0]">
          <Search className="w-5 h-5 text-[#C27838] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cakes, flavors, eggless, courses..."
            className="w-full bg-transparent text-[16px] text-[#2C1810] placeholder-[#8A796F] focus:outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="search"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#8A796F] hover:text-[#2C1810] hover:bg-[#F5ECE1] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-[#8A796F] bg-white px-2 py-0.5 rounded border border-[#E8DEC8]">
              ESC
            </kbd>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#8A796F] hover:text-[#2C1810] rounded-full hover:bg-[#F5ECE1] transition-colors sm:hidden"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bakingo-style Location Indicator Strip */}
        <div className="px-4 py-2 bg-[#F5ECE1] border-b border-[#E8DEC8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#2C1810] truncate">
            <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            <span className="text-[11px] text-[#8A796F]">Deliver to:</span>
            <span className="font-bold text-[11px] truncate">
              {currentLocation.name.split(',')[0]}
            </span>
            <span className="text-[10px] text-[#15803D] font-semibold bg-[#E8F8EE] px-1.5 py-0.5 rounded">
              ⚡ {currentLocation.deliveryTime}
            </span>
          </div>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setIsLocationModalOpen(true);
            }}
            className="text-[10px] text-[#15803D] font-bold hover:underline shrink-0 ml-2"
          >
            Change
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Zero-state: Quick Popular Search Chips */}
          {!query && (
            <div className="space-y-3 py-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C27838] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Categories &amp; Flavors</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_TAGS.map((tag) =>
                  tag.href ? (
                    <Link
                      key={tag.label}
                      href={tag.href}
                      onClick={() => setIsSearchOpen(false)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#2C1810] border border-[#E8DEC8] transition-colors active:scale-95 hover:border-[#C27838]"
                    >
                      {tag.label}
                    </Link>
                  ) : (
                    <button
                      key={tag.label}
                      onClick={() => setQuery(tag.query || tag.label)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF6F0] hover:bg-[#F5ECE1] text-[#2C1810] border border-[#E8DEC8] transition-colors active:scale-95 hover:border-[#C27838]"
                    >
                      {tag.label}
                    </button>
                  )
                )}
              </div>

              {/* Quick trending preview */}
              <div className="pt-4 border-t border-[#E8DEC8]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#8A796F] uppercase tracking-wider">
                    Bestsellers for Immediate Delivery
                  </p>
                  <span className="text-[10px] text-[#15803D] font-semibold">
                    ⚡ 2-3 Hr Delivery
                  </span>
                </div>
                <div className="space-y-1.5">
                  {CAKE_PRODUCTS.slice(0, 3).map((cake) => (
                    <Link
                      key={cake.id}
                      href={`/cakes/${cake.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF6F0] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E8DEC8]">
                          <Image
                            src={cake.images[0]}
                            alt={cake.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#2C1810] truncate group-hover:text-[#C27838]">
                            {cake.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#8A796F]">
                            <span className="font-semibold text-[#2C1810]">
                              ₹{cake.price.toLocaleString('en-IN')}
                            </span>
                            <span className="flex items-center gap-0.5 text-[#DE9E62] font-bold">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {cake.rating}
                            </span>
                            {cake.isEggless && (
                              <span className="text-[#15803D]">🌱 Eggless</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C27838] group-hover:text-[#2C1810] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <>
              {/* Filter Tabs if multiple types */}
              {totalResults > 0 && (
                <div className="flex items-center gap-2 border-b border-[#E8DEC8] pb-2 text-xs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'bg-[#2C1810] text-white'
                        : 'text-[#8A796F] hover:text-[#2C1810]'
                    }`}
                  >
                    All ({totalResults})
                  </button>
                  {filteredCakes.length > 0 && (
                    <button
                      onClick={() => setActiveTab('cakes')}
                      className={`px-3 py-1 rounded-full font-medium transition-colors ${
                        activeTab === 'cakes'
                          ? 'bg-[#2C1810] text-white'
                          : 'text-[#8A796F] hover:text-[#2C1810]'
                      }`}
                    >
                      Cakes ({filteredCakes.length})
                    </button>
                  )}
                  {filteredCourses.length > 0 && (
                    <button
                      onClick={() => setActiveTab('courses')}
                      className={`px-3 py-1 rounded-full font-medium transition-colors ${
                        activeTab === 'courses'
                          ? 'bg-[#2C1810] text-white'
                          : 'text-[#8A796F] hover:text-[#2C1810]'
                      }`}
                    >
                      Academy ({filteredCourses.length})
                    </button>
                  )}
                </div>
              )}

              {/* No results message */}
              {totalResults === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm font-semibold text-[#2C1810]">
                    No cakes or courses found for &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-[#8A796F]">
                    Try searching for &quot;Truffle&quot;, &quot;Eggless&quot;, or &quot;Pistachio&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {/* Cakes */}
                  {(activeTab === 'all' || activeTab === 'cakes') &&
                    filteredCakes.map((cake) => (
                      <Link
                        key={cake.id}
                        href={`/cakes/${cake.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF6F0] transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E8DEC8]">
                            <Image
                              src={cake.images[0]}
                              alt={cake.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#2C1810] truncate group-hover:text-[#C27838]">
                              {cake.name}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-[#8A796F] mt-0.5">
                              <span className="font-bold text-[#2C1810]">
                                ₹{cake.price.toLocaleString('en-IN')}
                              </span>
                              <span className="flex items-center gap-0.5 text-[#DE9E62] font-bold text-[10px]">
                                <Star className="w-3 h-3 fill-current" />
                                {cake.rating}
                              </span>
                              <span>•</span>
                              <span className="text-[#15803D] font-semibold text-[10px]">
                                ⚡ Today
                              </span>
                              {cake.isEggless && (
                                <span className="text-[#15803D] font-medium text-[10px]">🌱 Eggless</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C27838] group-hover:text-[#2C1810] transition-colors shrink-0 ml-2" />
                      </Link>
                    ))}

                  {/* Courses */}
                  {(activeTab === 'all' || activeTab === 'courses') &&
                    filteredCourses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF6F0] transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-[#E8DEC8]">
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#2C1810] truncate group-hover:text-[#C27838]">
                              {course.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-[#8A796F]">
                              <span className="font-semibold text-[#8E44AD]">
                                ₹{course.price.toLocaleString('en-IN')}
                              </span>
                              <span>•</span>
                              <span>Academy Masterclass</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C27838] group-hover:text-[#2C1810] transition-colors shrink-0 ml-2" />
                      </Link>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
