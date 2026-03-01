import React, { useState } from 'react';
import { X, Calendar, MapPin, Trophy, LayoutGrid, Users, Target, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Tournament, Player } from '../types';

interface TournamentFormProps {
  tournament?: Tournament | null;
  availablePlayers: Player[];
  onClose: () => void;
  onSubmit: (data: Partial<Tournament>) => void;
}

export default function TournamentForm({ tournament, availablePlayers, onClose, onSubmit }: TournamentFormProps) {
  const [formData, setFormData] = useState({
    name: tournament?.name || '',
    location: tournament?.location || '',
    type: tournament?.type || 'knockout' as const,
    startDate: tournament?.startDate || new Date().toISOString().split('T')[0],
    endDate: tournament?.endDate || new Date().toISOString().split('T')[0],
    targetPoints: tournament?.targetPoints || 40,
    inningsLimit: tournament?.inningsLimit || 0,
    selectedPlayerIds: tournament?.players.map(p => p.id) || [] as string[],
  });

  const togglePlayer = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayerIds: prev.selectedPlayerIds.includes(id)
        ? prev.selectedPlayerIds.filter(pid => pid !== id)
        : [...prev.selectedPlayerIds, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlayers = availablePlayers.filter(p => formData.selectedPlayerIds.includes(p.id));
    
    onSubmit({
      ...formData,
      id: tournament?.id || Math.random().toString(36).substr(2, 9),
      players: selectedPlayers,
      matches: tournament?.matches || [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#E4E3E0] w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl border border-[#141414]"
      >
        <div className="bg-[#141414] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase italic font-serif">
              {tournament ? 'Edit Tournament' : 'Create Tournament'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">
              {tournament ? 'Update championship details' : 'Configure new championship event'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-[#141414] max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <Trophy size={12} /> Tournament Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Seoul World Cup 2024"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <MapPin size={12} /> Location
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Seoul, South Korea"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                    <Calendar size={12} /> Start Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono text-xs"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                    <Calendar size={12} /> End Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono text-xs"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                    <Target size={12} /> Target
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                    value={formData.targetPoints}
                    onChange={(e) => setFormData({ ...formData, targetPoints: parseInt(e.target.value) || 40 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                    <Clock size={12} /> Inn. Limit
                  </label>
                  <input
                    type="number"
                    placeholder="None"
                    className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                    value={formData.inningsLimit || ''}
                    onChange={(e) => setFormData({ ...formData, inningsLimit: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <LayoutGrid size={12} /> Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['knockout', 'round-robin', 'groups'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`py-2 rounded-xl border text-[8px] font-bold uppercase tracking-widest transition-all ${
                        formData.type === type 
                          ? 'bg-[#141414] text-white border-[#141414]' 
                          : 'bg-white border-[#141414]/10 hover:border-[#141414]/30'
                      }`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  <Users size={12} /> Participants ({formData.selectedPlayerIds.length})
                </label>
                <div className="bg-white border border-[#141414]/10 rounded-xl h-[340px] overflow-y-auto p-2 space-y-1">
                  {availablePlayers.map(player => (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => togglePlayer(player.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all border ${
                        formData.selectedPlayerIds.includes(player.id)
                          ? 'bg-[#141414] text-white border-[#141414]'
                          : 'bg-white text-[#141414] border-transparent hover:bg-[#141414]/5'
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-xs font-bold">{player.name}</p>
                        <p className="text-[8px] uppercase tracking-widest opacity-50">{player.country}</p>
                      </div>
                      {formData.selectedPlayerIds.includes(player.id) && <Trophy size={12} className="text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-[#141414] font-bold uppercase tracking-widest text-xs hover:bg-[#141414] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 rounded-2xl bg-[#141414] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg"
            >
              {tournament ? 'Update Tournament' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
