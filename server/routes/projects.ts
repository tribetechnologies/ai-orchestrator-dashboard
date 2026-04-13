import { Router } from 'express';
import { getProjects, addProject, removeProject } from '../services/project-store.js';
import { listRuns } from '../services/run-reader.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getProjects());
});

router.post('/', (req, res) => {
  const { name, runsPath } = req.body;
  if (!name || !runsPath) {
    res.status(400).json({ error: 'name and runsPath are required' });
    return;
  }
  const project = addProject(name, runsPath);
  res.status(201).json(project);
});

router.delete('/:id', (req, res) => {
  const removed = removeProject(req.params.id);
  if (!removed) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ success: true });
});

router.get('/:id/runs', (req, res) => {
  const projects = getProjects();
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(listRuns(project.runsPath));
});

export default router;
