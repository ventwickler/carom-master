import React, { useState, useEffect } from 'react';
import { User, Globe, Trophy, X, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { Player } from '../types';

interface PlayerFormProps {
  player?: Player;
  onClose: () => void;
  onSubmit: (data: Partial<Player>) => void;
}

const DEFAULT_PLAYER_DATA: Partial<Player> = {
  name: '',
  country: '',
  ranking: undefined,
};

export default function PlayerForm({ player, onClose, onSubmit }: PlayerFormProps) {
  const [formData, setFormData] = useState<Partial<Player>>(DEFAULT_PLAYER_DATA);

  useEffect(() => {
    if (player) {
      setFormData(player);
    } else {
      setFormData(DEFAULT_PLAYER_DATA);
    }
  }, [player]);

  const handleCancel = () => {
    setFormData(DEFAULT_PLAYER_DATA);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#E4E3E0] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-[#141414]"
      >
        <div className="bg-[#141414] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase italic font-serif">
              {player ? 'Update Player' : 'Register Player'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">
              {player ? 'Modify athlete profile' : 'Add new athlete to roster'}
            </p>
          </div>
          <button 
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-[#141414]">
          {/* Avatar Placeholder */}
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white border-2 border-[#141414] flex items-center justify-center overflow-hidden">
                <User size={48} className="opacity-20" />
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-[#141414] text-white rounded-full flex items-center justify-center border-2 border-[#E4E3E0] hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Player Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                <input
                  required
                  type="text"
                  placeholder="e.g. Dick Jaspers"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Country</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                <input
                  required
                  type="text"
                  placeholder="e.g. Netherlands"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            {/* Ranking */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">World Ranking</label>
              <div className="relative">
                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                <input
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full bg-white border border-[#141414]/10 rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all"
                  value={formData.ranking || ''}
                  onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) || undefined })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border border-[#141414] font-bold uppercase tracking-widest text-[10px] hover:bg-[#141414] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#141414] text-white font-bold uppercase tracking-widest text-[10px] hover:bg-[#2A2A2A] transition-all shadow-lg"
            >
              {player ? 'Save Changes' : 'Add Player'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
