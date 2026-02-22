import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function Logo({ className, size = 'default' }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <span className={cn('font-display font-bold text-forest tracking-tight', sizes[size])}>
        Trails <span className="text-orange">&</span> Miles
      </span>
    </Link>
  );
}
