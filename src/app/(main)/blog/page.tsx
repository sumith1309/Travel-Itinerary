import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/data/blog';
import { BlogCard } from '@/components/shared/blog-card';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export const metadata: Metadata = {
  title: 'Travel Blog',
  description: 'Travel guides, tips, and stories for Indian travellers exploring Southeast Asia and beyond.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Blog' }]} className="mb-6" />
        <ScrollReveal>
          <SectionHeader title="Travel Blog" subtitle="Guides, tips, and stories for Indian travellers" />
        </ScrollReveal>

        {posts.length > 0 && (
          <div className="mb-10">
            <ScrollReveal>
              <BlogCard {...posts[0]} featured />
            </ScrollReveal>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.08}>
              <BlogCard {...post} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
