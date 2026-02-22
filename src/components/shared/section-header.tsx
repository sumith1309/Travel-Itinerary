import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel = 'View all', className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between mb-8', className)}>
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-midnight">{title}</h2>
        {subtitle && <p className="mt-2 text-stone text-sm sm:text-base max-w-2xl">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-600 transition-colors shrink-0"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
