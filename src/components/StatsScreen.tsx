import { Trophy, Clock, MousePointerClick, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameRecord } from '@/hooks/useGameStats';

/**
 * Stats Screen Component
 * Displays game performance history and best records
 * 
 * CUSTOMIZATION:
 * - Add charts or graphs for performance trends
 * - Add filtering by date or grid size
 * - Add more statistics (average time, win rate, etc.)
 */

interface StatsScreenProps {
  records: GameRecord[];
  bestRecords: { [key: number]: GameRecord };
  totalGames: number;
  onClose: () => void;
  onClear: () => void;
  onButtonClick: () => void;
}

const StatsScreen = ({ 
  records, 
  bestRecords, 
  totalGames, 
  onClose, 
  onClear,
  onButtonClick 
}: StatsScreenProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-slide-in">
      <div className="w-full max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onButtonClick();
              onClose();
            }}
            className="absolute right-0 top-0 rounded-full hover:bg-primary/10"
            aria-label="Close stats"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Trophy className="h-16 w-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Game Statistics
          </h2>
          <p className="text-muted-foreground">
            Total games played: {totalGames}
          </p>
        </div>

        {totalGames === 0 ? (
          <Card className="p-8 text-center bg-card/50 backdrop-blur border-primary/20">
            <p className="text-muted-foreground mb-4">No games played yet!</p>
            <Button onClick={() => {
              onButtonClick();
              onClose();
            }} className="bg-primary hover:bg-primary/90">
              Start Playing
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Best Records */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/30 shadow-glow">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Best Records
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[3, 4, 5].map(size => {
                  const best = bestRecords[size];
                  return (
                    <div key={size} className="p-4 rounded-lg bg-background/50 border border-primary/20">
                      <div className="text-2xl font-bold text-primary mb-2">{size}×{size}</div>
                      {best ? (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <MousePointerClick className="h-4 w-4" />
                            <span>{best.moves} moves</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(best.time)}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">No games yet</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Games */}
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Games</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onButtonClick();
                    if (confirm('Are you sure you want to clear all statistics?')) {
                      onClear();
                    }
                  }}
                  className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Stats
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {records.slice(0, 20).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/30 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-primary w-12">
                        {record.gridSize}×{record.gridSize}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MousePointerClick className="h-4 w-4" />
                          <span>{record.moves}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(record.time)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(record.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsScreen;
