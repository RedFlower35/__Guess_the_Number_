/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle2, AlertCircle, Hash, Play, HelpCircle } from 'lucide-react';

/**
 * 遊戲狀態的型別定義
 */
type GameStatus = 'playing' | 'won';

export default function App() {
  // --- 狀態管理 ---
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<{ text: string; type: 'info' | 'success' | 'warn' | 'none' }>({
    text: '請輸入 1 到 100 之間的數字',
    type: 'none'
  });
  const [status, setStatus] = useState<GameStatus>('playing');
  const [guessHistory, setGuessHistory] = useState<number[]>([]);

  /**
   * 初始化遊戲或重新開始
   */
  const startNewGame = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(newTarget);
    setUserGuess('');
    setAttempts(0);
    setMessage({ text: '新的遊戲開始了！請輸入 1 到 100 之間的數字', type: 'none' });
    setStatus('playing');
    setGuessHistory([]);
  }, []);

  // 初始掛載時啟動遊戲
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  /**
   * 處理玩家的猜測動作
   */
  const handleGuess = () => {
    const guessNum = parseInt(userGuess);

    // 驗證輸入內容
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage({ text: '無效的輸入！請輸入 1 到 100 之間的整數', type: 'warn' });
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuessHistory(prev => [guessNum, ...prev]);

    if (guessNum === targetNumber) {
      // 猜對了
      setMessage({ text: `恭喜！猜對了！答案就是 ${targetNumber}`, type: 'success' });
      setStatus('won');
    } else if (guessNum > targetNumber) {
      // 猜大了
      setMessage({ text: '太大了！再小一點', type: 'warn' });
      setUserGuess('');
    } else {
      // 猜小了
      setMessage({ text: '太小了！再大一點', type: 'warn' });
      setUserGuess('');
    }
  };

  /**
   * 處理 Enter 鍵提交
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && status === 'playing') {
      handleGuess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 selection:bg-emerald-500/30">
      <div className="max-w-5xl w-full flex flex-col gap-6">
        {/* Header Section */}
        <header className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-emerald-500 font-bold tracking-[0.3em] text-xs uppercase mb-1">Project Numero</span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Guess the Number</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-zinc-800/50 rounded-full px-4 py-2 border border-zinc-700 items-center gap-3">
              <span className="text-zinc-400 text-sm">Target Range</span>
              <span className="text-white font-semibold font-mono">1 — 100</span>
            </div>
            <button 
              onClick={startNewGame}
              className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              再玩一次
            </button>
          </div>
        </header>

        {/* Main Bento Grid */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[500px]">
          {/* Main Game Interface */}
          <section className="md:col-span-8 bento-card flex flex-col items-center justify-center gap-8 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-1 accent-gradient" />
            
            <div className="space-y-2 py-8">
              <span className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs">Current Hint</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={message.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-6xl font-black ${
                    message.type === 'success' ? 'text-emerald-500' : 
                    message.type === 'warn' ? 'text-orange-400' : 'text-white'
                  }`}
                >
                  {message.text.includes('！') ? message.text.split('！')[0] + '！' : message.text}
                </motion.div>
              </AnimatePresence>
              <p className="text-zinc-400">
                {message.text.includes('！') ? (message.text.split('！')[1] || '試著輸入一個數字...') : '1 到 100 之間的一個整數'}
              </p>
            </div>

            {status === 'playing' ? (
              <div className="w-full max-w-md flex flex-col gap-4 mt-4">
                <div className="relative group">
                  <input
                    autoFocus
                    type="number"
                    min="1"
                    max="100"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="?"
                    className="w-full bg-zinc-900 border-2 border-zinc-700 group-focus-within:border-emerald-500 rounded-2xl py-6 px-8 text-4xl font-bold text-center text-white focus:outline-none transition-colors font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute -top-3 left-6 bg-[#18181B] px-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Your Guess
                  </div>
                </div>
                <button
                  onClick={handleGuess}
                  className="w-full accent-gradient text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-emerald-500/10 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  提交猜測
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
              >
                <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4">
                  <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-2">Victory Achieved</p>
                  <p className="text-neutral-400 text-xs italic uppercase">The number was {targetNumber}</p>
                </div>
                <button
                  onClick={startNewGame}
                  className="w-full bg-white text-black font-bold py-5 rounded-2xl text-xl hover:bg-zinc-200 active:scale-[0.98] transition-all"
                >
                  再玩一次
                </button>
              </motion.div>
            )}
          </section>

          {/* Sidebar Area */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Attempts Tracker */}
            <div className="bento-card flex-1 flex flex-col justify-between overflow-hidden relative">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-zinc-600 font-bold font-mono text-sm">#TRACKER</span>
              </div>
              <div className="mt-4">
                <div className="text-6xl font-black text-white font-mono leading-none">
                  {attempts.toString().padStart(2, '0')}
                </div>
                <div className="text-zinc-400 font-medium">猜測次數</div>
              </div>
              <div className="absolute -bottom-6 -right-6 text-zinc-800/20 font-black text-8xl italic select-none">
                ATMP
              </div>
            </div>

            {/* Guess History */}
            <div className="bento-card flex-[2] flex flex-col gap-4 overflow-hidden h-[300px]">
              <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                猜測紀錄
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 mt-2 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {guessHistory.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-600 font-mono text-sm italic">
                      No records yet
                    </div>
                  ) : (
                    guessHistory.map((num, idx) => {
                      const isTooSmall = num < targetNumber;
                      return (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={`${guessHistory.length - idx}-${num}`}
                          className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-400 font-mono font-bold">
                              {(guessHistory.length - idx).toString().padStart(2, '0')}
                            </span>
                            <span className="text-white font-bold text-lg font-mono">{num}</span>
                          </div>
                          <span className={`${isTooSmall ? 'text-blue-400' : num === targetNumber ? 'text-emerald-400' : 'text-red-400'} text-[10px] font-bold uppercase tracking-wider`}>
                            {num === targetNumber ? 'Bingo' : isTooSmall ? 'Too Small' : 'Too Big'}
                          </span>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Lower Grid Row */}
          <div className="md:col-span-8 bento-card flex items-center gap-6 overflow-hidden bg-emerald-950/20 border-emerald-900/30">
            <div className="flex-1">
              <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Game Mode</h4>
              <p className="text-white font-semibold text-lg">Classic 1-100</p>
              <p className="text-emerald-500/60 text-xs mt-1 font-medium">Standard difficulty enabled</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
              <div className="absolute w-10 h-10 bg-emerald-500 rounded-full blur-xl opacity-20" />
              <Play className="w-8 h-8 text-emerald-500 relative z-10" />
            </div>
          </div>

          <div className="md:col-span-4 bento-card flex items-center gap-4 group cursor-pointer hover:bg-zinc-800 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white group-hover:bg-emerald-500 transition-all">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold">遊戲說明</h4>
              <p className="text-zinc-500 text-sm">如何變強？查看攻略提示</p>
            </div>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-700">
          <p>Built with React + TypeScript + Tailwind</p>
          <div className="flex items-center gap-4">
            <p>System Status: Active</p>
            <span className="hidden sm:inline">•</span>
            <p className="hidden sm:inline">Session: {Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
