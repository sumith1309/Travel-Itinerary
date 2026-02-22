import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, User } from 'lucide-react';
import { getBlogBySlug } from '@/lib/data/blog';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { Badge } from '@/components/ui/badge';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return { title: post.seoTitle ?? post.title, description: post.seoDescription ?? post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <div className="pt-24 pb-[var(--spacing-section)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} className="mb-6" />

        <ScrollReveal>
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-midnight leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-stone mb-8">
            {post.authorName && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" strokeWidth={1.5} />
                {post.authorName}
              </span>
            )}
            {post.readTimeMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" strokeWidth={1.5} />
                {post.readTimeMinutes} min read
              </span>
            )}
          </div>
        </ScrollReveal>

        {post.coverImageUrl && (
          <ScrollReveal>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
              <Image src={post.coverImageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <div className="prose-luxury">
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
