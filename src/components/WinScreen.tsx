import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Win Screen Component
 * Victory celebration display
 * 
 * CUSTOMIZATION:
 * - Add confetti animations
 * - Include statistics (best time, fewest moves)
 * - Add social sharing options
 * - Modify celebration messages
 */

interface WinScreenProps {
  moves: number;
  time: number;
  gridSize: number;
  onRestart: () => void;
  onBackToMenu: () => void;
  onButtonClick: () => void;
}

const WinScreen = ({ moves, time, gridSize, onRestart, onBackToMenu, onButtonClick }: WinScreenProps) => {
  useEffect(() => {
    // Create confetti effect
    const confettiColors = ['#00FFFF', '#FF00FF', '#FF8800', '#00FF00', '#FFFF00'];
    const confettiElements: HTMLDivElement[] = [];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'fixed w-3 h-3 rounded-full animate-confetti pointer-events-none';
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
      document.body.appendChild(confetti);
      confettiElements.push(confetti);
    }

    return () => {
      confettiElements.forEach(el => el.remove());
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    onButtonClick();
    onRestart();
  };

  const handleBackToMenu = () => {
    onButtonClick();
    onBackToMenu();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-slide-in">
      {/* Trophy Icon */}
      <div className="mb-8 animate-victory-bounce">
        <div className="relative">
          <Trophy className="h-32 w-32 text-accent drop-shadow-[0_0_30px_rgba(255,136,0,0.5)]" />
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-glow-pulse" />
        </div>
      </div>

      {/* Victory Message */}
      <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent text-center">
        Puzzle Solved!
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-center">
        🎉 Congratulations! You did it! 🎉
      </p>

      {/* Stats Card */}
      <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full mb-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          Your Score
        </h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{gridSize}×{gridSize}</div>
            <div className="text-sm text-muted-foreground">Grid Size</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">{moves}</div>
            <div className="text-sm text-muted-foreground">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">{formatTime(time)}</div>
            <div className="text-sm text-muted-foreground">Time</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleRestart}
            className="h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-2xl border-2 border-white/20"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again ({gridSize}×{gridSize})
          </Button>
          
          <Button
            onClick={handleBackToMenu}
            variant="outline"
            className="h-14 text-lg font-bold border-2 border-primary/30 hover:border-primary hover:bg-primary/10 rounded-2xl transition-all hover:scale-105"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>
      </div>

      {/* Encouragement Message */}
      <p className="text-sm text-muted-foreground text-center max-w-md" role="status" aria-live="polite">
        {moves < gridSize * gridSize * 2 
          ? "Incredible! You're a puzzle master! 🌟" 
          : moves < gridSize * gridSize * 4
          ? "Great job! That was impressive! 👏"
          : "Well done! Practice makes perfect! 💪"}
      </p>
    </div>
  );
};

export default WinScreen;
