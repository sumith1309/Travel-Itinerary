import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number | { toNumber(): number };
  maxStars?: number;
  className?: string;
}

export function RatingStars({ rating, maxStars = 5, className }: RatingStarsProps) {
  const numericRating =
    typeof rating === 'number' ? rating : Number(rating.toNumber());

  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.25 && numericRating - fullStars < 0.75;
  const adjustedFull = numericRating - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = maxStars - adjustedFull - (hasHalfStar ? 1 : 0);

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${numericRating} out of ${maxStars} stars`}>
      {Array.from({ length: adjustedFull }, (_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-orange text-orange" />
      ))}
      {hasHalfStar && (
        <span className="relative h-4 w-4">
          <Star className="absolute inset-0 h-4 w-4 text-sand-300" />
          <StarHalf className="absolute inset-0 h-4 w-4 fill-orange text-orange" />
        </span>
      )}
      {Array.from({ length: Math.max(0, emptyStars) }, (_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-sand-300" />
      ))}
    </span>
  );
}
