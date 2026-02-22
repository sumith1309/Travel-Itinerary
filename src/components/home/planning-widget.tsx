'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export function PlanningWidget() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [style, setStyle] = useState('');

  const handlePlanTrip = () => {
    const params = new URLSearchParams();
    if (destination.trim()) params.set('dest', destination.trim());
    if (duration) params.set('days', duration);
    if (style) params.set('style', style);
    
    router.push(`/plan?${params.toString()}`);
  };

  return (
    <div className="relative z-20 -mt-20 mx-auto max-w-4xl px-4 sm:px-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-elevated border border-sand-200/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-forest/60 uppercase tracking-wider block">
              Destination
            </label>
            <Input
              placeholder="Anywhere in the world..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12 bg-sand-50 border-sand-200 rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-forest/60 uppercase tracking-wider block">
              Duration
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="h-12 bg-sand-50 border-sand-200 rounded-xl text-sm">
                <SelectValue placeholder="How long?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="10">10 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-forest/60 uppercase tracking-wider block">
              Travel Style
            </label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="h-12 bg-sand-50 border-sand-200 rounded-xl text-sm">
                <SelectValue placeholder="Your style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEISURE">Leisure</SelectItem>
                <SelectItem value="ADVENTURE">Adventure</SelectItem>
                <SelectItem value="LUXURY">Luxury</SelectItem>
                <SelectItem value="BUDGET">Budget</SelectItem>
                <SelectItem value="CULTURAL">Cultural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              className="w-full h-12"
              size="lg"
              variant="secondary"
              onClick={handlePlanTrip}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Plan Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
