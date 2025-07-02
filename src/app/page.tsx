'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Trophy, Users, Sparkles, Zap, Crown } from 'lucide-react';

type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

const CELEBRATION_EMOJIS = ['🎉', '🎊', '✨', '🏆', '🎈', '🌟', '💫', '🎯'];

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });
  const [celebrationEmojis, setCelebrationEmojis] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastMove, setLastMove] = useState<number | null>(null);

  const checkWinner = (board: Player[]): { winner: Player; line: number[] } => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: [] };
  };

  const triggerCelebration = () => {
    const randomEmojis = Array.from({ length: 8 }, () => 
      CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)]
    );
    setCelebrationEmojis(randomEmojis);
    setTimeout(() => setCelebrationEmojis([]), 3000);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || isAnimating) return;

    setIsAnimating(true);
    setLastMove(index);
    
    setTimeout(() => {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const { winner: gameWinner, line } = checkWinner(newBoard);
      
      if (gameWinner) {
        setWinner(gameWinner);
        setWinningLine(line);
        setGameState('won');
        setStats(prev => ({
          ...prev,
          [gameWinner === 'X' ? 'xWins' : 'oWins']: prev[gameWinner === 'X' ? 'xWins' : 'oWins'] + 1
        }));
        triggerCelebration();
      } else if (newBoard.every(cell => cell !== null)) {
        setGameState('draw');
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
      
      setIsAnimating(false);
    }, 200);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
    setWinningLine([]);
    setLastMove(null);
    setCelebrationEmojis([]);
  };

  const resetStats = () => {
    setStats({ xWins: 0, oWins: 0, draws: 0 });
  };

  const getGameStatus = () => {
    if (gameState === 'won') return `Player ${winner} Wins!`;
    if (gameState === 'draw') return "It's a Draw!";
    return `Player ${currentPlayer}'s Turn`;
  };

  const getCellContent = (index: number) => {
    const value = board[index];
    if (!value) return '';
    
    const isWinningCell = winningLine.includes(index);
    const isLastMoveCell = lastMove === index;
    
    return (
      <span 
        className={`
          text-3xl sm:text-4xl lg:text-5xl font-bold transition-all duration-500 
          ${value === 'X' 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-red-600 dark:text-red-400'
          }
          ${isWinningCell ? 'animate-pulse scale-110' : ''}
          ${isLastMoveCell ? 'animate-bounce' : ''}
        `}
      >
        {value}
      </span>
    );
  };

  const getPlayerIcon = (player: Player) => {
    if (player === 'X') return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />;
    if (player === 'O') return <Crown className="w-4 h-4 sm:w-5 sm:h-5" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 p-2 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Celebration Emojis */}
      {celebrationEmojis.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {celebrationEmojis.map((emoji, index) => (
            <div
              key={index}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${index * 200}ms`,
                animationDuration: '2s'
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-4xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Tic-Tac-Toe
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Challenge your opponent in this classic strategy game with modern flair
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Game Board */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="text-center pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-4">
                  <div className={`
                    transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3
                    ${gameState === 'won' 
                      ? winner === 'X' 
                        ? 'text-blue-600 dark:text-blue-400 animate-pulse' 
                        : 'text-red-600 dark:text-red-400 animate-pulse'
                      : gameState === 'draw'
                      ? 'text-amber-600 dark:text-amber-400'
                      : currentPlayer === 'X'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-red-600 dark:text-red-400'
                    }
                  `}>
                    {gameState === 'won' && <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />}
                    {getGameStatus()}
                    {gameState === 'won' && <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />}
                  </div>
                </CardTitle>
                
                {gameState === 'playing' && (
                  <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Current Player: 
                    </span>
                    <div className={`
                      flex items-center gap-1 sm:gap-2 font-semibold px-2 sm:px-3 py-1 rounded-full
                      ${currentPlayer === 'X' 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' 
                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                      }
                      animate-pulse
                    `}>
                      {getPlayerIcon(currentPlayer)}
                      {currentPlayer}
                    </div>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="px-4 sm:px-6 lg:px-8">
                {/* Game Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto mb-6 sm:mb-8">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={gameState !== 'playing' || cell !== null || isAnimating}
                      className={`
                        aspect-square rounded-xl sm:rounded-2xl border-2 transition-all duration-300
                        flex items-center justify-center relative overflow-hidden
                        ${winningLine.includes(index) 
                          ? 'bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-800 dark:to-emerald-700 border-emerald-400 shadow-lg shadow-emerald-200 dark:shadow-emerald-800 animate-pulse' 
                          : cell 
                          ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 border-slate-300 dark:border-slate-500 shadow-md' 
                          : 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-800/50'
                        }
                        ${gameState === 'playing' && !cell ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
                        ${lastMove === index ? 'ring-4 ring-purple-400/50 animate-pulse' : ''}
                        disabled:opacity-50
                        min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]
                      `}
                    >
                      {/* Hover effect overlay */}
                      {!cell && gameState === 'playing' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl"></div>
                      )}
                      
                      {getCellContent(index)}
                      
                      {/* Ripple effect */}
                      {lastMove === index && (
                        <div className="absolute inset-0 bg-purple-400/20 rounded-xl sm:rounded-2xl animate-ping"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Game Controls */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    size="lg"
                    className="bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    New Game
                  </Button>
                  
                  {(stats.xWins > 0 || stats.oWins > 0 || stats.draws > 0) && (
                    <Button 
                      onClick={resetStats}
                      variant="outline"
                      size="lg"
                      className="bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 border-2 hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Reset Stats
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            {/* Score Card */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 animate-pulse" />
                  Score Board
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">Player X</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:scale-110 transition-transform duration-300">
                    {stats.xWins}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400 font-semibold text-sm sm:text-base">Player O</span>
                  </div>
                  <Badge variant="secondary" className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 hover:scale-110 transition-transform duration-300">
                    {stats.oWins}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-300">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm sm:text-base">Draws</span>
                  <Badge variant="secondary" className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 hover:scale-110 transition-transform duration-300">
                    {stats.draws}
                  </Badge>
                </div>
                
                <Separator className="my-3 sm:my-4" />
                
                <div className="flex justify-between items-center font-semibold p-2 sm:p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <span className="text-sm sm:text-base">Total Games</span>
                  <Badge variant="outline" className="hover:scale-110 transition-transform duration-300">
                    {stats.xWins + stats.oWins + stats.draws}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Game Rules */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <p>Players take turns placing X and O</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <p>First to get 3 in a row wins</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  <p>Rows, columns, or diagonals count</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <p>If all squares are filled, it&#39;s a draw</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}