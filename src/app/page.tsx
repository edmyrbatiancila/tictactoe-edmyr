'use client';

import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Trophy, Users, Sparkles, Zap, Crown } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';

type Player = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
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

  const boardRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  // Enhanced board entrance animation
  useEffect(() => {
    if (boardRef.current) {
      anime({
        targets: boardRef.current.children,
        scale: [0, 1],
        rotate: [180, 0],
        duration: 800,
        delay: anime.stagger(80, {start: 200}),
        easing: 'easeOutElastic(1, .8)',
      });
    }
  }, []);

  // Enhanced background animation
  useEffect(() => {
    if (backgroundRef.current) {
      anime({
        targets: backgroundRef.current.children,
        translateY: [-20, 20],
        opacity: [0.3, 0.7, 0.3],
        duration: 4000,
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(1000),
        easing: 'easeInOutSine'
      });
    }
  }, []);

  const checkWinner = (board: Player[]) => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: [] };
  };

  const animateCellClick = (cellIndex: number) => {
    const cell = boardRef.current?.children[cellIndex] as HTMLElement;
    if (!cell) return;

    // Enhanced click animation
    anime({
      targets: cell,
      scale: [1, 1.1, 1],
      backgroundColor: [
        'rgba(99, 102, 241, 0.1)',
        'rgba(99, 102, 241, 0.3)',
        'rgba(255, 255, 255, 0)'
      ],
      duration: 600,
      easing: 'easeOutElastic(1, .8)',
    });

    // Enhanced symbol entrance
    const symbolElement = cell.querySelector('.cell-symbol');
    if (symbolElement) {
      anime({
        targets: symbolElement,
        scale: [0, 1.2, 1],
        rotate: [90, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutBounce',
      });
    }
  };

  const animateWinningLine = (line: number[]) => {
    const cells = line.map(index => boardRef.current?.children[index]).filter(Boolean);
    
    anime({
      targets: cells,
      scale: [1, 1.15, 1.05],
      backgroundColor: [
        'rgba(34, 197, 94, 0.2)',
        'rgba(34, 197, 94, 0.4)',
        'rgba(34, 197, 94, 0.3)'
      ],
      duration: 1200,
      delay: anime.stagger(100),
      direction: 'alternate',
      loop: 3,
      easing: 'easeInOutQuart',
    });
  };

  const triggerCelebration = () => {
    // Enhanced celebration animation
    const newEmojis = Array.from({ length: 12 }, () => 
      CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)]
    );
    setCelebrationEmojis(newEmojis);

    // Board celebration shake
    if (boardRef.current) {
      anime({
        targets: boardRef.current,
        translateX: [-5, 5, -3, 3, 0],
        translateY: [-2, 2, -1, 1, 0],
        duration: 600,
        easing: 'easeInOutQuart'
      });
    }

    // Clear emojis after animation
    setTimeout(() => setCelebrationEmojis([]), 3000);
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || isAnimating) return;

    setIsAnimating(true);
    setLastMove(index);
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    animateCellClick(index);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setGameState('won');
      setWinningLine(line);
      setStats(prev => ({
        ...prev,
        [gameWinner === 'X' ? 'xWins' : 'oWins']: prev[gameWinner === 'X' ? 'xWins' : 'oWins'] + 1
      }));
      
      setTimeout(() => {
        animateWinningLine(line);
        triggerCelebration();
      }, 500);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameState('draw');
      setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    setTimeout(() => setIsAnimating(false), 600);
  };

  const resetGame = () => {
    setIsAnimating(true);
    
    // Enhanced reset animation
    if (boardRef.current) {
      anime({
        targets: boardRef.current.children,
        scale: [1, 0],
        rotate: [0, 180],
        duration: 400,
        delay: anime.stagger(50, {from: 'center'}),
        easing: 'easeInBack',
        complete: () => {
          setBoard(Array(9).fill(null));
          setCurrentPlayer('X');
          setGameState('playing');
          setWinner(null);
          setWinningLine([]);
          setLastMove(null);
          setCelebrationEmojis([]);

          // Board re-entrance animation
          if (boardRef.current) {
            anime({
              targets: boardRef.current.children,
              scale: [0.8, 1],
              duration: 400,
              delay: anime.stagger(50),
              easing: 'easeOutElastic(1, .8)',
            });
          }
        }
      });
    }

    setTimeout(() => setIsAnimating(false), 800);
  };

  const resetStats = () => {
    if (scoreRef.current) {
      anime({
        targets: scoreRef.current.children,
        scale: [1, 0, 1],
        duration: 400,
        delay: anime.stagger(100),
        easing: 'easeInOutQuart',
        complete: () => setStats({ xWins: 0, oWins: 0, draws: 0 })
      });
    }
  };

  const getGameStatus = () => {
    if (gameState === 'won') return `Player ${winner} Wins!`;
    if (gameState === 'draw') return "It's a Draw!";
    return `Player ${currentPlayer}&apos;s Turn`;
  };

  const getCellContent = (index: number) => {
    const value = board[index];
    if (!value) return '';
    
    const isWinningCell = winningLine.includes(index);
    const isLastMoveCell = lastMove === index;
    
    return (
      <span 
        className={`
          cell-symbol text-4xl sm:text-5xl lg:text-6xl font-black transition-all duration-500 drop-shadow-lg
          ${value === 'X' 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-emerald-600 dark:text-emerald-400'
          }
          ${isWinningCell ? 'animate-pulse scale-110 text-green-500 dark:text-green-400' : ''}
          ${isLastMoveCell ? 'animate-bounce' : ''}
        `}
      >
        {value}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-500/10 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20"></div>
      
      {/* Animated Background Elements */}
      <div ref={backgroundRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Celebration Emojis */}
      {celebrationEmojis.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {celebrationEmojis.map((emoji, index) => (
            <div
              key={index}
              className="celebration-emoji absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row gap-8 p-6 sm:p-8 lg:p-12">
        {/* Enhanced Main Game Section */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          {/* Enhanced Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
              Tic Tac Toe
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 dark:text-yellow-400" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">
                  {getGameStatus()}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Game Card */}
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-4 sm:pb-6 lg:pb-8 px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Game Board
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-10 lg:pb-12">
              {/* Enhanced Game Grid */}
              <div className="mb-10 sm:mb-12 lg:mb-16">
                <div ref={boardRef} className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/30 dark:to-gray-900/30 rounded-3xl border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-sm shadow-xl">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      data-cell-index={index}
                      onClick={() => handleCellClick(index)}
                      disabled={gameState !== 'playing' || cell !== null || isAnimating}
                      className={`
                        aspect-square rounded-2xl sm:rounded-3xl border-3 transition-all duration-300
                        flex items-center justify-center relative overflow-hidden group
                        min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] font-black text-4xl sm:text-5xl lg:text-6xl
                        ${winningLine.includes(index) 
                          ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-400/30' 
                          : cell 
                          ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:shadow-lg hover:scale-105'
                        }
                        ${!cell && gameState === 'playing' ? 'cursor-pointer' : 'cursor-default'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                        shadow-lg hover:shadow-xl
                      `}
                    >
                      {getCellContent(index)}
                      
                      {/* Enhanced Ripple effect */}
                      {lastMove === index && (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl sm:rounded-3xl animate-ping"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Controls */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <AnimatedButton 
                  onAnimatedClick={resetGame}
                  animationType="bounce"
                  variant="outline"
                  size="lg"
                  className="bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  New Game
                </AnimatedButton>
                
                <AnimatedButton 
                  onAnimatedClick={resetStats}
                  animationType="pulse"
                  variant="outline"
                  size="lg"
                  className="bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 border-2 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                >
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Reset Stats
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sidebar */}
        <div className="w-full lg:w-80 xl:w-96 space-y-6 sm:space-y-8">
          {/* Enhanced Score Card */}
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 sm:pb-6 px-6 sm:px-8 py-6 sm:py-8 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Score Board
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent ref={scoreRef} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-5">
              {/* Player X */}
              <div className="flex justify-between items-center p-4 sm:p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all duration-300 border border-blue-200/50 dark:border-blue-800/30 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-200 dark:bg-blue-800 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <span className="text-blue-700 dark:text-blue-300 font-bold text-lg sm:text-xl">Player X</span>
                </div>
                <Badge className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:scale-110 transition-transform duration-300 px-4 py-2 text-lg font-bold rounded-xl">
                  {stats.xWins}
                </Badge>
              </div>

              {/* Player O */}
              <div className="flex justify-between items-center p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-all duration-300 border border-emerald-200/50 dark:border-emerald-800/30 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-200 dark:bg-emerald-800 group-hover:scale-110 transition-transform duration-300">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 dark:text-emerald-300" />
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold text-lg sm:text-xl">Player O</span>
                </div>
                <Badge className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 hover:scale-110 transition-transform duration-300 px-4 py-2 text-lg font-bold rounded-xl">
                  {stats.oWins}
                </Badge>
              </div>

              {/* Draws */}
              <div className="flex justify-between items-center p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-950/30 hover:bg-gray-100 dark:hover:bg-gray-950/50 transition-all duration-300 border border-gray-200/50 dark:border-gray-800/30 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg sm:text-xl">Draws</span>
                </div>
                <Badge className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:scale-110 transition-transform duration-300 px-4 py-2 text-lg font-bold rounded-xl">
                  {stats.draws}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

          {/* Enhanced Game Rules */}
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <CardHeader className="pb-4 sm:pb-6 px-6 sm:px-8 py-6 sm:py-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  How to Play
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/20">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">Players take turns placing X and O</p>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-800/20">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">First to get 3 in a row wins</p>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/30 dark:border-purple-800/20">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">Rows, columns, or diagonals count</p>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/20">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">If all squares are filled, it&apos;s a draw</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
