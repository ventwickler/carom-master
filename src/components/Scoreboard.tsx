import React, { useState, useEffect } from 'react';
import { Match, Player } from '../types';
import { cn } from '../lib/utils';
import { Timer, Hash, TrendingUp, User, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreboardProps {
  match: Match;
  player1: Player;
  player2: Player;
}

export default function Scoreboard({ match: initialMatch, player1, player2 }: ScoreboardProps) {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [currentRun, setCurrentRun] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(40); // 40 seconds per shot

  // Simulate real-time updates for live matches
  useEffect(() => {
    if (match.status !== 'live') return;

    const interval = setInterval(() => {
      // 30% chance to score a point every 3 seconds
      if (Math.random() > 0.7) {
        setMatch(prev => {
          const isPlayer1 = activePlayer === 1;
          const newScore1 = isPlayer1 ? prev.player1Score + 1 : prev.player1Score;
          const newScore2 = !isPlayer1 ? prev.player2Score + 1 : prev.player2Score;
          
          const newHighRun1 = isPlayer1 ? Math.max(prev.highRun1, currentRun + 1) : prev.highRun1;
          const newHighRun2 = !isPlayer1 ? Math.max(prev.highRun2, currentRun + 1) : prev.highRun2;

          setCurrentRun(curr => curr + 1);
          
          return {
            ...prev,
            player1Score: newScore1,
            player2Score: newScore2,
            highRun1: newHighRun1,
            highRun2: newHighRun2,
          };
        });
        setTimeLeft(40); // Reset shot clock on score
      } else if (Math.random() > 0.9) {
        // 10% chance to miss/switch player
        setActivePlayer(curr => curr === 1 ? 2 : 1);
        setCurrentRun(0);
        setMatch(prev => ({ ...prev, innings: prev.innings + (activePlayer === 2 ? 1 : 0) }));
        setTimeLeft(40);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [match.status, activePlayer, currentRun]);

  // Shot clock countdown
  useEffect(() => {
    if (match.status !== 'live') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setActivePlayer(curr => curr === 1 ? 2 : 1);
          setCurrentRun(0);
          return 40;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [match.status]);

  const avg1 = match.innings > 0 ? (match.player1Score / match.innings).toFixed(3) : '0.000';
  const avg2 = match.innings > 0 ? (match.player2Score / match.innings).toFixed(3) : '0.000';

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-8 text-[#E4E3E0] font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Info */}
        <div className="flex justify-between items-end border-b border-[#2A2A2A] pb-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">Table {match.tableNumber}</h2>
            <p className="text-xs tracking-widest opacity-40 uppercase mt-1">World Cup - Quarter Finals</p>
          </div>
          <div className="flex gap-12 text-right">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Target</p>
              <p className="text-2xl font-mono font-bold">{match.targetPoints}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Innings</p>
              <p className="text-2xl font-mono font-bold">{match.innings}</p>
            </div>
          </div>
        </div>

        {/* Main Score Area */}
        <div className="grid grid-cols-11 gap-4 items-center">
          {/* Player 1 */}
          <div className="col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 bg-[#1A1A1A] border rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-500",
                activePlayer === 1 ? "border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "border-[#2A2A2A] text-[#444]"
              )}>
                {player1.country.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-bold tracking-tight">{player1.name}</h3>
                  {activePlayer === 1 && match.status === 'live' && (
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                  )}
                </div>
                <p className="text-sm opacity-40">{player1.country}</p>
              </div>
            </div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: activePlayer === 1 ? 1.02 : 1, 
                opacity: 1,
                borderColor: activePlayer === 1 ? '#10b981' : '#2A2A2A'
              }}
              className={cn(
                "bg-[#141414] border rounded-[32px] p-12 text-center relative overflow-hidden group transition-colors duration-500",
                activePlayer === 1 ? "bg-[#1A1A1A]" : ""
              )}
            >
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest opacity-20">Score</div>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={match.player1Score}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-[180px] font-mono font-bold leading-none tracking-tighter text-white block"
                >
                  {match.player1Score}
                </motion.span>
              </AnimatePresence>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Average</p>
                  <p className="text-xl font-mono font-bold text-emerald-500">{avg1}</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">High Run</p>
                  <p className="text-xl font-mono font-bold">{match.highRun1}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* VS Divider */}
          <div className="col-span-1 flex flex-col items-center gap-4">
            <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#2A2A2A] to-transparent" />
            <div className="text-xs font-mono opacity-20 rotate-90 tracking-[1em] uppercase">VERSUS</div>
            <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#2A2A2A] to-transparent" />
          </div>

          {/* Player 2 */}
          <div className="col-span-5 space-y-6 text-right">
            <div className="flex items-center gap-4 justify-end">
              <div>
                <div className="flex items-center gap-2 justify-end">
                  {activePlayer === 2 && match.status === 'live' && (
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                  )}
                  <h3 className="text-3xl font-bold tracking-tight">{player2.name}</h3>
                </div>
                <p className="text-sm opacity-40">{player2.country}</p>
              </div>
              <div className={cn(
                "w-16 h-16 bg-[#1A1A1A] border rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-500",
                activePlayer === 2 ? "border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "border-[#2A2A2A] text-[#444]"
              )}>
                {player2.country.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: activePlayer === 2 ? 1.02 : 1, 
                opacity: 1,
                borderColor: activePlayer === 2 ? '#10b981' : '#2A2A2A'
              }}
              className={cn(
                "bg-[#141414] border rounded-[32px] p-12 text-center relative overflow-hidden group transition-colors duration-500",
                activePlayer === 2 ? "bg-[#1A1A1A]" : ""
              )}
            >
              <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-20">Score</div>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={match.player2Score}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-[180px] font-mono font-bold leading-none tracking-tighter text-white block"
                >
                  {match.player2Score}
                </motion.span>
              </AnimatePresence>
              <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Average</p>
                  <p className="text-xl font-mono font-bold text-emerald-500">{avg2}</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">High Run</p>
                  <p className="text-xl font-mono font-bold">{match.highRun2}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls / Stats Footer */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Shot Clock', value: `${timeLeft}s`, icon: Timer, highlight: timeLeft <= 10 },
            { label: 'Current Run', value: currentRun, icon: TrendingUp },
            { label: 'Total Points', value: match.player1Score + match.player2Score, icon: Hash },
            { label: 'Match Status', value: match.status.toUpperCase(), icon: Activity, live: match.status === 'live' },
          ].map((stat, i) => (
            <div key={i} className={cn(
              "bg-[#141414] border p-6 rounded-2xl flex items-center gap-4 transition-all duration-300",
              stat.highlight ? "border-red-500 bg-red-500/5" : "border-[#2A2A2A]"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                stat.highlight ? "bg-red-500 text-white" : "bg-[#1A1A1A] text-[#888]",
                stat.live ? "text-emerald-500" : ""
              )}>
                <stat.icon size={20} className={cn(stat.live && "animate-pulse")} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-40">{stat.label}</p>
                <p className={cn(
                  "text-xl font-mono font-bold",
                  stat.highlight && "text-red-500"
                )}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
