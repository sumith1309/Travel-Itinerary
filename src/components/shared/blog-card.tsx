'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category: string;
  authorName?: string | null;
  readTimeMinutes?: number | null;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ title, slug, excerpt, coverImageUrl, category, authorName, readTimeMinutes, featured, className }: BlogCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
      <Link href={`/blog/${slug}`} className={cn('block neu-raised overflow-hidden group', featured && 'md:flex', className)}>
        <div className={cn('relative overflow-hidden rounded-t-2xl', featured ? 'md:w-1/2 md:rounded-l-2xl md:rounded-tr-none aspect-[16/10]' : 'aspect-[16/10]')}>
          {coverImageUrl ? (
            <Image src={coverImageUrl} alt={title} fill sizes={featured ? '50vw' : '(max-width: 768px) 100vw, 33vw'} className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full bg-sand-200" />
          )}
          <Badge className="absolute top-3 left-3" variant="default">{category}</Badge>
        </div>
        <div className={cn('p-5 space-y-2', featured && 'md:w-1/2 md:flex md:flex-col md:justify-center')}>
          <h3 className={cn('font-display font-semibold text-midnight leading-tight', featured ? 'text-2xl' : 'text-lg')}>{title}</h3>
          {excerpt && <p className={cn('text-sm text-stone', featured ? 'line-clamp-3' : 'line-clamp-2')}>{excerpt}</p>}
          <div className="flex items-center gap-3 text-xs text-stone">
            {authorName && <span>{authorName}</span>}
            {readTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                {readTimeMinutes} min read
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
