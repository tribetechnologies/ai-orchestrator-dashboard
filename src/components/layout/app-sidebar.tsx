import { useState, useCallback } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Bot,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { usePolling } from '@/hooks/use-polling';
import { fetchProjects, fetchRuns, addProject, removeProject } from '@/lib/api';
import { formatRelativeTime, formatCost, capitalize } from '@/lib/format';
import { AddProjectDialog } from '@/components/projects/add-project-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RUN_STATUS_BADGE_STYLES, RUN_STATUS_COLORS } from '@/lib/constants';
import type { Project, RunSummary, ProjectRunsProps, AppSidebarProps } from '@/lib/types';

// ─── Status Icons ───────────────────────────────────────────────────────────

const RUN_STATUS_ICONS: Record<RunSummary['status'], React.ElementType> = {
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  pending: Clock,
};

// ─── Project Runs Section ───────────────────────────────────────────────────

function ProjectRuns({ project, selectedRun, onSelectRun, onRemove }: ProjectRunsProps) {
  const fetcher = useCallback(() => fetchRuns(project.id), [project.id]);
  const { data: runs } = usePolling(fetcher);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between px-0 text-sm font-semibold mb-2">
        <span className="truncate">{project.name}</span>
        <button
          onClick={() => onRemove(project.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {runs?.map((run) => {
            const StatusIcon = RUN_STATUS_ICONS[run.status];
            const statusColor = RUN_STATUS_COLORS[run.status];
            return (
              <SidebarMenuItem key={run.ticketId}>
                <SidebarMenuButton
                  isActive={selectedRun === run.ticketId}
                  onClick={() => onSelectRun(project.id, run.ticketId)}
                  className="flex items-start gap-2 py-2 h-auto hover:bg-muted data-active:bg-muted-foreground/5 data-active:text-sidebar-foreground data-active:border data-active:border-border"
                >
                  <StatusIcon className={`h-4 w-4 mt-0.5 shrink-0 ${statusColor} ${run.status === 'running' ? 'animate-spin' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{run.ticketId}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {run.description}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-[10px] h-4 ${RUN_STATUS_BADGE_STYLES[run.status]}`}>
                        {capitalize(run.status)}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(run.startedAt)}
                      </span>
                      <span className="text-[10px] text-foreground font-medium ml-auto">
                        {formatCost(run.totalCostUsd)}
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {(!runs || runs.length === 0) && (
            <p className="px-3 py-2 text-xs text-muted-foreground">No runs found</p>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ─── Main Sidebar ───────────────────────────────────────────────────────────

export function AppSidebar({ selectedProjectId, selectedRunId, onSelectRun }: AppSidebarProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { data: projects, refresh } = usePolling(fetchProjects);

  const handleAddProject = async (name: string, runsPath: string) => {
    await addProject(name, runsPath);
    refresh();
  };

  const requestRemoveProject = (id: string) => {
    const project = projects?.find((p) => p.id === id);
    if (project) setProjectToDelete(project);
  };

  const confirmRemoveProject = async () => {
    if (!projectToDelete) return;
    await removeProject(projectToDelete.id);
    setProjectToDelete(null);
    refresh();
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border px-4 h-14 flex flex-row items-center justify-center">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold text-sm">AI Orchestrator</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel className="px-0 text-lg font-semibold">Projects</SidebarGroupLabel>
              <button
                onClick={() => setAddDialogOpen(true)}
                title="Add project"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 border-t border-sidebar-border" />
          </SidebarGroup>

          {projects?.map((project) => (
            <ProjectRuns
              key={project.id}
              project={project}
              selectedRun={selectedProjectId === project.id ? selectedRunId : null}
              onSelectRun={onSelectRun}
              onRemove={requestRemoveProject}
            />
          ))}

          {(!projects || projects.length === 0) && (
            <div className="px-4 py-8 text-center">
              <p className="text-base text-muted-foreground mb-3">No projects added yet</p>
              <button
                onClick={() => setAddDialogOpen(true)}
                className="text-base font-medium text-primary hover:underline"
              >
                + Add your first project
              </button>
            </div>
          )}
        </SidebarContent>
      </Sidebar>

      <AddProjectDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddProject}
      />

      <Dialog
        open={projectToDelete !== null}
        onOpenChange={(isOpen) => !isOpen && setProjectToDelete(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              This will remove <span className="font-medium text-foreground">{projectToDelete?.name}</span> from the dashboard. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
