import {
  CIRCULAR_PROGRESS_DEFAULT_SIZE,
  CIRCULAR_PROGRESS_DEFAULT_STROKE,
  STAT_COLORS,
} from '@/lib/constants';
import type { CircularProgressProps } from '@/lib/types';

export function CircularProgress({
  value,
  max,
  size = CIRCULAR_PROGRESS_DEFAULT_SIZE,
  strokeWidth = CIRCULAR_PROGRESS_DEFAULT_STROKE,
  className = '',
  color = STAT_COLORS.primary,
  display,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference * (1 - percentage);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-muted/50 ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={STAT_COLORS.mutedStroke}
          strokeWidth={strokeWidth}
          opacity={0.5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold tabular-nums">{display ?? `${value}/${max}`}</span>
      </div>
    </div>
  );
}
