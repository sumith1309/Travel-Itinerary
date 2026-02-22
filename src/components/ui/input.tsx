import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'neu-input flex h-11 w-full px-4 py-2 text-sm text-midnight placeholder:text-stone/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-orange shadow-[inset_3px_3px_6px_rgba(0,0,0,0.04),inset_-3px_-3px_6px_rgba(255,255,255,0.7),0_0_0_3px_rgba(232,115,74,0.15)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
