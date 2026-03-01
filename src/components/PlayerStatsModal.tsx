import React from 'react';
import { X, TrendingUp, Target, Award, BarChart3, PieChart, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Player } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlayerStatsModalProps {
  player: Player;
  onClose: () => void;
}

// Mock performance data
const PERFORMANCE_DATA = [
  { match: 'M1', avg: 1.850 },
  { match: 'M2', avg: 2.105 },
  { match: 'M3', avg: 1.920 },
  { match: 'M4', avg: 2.450 },
  { match: 'M5', avg: 2.145 },
];

export default function PlayerStatsModal({ player, onClose }: PlayerStatsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#E4E3E0] w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-[#141414]"
      >
        <div className="bg-[#141414] p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-[#141414] rounded-xl flex items-center justify-center font-bold text-xl">
              {player.country.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase italic font-serif">{player.name}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Performance Analytics • {player.country}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'General Average', value: '2.145', icon: TrendingUp, color: 'text-emerald-500' },
              { label: 'Highest Run', value: '18', icon: Target, color: 'text-blue-500' },
              { label: 'Win Rate', value: '78%', icon: Award, color: 'text-amber-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-[#141414]/10 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.color} />
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">{stat.label}</p>
                </div>
                <p className="text-2xl font-mono font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Detailed Match Record & Advanced Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-[#141414]/10 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Match Record</h3>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-3xl font-mono font-bold">42-12</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Wins / Losses</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-lg font-mono font-bold text-emerald-500">77.8%</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Success Rate</p>
                </div>
              </div>
              <div className="w-full bg-[#E4E3E0] h-2 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '78%' }} />
                <div className="bg-red-400 h-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div className="bg-white border border-[#141414]/10 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Advanced Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-mono font-bold">1.82</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Points / Inning</p>
                </div>
                <div>
                  <p className="text-xl font-mono font-bold">85.4%</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Break Conv.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white border border-[#141414]/10 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="opacity-40" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Average Trend (Last 5 Matches)</h3>
              </div>
              <p className="text-[10px] font-mono opacity-40">Current: 2.145</p>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PERFORMANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="match" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }}
                    domain={['dataMin - 0.2', 'dataMax + 0.2']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141414', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avg" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40 border-b border-[#141414]/10 pb-2">Tournament History</h4>
              {[
                { event: 'Seoul World Cup', result: '1st Place', year: '2024' },
                { event: 'Las Vegas Open', result: '3rd Place', year: '2023' },
                { event: 'European Championship', result: 'Quarter Final', year: '2023' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-medium">{item.event}</span>
                  <span className="opacity-40">{item.result}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-40 border-b border-[#141414]/10 pb-2">Technical Profile</h4>
              {[
                { trait: 'Break Success', value: '92%' },
                { trait: 'Defensive Play', value: '74%' },
                { trait: 'Time per Shot', value: '32s' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="font-medium">{item.trait}</span>
                  <span className="font-mono font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#141414] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg"
          >
            Close Analytics
          </button>
        </div>
      </motion.div>
    </div>
  );
}
