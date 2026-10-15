'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Enrollment } from './types';
import { SAMPLE_ENROLLMENTS, BAKING_COURSES } from './data';

interface LearningContextType {
  enrollments: Enrollment[];
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  enrollInCourse: (courseId: string) => void;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  notes: Record<string, string>;
  setLessonNote: (lessonId: string, note: string) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(SAMPLE_ENROLLMENTS);
  const [activeLessonId, setActiveLessonId] = useState<string>('les-1');
  const [notes, setNotes] = useState<Record<string, string>>({
    'les-1': 'Chef mentioned keeping oven calibrated to 160°C instead of 180°C for cake strips.',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bakeistry_enrollments');
      if (saved) {
        setEnrollments(JSON.parse(saved));
      }
    } catch {
      // LocalStorage error
    }
  }, []);

  const saveEnrollments = (updated: Enrollment[]) => {
    setEnrollments(updated);
    try {
      localStorage.setItem('bakeistry_enrollments', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const markLessonComplete = (courseId: string, lessonId: string) => {
    const updated = enrollments.map((enr) => {
      if (enr.courseId === courseId) {
        const completed = enr.completedLessonIds.includes(lessonId)
          ? enr.completedLessonIds
          : [...enr.completedLessonIds, lessonId];
        const progressPercent = Math.min(
          100,
          Math.round((completed.length / Math.max(1, enr.totalLessons)) * 100)
        );
        return {
          ...enr,
          completedLessonIds: completed,
          progressPercent,
          certificateEarned: progressPercent === 100,
        };
      }
      return enr;
    });
    saveEnrollments(updated);
  };

  const enrollInCourse = (courseId: string) => {
    if (enrollments.some((e) => e.courseId === courseId)) return;
    const course = BAKING_COURSES.find((c) => c.id === courseId);
    if (!course) return;

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      courseId,
      courseTitle: course.title,
      thumbnail: course.thumbnail,
      instructorName: course.instructor.name,
      enrolledDate: 'Today',
      progressPercent: 0,
      completedLessonIds: [],
      lastLessonId: course.curriculum[0]?.lessons[0]?.id || 'les-1',
      lastLessonTitle: course.curriculum[0]?.lessons[0]?.title || 'Introduction',
      totalLessons: course.lessonCount,
      certificateEarned: false,
    };

    saveEnrollments([...enrollments, newEnrollment]);
  };

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    const found = enrollments.find((e) => e.courseId === courseId);
    return found ? found.completedLessonIds.includes(lessonId) : false;
  };

  const setLessonNote = (lessonId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [lessonId]: note }));
  };

  return (
    <LearningContext.Provider
      value={{
        enrollments,
        activeLessonId,
        setActiveLessonId,
        markLessonComplete,
        enrollInCourse,
        isLessonCompleted,
        notes,
        setLessonNote,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
