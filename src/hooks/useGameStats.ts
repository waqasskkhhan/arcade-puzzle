import { useState, useEffect } from 'react';

/**
 * Game Statistics Hook
 * Manages game performance tracking using localStorage
 * 
 * CUSTOMIZATION:
 * - Add more stats fields (best time, average moves, etc.)
 * - Change storage key or add data expiration
 * - Add filtering/sorting capabilities
 */

export interface GameRecord {
  id: string;
  gridSize: number;
  moves: number;
  time: number;
  timestamp: number;
}

const STORAGE_KEY = 'slide-puzzle-stats';

export const useGameStats = () => {
  const [records, setRecords] = useState<GameRecord[]>([]);

  // Load stats from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  // Save a new game record
  const saveRecord = (gridSize: number, moves: number, time: number) => {
    const newRecord: GameRecord = {
      id: `${Date.now()}-${Math.random()}`,
      gridSize,
      moves,
      time,
      timestamp: Date.now(),
    };

    const updatedRecords = [newRecord, ...records].slice(0, 50); // Keep last 50 games
    setRecords(updatedRecords);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Failed to save game stats:', error);
    }
  };

  // Get best records for each grid size
  const getBestRecords = () => {
    const bestBySize: { [key: number]: GameRecord } = {};
    
    records.forEach(record => {
      const current = bestBySize[record.gridSize];
      if (!current || record.moves < current.moves) {
        bestBySize[record.gridSize] = record;
      }
    });

    return bestBySize;
  };

  // Clear all stats
  const clearStats = () => {
    setRecords([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear game stats:', error);
    }
  };

  return {
    records,
    saveRecord,
    getBestRecords,
    clearStats,
    totalGames: records.length,
  };
};
