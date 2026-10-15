'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Plus, Check } from 'lucide-react';
import { CakeProduct } from '../lib/types';
import { useCart } from '../lib/cart-context';

interface CakeCardProps {
  cake: CakeProduct;
  onQuickView?: (cake: CakeProduct) => void;
}

export function CakeCard({ cake }: CakeCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      type: 'cake',
      productId: cake.id,
      slug: cake.slug,
      title: cake.name,
      image: cake.images[0],
      unitPrice: cake.price,
      quantity: 1,
      weight: cake.weights[0]?.value || '0.5kg',
      flavor: cake.flavors[0]?.name || 'Signature',
      isEggless: cake.isEggless,
      customMessage: 'Best Wishes',
      deliveryDate: 'Today',
      deliverySlot: '06:00 PM - 09:00 PM',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#C27838] transition-all duration-200 hover:shadow-md">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF6F0]">
        <Link href={`/cakes/${cake.slug}`} className="block w-full h-full">
          <Image
            src={cake.images[0]}
            alt={cake.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top Badges: Eggless Green Dot / Veg mark & Bestseller */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          {cake.isEggless && (
            <span
              className="w-4 h-4 rounded-xs border border-[#15803D] bg-white flex items-center justify-center p-0.5 shadow-2xs"
              title="100% Pure Vegetarian / Eggless"
            >
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            </span>
          )}
          {cake.isBestseller && (
            <span className="bg-[#2C1810] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
              Bestseller
            </span>
          )}
        </div>

        {/* Rating chip on bottom-left of image (Bakingo style) */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-md flex items-center gap-0.5 text-[10px] font-bold text-[#2C1810] shadow-2xs border border-[#E8DEC8]/50">
          <span>{cake.rating}</span>
          <Star className="w-2.5 h-2.5 text-[#F59E0B] fill-current" />
        </div>
      </div>

      {/* Details - Minimal */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/cakes/${cake.slug}`}>
            <h3 className="font-serif font-bold text-xs sm:text-sm text-[#2C1810] line-clamp-1 group-hover:text-[#C27838] transition-colors">
              {cake.name}
            </h3>
          </Link>
          <p className="text-[10px] text-[#15803D] font-semibold mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
            <span>Today in 2-3 hrs</span>
          </p>
        </div>

        {/* Price & Add Button */}
        <div className="pt-2 mt-2 border-t border-[#F5ECE1] flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-sm sm:text-base text-[#2C1810]">
              ₹{cake.price.toLocaleString('en-IN')}
            </span>
            {cake.originalPrice && (
              <span className="text-[10px] text-[#8A796F] line-through">
                ₹{cake.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95 ${
              added
                ? 'bg-[#15803D] text-white'
                : 'bg-[#FAF6F0] hover:bg-[#2C1810] text-[#2C1810] hover:text-white border border-[#E8DEC8]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
