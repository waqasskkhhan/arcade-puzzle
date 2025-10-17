import React, { useState, useCallback } from 'react';
import Tile from './Tile';
import { usePuzzle } from '@/hooks/usePuzzle';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';

/**
 * Game Board Component
 * Main puzzle grid and game logic container
 * 
 * CUSTOMIZATION:
 * - Adjust grid gap via gap-X classes
 * - Modify tile size calculations for different dimensions
 * - Change grid background/border styling
 */

interface GameBoardProps {
  gridSize: number;
  onWin: (moves: number, time: number) => void;
  soundEnabled: boolean;
}

const GameBoard = ({ gridSize, onWin, soundEnabled }: GameBoardProps) => {
  const { tiles, moves, timer, isWon, moveTile, startGame } = usePuzzle(gridSize);
  const { playTileMove } = useAudio();
  const [movingTile, setMovingTile] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState(false);

  // Initialize game on mount or gridSize change
  React.useEffect(() => {
    setHasWon(false);
    startGame();
  }, [gridSize, startGame]);

  // Watch for win condition
  React.useEffect(() => {
    if (isWon && !hasWon) {
      setHasWon(true);
      setTimeout(() => onWin(moves, timer), 100);
    }
  }, [isWon, hasWon, moves, timer, onWin]);

  const handleTileClick = useCallback((position: number) => {
    const success = moveTile(position);
    
    if (success) {
      if (soundEnabled) {
        playTileMove();
      }
      setMovingTile(position);
      setTimeout(() => setMovingTile(null), 300);
    }
  }, [moveTile, playTileMove, soundEnabled]);

  // Calculate grid size for responsive layout
  const getGridSize = () => {
    const maxSize = Math.min(window.innerWidth - 32, window.innerHeight - 300, 600);
    return maxSize;
  };

  const gridPixelSize = getGridSize();
  const tileSize = gridPixelSize / gridSize;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Stats Display */}
      <div className="flex gap-6 md:gap-12 text-center">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground uppercase tracking-wider">Moves</span>
          <span className="text-3xl md:text-4xl font-bold text-primary animate-glow-pulse">
            {moves}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground uppercase tracking-wider">Time</span>
          <span className="text-3xl md:text-4xl font-bold text-secondary animate-glow-pulse">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Puzzle Grid */}
      <div
        className={cn(
          'relative bg-card border-4 border-primary/30 rounded-3xl',
          'shadow-2xl',
          'mx-auto'
        )}
        style={{
          width: `${gridPixelSize}px`,
          height: `${gridPixelSize}px`,
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.1)',
        }}
        role="grid"
        aria-label={`${gridSize} by ${gridSize} sliding puzzle`}
      >
        {tiles.map((tile) => (
          <Tile
            key={tile.value}
            value={tile.value}
            position={tile.position}
            isEmpty={tile.isEmpty}
            gridSize={gridSize}
            onClick={() => handleTileClick(tile.position)}
            isMoving={movingTile === tile.position}
          />
        ))}
      </div>

      {/* Instructions */}
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Tap or click tiles next to the empty space to move them. Arrange numbers in order from 1 to {gridSize * gridSize - 1}.
      </p>
    </div>
  );
};

export default GameBoard;
