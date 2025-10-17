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
    if (typeof window === 'undefined') return 400;
    const maxSize = Math.min(window.innerWidth - 64, window.innerHeight - 300, 500);
    return Math.max(250, maxSize);
  };

  const gridPixelSize = getGridSize();
  const gap = 8; // Gap between tiles in pixels

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
          'relative bg-card border-4 border-primary/30 rounded-3xl p-2',
          'shadow-2xl',
          'mx-auto overflow-hidden'
        )}
        style={{
          width: `${gridPixelSize}px`,
          height: `${gridPixelSize}px`,
          boxShadow: 'var(--shadow-glow)',
        }}
        role="grid"
        aria-label={`${gridSize} by ${gridSize} sliding puzzle`}
      >
        <div 
          className="relative w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {tiles.map((tile) => (
            <Tile
              key={tile.value}
              value={tile.value}
              position={tile.position}
              isEmpty={tile.isEmpty}
              gridSize={gridSize}
              gap={gap}
              onClick={() => handleTileClick(tile.position)}
              isMoving={movingTile === tile.position}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Tap or click tiles next to the empty space to move them. Arrange numbers in order from 1 to {gridSize * gridSize - 1}.
      </p>
    </div>
  );
};

export default GameBoard;
