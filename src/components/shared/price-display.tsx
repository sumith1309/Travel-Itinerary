import { cn, formatINR } from '@/lib/utils';

interface PriceDisplayProps {
  amount: number | { toNumber(): number } | null | undefined;
  className?: string;
  variant?: 'compact' | 'detailed';
  showFree?: boolean;
}

export function PriceDisplay({
  amount,
  className,
  variant = 'compact',
  showFree = false,
}: PriceDisplayProps) {
  const numericAmount =
    amount == null ? 0 : typeof amount === 'number' ? amount : Number(amount.toNumber());

  if ((numericAmount === 0 || amount == null) && showFree) {
    return (
      <span className={cn('font-mono text-forest font-semibold', className)}>
        Free
      </span>
    );
  }

  if (amount == null) {
    return null;
  }

  const formatted = formatINR(numericAmount);

  if (variant === 'detailed') {
    return (
      <span className={cn('inline-flex items-baseline gap-1', className)}>
        <span className="font-mono font-semibold text-midnight">{formatted}</span>
        <span className="text-xs text-stone uppercase tracking-wide">INR</span>
      </span>
    );
  }

  return (
    <span className={cn('font-mono font-semibold text-midnight', className)}>
      {formatted}
    </span>
  );
}
