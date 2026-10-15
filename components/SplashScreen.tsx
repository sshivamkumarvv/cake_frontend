'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Cake } from 'lucide-react';

export function SplashScreen() {
  const [show, setShow] = useState<boolean | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    'Handcrafting artisanal gateaux...',
    'Whipping French Callebaut ganache...',
    'Welcome to Bakeistry Studio',
  ];

  useEffect(() => {
    // Check if user already saw the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem('bakeistry_splash_viewed');
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    setShow(true);

    // Progress animation
    const pTimer1 = setTimeout(() => setProgress(55), 300);
    const pTimer2 = setTimeout(() => {
      setProgress(85);
      setStatusIndex(1);
    }, 700);
    const pTimer3 = setTimeout(() => {
      setProgress(100);
      setStatusIndex(2);
    }, 1100);

    // Fade out and dismiss
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1400);

    const closeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('bakeistry_splash_viewed', 'true');
    }, 1800);

    return () => {
      clearTimeout(pTimer1);
      clearTimeout(pTimer2);
      clearTimeout(pTimer3);
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsFading(true);
    setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('bakeistry_splash_viewed', 'true');
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#1C2619] via-[#243321] to-[#151D13] text-white cursor-pointer select-none transition-all duration-500 ${
        isFading ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Welcome Splash Screen (Click to skip)"
      role="banner"
    >
      {/* Ambient background glow */}
      <div className="absolute w-80 h-80 bg-[#DE9E62]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-96 h-96 bg-[#86A57D]/10 rounded-full blur-3xl pointer-events-none -top-20" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
        {/* Animated Emblem */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-[#DE9E62]/20 blur-md animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#DE9E62]/40 p-1.5 bg-[#FAF8F5]/10 backdrop-blur-md shadow-2xl flex items-center justify-center">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[#FAF8F5]">
              <Image
                src="/images/logo.png"
                alt="Bakeistry Studio Logo"
                fill
                priority
                className="object-contain p-2"
              />
            </div>
          </div>
          {/* Subtle floating sparkle */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#DE9E62] text-[#191715] flex items-center justify-center shadow-md animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Brand Wordmark */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1 drop-shadow-sm">
          Bakeistry
        </h1>
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#DE9E62] mb-3">
          Studio by Chef Mitali
        </p>

        <p className="text-xs text-[#D0E2CA] font-light max-w-xs mb-8 leading-relaxed">
          Luxury Handcrafted Celebration Cakes &amp; Online Baking Masterclasses
        </p>

        {/* Progress bar */}
        <div className="w-48 sm:w-56 bg-white/10 rounded-full h-1 overflow-hidden mb-3 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#9CB894] via-[#DE9E62] to-[#FAF8F5] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic status pill */}
        <div className="h-6 flex items-center justify-center">
          <span className="text-[11px] text-[#D0E2CA]/80 font-medium tracking-wide flex items-center gap-1.5 animate-in fade-in duration-200">
            <Cake className="w-3 h-3 text-[#DE9E62]" />
            {statusMessages[statusIndex]}
          </span>
        </div>
      </div>

      {/* Skip button in bottom */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute bottom-8 text-[11px] text-[#D0E2CA]/60 hover:text-white px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xs transition-colors"
      >
        Skip to Menu &rarr;
      </button>
    </div>
  );
}
