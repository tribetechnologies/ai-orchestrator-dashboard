import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { RunDetail } from '@/components/dashboard/run-detail';
import { Bot } from 'lucide-react';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
      <Bot className="h-16 w-16 opacity-20" />
      <div className="text-center">
        <p className="text-lg font-medium">No run selected</p>
        <p className="text-sm">Add a project and select a run from the sidebar</p>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const handleSelectRun = (projectId: string, ticketId: string) => {
    setSelectedProjectId(projectId);
    setSelectedRunId(ticketId);
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar
            selectedProjectId={selectedProjectId}
            selectedRunId={selectedRunId}
            onSelectRun={handleSelectRun}
          />
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            <Header />
            <main className="flex-1 min-h-0 overflow-y-auto">
              {selectedProjectId && selectedRunId ? (
                <RunDetail
                  projectId={selectedProjectId}
                  ticketId={selectedRunId}
                />
              ) : (
                <EmptyState />
              )}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
