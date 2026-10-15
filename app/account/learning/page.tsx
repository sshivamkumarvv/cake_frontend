'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Play,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useLearning } from '../../../lib/learning-context';
import { BAKING_COURSES } from '../../../lib/data';

export default function StudentLearningDashboard() {
  const { enrollments } = useLearning();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Student Welcome Header */}
      <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#D0E2CA] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-2xl space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#86A57D] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#DE9E62]" />
            Student Classroom & Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#253322]">
            My Enrolled Baking Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-[#546F4D]">
            Welcome back! Continue mastering French patisserie, sharp edge architecture, and natural fermentation at your own pace.
          </p>
        </div>

        <Link
          href="/courses"
          className="px-6 py-3 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2 shrink-0 shadow-sm z-10"
        >
          Browse Academy Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Enrolled Courses Grid */}
      {enrollments.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-[#EFE9DF] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E6F0E2] text-[#6B8B62] flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#253322]">
            You have not enrolled in any masterclasses yet
          </h3>
          <p className="text-xs text-[#736B63] max-w-sm mx-auto">
            Explore our 4K pre-recorded courses with lifetime access, downloadable formulas, and direct chef Q&A.
          </p>
          <Link
            href="/courses"
            className="inline-block px-8 py-3.5 bg-[#283625] text-white text-xs font-bold rounded-full"
          >
            Explore Masterclasses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {enrollments.map((enr) => {
            const courseData = BAKING_COURSES.find((c) => c.id === enr.courseId);
            return (
              <div
                key={enr.id}
                className="bg-white rounded-3xl border border-[#EFE9DF] overflow-hidden shadow-xs hover:border-[#9CB894] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-16/9 w-full bg-[#23201D]">
                    <Image
                      src={enr.thumbnail}
                      alt={enr.courseTitle}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {enr.certificateEarned ? (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Award className="w-3 h-3" /> Certificate Ready
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 bg-[#283625]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        In Progress
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                      <span className="text-[10px] text-[#9CB894] font-semibold uppercase tracking-wider block">
                        Instructor: {enr.instructorName}
                      </span>
                      <h3 className="font-serif font-bold text-base sm:text-lg leading-snug line-clamp-1">
                        {enr.courseTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Progress & Current Lesson */}
                  <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[#253322]">
                        <span>Course Completion</span>
                        <span className="text-[#6B8B62]">{enr.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-[#F2EDE4] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#6B8B62] h-full rounded-full transition-all duration-500"
                          style={{ width: `${enr.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-[#736B63] pt-0.5">
                        <span>{enr.completedLessonIds.length} of {enr.totalLessons} lessons completed</span>
                        <span>Enrolled {enr.enrolledDate}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E6F0E2]">
                      <span className="text-[10px] uppercase font-bold text-[#86A57D] block">
                        Next Lesson
                      </span>
                      <p className="font-serif font-bold text-xs sm:text-sm text-[#253322] mt-0.5 line-clamp-1">
                        {enr.lastLessonTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <Link
                    href={`/learn/${enr.courseId}`}
                    className="w-full py-3.5 px-6 bg-[#283625] hover:bg-[#3E5239] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {enr.certificateEarned ? 'Review Course Material' : 'Continue Masterclass'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
