'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { CakeProduct } from '../lib/types';

interface CakeCardProps {
  cake: CakeProduct;
  onQuickView?: (cake: CakeProduct) => void;
}

export function CakeCard({ cake }: CakeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bakeistry_wishlist');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list) && list.includes(cake.id)) {
          setIsFavorite(true);
        }
      }
    } catch {
      // LocalStorage not available
    }
  }, [cake.id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <div className="group flex flex-col cursor-pointer transition-transform duration-200">
      {/* 1. Rounded Image - Clean & Standalone (No Enclosing Box) */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] shadow-2xs">
        <Link href={`/cakes/${cake.slug}`} className="block w-full h-full relative">
          <Image
            src={cake.images[0]}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Tiny Pure Veg Green Mark (Bakingo hallmark at top-left) */}
        {cake.isEggless && (
          <div
            className="absolute top-2 left-2 z-10 w-3.5 h-3.5 rounded-[2px] border border-[#15803D] bg-white flex items-center justify-center p-[2px] shadow-xs pointer-events-none"
            title="100% Pure Vegetarian / Eggless"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
          </div>
        )}
      </div>

      {/* 2. Product Details - Flowing Freely Below (Bakingo Minimalist Style) */}
      <div className="pt-2 px-0.5 space-y-1">
        {/* Title */}
        <Link href={`/cakes/${cake.slug}`} className="block">
          <h3
            title={cake.name}
            className="text-xs sm:text-[13px] font-medium text-neutral-800 line-clamp-1 group-hover:text-[#E23744] transition-colors leading-tight"
          >
            {cake.name}
          </h3>
        </Link>

        {/* Price & Wishlist Row */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-neutral-900">
              ₹{cake.price.toLocaleString('en-IN')}
            </span>
            {cake.originalPrice && (
              <span className="text-[10px] sm:text-[11px] text-neutral-400 line-through">
                ₹{cake.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Wishlist Heart Icon */}
          <button
            onClick={handleToggleWishlist}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            className="p-1 -mr-1 text-neutral-400 hover:text-red-500 hover:scale-115 active:scale-90 transition-all focus:outline-none"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'
              }`}
            />
          </button>
        </div>

        {/* Rating Line: 4.9 ★ (245 Reviews) */}
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-neutral-500">
          <span className="font-semibold text-neutral-700">{cake.rating.toFixed(1)}</span>
          <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
          <span>({cake.reviewCount || 120} Reviews)</span>
        </div>

        {/* Earliest Delivery Line */}
        <p className="text-[10px] sm:text-[11px] text-neutral-500 truncate">
          <span>Earliest Delivery: </span>
          <span className="text-[#E23744] font-medium">In 2 hours</span>
        </p>
      </div>
    </div>
  );
}
