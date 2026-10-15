'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cake, MessageCircle, ShoppingBag, Package } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen } = useCart();

  // Hide on pages that have dedicated sticky action bars or require distraction-free flow
  const isCakeDetail = pathname.startsWith('/cakes/') && pathname !== '/cakes';
  const isCourseDetail = pathname.startsWith('/courses/') && pathname !== '/courses';
  const isCheckout = pathname === '/checkout';
  const isCart = pathname === '/cart';
  const isLearnPlayer = pathname.startsWith('/learn/');

  if (isCakeDetail || isCourseDetail || isCheckout || isCart || isLearnPlayer) {
    return null;
  }

  const whatsappUrl = getGeneralWhatsAppUrl();

  const navItems = [
    { label: 'Home', href: '/', icon: Home, exact: true },
    { label: 'Cakes', href: '/cakes', icon: Cake, exact: false },
    { label: 'Orders', href: '/account/orders', icon: Package, exact: false },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6F0E2] lg:hidden px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-4px_20px_rgba(40,54,37,0.08)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl active:scale-95 transition-all duration-150 ${
                isActive
                  ? 'text-[#283625] font-bold'
                  : 'text-[#736B63] hover:text-[#283625]'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-[#E6F0E2] text-[#283625] shadow-xs' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* WhatsApp Direct Kitchen Chat Trigger */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 text-[#25D366] hover:text-[#20ba59] active:scale-95 transition-all duration-150"
          aria-label="Order on WhatsApp"
        >
          <div className="p-1.5 rounded-xl bg-[#E8F8EE] text-[#25D366]">
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold text-[#25D366]">WhatsApp</span>
        </a>

        {/* Cart Trigger in Mobile Bottom Bar */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-[#736B63] hover:text-[#283625] active:scale-95 transition-all duration-150 relative"
          aria-label="Open Cart"
        >
          <div className="p-1.5 relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#DE9E62] text-[#191715] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Cart</span>
        </button>
      </div>
    </nav>
  );
}
