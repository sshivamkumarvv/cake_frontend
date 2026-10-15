'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  GraduationCap,
  Play,
  Star,
  Clock,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { BAKING_COURSES } from '../../lib/data';
import { useCart } from '../../lib/cart-context';
import { useLearning } from '../../lib/learning-context';

export default function CoursesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addItem } = useCart();
  const { enrollInCourse } = useLearning();

  const categories = [
    'All',
    'Celebration Cakes',
    'Buttercream & Piping',
    'Eggless Baking',
    'French Pastry',
    'Breads & Sourdough',
    'Chocolate Art',
  ];

  const filteredCourses =
    selectedCategory === 'All'
      ? BAKING_COURSES
      : BAKING_COURSES.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-10 sm:space-y-20 pb-16">
      {/* 1. Mobile-First Academy Hero */}
      <section className="bg-[#23201D] text-white pt-8 pb-12 sm:pt-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-[#9CB894]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3E5239] text-[#D0E2CA] text-[11px] sm:text-xs font-semibold border border-[#546F4D]">
              <GraduationCap className="w-3.5 h-3.5 text-[#DE9E62]" />
              <span>Bakeistry Online Baking Academy</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Pre-Recorded 4K Masterclasses with{' '}
              <span className="italic text-[#9CB894] font-normal underline decoration-[#9CB894]/40">
                Lifetime Access.
              </span>
            </h1>

            <p className="text-xs sm:text-base text-[#D0E2CA] leading-relaxed max-w-2xl">
              Learn sturdy cake tiering, tropical ganache balances, and French viennoiserie from Chef Mitali. Over 8,000 home and professional bakers trained worldwide.
            </p>
          </div>

          {/* Quick Metrics Strip: Responsive 2x2 grid on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-2 sm:pt-4 border-t border-[#3E5239] text-xs">
            <div className="p-3 bg-[#2D2A26] sm:bg-transparent rounded-2xl sm:rounded-none space-y-0.5">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#9CB894]">6</span>
              <p className="text-[11px] sm:text-xs text-[#A0AAB2]">In-Depth Masterclasses</p>
            </div>
            <div className="p-3 bg-[#2D2A26] sm:bg-transparent rounded-2xl sm:rounded-none space-y-0.5">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#9CB894]">116+</span>
              <p className="text-[11px] sm:text-xs text-[#A0AAB2]">4K Video Lessons</p>
            </div>
            <div className="p-3 bg-[#2D2A26] sm:bg-transparent rounded-2xl sm:rounded-none space-y-0.5">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#9CB894]">4.96 ★</span>
              <p className="text-[11px] sm:text-xs text-[#A0AAB2]">Student Rating</p>
            </div>
            <div className="p-3 bg-[#2D2A26] sm:bg-transparent rounded-2xl sm:rounded-none space-y-0.5">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#9CB894]">100%</span>
              <p className="text-[11px] sm:text-xs text-[#A0AAB2]">Climate Tested</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Course Catalog & Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 pb-2 border-b border-[#EFE9DF]">
          <div>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#253322]">
              Choose Your Masterclass
            </h2>
            <p className="text-xs text-[#736B63] mt-1">
              Includes downloadable formulation worksheets, direct chef Q&A, and verifiable certification.
            </p>
          </div>

          {/* Swipeable Category Pills on Mobile with Edge-to-Edge bleed */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none snap-x">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all snap-start ${
                  selectedCategory === cat
                    ? 'bg-[#283625] text-white shadow-xs'
                    : 'bg-white hover:bg-[#E6F0E2] text-[#4D473F] border border-[#D0E2CA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EFE9DF] hover:border-[#9CB894] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group shadow-xs"
            >
              <div>
                {/* Thumbnail */}
                <Link href={`/courses/${course.slug}`} className="block relative aspect-16/9 w-full bg-[#23201D] overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

                  <span className="absolute top-3 left-3 bg-[#283625]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/20">
                    {course.level}
                  </span>

                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#9CB894]" />
                    {course.duration}
                  </div>
                </Link>

                {/* Body Details */}
                <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#736B63]">
                    <span className="text-[#86A57D] font-bold uppercase tracking-wider text-[10px]">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#DE9E62] fill-current" />
                      <span className="font-bold text-[#253322]">{course.rating}</span>
                      <span className="text-[11px] text-[#736B63]">({course.studentCount})</span>
                    </div>
                  </div>

                  <Link href={`/courses/${course.slug}`}>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#253322] group-hover:text-[#546F4D] transition-colors leading-snug">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#736B63] line-clamp-2 leading-relaxed">
                    {course.subtitle}
                  </p>

                  <div className="pt-1 flex items-center gap-3 text-xs text-[#546F4D]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#86A57D]" />
                      {course.lessonCount} Lessons
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#86A57D]" />
                      {course.studentCount} Students
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer - Thumb Friendly */}
              <div className="p-5 sm:p-6 pt-0 border-t border-[#F2EDE4] mt-2 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#736B63] block">Lifetime Access</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif font-bold text-lg sm:text-xl text-[#283625]">
                      ₹{course.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#736B63] line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2.5 sm:px-5 sm:py-2.5 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span>Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Instructor Showcase Banner: Mobile-First layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-12 lg:p-16 border border-[#D0E2CA] flex flex-col md:flex-row gap-6 sm:gap-10 items-center">
          <div className="w-32 h-32 sm:w-56 sm:h-56 md:w-64 md:h-64 relative rounded-full md:rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0">
            <Image
              src="/images/chefs/chef-mitali.jpg"
              alt="Chef Mitali"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-3 sm:space-y-4 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#86A57D]">
              Meet Your Mentor
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#253322]">
              Trained in Paris. Perfected for Tropical Baking.
            </h2>
            <p className="text-xs sm:text-sm text-[#546F4D] leading-relaxed">
              &quot;Too many online baking courses teach European recipes that collapse in 32°C humidity. In my masterclasses, we break down the food science behind cocoa fat crystallization, starch gelatinization, and humidity control so your cakes remain flawless wherever you are.&quot;
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E6F0E2]">
                <strong className="text-[#253322] block font-semibold">Le Cordon Bleu Paris</strong>
                <span className="text-[11px] text-[#736B63]">Grand Diplôme de Pâtisserie</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6F0E2]">
                <strong className="text-[#253322] block font-semibold">5,000+ Cakes Crafted</strong>
                <span className="text-[11px] text-[#736B63]">Bespoke celebration orders</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E6F0E2]">
                <strong className="text-[#253322] block font-semibold">12,000+ Alumni</strong>
                <span className="text-[11px] text-[#736B63]">Mentored in 18 countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
