import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Header Component
 * Game title, theme toggle, and sound toggle
 * 
 * CUSTOMIZATION:
 * - Modify title text or styling
 * - Add additional controls or info
 * - Change icon styles
 */

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header = ({ soundEnabled, onToggleSound, theme, onToggleTheme }: HeaderProps) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Slide Puzzle
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Classic arcade puzzle game
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          className="rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-primary" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleSound}
          className="rounded-full border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
          aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-primary" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
