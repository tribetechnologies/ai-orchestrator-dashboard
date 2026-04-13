import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/use-theme';
import { Theme } from '@/lib/constants';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger />
      <div className="w-px self-stretch my-2 bg-border" />
      <span className="text-sm font-medium flex-1">Dashboard</span>
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {theme === Theme.Dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  );
}
