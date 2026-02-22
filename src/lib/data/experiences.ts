import prisma from '@/lib/db';
import type { ExperienceCategory } from '@prisma/client';

export async function getExperiences(category?: ExperienceCategory) {
  const where: Record<string, unknown> = { status: 'PUBLISHED' };
  if (category) where.category = category;

  return prisma.experience.findMany({
    where,
    orderBy: { name: 'asc' },
  });
}

export async function getExperienceBySlug(slug: string) {
  return prisma.experience.findUnique({
    where: { slug },
  });
}
