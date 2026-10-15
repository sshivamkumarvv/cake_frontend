'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  BookOpen,
  Award,
  Sparkles,
  Menu,
  X,
  MessageSquare,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { BakingCourse } from '../../../lib/types';
import { useLearning } from '../../../lib/learning-context';

export function LearnPlayerClient({ course }: { course: BakingCourse }) {
  const {
    enrollments,
    markLessonComplete,
    isLessonCompleted,
    notes,
    setLessonNote,
  } = useLearning();

  // Find all lessons flattened
  const allLessons = course.curriculum.flatMap((sec) =>
    sec.lessons.map((l) => ({ ...l, sectionTitle: sec.title }))
  );

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || 'les-1'
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'notes'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const currentNote = notes[activeLessonId] || '';
  const isCompleted = isLessonCompleted(course.id, activeLessonId);

  // Student progress
  const currentEnrollment = enrollments.find((e) => e.courseId === course.id);
  const progressPercent = currentEnrollment?.progressPercent || 0;

  const handleToggleComplete = () => {
    markLessonComplete(course.id, activeLessonId);
  };

  const handleSaveNote = (text: string) => {
    setLessonNote(activeLessonId, text);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#191715] text-[#FAF8F5] flex flex-col">
      {/* Top Learning Navigation Bar */}
      <header className="h-16 bg-[#23201D] border-b border-[#2E3C2B] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/account/learning"
            className="p-2 text-[#9CB894] hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Classroom</span>
          </Link>
          <span className="text-[#3E5239] hidden sm:inline">|</span>
          <span className="font-serif font-bold text-xs sm:text-sm text-white truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress widget */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            <span className="text-[#A0AAB2]">Course Progress:</span>
            <div className="w-28 bg-[#36312B] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#9CB894] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-semibold text-[#9CB894]">{progressPercent}%</span>
          </div>

          {currentEnrollment?.certificateEarned && (
            <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Certificate Earned
            </span>
          )}

          {/* Toggle sidebar button on mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
          >
            <Menu className="w-4 h-4" />
            <span>Curriculum</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Player & Lesson Workspace */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Video Player: Edge-to-edge on mobile */}
          <div className="relative aspect-16/9 bg-black -mx-4 rounded-none sm:mx-0 sm:rounded-3xl overflow-hidden shadow-2xl border-y sm:border border-[#3E5239]">
            <video
              key={currentLesson.videoUrl}
              src={currentLesson.videoUrl}
              controls
              autoPlay={false}
              poster={course.thumbnail}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Lesson Action Controls Header */}
          <div className="p-6 bg-[#23201D] rounded-3xl border border-[#2E3C2B] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CB894] block">
                  {currentLesson.sectionTitle}
                </span>
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white mt-0.5">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-[#A0AAB2] mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#DE9E62]" />
                    {currentLesson.duration}
                  </span>
                  <span>•</span>
                  <span>Masterclass Lesson {currentLessonIndex + 1} of {allLessons.length}</span>
                </div>
              </div>

              {/* Complete / Incomplete toggle button */}
              <button
                onClick={handleToggleComplete}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-500'
                    : 'bg-[#9CB894] hover:bg-[#86A57D] text-[#191715]'
                }`}
              >
                <Check className="w-4 h-4" />
                {isCompleted ? 'Completed' : 'Mark as Complete'}
              </button>
            </div>

            {/* Previous & Next lesson navigation */}
            <div className="pt-4 border-t border-[#36312B] flex items-center justify-between text-xs">
              {previousLesson ? (
                <button
                  onClick={() => setActiveLessonId(previousLesson.id)}
                  className="flex items-center gap-1.5 text-[#D0E2CA] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="line-clamp-1">Prev: {previousLesson.title}</span>
                </button>
              ) : (
                <span className="text-[#546F4D]">First lesson</span>
              )}

              {nextLesson ? (
                <button
                  onClick={() => setActiveLessonId(nextLesson.id)}
                  className="flex items-center gap-1.5 text-[#9CB894] hover:text-white transition-colors ml-auto font-semibold"
                >
                  <span className="line-clamp-1">Next: {nextLesson.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-[#9CB894] font-semibold">Course Finish!</span>
              )}
            </div>
          </div>

          {/* Lesson Tabs: Overview, Formula Sheets, Notes */}
          <div className="bg-[#23201D] rounded-3xl border border-[#2E3C2B] p-6 space-y-6">
            <div className="flex border-b border-[#2E3C2B] gap-6 text-xs sm:text-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 font-semibold transition-colors relative ${
                  activeTab === 'overview' ? 'text-white' : 'text-[#A0AAB2] hover:text-white'
                }`}
              >
                Lesson Overview
                {activeTab === 'overview' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9CB894]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 font-semibold transition-colors relative ${
                  activeTab === 'resources' ? 'text-white' : 'text-[#A0AAB2] hover:text-white'
                }`}
              >
                Formulas & Downloads ({currentLesson.resources?.length || 0})
                {activeTab === 'resources' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9CB894]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 font-semibold transition-colors relative ${
                  activeTab === 'notes' ? 'text-white' : 'text-[#A0AAB2] hover:text-white'
                }`}
              >
                Personal Notes
                {activeTab === 'notes' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9CB894]" />
                )}
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-3 text-xs sm:text-sm text-[#D0E2CA] leading-relaxed">
                <p>{currentLesson.summary}</p>
                <div className="p-4 bg-[#191715] rounded-2xl border border-[#3E5239] space-y-1">
                  <h4 className="font-serif font-bold text-white text-xs">
                    Chef Mitali&apos;s Pro Tip
                  </h4>
                  <p className="text-xs text-[#A0AAB2]">
                    Never rush the chocolate ganache resting period. Let the cocoa butter form stable Beta crystals naturally at 20°C for at least 6 hours before whipping.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {currentLesson.resources && currentLesson.resources.length > 0 ? (
                  currentLesson.resources.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 bg-[#191715] rounded-2xl border border-[#3E5239] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#9CB894]" />
                        <div>
                          <p className="text-xs font-semibold text-white">{res.name}</p>
                          <span className="text-[10px] text-[#A0AAB2]">{res.type} Document • {res.size}</span>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Simulating download of ${res.name}`);
                        }}
                        className="p-2 text-[#9CB894] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#A0AAB2] italic py-2">
                    No extra downloads required for this specific lesson.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                <p className="text-xs text-[#A0AAB2]">
                  Private notes for this lesson. Notes are saved automatically in your browser.
                </p>
                <textarea
                  defaultValue={currentNote}
                  onChange={(e) => handleSaveNote(e.target.value)}
                  placeholder="Record your kitchen observations, oven adjustments, or flavor notes here..."
                  rows={4}
                  className="w-full p-4 text-xs rounded-2xl bg-[#191715] border border-[#3E5239] text-white focus:outline-none focus:border-[#9CB894]"
                />
                {noteSaved && (
                  <span className="text-[11px] text-emerald-400 block">Note auto-saved!</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Expandable Modules & Lessons Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 right-0 z-40 w-80 sm:w-96 bg-[#23201D] border-l border-[#2E3C2B] flex flex-col transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 sm:p-5 border-b border-[#2E3C2B] flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white">
                Course Curriculum
              </h3>
              <p className="text-[11px] text-[#A0AAB2]">
                {course.curriculum.length} Modules • {allLessons.length} Lessons
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 text-[#A0AAB2] hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#2E3C2B]">
            {course.curriculum.map((section, sIdx) => (
              <div key={section.id} className="py-2">
                <div className="px-4 py-2 bg-[#2D2A26] text-[11px] font-bold text-[#D0E2CA] flex items-center justify-between">
                  <span>Module {sIdx + 1}: {section.title.split(':')[1] || section.title}</span>
                  <span className="text-[10px] text-[#86A57D] font-mono">{section.duration}</span>
                </div>

                <div className="divide-y divide-[#282522]">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = isLessonCompleted(course.id, lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                          isActive
                            ? 'bg-[#3E5239] text-white'
                            : 'hover:bg-white/5 text-[#D0E2CA]'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div
                              className={`w-3.5 h-3.5 rounded-full border ${
                                isActive ? 'border-white' : 'border-[#546F4D]'
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs line-clamp-1 leading-snug">
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-[#A0AAB2] mt-0.5 font-mono">
                            <span>{lesson.duration}</span>
                            {lesson.isPreview && (
                              <span className="text-[#DE9E62] font-semibold">Preview</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
