import React from 'react';
import { Match, Player } from '../types';
import { cn } from '../lib/utils';
import { Timer, Hash, TrendingUp, User } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreboardProps {
  match: Match;
  player1: Player;
  player2: Player;
}

export default function Scoreboard({ match, player1, player2 }: ScoreboardProps) {
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
              <div className="w-16 h-16 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-500">
                {player1.country.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight">{player1.name}</h3>
                <p className="text-sm opacity-40">{player1.country}</p>
              </div>
            </div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#141414] border border-[#2A2A2A] rounded-[32px] p-12 text-center relative overflow-hidden group"
            >
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest opacity-20">Score</div>
              <span className="text-[180px] font-mono font-bold leading-none tracking-tighter text-white">
                {match.player1Score}
              </span>
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
                <h3 className="text-3xl font-bold tracking-tight">{player2.name}</h3>
                <p className="text-sm opacity-40">{player2.country}</p>
              </div>
              <div className="w-16 h-16 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-500">
                {player2.country.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#141414] border border-[#2A2A2A] rounded-[32px] p-12 text-center relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-20">Score</div>
              <span className="text-[180px] font-mono font-bold leading-none tracking-tighter text-white">
                {match.player2Score}
              </span>
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
            { label: 'Time Remaining', value: '45:00', icon: Timer },
            { label: 'Current Run', value: '0', icon: TrendingUp },
            { label: 'Total Points', value: '72', icon: Hash },
            { label: 'Referees', value: '2 Active', icon: User },
          ].map((stat, i) => (
            <div key={i} className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#888]">
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-40">{stat.label}</p>
                <p className="text-xl font-mono font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
