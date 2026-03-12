import React, { useState } from 'react';
import { X, Trophy, Hash, Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, Match, Tournament } from '../types';

interface MatchRecordFormProps {
  player?: Player;
  match?: Match;
  allPlayers: Player[];
  allTournaments?: Tournament[];
  onClose: () => void;
  onSubmit: (match: Match) => void;
}

export default function MatchRecordForm({ player: initialPlayer, match, allPlayers, allTournaments = [], onClose, onSubmit }: MatchRecordFormProps) {
  const [formData, setFormData] = useState({
    player1Id: match?.player1Id || initialPlayer?.id || '',
    player2Id: match?.player2Id || '',
    tournamentId: match?.tournamentId || '',
    playerScore: match?.player1Score || 0,
    opponentScore: match?.player2Score || 0,
    innings: match?.innings || 0,
    highRun: match?.highRun1 || 0,
    opponentHighRun: match?.highRun2 || 0,
    targetPoints: match?.targetPoints || 40,
    tableNumber: match?.tableNumber || 1,
    status: match?.status || 'completed' as Match['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.player1Id || !formData.player2Id) return;

    const updatedMatch: Match = {
      id: match?.id || 0,
      tournamentId: formData.tournamentId ? Number(formData.tournamentId) : undefined,
      player1Id: Number(formData.player1Id),
      player2Id: Number(formData.player2Id),
      player1Score: formData.playerScore,
      player2Score: formData.opponentScore,
      innings: formData.innings,
      status: formData.status,
      startTime: match?.startTime || new Date().toISOString(),
      tableNumber: formData.tableNumber,
      targetPoints: formData.targetPoints,
      highRun1: formData.highRun,
      highRun2: formData.opponentHighRun,
    };

    onSubmit(updatedMatch);
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
            <h2 className="text-2xl font-bold tracking-tighter uppercase italic font-serif">
              {match ? 'Edit Match Result' : 'Record Match Result'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">
              {match ? `Update official score for match ${match.id}` : `Submit official score for match`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-[#141414]">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Tournament</label>
            <select
              className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all appearance-none font-bold"
              value={formData.tournamentId}
              onChange={(e) => setFormData({ ...formData, tournamentId: e.target.value })}
            >
              <option value="">Exhibition Match (No Tournament)</option>
              {allTournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Player 1 Side */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Player 1</label>
                <select
                  required
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all appearance-none font-bold"
                  value={formData.player1Id}
                  onChange={(e) => setFormData({ ...formData, player1Id: e.target.value })}
                >
                  <option value="">Select Player</option>
                  {allPlayers.map(p => (
                    <option key={p.id} value={p.id} disabled={Number(formData.player2Id) === p.id}>{p.name}</option>
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

            {/* Player 2 Side */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Player 2</label>
                <select
                  required
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all appearance-none font-bold"
                  value={formData.player2Id}
                  onChange={(e) => setFormData({ ...formData, player2Id: e.target.value })}
                >
                  <option value="">Select Opponent</option>
                  {allPlayers.map(p => (
                    <option key={p.id} value={p.id} disabled={Number(formData.player1Id) === p.id}>{p.name}</option>
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
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Status</label>
              <select
                required
                className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all appearance-none font-bold"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Match['status'] })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
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
