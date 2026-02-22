import prisma from '@/lib/db';

export async function getBlogPosts(category?: string, featured?: boolean) {
  const where: Record<string, unknown> = { status: 'PUBLISHED' };
  if (category) where.category = category;
  if (featured) where.publishedAt = { not: null };

  return prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getBlogBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function getFeaturedPosts() {
  return prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });
}

export async function getBlogCategories() {
  const results = await prisma.blogPost.groupBy({
    by: ['category'],
    where: { status: 'PUBLISHED' },
    _count: { category: true },
  });

  return results.map((r) => ({
    name: r.category,
    count: r._count.category,
  }));
}
