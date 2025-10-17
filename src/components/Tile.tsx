import { memo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Individual Tile Component
 * 
 * CUSTOMIZATION:
 * - Adjust tile colors via Tailwind classes
 * - Modify shadow/glow effects in className
 * - Change border radius or size
 * - Add custom tile images or patterns
 */

interface TileProps {
  value: number;
  position: number;
  isEmpty: boolean;
  gridSize: number;
  onClick: () => void;
  isMoving: boolean;
}

const Tile = memo(({ value, position, isEmpty, gridSize, onClick, isMoving }: TileProps) => {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;

  // Calculate tile position based on grid
  const tileStyle = {
    transform: `translate(${col * 100}%, ${row * 100}%)`,
    transition: isMoving ? 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'none',
  };

  if (isEmpty) {
    return null; // Don't render empty tile
  }

  // Gradient colors for tiles - cycle through different hues
  const getTileColor = (val: number) => {
    const colors = [
      'from-primary to-primary/80',
      'from-secondary to-secondary/80',
      'from-accent to-accent/80',
      'from-[hsl(270,100%,65%)] to-[hsl(270,100%,50%)]',
      'from-[hsl(150,100%,60%)] to-[hsl(150,100%,45%)]',
    ];
    return colors[val % colors.length];
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute w-full h-full p-1 cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        'touch-manipulation select-none'
      )}
      style={tileStyle}
      aria-label={`Tile ${value}`}
    >
      <div
        className={cn(
          'w-full h-full rounded-2xl',
          'bg-gradient-to-br',
          getTileColor(value),
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'text-2xl md:text-4xl font-bold',
          'text-primary-foreground',
          'transform transition-all duration-200',
          'hover:scale-105 active:scale-95',
          'border-2 border-white/20',
          isMoving && 'animate-tile-move'
        )}
        style={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
      >
        {value}
      </div>
    </button>
  );
});

Tile.displayName = 'Tile';

export default Tile;
