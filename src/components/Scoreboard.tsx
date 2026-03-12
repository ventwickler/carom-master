import React, { useState, useEffect } from 'react';
import { Match, Player, MatchInning } from '../types';
import { cn } from '../lib/utils';
import { Timer, Hash, TrendingUp, User, Activity, ArrowLeft, Plus, Check, Minus, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/apiService';

interface ScoreboardProps {
  match: Match;
  player1: Player;
  player2: Player;
  onBack?: () => void;
}

export default function Scoreboard({ match: initialMatch, player1, player2, onBack }: ScoreboardProps) {
  const [match, setMatch] = useState(initialMatch);
  const [currentRun, setCurrentRun] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(40); // 40 seconds per shot
  const [p1Run, setP1Run] = useState(0);

  const displayP1Score = match.player1Score + (activePlayer === 2 ? p1Run : 0);
  const displayP2Score = match.player2Score;

  const p1Innings = match.innings + (activePlayer === 2 ? 1 : 0);
  const avg1 = p1Innings > 0 ? (displayP1Score / p1Innings).toFixed(3) : '0.000';
  const avg2 = match.innings > 0 ? (displayP2Score / match.innings).toFixed(3) : '0.000';

  const displayHighRun1 = Math.max(match.highRun1, activePlayer === 2 ? p1Run : 0);
  const displayHighRun2 = match.highRun2;

  const handleAddPoint = () => {
    setCurrentRun(prev => prev + 1);
    setTimeLeft(40); // Reset shot clock
  };

  const handleRemovePoint = () => {
    setCurrentRun(prev => Math.max(0, prev - 1));
  };

  const handleUndoTurn = async () => {
    if (activePlayer === 2) {
      // Revert to Player 1's turn
      setActivePlayer(1);
      setCurrentRun(p1Run);
      setP1Run(0);
    } else if (activePlayer === 1 && match.innings > 0) {
      // Revert to Player 2's turn of the previous inning
      try {
        const deletedInning = await apiService.deleteLastInning(match.id);
        if (deletedInning) {
          const updatedMatch: Match = {
            ...match,
            player1Score: match.player1Score - deletedInning.player1Run,
            player2Score: match.player2Score - deletedInning.player2Run,
            innings: match.innings - 1,
            status: 'live' // Revert to live if it was completed
          };
          await apiService.updateMatch(updatedMatch);
          setMatch(updatedMatch);
          setActivePlayer(2);
          setP1Run(deletedInning.player1Run);
          setCurrentRun(deletedInning.player2Run);
        }
      } catch (error) {
        console.error('Failed to undo inning:', error);
      }
    }
  };

  const handleEndTurn = async () => {
    if (activePlayer === 1) {
      // Player 1 finished their turn, save run and switch to player 2
      setP1Run(currentRun);
      setActivePlayer(2);
      setCurrentRun(0);
      setTimeLeft(40);
    } else {
      // Player 2 finished their turn, inning is complete
      const p2Run = currentRun;
      const newInningNumber = match.innings + 1;
      const newP1Score = match.player1Score + p1Run;
      const newP2Score = match.player2Score + p2Run;
      const newHighRun1 = Math.max(match.highRun1, p1Run);
      const newHighRun2 = Math.max(match.highRun2, p2Run);

      const inning: MatchInning = {
        matchId: match.id,
        inningNumber: newInningNumber,
        player1Score: newP1Score,
        player2Score: newP2Score,
        player1Run: p1Run,
        player2Run: p2Run
      };

      const updatedMatch: Match = {
        ...match,
        player1Score: newP1Score,
        player2Score: newP2Score,
        innings: newInningNumber,
        highRun1: newHighRun1,
        highRun2: newHighRun2,
        status: (newP1Score >= match.targetPoints || newP2Score >= match.targetPoints) ? 'completed' : 'live'
      };

      try {
        await apiService.addMatchInning(match.id, inning);
        await apiService.updateMatch(updatedMatch);
        setMatch(updatedMatch);
        setActivePlayer(1);
        setCurrentRun(0);
        setP1Run(0);
        setTimeLeft(40);
      } catch (error) {
        console.error('Failed to save inning:', error);
      }
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen p-8 text-[#E4E3E0] font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Info */}
        <div className="flex justify-between items-end border-b border-[#2A2A2A] pb-6">
          <div>
            {onBack && (
              <button 
                onClick={onBack}
                className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                <ArrowLeft size={14} /> Back to Matches
              </button>
            )}
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
                  key={displayP1Score}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-[180px] font-mono font-bold leading-none tracking-tighter text-white block"
                >
                  {displayP1Score}
                </motion.span>
              </AnimatePresence>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Average</p>
                  <p className="text-xl font-mono font-bold text-emerald-500">{avg1}</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">High Run</p>
                  <p className="text-xl font-mono font-bold">{displayHighRun1}</p>
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
                  key={displayP2Score}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-[180px] font-mono font-bold leading-none tracking-tighter text-white block"
                >
                  {displayP2Score}
                </motion.span>
              </AnimatePresence>
              <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Average</p>
                  <p className="text-xl font-mono font-bold text-emerald-500">{avg2}</p>
                </div>
                <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A2A2A]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">High Run</p>
                  <p className="text-xl font-mono font-bold">{displayHighRun2}</p>
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
            { label: 'Total Points', value: displayP1Score + displayP2Score, icon: Hash },
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

        {/* Action Buttons */}
        {match.status === 'live' && (
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={handleUndoTurn}
              disabled={activePlayer === 1 && match.innings === 0 && currentRun === 0}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white px-6 py-6 rounded-2xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo Last Turn"
            >
              <Undo2 size={24} />
            </button>

            <button 
              onClick={handleRemovePoint}
              disabled={currentRun === 0}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white px-8 py-6 rounded-2xl font-bold text-xl flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove Point"
            >
              <Minus size={24} />
            </button>

            <button 
              onClick={handleAddPoint}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl flex items-center gap-3 transition-colors shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <Plus size={28} /> Point
            </button>

            <button 
              onClick={handleEndTurn}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-3 transition-colors"
            >
              <Check size={24} /> End Turn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
