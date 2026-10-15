'use client';

import React, { useState } from 'react';
import { Sparkles, MapPin, Phone, X, Award } from 'lucide-react';
import Link from 'next/link';

import { BAKERY_INFO } from '../lib/data';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#283625] text-[#FAF8F5] text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 transition-all duration-300 border-b border-[#3E5239]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="hidden md:flex items-center gap-4 text-[#D0E2CA]">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#9CB894]" />
            {BAKERY_INFO.deliveryNote}
          </span>
          <span className="text-[#546F4D]">•</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#DE9E62]" />
            By Le Cordon Bleu Paris Alumna
          </span>
        </div>

        <div className="flex-1 text-center font-medium flex items-center justify-center gap-1.5 sm:gap-2 leading-tight">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DE9E62] shrink-0" />
          <span>
            <span className="hidden sm:inline">Complimentary Handcrafted Macarons above ₹1,999</span>
            <span className="sm:hidden">Free Macarons above ₹1,999</span> • Code:{' '}
            <span className="font-bold tracking-wider text-[#9CB894] bg-[#1E281C] px-1 py-0.5 rounded border border-[#3E5239]">
              FIRSTBAKE10
            </span>
          </span>
          <Link
            href="/cakes"
            className="hidden sm:inline-block underline underline-offset-2 ml-1 text-[#9CB894] hover:text-white transition-colors"
          >
            Shop Now →
          </Link>
        </div>

        <div className="flex items-center gap-3 text-[#D0E2CA]">
          <a
            href="tel:+918198978095"
            className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-[#9CB894]" />
            +91 81989 78095
          </a>
          <button
            onClick={() => setVisible(false)}
            aria-label="Close announcement bar"
            className="text-[#9CB894] hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
