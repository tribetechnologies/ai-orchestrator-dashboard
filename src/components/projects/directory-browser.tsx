import { useState, useEffect } from 'react';
import { Folder, ArrowUp, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { browseDirectory } from '@/lib/api';
import type { DirectoryListing, DirectoryBrowserProps } from '@/lib/types';

export function DirectoryBrowser({ open, onClose, onSelect }: DirectoryBrowserProps) {
  const [listing, setListing] = useState<DirectoryListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pathInput, setPathInput] = useState('');

  const browse = async (dirPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await browseDirectory(dirPath);
      setListing(result);
      setPathInput(result.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to browse directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) browse();
  }, [open]);

  const handleNavigate = (dirPath: string) => browse(dirPath);
  const handleGoUp = () => listing && browse(listing.parent);
  const handlePathSubmit = () => pathInput && browse(pathInput);

  const handleSelect = () => {
    if (listing) onSelect(listing.current);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select Runs Directory</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePathSubmit()}
            placeholder="/path/to/runs"
            className="flex-1 font-mono text-xs"
          />
          <Button variant="outline" size="icon" onClick={handleGoUp} disabled={!listing}>
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-72 rounded-md border">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-destructive">{error}</span>
            </div>
          ) : (
            <div className="p-1">
              {listing?.entries.map((entry) => (
                <button
                  key={entry.path}
                  onClick={() => handleNavigate(entry.path)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{entry.name}</span>
                </button>
              ))}
              {listing?.entries.length === 0 && (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No subdirectories
                </p>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!listing}>
            <Check className="h-4 w-4 mr-2" />
            Select This Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
