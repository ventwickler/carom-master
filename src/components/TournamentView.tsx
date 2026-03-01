import React, { useState } from 'react';
import { MOCK_MATCHES, MOCK_PLAYERS } from '../mockData';
import MatchDetailsModal from './MatchDetailsModal';
import TournamentForm from './TournamentForm';
import { Match, Tournament } from '../types';
import { MapPin, Calendar, Trophy } from 'lucide-react';

export default function TournamentView() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>({
    id: '1',
    name: 'Seoul World Cup 2024',
    location: 'Seoul, South Korea',
    type: 'knockout',
    startDate: '2024-05-01',
    endDate: '2024-05-07',
    players: MOCK_PLAYERS,
    matches: MOCK_MATCHES,
  });

  const getPlayer = (id: string) => MOCK_PLAYERS.find(p => p.id === id);
  const completedMatches = MOCK_MATCHES.filter(m => m.status === 'completed');

  const handleCreateTournament = (data: Partial<Tournament>) => {
    setCurrentTournament(data as Tournament);
    setIsFormOpen(false);
  };

  // Simplified bracket view
  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">
            {currentTournament?.name || 'Tournament Bracket'}
          </h2>
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
          onClick={() => setIsFormOpen(true)}
          className="bg-[#141414] text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center gap-2"
        >
          New Tournament
        </button>
      </header>

      <div className="flex gap-12 overflow-x-auto pb-8">
        {/* Round of 16 */}
        <div className="space-y-8 min-w-[280px]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Round of 16</h3>
          {completedMatches.slice(0, 4).map((match, i) => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            return (
              <div 
                key={match.id} 
                onClick={() => setSelectedMatch(match)}
                className="space-y-1 cursor-pointer group"
              >
                <div className={match.player1Score >= match.player2Score ? "bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center group-hover:border-[#141414] transition-all" : "bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center opacity-40 group-hover:border-[#141414] transition-all"}>
                  <span className="text-sm font-bold">{p1?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player1Score}</span>
                </div>
                <div className={match.player2Score >= match.player1Score ? "bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center group-hover:border-[#141414] transition-all" : "bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center opacity-40 group-hover:border-[#141414] transition-all"}>
                  <span className="text-sm font-bold">{p2?.name.split(' ').pop()}</span>
                  <span className="font-mono text-sm font-bold">{match.player2Score}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quarter Finals */}
        <div className="space-y-16 pt-12 min-w-[280px]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Quarter Finals</h3>
          {[1, 2].map(i => (
            <div key={i} className="space-y-1 relative">
              {/* Connector lines (simplified) */}
              <div className="absolute -left-6 top-1/2 w-6 h-px bg-[#141414]/20" />
              
              <div className="bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center">
                <span className="text-sm font-bold">Jaspers</span>
                <span className="font-mono text-sm font-bold">-</span>
              </div>
              <div className="bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center">
                <span className="text-sm font-bold">Zanetti</span>
                <span className="font-mono text-sm font-bold">-</span>
              </div>
            </div>
          ))}
        </div>

        {/* Semi Finals */}
        <div className="space-y-32 pt-24 min-w-[280px]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Semi Finals</h3>
          <div className="space-y-1 relative">
            <div className="absolute -left-6 top-1/2 w-6 h-px bg-[#141414]/20" />
            <div className="bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center">
              <span className="text-sm font-bold">TBD</span>
              <span className="font-mono text-sm font-bold">-</span>
            </div>
            <div className="bg-white border border-[#141414] p-4 rounded-xl flex justify-between items-center">
              <span className="text-sm font-bold">TBD</span>
              <span className="font-mono text-sm font-bold">-</span>
            </div>
          </div>
        </div>

        {/* Final */}
        <div className="space-y-64 pt-48 min-w-[280px]">
          <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 border-b border-[#141414]/10 pb-2">Grand Final</h3>
          <div className="bg-[#141414] text-white border border-[#141414] p-6 rounded-2xl flex justify-between items-center shadow-2xl scale-110">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold italic font-serif">CHAMPIONSHIP MATCH</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-sm font-bold">FINALIST A</span>
                  <span className="font-mono text-sm font-bold">0</span>
                </div>
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-sm font-bold">FINALIST B</span>
                  <span className="font-mono text-sm font-bold">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedMatch && (
        <MatchDetailsModal 
          match={selectedMatch}
          player1={getPlayer(selectedMatch.player1Id)!}
          player2={getPlayer(selectedMatch.player2Id)!}
          onClose={() => setSelectedMatch(null)}
        />
      )}

      {isFormOpen && (
        <TournamentForm 
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateTournament}
        />
      )}
    </div>
  );
}
