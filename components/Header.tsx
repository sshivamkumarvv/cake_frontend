'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  GraduationCap,
  Cake,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { useLocation } from '../lib/location-context';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';
import { BAKERY_INFO } from '../lib/data';

export function Header() {
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen, setIsSearchOpen, setIsAuthModalOpen, user } = useCart();
  const { currentLocation, setIsLocationModalOpen } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const whatsappUrl = getGeneralWhatsAppUrl();

  const navLinks = [
    { label: 'Shop Cakes', href: '/cakes', badge: 'Fresh Daily' },
    { label: 'How to Order', href: '/#custom', badge: null },
    { label: 'Our Story', href: '/#story', badge: null },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF6F0]/95 backdrop-blur-md shadow-sm border-b border-[#E8DEC8]'
            : 'bg-[#FAF6F0] border-b border-[#E8DEC8]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
              className="p-2 -ml-2 text-[#2C1810] hover:text-[#C27838] transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C27838]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/search"
              aria-label="Search and Explore Categories"
              className="p-2 text-[#2C1810] hover:text-[#C27838] ml-1 sm:hidden flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-105 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Bakeistry Studio by Mitali Logo"
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2C1810] leading-tight group-hover:text-[#C27838] transition-colors">
                  Bakeistry
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#C27838] -mt-0.5">
                  Studio by Mitali
                </span>
              </div>
            </Link>

            {/* Delivery Location Pill (Bakingo Style) */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              aria-label="Select Delivery Location"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F5ECE1] border border-[#E8DEC8] text-xs transition-all max-w-[190px] text-left group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col truncate leading-tight">
                <span className="text-[9px] text-[#8A796F] uppercase tracking-wider font-semibold">
                  Delivering to
                </span>
                <span className="font-bold text-xs truncate text-[#2C1810] flex items-center gap-1">
                  {currentLocation.name.split(',')[0]}
                  <ChevronDown className="w-3 h-3 text-[#8A796F] shrink-0" />
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href) && link.href !== '/#story';

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-xs font-semibold uppercase tracking-wider transition-colors py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#2C1810]'
                      : 'text-[#6B4F3B] hover:text-[#2C1810]'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[9px] font-semibold bg-[#F5ECE1] text-[#A85D22] px-1.5 py-0.2 rounded-full border border-[#E8DEC8]">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C27838] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bakingo-style Search Bar Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search cakes and courses"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs text-[#6B4F3B] bg-[#F5ECE1]/80 hover:bg-[#EADBC8] border border-[#E8DEC8] rounded-full transition-all w-48 lg:w-60"
            >
              <Search className="w-3.5 h-3.5 text-[#C27838] shrink-0" />
              <span className="truncate">Search cakes, eggless...</span>
              <kbd className="hidden lg:inline-block text-[10px] font-mono bg-[#FAF6F0] px-1.5 py-0.5 rounded border border-[#E8DEC8] text-[#8A796F] ml-auto">
                ⌘K
              </kbd>
            </button>

            {/* WhatsApp Quick Kitchen Chat */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#1E281C] bg-[#E8F8EE] hover:bg-[#d8f4e1] border border-[#25D366]/40 rounded-full font-semibold transition-all shadow-xs"
              title="Chat or Order directly via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Account */}
            {user ? (
              <Link
                href="/account"
                aria-label="Account details"
                className="flex items-center gap-1.5 p-2 text-[#2C1810] hover:text-[#C27838] rounded-full hover:bg-[#F5ECE1] transition-colors"
                title={`Signed in as ${user.name}`}
              >
                <div className="w-7 h-7 rounded-full bg-[#C27838] text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                  {user.name[0]}
                </div>
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                aria-label="Sign in"
                className="p-2 text-[#2C1810] hover:text-[#C27838] rounded-full hover:bg-[#F5ECE1] transition-colors"
                title="Sign In"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2.5 bg-[#2C1810] hover:bg-[#3E2014] text-[#FAF6F0] rounded-full transition-all shadow-sm flex items-center justify-center group"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C27838] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FAF6F0] shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Location Quick Bar (Bakingo Style) */}
        <div className="md:hidden bg-[#F5ECE1] border-t border-[#E8DEC8] px-3.5 py-1.5 flex items-center justify-between text-xs text-[#2C1810]">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-left truncate flex-1 mr-2 active:opacity-75"
          >
            <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            <span className="text-[11px] text-[#8A796F] shrink-0">Deliver to:</span>
            <span className="font-bold text-[11px] truncate text-[#2C1810]">
              {currentLocation.name.split(',')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#8A796F] shrink-0" />
          </button>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="text-[10px] text-[#15803D] font-semibold bg-[#E8F8EE] px-2 py-0.5 rounded-full shrink-0 border border-[#15803D]/20"
          >
            ⚡ {currentLocation.deliveryTime}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] shadow-2xl flex flex-col z-10 border-r border-[#E6F0E2]">
            <div className="p-5 flex items-center justify-between border-b border-[#EFE9DF]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#253322]">
                    Bakeistry
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-[#6B8B62]">
                    By Chef Mitali
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#736B63] hover:text-[#253322]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#86A57D] mb-2 px-3">
                  Artisanal Cake Studio
                </p>
                <Link
                  href="/cakes"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#283625] hover:bg-[#E6F0E2]"
                >
                  <span className="flex items-center gap-3">
                    <Cake className="w-4 h-4 text-[#86A57D]" />
                    Shop All Cakes
                  </span>
                  <span className="text-[10px] bg-[#E6F0E2] text-[#3E5239] font-bold px-2 py-0.5 rounded-full border border-[#D0E2CA]">
                    Fresh Daily
                  </span>
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1B5E20] bg-[#E8F5E9] hover:bg-[#C8E6C9] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
                    WhatsApp Kitchen Order
                  </span>
                  <span className="text-[10px] bg-[#25D366] text-white font-bold px-2 py-0.5 rounded-full">
                    Instant
                  </span>
                </a>
                <Link
                  href="/#story"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#283625] hover:bg-[#E6F0E2]"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-4 h-4 text-center font-serif font-bold text-xs text-[#86A57D]">M</span>
                    Our Philosophy
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#B0CEAA]" />
                </Link>
              </div>

              {/* Quick Cake Categories */}
              <div className="pt-4 border-t border-[#EFE9DF]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#86A57D] mb-2 px-3">
                  Cake Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cakes?category=Celebration+Cakes"
                    className="p-2 rounded-lg bg-white border border-[#E6F0E2] text-xs font-medium text-[#3E5239] hover:border-[#9CB894]"
                  >
                    Celebrations
                  </Link>
                  <Link
                    href="/cakes?category=Chocolate+Decadence"
                    className="p-2 rounded-lg bg-white border border-[#E6F0E2] text-xs font-medium text-[#3E5239] hover:border-[#9CB894]"
                  >
                    Chocolaterie
                  </Link>
                  <Link
                    href="/cakes?category=Eggless+Collection"
                    className="p-2 rounded-lg bg-white border border-[#E6F0E2] text-xs font-medium text-[#3E5239] hover:border-[#9CB894]"
                  >
                    100% Eggless
                  </Link>
                  <Link
                    href="/cakes?category=Custom+%26+Wedding"
                    className="p-2 rounded-lg bg-white border border-[#E6F0E2] text-xs font-medium text-[#3E5239] hover:border-[#9CB894]"
                  >
                    Tiered & Custom
                  </Link>
                </div>
              </div>

              {/* Account Quick Link */}
              <div className="pt-4 border-t border-[#EFE9DF]">
                {user ? (
                  <div className="bg-[#E6F0E2] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#253322]">{user.name}</p>
                      <p className="text-[11px] text-[#546F4D]">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="text-xs bg-[#283625] text-white px-3 py-1.5 rounded-lg"
                    >
                      Profile
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 bg-[#283625] text-white text-xs font-bold rounded-xl"
                  >
                    Sign In or Register
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] border-t border-[#EFE9DF] bg-[#FAF8F5] text-xs text-[#736B63] space-y-1">
              <p className="font-medium text-[#253322]">{BAKERY_INFO.address}</p>
              <p>{BAKERY_INFO.deliveryNote}</p>
              <p className="text-[11px] text-[#86A57D]">{BAKERY_INFO.phone}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
