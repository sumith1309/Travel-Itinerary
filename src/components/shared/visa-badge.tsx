import { cn, formatINR } from '@/lib/utils';

interface VisaBadgeProps {
  visaType: string;
  feeINR?: number;
  size?: 'sm' | 'default';
  className?: string;
}

const visaConfig: Record<string, { bg: string; label: string }> = {
  VISA_FREE: { bg: 'bg-success/15 text-success border-success/20', label: 'Visa Free' },
  VISA_ON_ARRIVAL: { bg: 'bg-warning/15 text-warning border-warning/20', label: 'Visa on Arrival' },
  E_VISA: { bg: 'bg-info/15 text-info border-info/20', label: 'E-Visa' },
  EMBASSY_VISA: { bg: 'bg-error/15 text-error border-error/20', label: 'Embassy Visa' },
};

export function VisaBadge({ visaType, feeINR, size = 'default', className }: VisaBadgeProps) {
  const config = visaConfig[visaType] ?? visaConfig.E_VISA;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium',
      config.bg,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      className
    )}>
      {config.label}
      {feeINR !== undefined && feeINR > 0 && (
        <span className="font-mono opacity-75">{formatINR(feeINR)}</span>
      )}
    </span>
  );
}
