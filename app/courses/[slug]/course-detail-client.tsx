'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronDown,
  ChevronRight,
  FileText,
  Lock,
  X,
} from 'lucide-react';
import { BakingCourse } from '../../../lib/types';
import { useCart } from '../../../lib/cart-context';
import { useLearning } from '../../../lib/learning-context';

export function CourseDetailClient({ course }: { course: BakingCourse }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { enrollInCourse, enrollments } = useLearning();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-1': true,
    'sec-2': true,
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [enrolledNotice, setEnrolledNotice] = useState(false);

  const isAlreadyEnrolled = enrollments.some((e) => e.courseId === course.id);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnrollDirect = () => {
    enrollInCourse(course.id);
    setEnrolledNotice(true);
    setTimeout(() => {
      router.push(`/learn/${course.id}`);
    }, 1000);
  };

  const handleAddToCart = () => {
    addItem({
      type: 'course',
      productId: course.id,
      slug: course.slug,
      title: course.title,
      image: course.thumbnail,
      unitPrice: course.price,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Cinematic Course Hero */}
      <section className="bg-[#1C211B] text-white pt-10 pb-16 lg:py-20 relative overflow-hidden border-b border-[#2E3C2B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#86A57D] mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#546F4D]" />
            <Link href="/courses" className="hover:text-white">Academy</Link>
            <ChevronRight className="w-3 h-3 text-[#546F4D]" />
            <span className="text-white font-semibold truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Course Intro */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#3E5239] text-[#D0E2CA] text-xs font-semibold border border-[#546F4D]">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  {course.level} Level
                </span>
                <span className="text-xs text-[#DE9E62] flex items-center gap-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {course.rating} ({course.studentCount} students)
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-[#D0E2CA] leading-relaxed">
                {course.subtitle}
              </p>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#9CB894]">
                  <Image
                    src={course.instructor.image}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">
                    Instructor: {course.instructor.name}
                  </h4>
                  <p className="text-[11px] text-[#9CB894]">
                    {course.instructor.role} • Le Cordon Bleu Alumna
                  </p>
                </div>
              </div>

              {/* Course Quick Inclusions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2E3C2B] text-xs">
                <div>
                  <span className="text-[#86A57D] block">Total Duration</span>
                  <strong className="text-white">{course.duration}</strong>
                </div>
                <div>
                  <span className="text-[#86A57D] block">Lessons</span>
                  <strong className="text-white">{course.lessonCount} Modules</strong>
                </div>
                <div>
                  <span className="text-[#86A57D] block">Access</span>
                  <strong className="text-white">Lifetime 4K</strong>
                </div>
                <div>
                  <span className="text-[#86A57D] block">Certification</span>
                  <strong className="text-white">Included</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Video Trailer & Purchase Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#252E23] rounded-3xl p-6 sm:p-7 border border-[#3E5239] shadow-2xl space-y-6">
                {/* Trailer Preview Frame */}
                <div
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative aspect-16/9 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                >
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/95 text-[#283625] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-[#283625]/90 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#DE9E62]" /> Watch 2-Min Course Trailer
                  </span>
                </div>

                {/* Pricing & CTA */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-[#A0AAB2] uppercase block">Lifetime Enrollment</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif font-bold text-3xl text-[#9CB894]">
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm text-[#736B63] line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs bg-[#DE9E62]/20 text-[#DE9E62] border border-[#DE9E62]/30 px-2.5 py-1 rounded-full font-bold">
                      40% OFF
                    </span>
                  </div>

                  {enrolledNotice ? (
                    <div className="p-3 bg-emerald-900/60 border border-emerald-500 rounded-xl text-center text-xs text-emerald-200">
                      Enrolled! Opening student classroom...
                    </div>
                  ) : isAlreadyEnrolled ? (
                    <Link
                      href={`/learn/${course.id}`}
                      className="w-full py-4 bg-[#9CB894] hover:bg-[#86A57D] text-[#191715] text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                      Resume Learning in Classroom <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={handleEnrollDirect}
                        className="w-full py-4 bg-[#9CB894] hover:bg-[#86A57D] text-[#191715] text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#9CB894]/20 hover:scale-[1.02]"
                      >
                        Enroll Now & Start Watching <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="w-full py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full transition-colors"
                      >
                        Add to Tasting Cart
                      </button>
                    </div>
                  )}

                  <div className="pt-2 text-[10px] text-[#A0AAB2] space-y-1 text-center">
                    <p>• 14-day 100% money-back satisfaction guarantee</p>
                    <p>• Instant access on iOS, Android, iPad & Desktop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What You Will Learn Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EFE9DF] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#253322]">
            What You Will Master in This Masterclass
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.whatYouWillLearn.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6F0E2]">
                <CheckCircle2 className="w-5 h-5 text-[#6B8B62] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#253322] leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detailed Expandable Curriculum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#253322]">
              Course Syllabus & Curriculum
            </h2>
            <p className="text-xs text-[#736B63] mt-0.5">
              {course.curriculum.length} Core Modules • {course.lessonCount} Structured Lessons • {course.duration}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const allOpen: Record<string, boolean> = {};
                course.curriculum.forEach((c) => (allOpen[c.id] = true));
                setExpandedSections(allOpen);
              }}
              className="text-xs text-[#6B8B62] hover:underline font-semibold"
            >
              Expand All
            </button>
            <span className="text-[#D0E2CA]">•</span>
            <button
              onClick={() => setExpandedSections({})}
              className="text-xs text-[#736B63] hover:underline"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {course.curriculum.map((section) => {
            const isExpanded = !!expandedSections[section.id];
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl border border-[#EFE9DF] overflow-hidden shadow-xs"
              >
                {/* Module Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-[#FAF8F5] hover:bg-[#E6F0E2]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#E6F0E2] text-[#283625] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                      M
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#253322]">
                        {section.title}
                      </h4>
                      <span className="text-[11px] text-[#736B63]">
                        {section.lessons.length} lessons • {section.duration}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6B8B62] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Lessons List */}
                {isExpanded && (
                  <div className="divide-y divide-[#FAF8F5] px-6 py-2">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="py-3.5 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#FAF8F5] text-[#86A57D] flex items-center justify-center shrink-0 mt-0.5">
                            {lesson.isPreview ? (
                              <Play className="w-3 h-3 fill-current ml-0.5 text-[#6B8B62]" />
                            ) : (
                              <Lock className="w-3 h-3 text-[#B0CEAA]" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-semibold text-xs sm:text-sm text-[#253322]">
                                {lesson.title}
                              </h5>
                              {lesson.isPreview && (
                                <span className="bg-[#E6F0E2] text-[#283625] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  Free Preview
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#736B63] mt-1 leading-relaxed">
                              {lesson.summary}
                            </p>

                            {/* Downloadable files */}
                            {lesson.resources && lesson.resources.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {lesson.resources.map((res, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F2EDE4] text-[#253322] text-[10px] font-medium"
                                  >
                                    <FileText className="w-3 h-3 text-[#6B8B62]" />
                                    {res.name} ({res.size})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-mono text-[#736B63] shrink-0">
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Instructor Profile Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#D0E2CA] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 relative aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white">
            <Image
              src={course.instructor.image}
              alt={course.instructor.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#86A57D]">
              Masterclass Instructor
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#253322]">
              {course.instructor.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#546F4D] leading-relaxed">
              {course.instructor.bio}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {course.instructor.credentials.map((cred, cIdx) => (
                <span
                  key={cIdx}
                  className="px-3 py-1.5 bg-white border border-[#D0E2CA] rounded-full text-xs text-[#283625] font-semibold flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-[#DE9E62]" />
                  {cred}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion */}
      {course.faqs && course.faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#253322]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#736B63]">
              Everything you need to know before enrolling in this masterclass.
            </p>
          </div>

          <div className="space-y-3">
            {course.faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="p-5 bg-white rounded-2xl border border-[#EFE9DF] space-y-2 shadow-xs"
              >
                <h4 className="font-serif font-bold text-sm text-[#253322]">
                  {faq.question}
                </h4>
                <p className="text-xs text-[#546F4D] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trailer Video Player Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsVideoModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl z-10 aspect-16/9">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={course.previewVideoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Sticky Mobile Enrollment Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C211B]/95 backdrop-blur-md px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] border-t border-[#3E5239] flex items-center justify-between gap-3 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <span className="text-[10px] text-[#A0AAB2] block leading-tight">
            Lifetime Access • 4K
          </span>
          <span className="font-serif font-bold text-lg text-[#9CB894]">
            ₹{course.price.toLocaleString('en-IN')}
          </span>
        </div>
        {isAlreadyEnrolled ? (
          <Link
            href={`/learn/${course.id}`}
            className="flex-1 max-w-[210px] py-3 px-4 bg-[#9CB894] text-[#191715] text-xs font-bold rounded-full shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <span>Open Classroom</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={handleEnrollDirect}
            className="flex-1 max-w-[210px] py-3 px-4 bg-[#9CB894] text-[#191715] text-xs font-bold rounded-full shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#283625]" />
            <span>Enroll Now</span>
          </button>
        )}
      </div>
    </div>
  );
}

