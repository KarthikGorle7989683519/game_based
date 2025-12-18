
import React, { useState, useEffect, useCallback } from 'react';
import { Equation, GameState, GameMode } from './types';
import { generateLevelEquations, getDifficulty, getGameMode } from './services/gameLogic';
import Balloon from './components/Balloon';

const ROUND_TIME = 15;
const TOTAL_LEVELS = 80;

const App: React.FC = () => {
  const [game, setGame] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    timeLeft: ROUND_TIME,
    status: 'idle',
    equations: [],
    clickedIds: []
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);

  const startLevel = useCallback((level: number, immediately: boolean = false) => {
    if (level > TOTAL_LEVELS) {
      setGame(prev => ({ ...prev, status: 'won' }));
      return;
    }

    const load = () => {
      const eqs = generateLevelEquations(level);
      setGame(prev => ({
        ...prev,
        currentLevel: level,
        timeLeft: ROUND_TIME,
        status: 'playing',
        equations: eqs,
        clickedIds: []
      }));
      setFeedbackType(null);
      setMessage(null);
      setIsTransitioning(false);
    };

    if (immediately) {
      load();
    } else {
      setIsTransitioning(true);
      setTimeout(load, 1200);
    }
  }, []);

  const handleStart = () => {
    startLevel(1, true);
  };

  const handleBalloonClick = (eq: Equation) => {
    if (game.status !== 'playing' || isTransitioning || game.clickedIds.includes(eq.id)) return;

    const mode = getGameMode(game.currentLevel);
    const unclickedEquations = game.equations.filter(e => !game.clickedIds.includes(e.id));
    const values = unclickedEquations.map(e => e.value);

    let isCorrect = false;
    let autoNext = false;

    if (mode === 'smallest') {
      const targetValue = Math.min(...game.equations.map(e => e.value));
      isCorrect = eq.value === targetValue;
      autoNext = true;
    } else if (mode === 'largest') {
      const targetValue = Math.max(...game.equations.map(e => e.value));
      isCorrect = eq.value === targetValue;
      autoNext = true;
    } else if (mode === 'ascending') {
      const nextSmallest = Math.min(...values);
      isCorrect = eq.value === nextSmallest;
      if (isCorrect) {
        const nextClickedIds = [...game.clickedIds, eq.id];
        if (nextClickedIds.length === game.equations.length) {
          autoNext = true;
        } else {
          setGame(prev => ({ ...prev, clickedIds: nextClickedIds, score: prev.score + 2 }));
        }
      } else {
        autoNext = true; 
      }
    } else if (mode === 'descending') {
      const nextLargest = Math.max(...values);
      isCorrect = eq.value === nextLargest;
      if (isCorrect) {
        const nextClickedIds = [...game.clickedIds, eq.id];
        if (nextClickedIds.length === game.equations.length) {
          autoNext = true;
        } else {
          setGame(prev => ({ ...prev, clickedIds: nextClickedIds, score: prev.score + 2 }));
        }
      } else {
        autoNext = true;
      }
    }

    if (autoNext) {
      if (isCorrect) {
        setGame(prev => ({ ...prev, score: prev.score + 10 }));
        setFeedbackType('correct');
        setMessage(mode === 'ascending' || mode === 'descending' ? "Perfect Order!" : "Correct!");
      } else {
        setFeedbackType('wrong');
        const correctVal = mode === 'smallest' ? Math.min(...game.equations.map(e => e.value)) : Math.max(...game.equations.map(e => e.value));
        setMessage(mode === 'ascending' || mode === 'descending' ? "Wrong Order!" : `Oops! Answer was ${correctVal}`);
      }
      startLevel(game.currentLevel + 1);
    }
  };

  useEffect(() => {
    let timer: number;
    if (game.status === 'playing' && game.timeLeft > 0 && !isTransitioning) {
      timer = window.setInterval(() => {
        setGame(prev => ({ ...prev, timeLeft: Math.max(0, prev.timeLeft - 1) }));
      }, 1000);
    } else if (game.timeLeft === 0 && game.status === 'playing' && !isTransitioning) {
      setFeedbackType('wrong');
      setMessage("Time's up!");
      startLevel(game.currentLevel + 1);
    }
    return () => clearInterval(timer);
  }, [game.status, game.timeLeft, isTransitioning, game.currentLevel, startLevel]);

  const mode = getGameMode(game.currentLevel);
  const difficulty = getDifficulty(game.currentLevel);
  
  const getInstruction = (m: GameMode) => {
    switch (m) {
      case 'smallest': return "Find the Smallest";
      case 'ascending': return "Click: Low to High";
      case 'descending': return "Click: High to Low";
      case 'largest': return "Find the Largest";
    }
  };

  const renderContent = () => {
    if (game.status === 'idle') {
      return (
        <div className="flex flex-col items-center gap-8 text-center px-6 animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-gray-900 tracking-tighter leading-none uppercase">
              MATH<br/><span className="text-blue-600 italic">80 CHALLENGE</span>
            </h1>
            <div className="flex flex-col items-center gap-2">
              <span className="px-4 py-1 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-[0.2em]">80 Rapid-Fire Questions</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-xl border border-gray-100 max-w-sm">
            <p className="text-gray-600 font-medium text-sm leading-relaxed">
              Find the <b>smallest</b> answer in Phase 1.<br/> 
              Phase 1.2 introduces <span className="text-blue-600 font-bold">/</span> and 1.3 brings <span className="text-blue-600 font-bold">%</span> mastery!
            </p>
          </div>
          <button 
            onClick={handleStart}
            className="group relative px-20 py-6 bg-blue-600 text-white font-black rounded-full shadow-[0_10px_0_0_rgba(29,78,216,1)] hover:shadow-[0_5px_0_0_rgba(29,78,216,1)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all overflow-hidden"
          >
            <span className="relative z-10 text-xl tracking-widest">START CHALLENGE</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </button>
        </div>
      );
    }

    if (game.status === 'won') {
      return (
        <div className="flex flex-col items-center gap-8 text-center px-6 animate-in zoom-in duration-500">
          <div className="p-12 rounded-[50px] shadow-2xl bg-white border-[6px] border-blue-600 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 animate-pulse" />
             <h2 className="text-7xl font-black uppercase mb-6 text-gray-900 tracking-tighter">
              FINISH!
            </h2>
            <div className="space-y-4">
              <p className="text-6xl font-black text-blue-600">{game.score}</p>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Final Score</p>
            </div>
          </div>
          <button 
            onClick={handleStart}
            className="px-16 py-6 bg-gray-900 text-white font-black rounded-full shadow-[0_10px_0_0_rgba(0,0,0,1)] hover:shadow-[0_5px_0_0_rgba(0,0,0,1)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transition-all"
          >
            PLAY AGAIN
          </button>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl flex flex-col items-center gap-8 px-6">
        <div className="flex justify-between w-full items-center bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 relative">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Score</span>
            <span className="text-4xl font-black text-gray-900 tabular-nums">{game.score}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-xl font-black text-blue-600 tracking-tighter uppercase mb-1">
              {getInstruction(mode)}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 tracking-wider">
              {difficulty}
            </span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Time</span>
             <span className={`text-4xl font-black tabular-nums transition-colors ${game.timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>
               {game.timeLeft}s
             </span>
          </div>
        </div>

        <div className="relative min-h-[500px] w-full flex flex-col items-center justify-center">
           {message && (
            <div className={`absolute z-30 inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md rounded-[40px] animate-in fade-in scale-in duration-300`}>
                <div className={`px-12 py-6 rounded-3xl shadow-2xl border-4 flex flex-col items-center gap-2 transform rotate-2 ${
                  feedbackType === 'correct' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <span className="text-5xl font-black italic tracking-tighter">{feedbackType === 'correct' ? 'GOOD!' : 'NEXT!'}</span>
                  <p className="font-bold text-xl">{message}</p>
                </div>
            </div>
           )}

           <div className={`grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-90 translate-y-12' : 'opacity-100 scale-100 translate-y-0'}`}>
              {game.equations.map((eq) => (
                <div 
                  key={eq.id} 
                  className={`transition-all duration-300 ${game.clickedIds.includes(eq.id) ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}`}
                >
                  <Balloon 
                    equation={eq} 
                    onClick={handleBalloonClick}
                    disabled={isTransitioning || game.clickedIds.includes(eq.id)}
                  />
                </div>
              ))}
           </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex justify-between px-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Question {game.currentLevel} / {TOTAL_LEVELS}</span>
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{Math.round((game.currentLevel / TOTAL_LEVELS) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-4 rounded-full p-1 border border-gray-100 shadow-inner">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-100"
              style={{ width: `${(game.currentLevel / TOTAL_LEVELS) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center py-8 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
