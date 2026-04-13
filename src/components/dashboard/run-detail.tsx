import { useState, useCallback, useMemo } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCards } from './stat-cards';
import { PhaseStepper } from './phase-stepper';
import { TaskAccordion } from './task-accordion';
import { LogPanel } from './log-panel';
import { usePolling } from '@/hooks/use-polling';
import { fetchRunDetail, fetchTaskLogs, fetchPhaseLogs } from '@/lib/api';
import { RUN_HEADER_STATUS_STYLES } from '@/lib/constants';
import { capitalize } from '@/lib/format';
import type { LogEntry, RunDetailProps, LogTarget } from '@/lib/types';
import { GitBranch } from 'lucide-react';

export function RunDetail({ projectId, ticketId }: RunDetailProps) {
  const [logTarget, setLogTarget] = useState<LogTarget>(null);

  const fetcher = useCallback(
    () => fetchRunDetail(projectId, ticketId),
    [projectId, ticketId]
  );
  const { data: detail, loading, error } = usePolling(fetcher);

  const logsFetcher = useCallback((): Promise<LogEntry[]> => {
    if (!logTarget) return Promise.resolve([]);
    return logTarget.type === 'task'
      ? fetchTaskLogs(projectId, ticketId, logTarget.taskId)
      : fetchPhaseLogs(projectId, ticketId, logTarget.phase);
  }, [projectId, ticketId, logTarget]);

  const { data: polledLogs, loading: logsLoading } = usePolling(
    logsFetcher,
    logTarget !== null
  );
  const logs = polledLogs ?? [];

  const loadTaskLogs = useCallback((taskId: string) => {
    setLogTarget({ type: 'task', taskId });
  }, []);

  const loadPhaseLogs = useCallback((phase: string) => {
    setLogTarget({ type: 'phase', phase });
  }, []);

  const closeLogs = useCallback(() => {
    setLogTarget(null);
  }, []);

  const logTitle = useMemo(() => {
    if (!logTarget) return '';
    return logTarget.type === 'task'
      ? `Task: ${logTarget.taskId}`
      : `Phase: ${logTarget.phase}`;
  }, [logTarget]);

  const logResult = useMemo(() => {
    if (!logTarget || !detail) return undefined;
    if (logTarget.type === 'task') {
      return detail.state.tasks.find((t) => t.id === logTarget.taskId)?.result;
    }
    return detail.state.steps.find((s) => s.id === logTarget.phase)?.result;
  }, [logTarget, detail]);

  if (loading && !detail) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-muted-foreground">Loading run details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-destructive">{error}</span>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-destructive">Run not found</span>
      </div>
    );
  }

  const isRunning = !detail.state.completedAt;
  const hasFailed = detail.state.tasks.some((t) => t.status === 'failed');
  const runStatus = detail.state.completedAt
    ? hasFailed ? 'failed' : 'completed'
    : detail.state.tasks.some((t) => t.status === 'in_progress') ? 'running' : 'pending';

  const statusStyle = RUN_HEADER_STATUS_STYLES;

  const mainContent = (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">{detail.state.ticketId}</h2>
          <Badge variant="outline" className={`text-xs ${statusStyle[runStatus] ?? ''}`}>
            {isRunning && (
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-4 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-chart-4" />
              </span>
            )}
            {isRunning ? 'Running' : capitalize(runStatus)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground w-1/2">{detail.state.description}</p>
          {detail.state.branch && (
            <div className="flex items-center gap-1.5 mt-4">
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-sm font-sans gap-1.5 py-1 px-3">
                <GitBranch className="h-3.5 w-3.5" />
                {detail.state.branch}
                {detail.state.baseBranch && (
                  <span className="text-muted-foreground/60"> from {detail.state.baseBranch}</span>
                )}
              </Badge>
            </div>
          )}
      </div>

      <StatCards detail={detail} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Pipeline Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <PhaseStepper phases={detail.phases} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Tasks by Phase</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <TaskAccordion
            phases={detail.phases}
            steps={detail.state.steps}
            tasks={detail.state.tasks}
            agents={detail.agents}
            onSelectTask={loadTaskLogs}
            onSelectPhase={loadPhaseLogs}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div className="h-full overflow-y-auto">{mainContent}</div>
      <Sheet open={logTarget !== null} onOpenChange={(isOpen) => !isOpen && closeLogs()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-full p-0 data-[side=right]:sm:max-w-4xl"
        >
          <LogPanel
            title={logTitle}
            logs={logs}
            loading={logsLoading}
            onClose={closeLogs}
            result={logResult}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
