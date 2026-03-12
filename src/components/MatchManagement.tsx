import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Match, Tournament, Player } from '../types';
import { Trophy, Calendar, MapPin, Play, CheckCircle, Clock, Search, Filter, Plus, Edit2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MatchRecordForm from './MatchRecordForm';
import { cn } from '../lib/utils';

interface MatchManagementProps {
  onOpenScoreboard?: (match: Match, p1: Player, p2: Player) => void;
}

export default function MatchManagement({ onOpenScoreboard }: MatchManagementProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | 'all'>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [tData, pData, mData] = await Promise.all([
        apiService.getTournaments(),
        apiService.getPlayers(),
        apiService.getMatches()
      ]);
      setTournaments(tData);
      setPlayers(pData);
      setMatches(mData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPlayer = (id: number) => players.find(p => p.id === id);
  const getTournament = (id?: number) => tournaments.find(t => t.id === id);

  const filteredMatches = matches.filter(m => {
    const tournamentMatch = selectedTournamentId === 'all' || m.tournamentId === selectedTournamentId;
    const statusMatch = statusFilter === 'all' || m.status === statusFilter;
    
    const p1 = getPlayer(m.player1Id);
    const p2 = getPlayer(m.player2Id);
    const t = getTournament(m.tournamentId);
    
    const searchStr = `${p1?.name} ${p2?.name} ${t?.name}`.toLowerCase();
    const searchMatch = searchStr.includes(searchTerm.toLowerCase());
    
    return tournamentMatch && statusMatch && searchMatch;
  });

  const handleMatchSubmit = async (match: Match) => {
    try {
      if (match.id) {
        await apiService.updateMatch(match);
      } else {
        await apiService.recordMatch(match);
      }
      await fetchData();
      setIsFormOpen(false);
      setEditingMatch(undefined);
    } catch (error) {
      console.error('Failed to save match:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play size={14} className="text-emerald-500 animate-pulse" />;
      case 'completed': return <CheckCircle size={14} className="text-blue-500" />;
      default: return <Clock size={14} className="text-amber-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#E4E3E0]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#141414] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Loading Matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">Match Management</h2>
          <p className="text-xs tracking-widest opacity-50 uppercase mt-1">Organize and track tournament pairings</p>
        </div>
        <button
          onClick={() => {
            setEditingMatch(undefined);
            setIsFormOpen(true);
          }}
          className="bg-[#141414] text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center gap-2"
        >
          <Plus size={16} /> New Match
        </button>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/50 p-4 rounded-2xl border border-[#141414]/5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
          <input 
            type="text"
            placeholder="Search players or tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#141414]/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#141414] transition-colors"
          />
        </div>
        
        <select 
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-white border border-[#141414]/10 rounded-xl py-3 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#141414] transition-colors appearance-none cursor-pointer"
        >
          <option value="all">All Tournaments</option>
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white border border-[#141414]/10 rounded-xl py-3 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#141414] transition-colors appearance-none cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Match List */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            const tournament = getTournament(match.tournamentId);

            return (
              <motion.div
                layout
                key={match.id}
                className="bg-white border border-[#141414]/10 rounded-2xl overflow-hidden hover:border-[#141414] transition-all group"
              >
                <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Match Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      match.status === 'live' ? "bg-emerald-500/10 text-emerald-500" :
                      match.status === 'completed' ? "bg-blue-500/10 text-blue-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {getStatusIcon(match.status)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {tournament?.name || 'Exhibition Match'}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <MapPin size={12} className="opacity-30" /> Table {match.tableNumber}
                      </div>
                    </div>
                  </div>

                  {/* Players & Score */}
                  <div className="flex-1 flex items-center justify-center gap-8">
                    <div className="text-right flex-1">
                      <p className="font-bold text-lg">{p1?.name}</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-40">{p1?.country}</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "text-3xl font-black font-mono",
                          match.status === 'upcoming' ? "opacity-20" : ""
                        )}>
                          {match.player1Score}
                        </span>
                        <span className="text-xs font-bold opacity-20">VS</span>
                        <span className={cn(
                          "text-3xl font-black font-mono",
                          match.status === 'upcoming' ? "opacity-20" : ""
                        )}>
                          {match.player2Score}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {match.innings} Innings
                      </div>
                    </div>

                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">{p2?.name}</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-40">{p2?.country}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingMatch(match);
                        setIsFormOpen(true);
                      }}
                      className="p-3 rounded-xl border border-[#141414]/10 hover:border-[#141414] hover:bg-[#141414] hover:text-white transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    {match.status !== 'completed' && (
                      <button 
                        onClick={() => {
                          if (match.status === 'upcoming') {
                            const updatedMatch = { ...match, status: 'live' as const };
                            handleMatchSubmit(updatedMatch);
                            if (onOpenScoreboard && p1 && p2) {
                              onOpenScoreboard(updatedMatch, p1, p2);
                            }
                          } else {
                            if (onOpenScoreboard && p1 && p2) {
                              onOpenScoreboard(match, p1, p2);
                            }
                          }
                        }}
                        className="bg-[#141414] text-white px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#2A2A2A] transition-all"
                      >
                        {match.status === 'upcoming' ? 'Start Match' : 'Open Scoreboard'}
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-[#141414]/10 rounded-3xl bg-white/30">
            <p className="text-sm opacity-40 uppercase tracking-widest font-bold">No matches found matching your criteria</p>
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); setSelectedTournamentId('all'); }}
              className="mt-4 text-xs font-bold uppercase tracking-widest underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {isFormOpen && (
        <MatchRecordForm 
          match={editingMatch}
          allPlayers={players}
          allTournaments={tournaments}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMatch(undefined);
          }}
          onSubmit={handleMatchSubmit}
        />
      )}
    </div>
  );
}
