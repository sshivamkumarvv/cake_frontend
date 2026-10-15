'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export function FloatingWhatsApp() {
  const pathname = usePathname();

  // Hide on video player page
  if (pathname.startsWith('/learn/')) {
    return null;
  }

  const whatsappUrl = getGeneralWhatsAppUrl();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order or chat on WhatsApp"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline font-sans text-xs font-bold tracking-tight">
        Order on WhatsApp
      </span>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
    </a>
  );
}
