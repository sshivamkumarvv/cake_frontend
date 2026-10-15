'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CakeProduct } from '../lib/types';
import { CakeCard } from './CakeCard';

interface HorizontalCakeSliderProps {
  title: string;
  subtitle?: string;
  cakes: CakeProduct[];
  viewAllHref?: string;
  badge?: string;
}

export function HorizontalCakeSlider({
  title,
  subtitle,
  cakes,
  viewAllHref,
  badge,
}: HorizontalCakeSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!cakes || cakes.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Slider Header */}
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C27838] flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          )}
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#2C1810]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#8A796F] mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-bold text-[#A85D22] hover:text-[#2C1810] hover:underline mr-1"
            >
              View all &rarr;
            </Link>
          )}

          {/* Desktop Left/Right Arrow Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#FDFBF7] text-[#2C1810] border border-[#E8DEC8] flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#FDFBF7] text-[#2C1810] border border-[#E8DEC8] flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 scroll-smooth"
      >
        {cakes.map((c) => (
          <div
            key={c.id}
            className="w-[175px] sm:w-[215px] shrink-0 snap-start"
          >
            <CakeCard cake={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
