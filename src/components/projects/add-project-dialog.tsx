import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderOpen } from 'lucide-react';
import { DirectoryBrowser } from './directory-browser';
import type { AddProjectDialogProps } from '@/lib/types';

export function AddProjectDialog({ open, onClose, onAdd }: AddProjectDialogProps) {
  const [name, setName] = useState('');
  const [runsPath, setRunsPath] = useState('');
  const [browserOpen, setBrowserOpen] = useState(false);

  const handleBrowseSelect = (path: string) => {
    setRunsPath(path);
    setBrowserOpen(false);
    if (!name) {
      const folderName = path.split('/').filter(Boolean).pop() ?? '';
      setName(folderName);
    }
  };

  const handleAdd = () => {
    if (name && runsPath) {
      onAdd(name, runsPath);
      setName('');
      setRunsPath('');
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open && !browserOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Project"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Runs Directory</label>
              <div className="flex gap-2">
                <Input
                  value={runsPath}
                  onChange={(e) => setRunsPath(e.target.value)}
                  placeholder="/path/to/project/agent-loop/runs"
                  className="flex-1 font-mono text-xs"
                />
                <Button variant="outline" size="icon" onClick={() => setBrowserOpen(true)}>
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!name || !runsPath}>
              Add Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DirectoryBrowser
        open={browserOpen}
        onClose={() => setBrowserOpen(false)}
        onSelect={handleBrowseSelect}
      />
    </>
  );
}
