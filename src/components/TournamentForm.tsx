import React, { useState } from 'react';
import { X, Calendar, MapPin, Trophy, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { Tournament } from '../types';

interface TournamentFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<Tournament>) => void;
}

export default function TournamentForm({ onClose, onSubmit }: TournamentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'knockout' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      players: [],
      matches: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#E4E3E0] w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl border border-[#141414]"
      >
        <div className="bg-[#141414] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase italic font-serif">Create Tournament</h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Configure new championship event</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-[#141414]">
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
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
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
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all font-mono"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                <LayoutGrid size={12} /> Tournament Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['knockout', 'round-robin', 'groups'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
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
              Create Event
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
