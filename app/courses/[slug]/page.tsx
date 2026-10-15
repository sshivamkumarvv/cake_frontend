import React from 'react';
import { notFound } from 'next/navigation';
import { BAKING_COURSES } from '../../../lib/data';
import { CourseDetailClient } from './course-detail-client';

export function generateStaticParams() {
  return BAKING_COURSES.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = BAKING_COURSES.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}
