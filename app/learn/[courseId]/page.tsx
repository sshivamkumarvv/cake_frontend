import React from 'react';
import { notFound } from 'next/navigation';
import { BAKING_COURSES } from '../../../lib/data';
import { LearnPlayerClient } from './learn-player-client';

export function generateStaticParams() {
  return BAKING_COURSES.map((course) => ({
    courseId: course.id,
  }));
}

export default async function CourseLearningPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = BAKING_COURSES.find(
    (c) => c.id === courseId || c.slug === courseId
  );

  if (!course) {
    notFound();
  }

  return <LearnPlayerClient course={course} />;
}
