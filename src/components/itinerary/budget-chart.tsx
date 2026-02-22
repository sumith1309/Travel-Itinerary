'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { fadeUp } from '@/lib/animations';

interface BudgetItem {
  category: string;
  amount: number;
}

interface BudgetChartProps {
  items: BudgetItem[];
  totalBudget: number;
  className?: string;
}

const CATEGORY_COLORS: Record<string, { fill: string; bg: string; label: string }> = {
  food: { fill: '#E8734A', bg: 'bg-brand-orange', label: 'Food & Dining' },
  activities: { fill: '#1B4D3E', bg: 'bg-forest', label: 'Activities' },
  transport: { fill: '#3b82f6', bg: 'bg-blue-500', label: 'Transport' },
  shopping: { fill: '#8b5cf6', bg: 'bg-purple-500', label: 'Shopping' },
  accommodation: { fill: '#f59e0b', bg: 'bg-amber-500', label: 'Accommodation' },
  other: { fill: '#8B8578', bg: 'bg-stone', label: 'Other' },
};

export function BudgetChart({ items, totalBudget, className = '' }: BudgetChartProps) {
  const chartData = useMemo(() => {
    if (items.length === 0 || totalBudget <= 0) return [];

    return items
      .filter((item) => item.amount > 0)
      .map((item) => {
        const key = item.category.toLowerCase();
        const config = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.other;
        const percentage = (item.amount / totalBudget) * 100;
        return { ...item, ...config, percentage };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [items, totalBudget]);

  if (chartData.length === 0) {
    return null;
  }

  // SVG donut chart
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <motion.div variants={fadeUp} className={`neu-raised rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <IndianRupee className="h-4 w-4 text-forest" />
        <h3 className="font-display text-lg font-semibold text-midnight">Budget Breakdown</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e2db"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {chartData.map((seg) => {
              const offset = circumference * (1 - cumulativePercent / 100);
              const length = circumference * (seg.percentage / 100);
              cumulativePercent += seg.percentage;

              return (
                <motion.circle
                  key={seg.category}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.fill}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              );
            })}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-stone">Total</span>
            <span className="font-mono text-sm font-bold text-midnight">
              {formatINR(totalBudget)}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {chartData.map((seg) => (
            <div key={seg.category} className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-sm shrink-0 ${seg.bg}`} />
              <span className="text-sm text-midnight flex-1">{seg.label}</span>
              <span className="text-sm font-mono text-stone">{formatINR(seg.amount)}</span>
              <span className="text-xs text-stone/70 w-10 text-right">
                {Math.round(seg.percentage)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
