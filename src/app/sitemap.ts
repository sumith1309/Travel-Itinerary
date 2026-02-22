import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://trailsandmiles.com';

  // Fetch all published slugs
  const [countries, cities, blogs, experiences] = await Promise.all([
    prisma.country.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.city.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.experience.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/visa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/experiences`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/itineraries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...countries.map((c) => ({ url: `${baseUrl}/destinations/${c.slug}`, lastModified: c.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...blogs.map((b) => ({ url: `${baseUrl}/blog/${b.slug}`, lastModified: b.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...experiences.map((e) => ({ url: `${baseUrl}/experiences/${e.slug}`, lastModified: e.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
