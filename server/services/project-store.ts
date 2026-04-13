import fs from 'node:fs';
import crypto from 'node:crypto';
import type { Project } from '../types.js';
import { CONFIG_DIR, FILE_ENCODING, JSON_INDENT, PROJECTS_FILE } from '../constants.js';

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function getProjects(): Project[] {
  ensureConfigDir();
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, FILE_ENCODING)) as Project[];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]): void {
  ensureConfigDir();
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, JSON_INDENT), FILE_ENCODING);
}

export function addProject(name: string, runsPath: string): Project {
  const projects = getProjects();
  const existing = projects.find((p) => p.runsPath === runsPath);
  if (existing) return existing;

  const project: Project = {
    id: crypto.randomUUID(),
    name,
    runsPath,
    addedAt: new Date().toISOString(),
  };
  projects.push(project);
  saveProjects(projects);
  return project;
}

export function removeProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveProjects(filtered);
  return true;
}
