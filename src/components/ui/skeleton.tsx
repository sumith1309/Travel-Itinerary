import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-xl bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200 bg-[length:400%_100%]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
