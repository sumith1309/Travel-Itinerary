import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="h-16 w-16 rounded-2xl bg-sand-200 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-stone" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl font-semibold text-midnight mb-2">{title}</h3>
      <p className="text-sm text-stone max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
    </div>
  );
}
