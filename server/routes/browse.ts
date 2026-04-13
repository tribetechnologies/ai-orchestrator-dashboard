import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { DirectoryEntry } from '../types.js';

const router = Router();

router.get('/', (req, res) => {
  const dirPath = (req.query.path as string) || os.homedir();
  const resolved = path.resolve(dirPath);

  if (!fs.existsSync(resolved)) {
    res.status(404).json({ error: 'Directory not found' });
    return;
  }

  try {
    const entries = fs.readdirSync(resolved, { withFileTypes: true });
    const directories: DirectoryEntry[] = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => ({
        name: e.name,
        path: path.join(resolved, e.name),
        isDirectory: true,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      current: resolved,
      parent: path.dirname(resolved),
      entries: directories,
    });
  } catch (err) {
    res.status(403).json({ error: 'Cannot read directory' });
  }
});

export default router;
