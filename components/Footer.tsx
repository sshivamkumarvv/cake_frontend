'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { BAKERY_INFO } from '../lib/data';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#1A0D08] text-[#FAF6F0] pt-16 pb-12 border-t border-[#3E2014]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Story Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#3E2014]">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-md">
                <Image
                  src="/images/logo.png"
                  alt="Bakeistry Studio Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                  Bakeistry Studio
                </h3>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#DE9E62] font-semibold">
                  By Chef Mitali • {BAKERY_INFO.location}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#EADBC8]/90 leading-relaxed max-w-lg">
              Crafting modern French-inspired gateaux, bespoke tiered celebration centerpieces, and educating passionate bakers across the globe through structured, chemical-free baking masterclasses.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-[#DE9E62]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C27838]" /> FSSAI Certified Studio
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C27838]" /> 100% Callebaut & Valrhona Chocolate
              </span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center bg-[#2C1810] p-6 sm:p-8 rounded-3xl border border-[#3E2014]">
            <h4 className="font-serif text-xl font-bold text-white">
              The Pastry Gazette & Secret Formulas
            </h4>
            <p className="text-xs text-[#EADBC8] mt-1.5 mb-5">
              Subscribe to receive weekly seasonal cake flavors, Chef Mitali&apos;s pastry formulas, and exclusive early access to online masterclasses.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#3E2014] border border-[#C27838] rounded-xl flex items-center gap-2 text-xs text-[#FAF6F0]">
                <CheckCircle2 className="w-4 h-4 text-[#C27838] shrink-0" />
                <span>Thank you! Your tasting welcome guide is on its way to your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-3 rounded-full bg-[#1A0D08] border border-[#3E2014] text-sm text-white placeholder-[#8A796F] focus:outline-none focus:border-[#C27838]"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C27838] hover:bg-[#A85D22] text-white text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Join Gazette <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-[#3E2014] text-xs">
          {/* Col 1 */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Artisan Cakes
            </h5>
            <ul className="space-y-2 text-[#EADBC8]/80">
              <li>
                <Link href="/cakes?category=Celebration+Cakes" className="hover:text-white transition-colors">
                  Celebration Gateaux
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=Chocolate+Decadence" className="hover:text-white transition-colors">
                  Belgian Truffle Collection
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=Eggless+Collection" className="hover:text-white transition-colors">
                  100% Eggless Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=Custom+%26+Wedding" className="hover:text-white transition-colors">
                  Tiered Wedding Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?category=Birthday+Cakes" className="hover:text-white transition-colors">
                  Signature Birthday Cakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Baking Academy
            </h5>
            <ul className="space-y-2 text-[#EADBC8]/80">
              <li>
                <Link href="/courses/the-art-of-celebration-cakes" className="hover:text-white transition-colors">
                  Celebration Cakes Masterclass
                </Link>
              </li>
              <li>
                <Link href="/courses/modern-buttercream-masterclass" className="hover:text-white transition-colors">
                  Lambeth Piping & Buttercream
                </Link>
              </li>
              <li>
                <Link href="/courses/the-science-of-eggless-baking" className="hover:text-white transition-colors">
                  The Science of Eggless Baking
                </Link>
              </li>
              <li>
                <Link href="/courses/french-patisserie-foundations" className="hover:text-white transition-colors">
                  French Patisserie Foundations
                </Link>
              </li>
              <li>
                <Link href="/account/learning" className="hover:text-white transition-colors">
                  Student Classroom Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Brand & Concierge
            </h5>
            <ul className="space-y-2 text-[#EADBC8]/80">
              <li>
                <Link href="/#story" className="hover:text-white transition-colors">
                  About Chef Mitali
                </Link>
              </li>
              <li>
                <Link href="/#custom" className="hover:text-white transition-colors">
                  Custom Cake Inquiry
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Delivery & Pincodes
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Studio Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Track Live Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 & 5: Studio Address */}
          <div className="col-span-2 space-y-3">
            <h5 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Studio & Contact
            </h5>
            <div className="space-y-2.5 text-[#EADBC8]/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C27838] shrink-0 mt-0.5" />
                <span>{BAKERY_INFO.address} ({BAKERY_INFO.deliveryNote})</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C27838] shrink-0" />
                <a href={`tel:${BAKERY_INFO.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {BAKERY_INFO.phone} (Orders & WhatsApp)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C27838] shrink-0" />
                <a href={`mailto:${BAKERY_INFO.email}`} className="hover:text-white transition-colors">
                  {BAKERY_INFO.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C27838] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <a
                  href={BAKERY_INFO.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {BAKERY_INFO.instagram}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A8988C] gap-4">
          <p>
            © 2026 {BAKERY_INFO.name}. Handcrafted fresh in {BAKERY_INFO.location}.
          </p>
          <div className="flex items-center gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Refund Policy</span>
            <Link href="/admin" className="hover:text-white transition-colors opacity-70 hover:opacity-100">
              Staff Portal
            </Link>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[#DE9E62] fill-current" /> for pastry lovers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
