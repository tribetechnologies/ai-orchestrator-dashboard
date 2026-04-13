import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCost, capitalize } from '@/lib/format';
import {
  PHASE_ACCORDION_PREFIX,
  PHASE_STATUS_BADGE_STYLES,
  PHASE_STATUS_ICON_STYLES,
  PHASE_TO_TASK_STATUS,
  STEP_ACCORDION_PREFIX,
  TASK_STATUS_CONFIG,
  TASK_STATUS_ORDER,
} from '@/lib/constants';
import type { PhaseInfo, AgentTask, TaskStatus, AgentInfo, PipelineStepState, TaskRowProps, PhaseTaskRow, TaskAccordionProps } from '@/lib/types';
import {
  Check,
  Loader2,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';

// ─── Status Badge ───────────────────────────────────────────────────────────

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = TASK_STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

// ─── Status Dot ─────────────────────────────────────────────────────────────

const TASK_STATUS_DOT_COLORS: Record<TaskStatus, string> = {
  completed: 'bg-chart-4',
  in_progress: 'bg-secondary',
  pending: 'bg-muted-foreground',
  failed: 'bg-destructive',
  blocked: 'bg-muted-foreground',
};

function TaskStatusDot({ status }: { status: TaskStatus }) {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {status === 'in_progress' && (
        <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', TASK_STATUS_DOT_COLORS[status])} />
      )}
      <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', TASK_STATUS_DOT_COLORS[status])} />
    </span>
  );
}

// ─── Phase Status Icons ─────────────────────────────────────────────────────

const PHASE_STATUS_ICONS: Record<string, React.ElementType> = {
  done: Check,
  running: Loader2,
  pending: Clock,
  failed: X,
};

// ─── Task Row ───────────────────────────────────────────────────────────────

function TaskRow({ task, onSelect }: TaskRowProps) {
  return (
    <button
      onClick={() => onSelect(task.id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
        'bg-muted/80 hover:bg-accent-foreground/5 border border-border/40 transition-colors duration-200'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate">{task.title}</span>
        </div>
        {task.blockedBy.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Blocked by: {task.blockedBy.join(', ')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <TaskStatusDot status={task.status} />
        <span className="w-14 text-xs text-foreground tabular-nums font-semibold">
          {formatCost(task.tokenUsage?.costUsd ?? 0)}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// ─── Main Phase Task Accordion ──────────────────────────────────────────────

/** Build a lookup of stepId → tasks from the pipeline steps. */
function buildStepTasksMap(steps: PipelineStepState[]): Map<string, AgentTask[]> {
  const map = new Map<string, AgentTask[]>();
  for (const step of steps) {
    if (step.tasks && step.tasks.length > 0) {
      map.set(step.id, step.tasks);
    }
  }
  return map;
}

function getPhaseCost(
  phase: PhaseInfo,
  stepTasksMap: Map<string, AgentTask[]>,
  agents: AgentInfo[],
): number {
  if (!phase.stepId) return 0;
  const tasks = stepTasksMap.get(phase.stepId);
  if (tasks) {
    return tasks.reduce((sum, t) => sum + (t.tokenUsage?.costUsd ?? 0), 0);
  }
  return agents
    .filter((a) => a.name === phase.stepId)
    .reduce((sum, a) => sum + (a.tokenUsage?.costUsd ?? 0), 0);
}

function getPhaseMainTask(phase: PhaseInfo): PhaseTaskRow {
  return {
    id: phase.stepId ? `${STEP_ACCORDION_PREFIX}${phase.stepId}` : `${PHASE_ACCORDION_PREFIX}${phase.id}`,
    title: `${phase.label} phase`,
    status: PHASE_TO_TASK_STATUS[phase.status] ?? 'pending',
    cost: 0,
  };
}

export function TaskAccordion({ phases, steps, tasks, agents, onSelectTask, onSelectPhase }: TaskAccordionProps) {
  const stepTasksMap = buildStepTasksMap(steps);

  // Find the first step that has subtasks to auto-expand it
  const defaultOpenValues = phases
    .filter((p) => p.stepId && stepTasksMap.has(p.stepId))
    .map((p) => `${STEP_ACCORDION_PREFIX}${p.stepId}`);

  const sortedTasks = [...tasks].sort(
    (a, b) => TASK_STATUS_ORDER[a.status] - TASK_STATUS_ORDER[b.status]
  );

  return (
    <Accordion multiple defaultValue={defaultOpenValues}>
      {phases.map((phase) => {
        const Icon = PHASE_STATUS_ICONS[phase.status] ?? Clock;
        const iconStyle = PHASE_STATUS_ICON_STYLES[phase.status] ?? '';
        const hasSubtasks = phase.stepId ? stepTasksMap.has(phase.stepId) : false;
        const phaseTasks = hasSubtasks ? sortedTasks : [];
        const mainTask = !hasSubtasks ? getPhaseMainTask(phase) : null;
        const itemValue = phase.stepId ? `${STEP_ACCORDION_PREFIX}${phase.stepId}` : `${PHASE_ACCORDION_PREFIX}${phase.id}`;

        return (
          <AccordionItem key={itemValue} value={itemValue} className="bg-muted/40 rounded-lg px-1 mb-2 border border-border/50">
            <AccordionTrigger className="px-3 py-3">
              <div className="flex items-center w-full">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Icon className={cn('h-5 w-5 shrink-0', iconStyle)} />
                  <span className="font-semibold text-base">{phase.label}</span>
                  {hasSubtasks && (
                    <span className="text-sm text-muted-foreground">
                      ({tasks.filter((t) => t.status === 'completed').length}/{tasks.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className={cn('text-xs', PHASE_STATUS_BADGE_STYLES[phase.status])}>
                    {phase.status === 'done' ? 'Completed' : capitalize(phase.status)}
                  </Badge>
                  <span className="w-14 text-xs text-foreground tabular-nums font-semibold mr-4">
                    {formatCost(getPhaseCost(phase, stepTasksMap, agents))}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-2">
              {hasSubtasks ? (
                <div className="space-y-1.5">
                  {phaseTasks.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      No tasks yet — waiting for planner
                    </p>
                  ) : (
                    phaseTasks.map((task) => (
                      <TaskRow key={task.id} task={task} onSelect={onSelectTask} />
                    ))
                  )}
                </div>
              ) : mainTask ? (
                <button
                  onClick={() => onSelectPhase(phase.stepId ?? phase.label)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
                    'bg-muted/80 hover:bg-accent-foreground/5 border border-border/40 transition-colors duration-200'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className="truncate">{mainTask.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <TaskStatusBadge status={mainTask.status} />
                    <span className="w-14 text-xs text-foreground tabular-nums font-semibold">
                      {formatCost(mainTask.cost)}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
