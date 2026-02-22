import prisma from '@/lib/db';
import type { VisaType } from '@prisma/client';

export async function getVisaEntries(type?: VisaType) {
  const where: Record<string, unknown> = { status: 'PUBLISHED' };
  if (type) where.visaType = type;

  return prisma.visaInfo.findMany({
    where,
    include: {
      country: {
        select: { name: true, slug: true, heroImageUrl: true },
      },
    },
    orderBy: { country: { name: 'asc' } },
  });
}

export async function getVisaByCountrySlug(slug: string) {
  const country = await prisma.country.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!country) return null;

  return prisma.visaInfo.findFirst({
    where: { countryId: country.id, status: 'PUBLISHED' },
    include: {
      country: {
        select: { name: true, slug: true, heroImageUrl: true, currencyCode: true },
      },
    },
  });
}

export async function getVisaCategoryCounts() {
  const results = await prisma.visaInfo.groupBy({
    by: ['visaType'],
    where: { status: 'PUBLISHED' },
    _count: { visaType: true },
  });

  return results.reduce(
    (acc, item) => {
      acc[item.visaType] = item._count.visaType;
      return acc;
    },
    {} as Record<string, number>
  );
}
