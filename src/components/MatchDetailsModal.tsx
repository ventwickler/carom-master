import React, { useState, useEffect } from 'react';
import { X, Trophy, Target, Activity, Calendar, Clock, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Match, Player, MatchInning } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/apiService';

interface MatchDetailsModalProps {
  match: Match;
  player1: Player;
  player2: Player;
  onClose: () => void;
  onEdit?: (match: Match) => void;
}

export default function MatchDetailsModal({ match, player1, player2, onClose, onEdit }: MatchDetailsModalProps) {
  const [innings, setInnings] = useState<MatchInning[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInnings = async () => {
      try {
        const data = await apiService.getMatchInnings(match.id);
        setInnings(data);
      } catch (error) {
        console.error('Failed to fetch innings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInnings();
  }, [match.id]);

  const scoreProgression = innings.map(inning => ({
    inning: inning.inningNumber,
    p1: inning.player1Score,
    p2: inning.player2Score,
  }));

  const p1Avg = (match.innings > 0 ? (match.player1Score / match.innings) : 0).toFixed(3);
  const p2Avg = (match.innings > 0 ? (match.player2Score / match.innings) : 0).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#E4E3E0] w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl border border-[#141414]"
      >
        {/* Header */}
        <div className="bg-[#141414] p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[#141414] rounded-lg flex items-center justify-center font-bold">
                {player1.country.substring(0, 2).toUpperCase()}
              </div>
              <div className="w-10 h-10 bg-white/20 text-white rounded-lg flex items-center justify-center font-bold">
                {player2.country.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tighter uppercase italic font-serif">Match Result Details</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Table {match.tableNumber} • Completed • {new Date(match.startTime).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
          {/* Scoreboard Section */}
          <div className="col-span-12 bg-white border border-[#141414] rounded-2xl p-8 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <Trophy size={400} className="absolute -right-20 -bottom-20" />
            </div>

            <div className="flex-1 text-center space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Player 1</p>
              <h3 className="text-2xl font-bold">{player1.name}</h3>
              <div className="text-6xl font-mono font-bold">{match.player1Score}</div>
              <div className={match.player1Score >= match.targetPoints ? "text-emerald-500 text-[10px] font-bold uppercase tracking-widest" : "invisible"}>Winner</div>
            </div>

            <div className="px-8 text-center">
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-20 mb-2">Final</div>
              <div className="w-px h-24 bg-[#141414]/10 mx-auto" />
              <div className="mt-2 text-sm font-mono font-bold opacity-40">{match.innings} INN</div>
            </div>

            <div className="flex-1 text-center space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Player 2</p>
              <h3 className="text-2xl font-bold">{player2.name}</h3>
              <div className="text-6xl font-mono font-bold">{match.player2Score}</div>
              <div className={match.player2Score >= match.targetPoints ? "text-emerald-500 text-[10px] font-bold uppercase tracking-widest" : "invisible"}>Winner</div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white border border-[#141414]/10 p-6 rounded-2xl space-y-6">
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40 border-b border-[#141414]/10 pb-2">Match Statistics</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-[10px] uppercase tracking-widest opacity-40">Average (G.A)</div>
                  <div className="flex gap-4 font-mono font-bold text-sm">
                    <span className="text-emerald-600">{p1Avg}</span>
                    <span className="opacity-20">/</span>
                    <span>{p2Avg}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] uppercase tracking-widest opacity-40">High Run (H.R)</div>
                  <div className="flex gap-4 font-mono font-bold text-sm">
                    <span className="text-emerald-600">{match.highRun1}</span>
                    <span className="opacity-20">/</span>
                    <span>{match.highRun2}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] uppercase tracking-widest opacity-40">Target Points</div>
                  <div className="font-mono font-bold text-sm">{match.targetPoints}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#141414] text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-60">Performance Note</h4>
              </div>
              <p className="text-xs leading-relaxed opacity-80 italic">
                {match.player1Score > match.player2Score 
                  ? `${player1.name} dominated the second half of the match with a high run of ${match.highRun1}.`
                  : `${player2.name} showed exceptional defensive play, limiting the opponent's scoring opportunities.`}
              </p>
            </div>
          </div>

          {/* Progression Chart */}
          <div className="col-span-8 bg-white border border-[#141414]/10 p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="opacity-40" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Score Progression</h3>
              </div>
              <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{player1.name.split(' ').pop()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{player2.name.split(' ').pop()}</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreProgression}>
                  <defs>
                    <linearGradient id="colorP1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorP2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="inning" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }} 
                    label={{ value: 'Innings', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#888' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141414', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="p1" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorP1)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="p2" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorP2)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-8 bg-[#141414]/5 flex justify-end gap-3">
          {onEdit && (
            <button
              onClick={() => onEdit(match)}
              className="px-8 py-3 rounded-xl border border-[#141414] text-[#141414] font-bold uppercase tracking-widest text-xs hover:bg-[#141414] hover:text-white transition-all shadow-sm"
            >
              Edit Match
            </button>
          )}
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-[#141414] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}
