import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StartScreen from '@/components/StartScreen';
import GameBoard from '@/components/GameBoard';
import WinScreen from '@/components/WinScreen';
import StatsScreen from '@/components/StatsScreen';
import { useAudio } from '@/hooks/useAudio';
import { useGameStats } from '@/hooks/useGameStats';

/**
 * Main Game Container
 * Manages game states: start → playing → win
 * 
 * CUSTOMIZATION:
 * - Add more game modes or difficulty levels
 * - Include high score tracking with localStorage
 * - Add different puzzle themes or images
 */

type GameState = 'start' | 'playing' | 'won' | 'stats';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [gridSize, setGridSize] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [gameStats, setGameStats] = useState({ moves: 0, time: 0 });
  const { playButtonClick, playWinSound } = useAudio();
  const { records, saveRecord, getBestRecords, clearStats, totalGames } = useGameStats();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Handle game start
  const handleStart = (size: number) => {
    setGridSize(size);
    setGameState('playing');
  };

  // Handle win condition
  const handleWin = (moves: number, time: number) => {
    setGameStats({ moves, time });
    saveRecord(gridSize, moves, time);
    if (soundEnabled) {
      playWinSound();
    }
    setGameState('won');
  };

  // Handle restart with same grid size
  const handleRestart = () => {
    setGameState('playing');
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameState('start');
  };

  // Toggle sound
  const handleToggleSound = () => {
    if (soundEnabled) {
      playButtonClick();
    }
    setSoundEnabled(!soundEnabled);
  };

  // Toggle theme
  const handleToggleTheme = () => {
    if (soundEnabled) {
      playButtonClick();
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Show stats
  const handleShowStats = () => {
    setGameState('stats');
  };

  // Close stats
  const handleCloseStats = () => {
    setGameState('start');
  };

  // SEO: Update page title dynamically
  useEffect(() => {
    document.title = 'Slide Puzzle - Retro Arcade Game';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header 
        soundEnabled={soundEnabled} 
        onToggleSound={handleToggleSound}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      
      <main className="container mx-auto px-4 pb-12">
        {gameState === 'start' && (
          <StartScreen
            onStart={handleStart}
            onShowStats={handleShowStats}
            onButtonClick={() => soundEnabled && playButtonClick()}
          />
        )}

        {gameState === 'playing' && (
          <GameBoard
            gridSize={gridSize}
            onWin={handleWin}
            soundEnabled={soundEnabled}
            onBackToMenu={handleBackToMenu}
          />
        )}

        {gameState === 'won' && (
          <WinScreen
            moves={gameStats.moves}
            time={gameStats.time}
            gridSize={gridSize}
            onRestart={handleRestart}
            onBackToMenu={handleBackToMenu}
            onButtonClick={() => soundEnabled && playButtonClick()}
          />
        )}

        {gameState === 'stats' && (
          <StatsScreen
            records={records}
            bestRecords={getBestRecords()}
            totalGames={totalGames}
            onClose={handleCloseStats}
            onClear={clearStats}
            onButtonClick={() => soundEnabled && playButtonClick()}
          />
        )}
      </main>

      {/* Accessibility: Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {gameState === 'won' && `Puzzle solved in ${gameStats.moves} moves and ${gameStats.time} seconds`}
      </div>
    </div>
  );
};

export default Index;
