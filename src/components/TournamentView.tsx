import React, { useState, useEffect } from 'react';
import MatchDetailsModal from './MatchDetailsModal';
import TournamentForm from './TournamentForm';
import MatchRecordForm from './MatchRecordForm';
import { Match, Tournament, Player } from '../types';
import { MapPin, Calendar, Trophy, Edit2, ChevronLeft, ChevronRight, Play, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { apiService } from '../services/apiService';

export default function TournamentView() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeRound, setActiveRound] = useState(0);
  const [hoveredPlayerId, setHoveredPlayerId] = useState<number | null>(null);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tournaments, players] = await Promise.all([
          apiService.getTournaments(),
          apiService.getPlayers()
        ]);
        if (tournaments.length > 0) {
          setCurrentTournament(tournaments[0]);
        }
        setAllPlayers(players);
      } catch (error) {
        console.error('Failed to fetch tournament data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const rounds = ['Round of 16', 'Quarter Finals', 'Semi Finals', 'Grand Final'];

  const getPlayer = (id: number) => allPlayers.find(p => p.id === id);
  const completedMatches = currentTournament?.matches.filter(m => m.status === 'completed') || [];

  const handleTournamentSubmit = async (data: Partial<Tournament>) => {
    try {
      if (editingTournament) {
        const updated = await apiService.updateTournament(data as Tournament);
        if (currentTournament?.id === updated.id) {
          setCurrentTournament(updated);
        }
      } else {
        const created = await apiService.createTournament(data as Tournament);
        setCurrentTournament(created);
      }
      setIsFormOpen(false);
      setEditingTournament(null);
    } catch (error) {
      console.error('Failed to save tournament:', error);
    }
  };

  const handleMatchUpdate = async (match: Match) => {
    try {
      const updated = await apiService.updateMatch(match);
      if (currentTournament) {
        setCurrentTournament({
          ...currentTournament,
          matches: currentTournament.matches.map(m => m.id === match.id ? updated : m)
        });
      }
      setEditingMatch(undefined);
      setSelectedMatch(null);
    } catch (error) {
      console.error('Failed to update match:', error);
    }
  };

  const handleEditTournament = () => {
    setEditingTournament(currentTournament);
    setIsFormOpen(true);
  };

  const handleNewTournament = () => {
    setEditingTournament(null);
    setIsFormOpen(true);
  };

  // Simplified bracket view
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E4E3E0]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="animate-pulse text-[#141414]" size={48} />
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Loading Tournament...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">
              {currentTournament?.name || 'Tournament Bracket'}
            </h2>
            <button 
              onClick={handleEditTournament}
              className="p-2 rounded-lg bg-[#141414]/5 hover:bg-[#141414]/10 transition-colors"
              title="Edit Tournament"
            >
              <Edit2 size={16} className="opacity-40" />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-xs tracking-widest opacity-50 uppercase">
              {currentTournament?.type.replace('-', ' ')} Phase • Final 16
            </p>
            {currentTournament?.location && (
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest opacity-30 font-bold">
                <MapPin size={10} /> {currentTournament.location}
              </div>
            )}
            {currentTournament?.startDate && (
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest opacity-30 font-bold">
                <Calendar size={10} /> {new Date(currentTournament.startDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleNewTournament}
          className="bg-[#141414] text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center gap-2"
        >
          New Tournament
        </button>
      </header>

      {/* Round Navigation (Mobile/Compact) */}
      <div className="flex lg:hidden items-center justify-between bg-white border border-[#141414]/10 p-4 rounded-2xl">
        <button 
          onClick={() => setActiveRound(Math.max(0, activeRound - 1))}
          disabled={activeRound === 0}
          className="p-2 disabled:opacity-20"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Current Round</p>
          <p className="text-sm font-bold uppercase">{rounds[activeRound]}</p>
        </div>
        <button 
          onClick={() => setActiveRound(Math.min(rounds.length - 1, activeRound + 1))}
          disabled={activeRound === rounds.length - 1}
          className="p-2 disabled:opacity-20"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex gap-12 overflow-x-auto pb-8 scrollbar-hide">
        {/* Round of 16 */}
        <div className={cn(
          "space-y-8 min-w-[280px] transition-all duration-300",
          activeRound !== 0 && "hidden lg:block"
        )}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Round of 16</h3>
          {completedMatches.slice(0, 4).map((match, i) => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            const isP1Winner = match.player1Score >= match.player2Score;
            const isP2Winner = match.player2Score >= match.player1Score;

            return (
              <div 
                key={match.id} 
                onClick={() => setSelectedMatch(match)}
                className="space-y-1 cursor-pointer group relative"
              >
                <div 
                  onMouseEnter={() => setHoveredPlayerId(p1?.id || null)}
                  onMouseLeave={() => setHoveredPlayerId(null)}
                  className={cn(
                    "p-4 rounded-xl flex justify-between items-center transition-all border",
                    isP1Winner ? "bg-white border-[#141414]" : "bg-white border-[#141414]/10 opacity-40",
                    hoveredPlayerId === p1?.id && "ring-2 ring-emerald-500 border-emerald-500 opacity-100"
                  )}
                >
                  <span className="text-sm font-bold">{p1?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player1Score}</span>
                </div>
                <div 
                  onMouseEnter={() => setHoveredPlayerId(p2?.id || null)}
                  onMouseLeave={() => setHoveredPlayerId(null)}
                  className={cn(
                    "p-4 rounded-xl flex justify-between items-center transition-all border",
                    isP2Winner ? "bg-white border-[#141414]" : "bg-white border-[#141414]/10 opacity-40",
                    hoveredPlayerId === p2?.id && "ring-2 ring-emerald-500 border-emerald-500 opacity-100"
                  )}
                >
                  <span className="text-sm font-bold">{p2?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player2Score}</span>
                </div>
                
                {/* Connector to next round */}
                <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-px bg-[#141414]/20" />
              </div>
            );
          })}
        </div>

        {/* Quarter Finals */}
        <div className={cn(
          "space-y-16 pt-12 min-w-[280px] transition-all duration-300",
          activeRound !== 1 && "hidden lg:block"
        )}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Quarter Finals</h3>
          {completedMatches.slice(4, 6).map((match, i) => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            return (
              <div key={match.id} onClick={() => setSelectedMatch(match)} className="space-y-1 relative group cursor-pointer">
                {/* Connector lines */}
                <div className="hidden lg:block absolute -left-6 top-1/2 w-6 h-px bg-[#141414]/20" />
                
                <div className={cn(
                  "bg-white border p-4 rounded-xl flex justify-between items-center transition-all",
                  match.status === 'live' ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-[#141414]"
                )}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p1?.name.split(' ').pop()}</span>
                    {match.status === 'live' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                  </div>
                  <span className="font-mono text-sm font-bold">{match.player1Score}</span>
                </div>
                <div className="bg-white border border-[#141414]/10 p-4 rounded-xl flex justify-between items-center opacity-40 group-hover:opacity-100 transition-all">
                  <span className="text-sm font-bold">{p2?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player2Score}</span>
                </div>

                {/* Connector to next round */}
                <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-px bg-[#141414]/20" />
              </div>
            );
          })}
        </div>

        {/* Semi Finals */}
        <div className={cn(
          "space-y-32 pt-24 min-w-[280px] transition-all duration-300",
          activeRound !== 2 && "hidden lg:block"
        )}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Semi Finals</h3>
          {completedMatches.slice(6, 7).map((match, i) => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            return (
              <div key={match.id} onClick={() => setSelectedMatch(match)} className="space-y-1 relative group cursor-pointer">
                <div className="hidden lg:block absolute -left-6 top-1/2 w-6 h-px bg-[#141414]/20" />
                <div className="bg-white border border-[#141414]/10 p-4 rounded-xl flex justify-between items-center opacity-40 group-hover:opacity-100 transition-all">
                  <span className="text-sm font-bold">{p1?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player1Score}</span>
                </div>
                <div className="bg-white border border-[#141414]/10 p-4 rounded-xl flex justify-between items-center opacity-40 group-hover:opacity-100 transition-all">
                  <span className="text-sm font-bold">{p2?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player2Score}</span>
                </div>
                {/* Connector to next round */}
                <div className="hidden lg:block absolute -right-6 top-1/2 w-6 h-px bg-[#141414]/20" />
              </div>
            );
          })}
        </div>

        {/* Final */}
        <div className={cn(
          "space-y-64 pt-48 min-w-[280px] transition-all duration-300",
          activeRound !== 3 && "hidden lg:block"
        )}>
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Grand Final</h3>
          {completedMatches.slice(7, 8).map((match, i) => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            return (
              <div key={match.id} onClick={() => setSelectedMatch(match)} className="bg-[#141414] text-white border border-[#141414] p-6 rounded-2xl flex justify-between items-center shadow-2xl scale-110 relative group cursor-pointer">
                <div className="hidden lg:block absolute -left-6 top-1/2 w-6 h-px bg-white/20" />
                <div className="space-y-4 w-full">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold italic font-serif flex items-center gap-2">
                      <Trophy size={18} className="text-amber-400" />
                      CHAMPIONSHIP
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-all">
                      <span className="text-sm font-bold">{p1?.name.split(' ').pop()}</span>
                      <span className="font-mono text-sm font-bold">{match.player1Score}</span>
                    </div>
                    <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-all">
                      <span className="text-sm font-bold">{p2?.name.split(' ').pop()}</span>
                      <span className="font-mono text-sm font-bold">{match.player2Score}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMatch && (
        <MatchDetailsModal 
          match={selectedMatch}
          player1={getPlayer(selectedMatch.player1Id)!}
          player2={getPlayer(selectedMatch.player2Id)!}
          onClose={() => setSelectedMatch(null)}
          onEdit={(match) => setEditingMatch(match)}
        />
      )}

      {editingMatch && (
        <MatchRecordForm
          match={editingMatch}
          allPlayers={allPlayers}
          onClose={() => setEditingMatch(undefined)}
          onSubmit={handleMatchUpdate}
        />
      )}

      {isFormOpen && (
        <TournamentForm 
          tournament={editingTournament}
          availablePlayers={allPlayers}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTournament(null);
          }}
          onSubmit={handleTournamentSubmit}
        />
      )}
    </div>
  );
}
