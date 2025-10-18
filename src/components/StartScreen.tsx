import { Button } from '@/components/ui/button';
import { Play, BarChart3 } from 'lucide-react';

/**
 * Start Screen Component
 * Initial game screen with grid size selection
 * 
 * CUSTOMIZATION:
 * - Add more grid size options (2x2, 6x6, etc.)
 * - Include difficulty presets
 * - Add game mode variations
 */

interface StartScreenProps {
  onStart: (gridSize: number) => void;
  onShowStats: () => void;
  onButtonClick: () => void;
}

const StartScreen = ({ onStart, onShowStats, onButtonClick }: StartScreenProps) => {
  const handleStart = (size: number) => {
    onButtonClick();
    onStart(size);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-slide-in">
      {/* Title */}
      <div className="text-center mb-12">
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-75" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
        </div>
      </div>

      {/* Grid Size Selection */}
      <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
          Choose Grid Size
        </h2>
        
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => handleStart(3)}
            className="h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-2xl border-2 border-white/20"
          >
            <Play className="mr-3 h-6 w-6" />
            3 × 3 <span className="ml-2 text-sm opacity-80">(Easy)</span>
          </Button>
          
          <Button
            onClick={() => handleStart(4)}
            className="h-16 text-xl font-bold bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-2xl border-2 border-white/20"
          >
            <Play className="mr-3 h-6 w-6" />
            4 × 4 <span className="ml-2 text-sm opacity-80">(Medium)</span>
          </Button>
          
          <Button
            onClick={() => handleStart(5)}
            className="h-16 text-xl font-bold bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-2xl border-2 border-white/20"
          >
            <Play className="mr-3 h-6 w-6" />
            5 × 5 <span className="ml-2 text-sm opacity-80">(Hard)</span>
          </Button>
        </div>

        {/* Stats Button */}
        <Button
          variant="outline"
          onClick={() => {
            onButtonClick();
            onShowStats();
          }}
          className="w-full mt-4 border-2 border-secondary/30 hover:border-secondary hover:bg-secondary/10 text-lg py-6 rounded-2xl"
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          View Statistics
        </Button>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-primary/10">
          <p className="text-sm text-muted-foreground text-center">
            Arrange the tiles in numerical order by sliding them into the empty space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
