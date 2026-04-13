import { Router } from 'express';
import { getProjects } from '../services/project-store.js';
import { getRunDetail, getTaskLogs, getPhaseLogs } from '../services/run-reader.js';

const router = Router();

function resolveRunsPath(projectId: string): string | null {
  const project = getProjects().find((p) => p.id === projectId);
  return project?.runsPath ?? null;
}

router.get('/:projectId/:ticketId', (req, res) => {
  const runsPath = resolveRunsPath(req.params.projectId);
  if (!runsPath) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  const detail = getRunDetail(runsPath, req.params.ticketId);
  if (!detail) {
    res.status(404).json({ error: 'Run not found' });
    return;
  }
  res.json(detail);
});

router.get('/:projectId/:ticketId/tasks/:taskId/logs', (req, res) => {
  const runsPath = resolveRunsPath(req.params.projectId);
  if (!runsPath) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(getTaskLogs(runsPath, req.params.ticketId, req.params.taskId));
});

router.get('/:projectId/:ticketId/phases/:phase/logs', (req, res) => {
  const runsPath = resolveRunsPath(req.params.projectId);
  if (!runsPath) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(getPhaseLogs(runsPath, req.params.ticketId, req.params.phase));
});

export default router;
