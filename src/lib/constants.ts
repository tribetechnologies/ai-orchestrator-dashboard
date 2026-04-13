import type { TaskStatus, BadgeVariant } from './types';
import type { RunSummary } from './types';

// ─── API ────────────────────────────────────────────────────────────────────

export const API_BASE = '/api';

export const ApiRoute = {
  Projects: '/projects',
  Runs: '/runs',
  Browse: '/browse',
} as const;

// ─── Polling ────────────────────────────────────────────────────────────────

export const POLL_INTERVAL_MS = 1000;

// ─── Theme ──────────────────────────────────────────────────────────────────

export const THEME_STORAGE_KEY = 'dashboard-theme';
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;
export type ThemeValue = (typeof Theme)[keyof typeof Theme];

// ─── Responsive ─────────────────────────────────────────────────────────────

export const MOBILE_BREAKPOINT_PX = 768;

// ─── Layout / Panels ────────────────────────────────────────────────────────

export const LOG_PANEL_DEFAULT_SIZE = 45;
export const LOG_PANEL_MIN_SIZE = 25;
export const MAIN_PANEL_DEFAULT_SIZE = 55;
export const MAIN_PANEL_MIN_SIZE = 30;

// ─── Circular Progress ──────────────────────────────────────────────────────

export const CIRCULAR_PROGRESS_DEFAULT_SIZE = 80;
export const CIRCULAR_PROGRESS_DEFAULT_STROKE = 6;
export const STAT_CIRCULAR_SIZE = 88;
export const STAT_CIRCULAR_STROKE = 7;

// ─── Stat Card Colors ───────────────────────────────────────────────────────

export const STAT_COLORS = {
  tasks: 'hsl(142 71% 45%)',
  budget: 'hsl(43 96% 56%)',
  primary: 'hsl(var(--primary))',
  mutedStroke: 'hsl(var(--muted))',
} as const;

// ─── Budget Thresholds ──────────────────────────────────────────────────────

export const BUDGET_THRESHOLD_HIGH = 0.8;
export const BUDGET_THRESHOLD_MID = 0.5;

// ─── Formatting ─────────────────────────────────────────────────────────────

export const COST_SMALL_THRESHOLD = 0.01;
export const COST_DECIMAL_PLACES = 2;
export const COST_SMALL_DECIMAL_PLACES = 4;

export const TOKEN_MILLION = 1_000_000;
export const TOKEN_THOUSAND = 1_000;

export const MS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 3600;
export const MS_PER_MINUTE = 60_000;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;

export const LOCALE = 'en-US';

export const TOOL_DURATION_MS_THRESHOLD = 1000;

// ─── Log Actions ────────────────────────────────────────────────────────────

export const LogAction = {
  Start: 'start',
  ToolUse: 'tool_use',
  Complete: 'complete',
  SessionEnd: 'session_end',
  Error: 'error',
  Config: 'config',
  Git: 'git',
} as const;
export type LogActionValue = (typeof LogAction)[keyof typeof LogAction];

export const ACTION_STYLES: Record<string, string> = {
  [LogAction.Start]: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  [LogAction.ToolUse]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  [LogAction.Complete]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [LogAction.SessionEnd]: 'bg-green-500/10 text-green-500 border-green-500/20',
  [LogAction.Error]: 'bg-red-500/10 text-red-500 border-red-500/20',
  [LogAction.Config]: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  [LogAction.Git]: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

export const DEFAULT_ACTION_STYLE = 'bg-muted text-muted-foreground';

// ─── Tool Names ─────────────────────────────────────────────────────────────

export const ToolName = {
  Glob: 'Glob',
  Grep: 'Grep',
  Read: 'Read',
  Edit: 'Edit',
  Write: 'Write',
  Bash: 'Bash',
  WebFetch: 'WebFetch',
  WebSearch: 'WebSearch',
} as const;

// ─── Phase Accordion ────────────────────────────────────────────────────────

/** Prefix for accordion item values that represent pipeline steps. */
export const STEP_ACCORDION_PREFIX = 'step-';
/** Prefix for accordion item values that represent non-step phases. */
export const PHASE_ACCORDION_PREFIX = 'phase-';

// ─── Run Status Styles ──────────────────────────────────────────────────────

export const RUN_STATUS_BADGE_STYLES: Record<RunSummary['status'], string> = {
  running: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  pending: 'bg-muted text-muted-foreground border-border',
};

export const RUN_STATUS_COLORS: Record<RunSummary['status'], string> = {
  running: 'text-yellow-500',
  completed: 'text-green-500',
  failed: 'text-red-500',
  pending: 'text-muted-foreground',
};

// ─── Task Status Config ─────────────────────────────────────────────────────

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; variant: BadgeVariant; className: string }
> = {
  completed: {
    label: 'Completed',
    variant: 'default',
    className: 'bg-green-500/10 text-green-500 border-green-500/20',
  },
  in_progress: {
    label: 'Running',
    variant: 'default',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
  pending: { label: 'Pending', variant: 'secondary', className: '' },
  failed: { label: 'Failed', variant: 'destructive', className: '' },
  blocked: {
    label: 'Blocked',
    variant: 'outline',
    className: 'text-orange-500 border-orange-500/30',
  },
};

export const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  in_progress: 0,
  pending: 1,
  blocked: 2,
  completed: 3,
  failed: 4,
};

// ─── Phase Status Styles ────────────────────────────────────────────────────

export const PHASE_STATUS_ICON_STYLES: Record<string, string> = {
  done: 'text-green-500',
  running: 'text-yellow-500 animate-spin',
  pending: 'text-muted-foreground',
  failed: 'text-red-500',
};

export const PHASE_STATUS_BADGE_STYLES: Record<string, string> = {
  done: 'bg-green-500/10 text-green-500 border-green-500/20',
  running: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  pending: 'bg-muted text-muted-foreground',
};

// ─── Run Status Header Styles ───────────────────────────────────────────────

export const RUN_HEADER_STATUS_STYLES: Record<string, string> = {
  running: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  pending: 'bg-muted text-muted-foreground',
};

// ─── Phase Status → Task Status ─────────────────────────────────────────────

export const PHASE_TO_TASK_STATUS: Record<string, TaskStatus> = {
  done: 'completed',
  running: 'in_progress',
  pending: 'pending',
  failed: 'failed',
};

// ─── Recent Logs Display ────────────────────────────────────────────────────

export const RECENT_LOG_TAIL = 20;
