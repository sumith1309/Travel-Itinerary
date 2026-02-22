import { cn } from '@/lib/utils';

interface TagListProps {
  tags: string[];
  max?: number;
  className?: string;
}

export function TagList({ tags, max, className }: TagListProps) {
  if (!tags.length) return null;

  const visibleTags = max ? tags.slice(0, max) : tags;
  const overflowCount = max ? Math.max(0, tags.length - max) : 0;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="inline-block rounded-full bg-sand-200 px-2.5 py-0.5 text-xs text-stone"
        >
          {tag}
        </span>
      ))}
      {overflowCount > 0 && (
        <span className="inline-block rounded-full bg-sand-300 px-2.5 py-0.5 text-xs text-stone font-medium">
          +{overflowCount} more
        </span>
      )}
    </div>
  );
}
