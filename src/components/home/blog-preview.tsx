import { getFeaturedPosts } from '@/lib/data/blog';
import { BlogCard } from '@/components/shared/blog-card';
import { SectionHeader } from '@/components/shared/section-header';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function BlogPreview() {
  const posts = await getFeaturedPosts();

  if (posts.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeader
            title="From the Blog"
            subtitle="Travel guides, tips, and stories for Indian travellers"
            viewAllHref="/blog"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts[0] && (
            <ScrollReveal>
              <BlogCard {...posts[0]} featured />
            </ScrollReveal>
          )}
          <div className="grid grid-cols-1 gap-6">
            {posts.slice(1, 3).map((post, i) => (
              <ScrollReveal key={post.id} delay={(i + 1) * 0.1}>
                <BlogCard {...post} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
