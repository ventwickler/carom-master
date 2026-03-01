import React, { useState } from 'react';
import { X, Trophy, Hash, Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, Match } from '../types';

interface MatchRecordFormProps {
  player: Player;
  allPlayers: Player[];
  onClose: () => void;
  onSubmit: (match: Match) => void;
}

export default function MatchRecordForm({ player, allPlayers, onClose, onSubmit }: MatchRecordFormProps) {
  const opponents = allPlayers.filter(p => p.id !== player.id);
  
  const [formData, setFormData] = useState({
    opponentId: '',
    playerScore: 0,
    opponentScore: 0,
    innings: 0,
    highRun: 0,
    opponentHighRun: 0,
    targetPoints: 40,
    tableNumber: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.opponentId) return;

    const newMatch: Match = {
      id: Math.random().toString(36).substr(2, 9),
      player1Id: player.id,
      player2Id: formData.opponentId,
      player1Score: formData.playerScore,
      player2Score: formData.opponentScore,
      innings: formData.innings,
      status: 'completed',
      startTime: new Date().toISOString(),
      tableNumber: formData.tableNumber,
      targetPoints: formData.targetPoints,
      highRun1: formData.highRun,
      highRun2: formData.opponentHighRun,
    };

    onSubmit(newMatch);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#E4E3E0] w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl border border-[#141414]"
      >
        <div className="bg-[#141414] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase italic font-serif">Record Match Result</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Submit official score for {player.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-[#141414]">
          <div className="grid grid-cols-2 gap-6">
            {/* Player Side */}
            <div className="space-y-4">
              <div className="p-4 bg-white border border-[#141414]/10 rounded-2xl">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Player</p>
                <p className="font-bold">{player.name}</p>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Score</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono font-bold text-xl"
                  value={formData.playerScore}
                  onChange={(e) => setFormData({ ...formData, playerScore: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">High Run</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                  value={formData.highRun}
                  onChange={(e) => setFormData({ ...formData, highRun: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Opponent Side */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Opponent</label>
                <select
                  required
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all appearance-none font-bold"
                  value={formData.opponentId}
                  onChange={(e) => setFormData({ ...formData, opponentId: e.target.value })}
                >
                  <option value="">Select Opponent</option>
                  {opponents.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Score</label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono font-bold text-xl"
                  value={formData.opponentScore}
                  onChange={(e) => setFormData({ ...formData, opponentScore: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">High Run</label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                  value={formData.opponentHighRun}
                  onChange={(e) => setFormData({ ...formData, opponentHighRun: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-[#141414]/10 pt-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Innings</label>
              <input
                required
                type="number"
                min="1"
                className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                value={formData.innings}
                onChange={(e) => setFormData({ ...formData, innings: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Target</label>
              <input
                required
                type="number"
                className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                value={formData.targetPoints}
                onChange={(e) => setFormData({ ...formData, targetPoints: parseInt(e.target.value) || 40 })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Table</label>
              <input
                required
                type="number"
                className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#141414] font-bold uppercase tracking-widest text-[10px] hover:bg-[#141414] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#141414] text-white font-bold uppercase tracking-widest text-[10px] hover:bg-[#2A2A2A] transition-all shadow-lg"
            >
              Save Result
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
