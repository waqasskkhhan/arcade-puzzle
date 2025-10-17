import { useState, useCallback, useEffect } from 'react';

export type Tile = {
  value: number;
  position: number;
  isEmpty: boolean;
};

/**
 * Custom hook for puzzle game logic
 * 
 * CUSTOMIZATION:
 * - Change MIN_SHUFFLES for easier/harder initial scramble
 * - Modify grid size (3, 4, or 5) via gridSize parameter
 * - Add difficulty levels by adjusting shuffle complexity
 */

const MIN_SHUFFLES = 100; // Minimum number of random moves to scramble puzzle

export const usePuzzle = (gridSize: number = 3) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize puzzle with solved state
  const initializePuzzle = useCallback(() => {
    const totalTiles = gridSize * gridSize;
    const newTiles: Tile[] = [];
    
    for (let i = 0; i < totalTiles; i++) {
      newTiles.push({
        value: i + 1,
        position: i,
        isEmpty: i === totalTiles - 1, // Last tile is empty
      });
    }
    
    return newTiles;
  }, [gridSize]);

  // Get valid moves for a given position
  const getValidMoves = useCallback((position: number, size: number): number[] => {
    const row = Math.floor(position / size);
    const col = position % size;
    const validMoves: number[] = [];

    // Up
    if (row > 0) validMoves.push(position - size);
    // Down
    if (row < size - 1) validMoves.push(position + size);
    // Left
    if (col > 0) validMoves.push(position - 1);
    // Right
    if (col < size - 1) validMoves.push(position + 1);

    return validMoves;
  }, []);

  // Shuffle puzzle by making random valid moves
  const shufflePuzzle = useCallback((initialTiles: Tile[]) => {
    let shuffled = [...initialTiles];
    let emptyPosition = shuffled.findIndex(tile => tile.isEmpty);

    for (let i = 0; i < MIN_SHUFFLES; i++) {
      const validMoves = getValidMoves(emptyPosition, gridSize);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      // Swap empty tile with random valid neighbor
      [shuffled[emptyPosition], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyPosition]];
      
      // Update positions
      shuffled[emptyPosition].position = emptyPosition;
      shuffled[randomMove].position = randomMove;
      
      emptyPosition = randomMove;
    }

    return shuffled;
  }, [gridSize, getValidMoves]);

  // Start new game
  const startGame = useCallback(() => {
    const initialTiles = initializePuzzle();
    const shuffled = shufflePuzzle(initialTiles);
    setTiles(shuffled);
    setMoves(0);
    setIsWon(false);
    setTimer(0);
    setIsPlaying(true);
  }, [initializePuzzle, shufflePuzzle]);

  // Check if puzzle is solved
  const checkWin = useCallback((currentTiles: Tile[]) => {
    return currentTiles.every((tile, index) => {
      if (tile.isEmpty) return true; // Empty tile can be anywhere
      return tile.value === index + 1;
    });
  }, []);

  // Move a tile
  const moveTile = useCallback((clickedPosition: number) => {
    if (isWon) return false;

    setTiles(currentTiles => {
      const emptyIndex = currentTiles.findIndex(tile => tile.isEmpty);
      const emptyPosition = currentTiles[emptyIndex].position;
      const validMoves = getValidMoves(emptyPosition, gridSize);

      // Check if clicked tile is adjacent to empty space
      if (!validMoves.includes(clickedPosition)) {
        return currentTiles;
      }

      // Swap tiles
      const newTiles = [...currentTiles];
      const clickedIndex = currentTiles.findIndex(tile => tile.position === clickedPosition);
      
      [newTiles[emptyIndex], newTiles[clickedIndex]] = [newTiles[clickedIndex], newTiles[emptyIndex]];
      
      // Update positions
      newTiles[emptyIndex].position = emptyPosition;
      newTiles[clickedIndex].position = clickedPosition;

      setMoves(m => m + 1);

      // Check for win
      if (checkWin(newTiles)) {
        setIsWon(true);
        setIsPlaying(false);
      }

      return newTiles;
    });

    return true;
  }, [gridSize, getValidMoves, checkWin, isWon]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isWon) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isWon]);

  return {
    tiles,
    moves,
    timer,
    isWon,
    isPlaying,
    startGame,
    moveTile,
  };
};
