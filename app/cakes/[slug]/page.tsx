import React from 'react';
import { notFound } from 'next/navigation';
import { CAKE_PRODUCTS } from '../../../lib/data';
import { CakeDetailClient } from './cake-detail-client';

export function generateStaticParams() {
  return CAKE_PRODUCTS.map((cake) => ({
    slug: cake.slug,
  }));
}

export default async function CakeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cake = CAKE_PRODUCTS.find((c) => c.slug === slug);

  if (!cake) {
    notFound();
  }

  return <CakeDetailClient cake={cake} />;
}
