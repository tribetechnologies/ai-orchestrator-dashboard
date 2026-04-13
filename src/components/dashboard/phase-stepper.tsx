import {
  Check,
  Loader2,
  Clock,
  X,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { capitalize } from '@/lib/format';
import type { PhaseStepperProps, PhaseInfo } from '@/lib/types';

function PhaseStep({ phase }: { phase: PhaseInfo }) {
  const isDone = phase.status === 'done';
  const isRunning = phase.status === 'running';
  const isFailed = phase.status === 'failed';

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="relative flex flex-col items-center">
          <div
            className={cn(
              'relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500',
              isDone && 'border-green-500 bg-green-500/10 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.2)]',
              isRunning && 'border-yellow-500 bg-yellow-500/10 text-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.2)]',
              isFailed && 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
              !isDone && !isRunning && !isFailed && 'border-muted-foreground/20 bg-muted/50 text-muted-foreground'
            )}
          >
            {isRunning && (
              <span className="absolute inset-0 rounded-full animate-ping border-2 border-yellow-500/30" />
            )}
            {isDone ? (
              <Check className="h-5 w-5" />
            ) : isRunning ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isFailed ? (
              <X className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>
          <span
            className={cn(
              'absolute top-full mt-2.5 text-xs font-medium whitespace-nowrap',
              isDone && 'text-green-500',
              isRunning && 'text-yellow-500 font-semibold',
              isFailed && 'text-red-500 font-semibold',
              !isDone && !isRunning && !isFailed && 'text-muted-foreground/60'
            )}
          >
            {phase.label}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Phase {phase.id}: {phase.label} — {capitalize(phase.status)}
      </TooltipContent>
    </Tooltip>
  );
}

function Connector({ done, active }: { done: boolean; active: boolean }) {
  return (
    <div className="flex-1 px-2 self-stretch flex items-center" style={{ height: 48 }}>
      <div className="relative h-0.5 w-full rounded-full overflow-hidden bg-muted-foreground/10">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-700',
            done ? 'bg-green-500 w-full' : active ? 'bg-yellow-500 w-1/2 animate-pulse' : 'w-0'
          )}
        />
      </div>
    </div>
  );
}

export function PhaseStepper({ phases }: PhaseStepperProps) {
  return (
    <div className="flex items-start pt-2 pb-10 px-6">
      {phases.map((phase, i) => {
        const next = phases[i + 1];
        const connectorActive = phase.status === 'done' && next?.status === 'running';
        return (
          <div key={phase.id} className="contents">
            <PhaseStep phase={phase} />
            {i < phases.length - 1 && (
              <Connector done={phase.status === 'done'} active={connectorActive} />
            )}
          </div>
        );
      })}
    </div>
  );
}
