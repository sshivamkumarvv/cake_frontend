'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Leaf,
  Gift,
  Star,
  ChevronRight,
} from 'lucide-react';
import { CAKE_PRODUCTS, BAKERY_INFO } from '../lib/data';
import { CakeCard } from '../components/CakeCard';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';
import { useLocation } from '../lib/location-context';

export default function HomePage() {
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const whatsappUrl = getGeneralWhatsAppUrl();

  // Category tiles inspired by Bakingo
  const categoryTiles = [
    {
      id: 'Celebration Cakes',
      name: 'Celebration',
      image: '/images/cakes/pistachio-raspberry.jpg',
      subtitle: 'Birthdays & Parties',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Celebration Cakes').length,
      href: '/cakes?category=Celebration%20Cakes',
    },
    {
      id: 'Chocolate Decadence',
      name: 'Chocolaterie',
      image: '/images/cakes/belgian-truffle.jpg',
      subtitle: '70% Dark Ganache',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Chocolate Decadence').length,
      href: '/cakes?category=Chocolate%20Decadence',
    },
    {
      id: 'Eggless Collection',
      name: '100% Eggless',
      image: '/images/cakes/eggless-fudge.jpg',
      subtitle: 'Zero Gelatin Veg',
      count: CAKE_PRODUCTS.filter((c) => c.isEggless).length,
      href: '/cakes?category=Eggless%20Collection',
    },
    {
      id: 'Birthday Cakes',
      name: 'Birthday',
      image: '/images/cakes/french-vanilla-berry.jpg',
      subtitle: 'Classic Sponges',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Birthday Cakes').length,
      href: '/cakes?category=Birthday%20Cakes',
    },
    {
      id: 'Custom & Wedding',
      name: 'Custom & Tiers',
      image: '/images/cakes/vintage-lambeth.jpg',
      subtitle: 'Weddings & Tiers',
      count: CAKE_PRODUCTS.filter((c) => c.category === 'Custom & Wedding').length,
      href: '/cakes?category=Custom%20%26%20Wedding',
    },
    {
      id: 'Bestsellers',
      name: 'Bestsellers',
      image: '/images/cakes/salted-caramel-biscoff.jpg',
      subtitle: 'Chef Signatures',
      count: CAKE_PRODUCTS.filter((c) => c.isBestseller).length,
      href: '/cakes?category=Bestsellers',
    },
  ];

  // Curated showcase subsets
  const bestsellers = CAKE_PRODUCTS.filter((c) => c.isBestseller).slice(0, 4);
  const egglessCakes = CAKE_PRODUCTS.filter((c) => c.isEggless).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6">
      {/* 1. BAKINGO-STYLE LOCATION & DELIVERY PROMISE STRIP */}
      <div className="bg-[#F5ECE1] border border-[#E8DEC8] rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-[#2C1810]">
          <div className="w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-[#8A796F] mr-1">Delivering to:</span>
            <span className="font-bold text-[#2C1810]">{currentLocation.name}</span>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-[#15803D] font-bold text-xs underline underline-offset-2 hover:text-[#2C1810] ml-1 shrink-0"
          >
            Change
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#15803D] font-semibold">
          <span className="bg-[#E8F8EE] px-2.5 py-0.5 rounded-full border border-[#15803D]/20 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            Earliest Slot: {currentLocation.deliveryTime}
          </span>
          <span className="hidden md:inline-flex bg-white px-2.5 py-0.5 rounded-full border border-[#E8DEC8] text-[#8A796F]">
            🌱 100% Eggless Available
          </span>
        </div>
      </div>

      {/* 2. MINIMAL HERO PROMOTIONAL BANNER */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#3E2014] to-[#1A0D08] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#86efac] font-bold border border-[#25D366]/30">
                <MapPin className="w-3 h-3 text-[#25D366]" />
                {currentLocation.city} Delivery
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[#EADBC8] border border-white/10">
                <Sparkles className="w-3 h-3 text-[#DE9E62]" />
                Fresh Daily
              </span>
            </div>

            <h1 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Artisanal Celebration Cakes
            </h1>

            <p className="text-xs text-[#EADBC8]/90 line-clamp-2 sm:line-clamp-none">
              70% Belgian Callebaut chocolate &amp; zero gelatin vegetarian gateaux. Delivered in 2-3 hours with custom message.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 md:pt-0 shrink-0">
            <Link
              href="/cakes"
              className="px-4 py-2 bg-[#C27838] hover:bg-[#A85D22] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              Explore Cakes
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#DE9E62]/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. BAKINGO-STYLE 4-POINT TRUST HIGHLIGHTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F8EE] text-[#25D366] flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-[#2C1810] text-[11px] leading-tight">2-3 Hr Delivery</p>
            <p className="text-[10px] text-[#8A796F]">Express from kitchen</p>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E8F8EE] text-[#15803D] flex items-center justify-center shrink-0">
            <Leaf className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-[#2C1810] text-[11px] leading-tight">100% Eggless</p>
            <p className="text-[10px] text-[#8A796F]">Zero gelatin patisserie</p>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFF8E1] text-[#C27838] flex items-center justify-center shrink-0">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-[#2C1810] text-[11px] leading-tight">Free Inscription</p>
            <p className="text-[10px] text-[#8A796F]">Knife &amp; candles free</p>
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-[#E8DEC8] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] text-[#F59E0B] flex items-center justify-center shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <p className="font-bold text-[#2C1810] text-[11px] leading-tight">4.95★ Rated</p>
            <p className="text-[10px] text-[#8A796F]">Chef Mitali signature</p>
          </div>
        </div>
      </div>

      {/* 4. BAKINGO-STYLE MENU SECTION (Screenshot 1 Inspired) */}
      <div className="space-y-4 pt-3">
        <div className="text-center space-y-0.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E23744] tracking-tight">
            Menu
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            What will you wish for?
          </p>
        </div>

        {/* Category cards row (Image 1 layout) */}
        <div className="flex items-start justify-start md:justify-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none py-2 px-1 -mx-3.5 px-3.5 sm:mx-0">
          {categoryTiles.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center shrink-0 group focus:outline-none cursor-pointer"
            >
              {/* Tall Rounded Rectangular Card */}
              <div className="relative w-28 sm:w-36 md:w-40 aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200/80 group-hover:border-[#E23744] transition-all duration-300 group-hover:scale-104 shadow-xs bg-[#FAF7F2]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 112px, 160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Bold Uppercase Category Name Below */}
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-800 group-hover:text-[#E23744] transition-colors text-center whitespace-nowrap mt-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. BAKINGO-STYLE: INDIA LOVES / BESTSELLERS */}
      <div className="space-y-3 pt-4">
        <div className="text-center space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-base sm:text-lg font-bold text-[#E23744]">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>India Loves</span>
          </div>
          <p className="text-xs text-neutral-500">
            Bestsellers from across our kitchen
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {bestsellers.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/cakes?category=Bestsellers"
            className="inline-block text-xs font-bold text-[#E23744] hover:underline uppercase tracking-wider"
          >
            VIEW ALL &rarr;
          </Link>
        </div>
      </div>

      {/* 6. SHOWCASE: 100% PURE EGGLESS FAVORITES (Minimal Cards) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif font-bold text-base sm:text-xl text-[#2C1810]">
                100% Pure Eggless Gateaux
              </h2>
              <span className="text-[10px] bg-[#E8F8EE] text-[#15803D] px-2 py-0.2 rounded-full font-bold border border-[#15803D]/20">
                🌱 Pure Veg
              </span>
            </div>
            <p className="text-[11px] text-[#8A796F]">
              Zero gelatin, certified vegetarian handcrafted patisserie
            </p>
          </div>
          <Link
            href="/cakes?category=Eggless%20Collection"
            className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {egglessCakes.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      </div>
    </div>
  );
}
