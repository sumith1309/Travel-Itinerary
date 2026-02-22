'use client';

import { Train, Clock, IndianRupee, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatINR } from '@/lib/utils';
import type { TrainRoute } from '@/lib/data/train-routes';

interface TrainInfoProps {
  route: TrainRoute;
  className?: string;
}

export function TrainInfo({ route, className }: TrainInfoProps) {
  const hasFares = route.fareINR.ac3 > 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn('neu-raised rounded-xl p-5', className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10">
            <Train className="h-5 w-5 text-forest" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="font-medium text-midnight">{route.from} → {route.to}</h4>
            {route.trainNames[0] && (
              <p className="text-xs text-stone">{route.trainNames.join(', ')}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-stone">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono">{route.durationHours}h</span>
        </div>
      </div>

      {hasFares && (
        <div className="mt-3 flex gap-2">
          {route.fareINR.sleeper > 0 && (
            <span className="rounded-full bg-sand-200/60 px-2.5 py-1 text-xs font-mono text-midnight">
              SL {formatINR(route.fareINR.sleeper)}
            </span>
          )}
          <span className="rounded-full bg-sand-200/60 px-2.5 py-1 text-xs font-mono text-midnight">
            3AC {formatINR(route.fareINR.ac3)}
          </span>
          <span className="rounded-full bg-sand-200/60 px-2.5 py-1 text-xs font-mono text-midnight">
            2AC {formatINR(route.fareINR.ac2)}
          </span>
        </div>
      )}

      <p className="mt-3 text-xs text-stone leading-relaxed">{route.bookingTip}</p>

      <a
        href="https://www.irctc.co.in"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-forest hover:text-forest/80 transition-colors"
      >
        Book on IRCTC <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  );
}
