import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      <Link href="/" className="text-stone hover:text-forest transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-stone/50" />
          {item.href ? (
            <Link href={item.href} className="text-stone hover:text-forest transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-midnight font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
