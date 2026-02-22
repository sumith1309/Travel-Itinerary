'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-forest to-forest-400 text-white shadow-md hover:shadow-lg hover:shadow-forest/20',
        secondary: 'bg-gradient-to-r from-orange to-orange-400 text-white shadow-md hover:shadow-lg hover:shadow-orange/20',
        outline: 'neu-button text-forest hover:text-forest-600',
        ghost: 'text-midnight hover:bg-sand-200/50',
        link: 'text-forest underline-offset-4 hover:underline',
        destructive: 'bg-error text-white hover:bg-error/90',
        glass: 'bg-white/15 backdrop-blur-2xl border border-white/20 text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/25 hover:border-white/35 hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        default: 'h-11 px-6 text-sm rounded-xl',
        lg: 'h-12 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const button = (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );

    return (
      <motion.div whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        {button}
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
