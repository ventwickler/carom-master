import React, { useState } from 'react';
import { MOCK_PLAYERS } from '../mockData';
import { Trophy, Award, Target, Globe, Plus, Edit2, Search, ArrowUpDown, BarChart3, ClipboardList, Activity, Clock, CheckCircle2, Download } from 'lucide-react';
import PlayerForm from './PlayerForm';
import PlayerStatsModal from './PlayerStatsModal';
import MatchRecordForm from './MatchRecordForm';
import { Player, Match } from '../types';
import { MOCK_MATCHES } from '../mockData';
import { cn } from '../lib/utils';

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);
  const [statsPlayer, setStatsPlayer] = useState<Player | undefined>(undefined);
  const [recordingPlayer, setRecordingPlayer] = useState<Player | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'ranking'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedPlayers = [...players].sort((a, b) => {
    if (sortKey === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else {
      const rankA = a.ranking ?? Infinity;
      const rankB = b.ranking ?? Infinity;
      return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
    }
  });

  const filteredPlayers = sortedPlayers.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate Tournament Stats
  const totalMatches = matches.length;
  const totalPoints = matches.reduce((acc, match) => acc + match.player1Score + match.player2Score, 0);
  const avgScore = totalMatches > 0 ? (totalPoints / (totalMatches * 2)).toFixed(1) : '0';
  const tournamentsCount = 12; // Mock value for tournaments organized

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown';

  const handleAddPlayer = () => {
    setEditingPlayer(undefined);
    setIsFormOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Partial<Player>) => {
    if (editingPlayer) {
      // Update existing player
      setPlayers(players.map(p => p.id === editingPlayer.id ? { ...p, ...data } as Player : p));
    } else {
      // Create new player
      const newPlayer: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || 'Unknown',
        country: data.country || 'Unknown',
        ranking: data.ranking,
      };
      setPlayers([...players, newPlayer]);
    }
    setIsFormOpen(false);
  };

  const handleMatchSubmit = (match: Match) => {
    setMatches([...matches, match]);
    setRecordingPlayer(undefined);
    // In a real app, we might recalculate player stats here
  };

  const exportToCSV = (type: 'players' | 'matches') => {
    let csvContent = "";
    let fileName = "";

    if (type === 'players') {
      const headers = ["ID", "Name", "Country", "Ranking"];
      const rows = players.map(p => [p.id, p.name, p.country, p.ranking || 'N/A']);
      csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      fileName = "tournament_players.csv";
    } else {
      const headers = ["ID", "Player 1", "Player 2", "Score 1", "Score 2", "Innings", "Status", "Table"];
      const rows = matches.map(m => [
        m.id, 
        getPlayerName(m.player1Id), 
        getPlayerName(m.player2Id), 
        m.player1Score, 
        m.player2Score, 
        m.innings, 
        m.status, 
        m.tableNumber
      ]);
      csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      fileName = "tournament_matches.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">Participants</h2>
          <p className="text-xs tracking-widest opacity-50 uppercase mt-1">World Class Field • {filteredPlayers.length} Players</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-[#141414]/10 rounded-2xl px-4 py-2">
            <ArrowUpDown size={16} className="opacity-40" />
            <select 
              value={`${sortKey}-${sortOrder}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split('-') as [any, any];
                setSortKey(key);
                setSortOrder(order);
              }}
              className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest cursor-pointer"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="ranking-asc">Rank Low-High</option>
              <option value="ranking-desc">Rank High-Low</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input
              type="text"
              placeholder="Search players..."
              className="bg-white border border-[#141414]/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#141414] outline-none transition-all text-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddPlayer}
            className="bg-[#141414] text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add Player
          </button>
          <div className="flex items-center gap-2 bg-white border border-[#141414]/10 rounded-2xl px-2 py-1">
            <button
              onClick={() => exportToCSV('players')}
              title="Export Players"
              className="p-2 hover:bg-[#141414]/5 rounded-xl transition-colors text-[#141414]/60 hover:text-[#141414]"
            >
              <Download size={18} />
            </button>
            <div className="w-px h-4 bg-[#141414]/10" />
            <button
              onClick={() => exportToCSV('matches')}
              title="Export Matches"
              className="p-2 hover:bg-[#141414]/5 rounded-xl transition-colors text-[#141414]/60 hover:text-[#141414]"
            >
              <Activity size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Tournament Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#141414] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#141414] text-white rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Total Matches</p>
            <p className="text-2xl font-mono font-bold">{totalMatches}</p>
          </div>
        </div>
        <div className="bg-white border border-[#141414] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#141414] text-white rounded-xl flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Avg Score / Player</p>
            <p className="text-2xl font-mono font-bold">{avgScore}</p>
          </div>
        </div>
        <div className="bg-white border border-[#141414] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#141414] text-white rounded-xl flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Tournaments Organized</p>
            <p className="text-2xl font-mono font-bold">{tournamentsCount}</p>
          </div>
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className="bg-white border border-[#141414] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="opacity-40" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Recent Match Results</h3>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Showing last 5 matches</p>
        </div>
        <div className="space-y-3">
          {matches.slice(-5).reverse().map((match) => (
            <div key={match.id} className="flex items-center justify-between p-4 bg-[#E4E3E0]/30 rounded-xl border border-[#141414]/5 hover:border-[#141414]/20 transition-all">
              <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="font-bold text-sm">{getPlayerName(match.player1Id)}</span>
                  <span className="font-mono text-xs opacity-40">vs</span>
                  <span className="font-bold text-sm">{getPlayerName(match.player2Id)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#141414] text-white px-3 py-1 rounded-lg font-mono font-bold text-sm">
                    {match.player1Score} - {match.player2Score}
                  </div>
                  <span className="text-[10px] font-mono opacity-40 uppercase">{match.innings} INN</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Table</p>
                  <p className="font-mono font-bold text-xs">{match.tableNumber}</p>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  match.status === 'live' ? "bg-red-100 text-red-600 animate-pulse" :
                  match.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  {match.status === 'live' && <Activity size={10} />}
                  {match.status === 'completed' && <CheckCircle2 size={10} />}
                  {match.status === 'upcoming' && <Clock size={10} />}
                  {match.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="bg-white border border-[#141414] rounded-2xl p-6 space-y-4 relative overflow-hidden group hover:bg-[#141414] hover:text-white transition-all duration-300">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
              <Globe size={120} />
            </div>
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-[#141414] text-white group-hover:bg-white group-hover:text-[#141414] rounded-xl flex items-center justify-center font-bold transition-colors">
                {player.country.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditPlayer(player)}
                  className="p-2 rounded-lg bg-[#141414]/5 group-hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Edit2 size={14} />
                </button>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Rank</p>
                  <p className="font-mono font-bold">#{player.ranking || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight leading-tight">{player.name}</h3>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{player.country}</p>
            </div>

            <div className="pt-4 border-t border-[#141414]/10 group-hover:border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-40">Avg</p>
                <p className="font-mono font-bold text-sm">2.145</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-40">High</p>
                <p className="font-mono font-bold text-sm">18</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStatsPlayer(player)}
                className="flex-1 py-3 rounded-xl border border-[#141414] group-hover:border-white/20 group-hover:bg-white/10 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <BarChart3 size={14} />
                Stats
              </button>
              <button
                onClick={() => setRecordingPlayer(player)}
                className="flex-1 py-3 rounded-xl bg-[#141414] text-white group-hover:bg-white group-hover:text-[#141414] flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <ClipboardList size={14} />
                Record
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <PlayerForm 
          player={editingPlayer}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {statsPlayer && (
        <PlayerStatsModal 
          player={statsPlayer}
          onClose={() => setStatsPlayer(undefined)}
        />
      )}

      {recordingPlayer && (
        <MatchRecordForm
          player={recordingPlayer}
          allPlayers={players}
          onClose={() => setRecordingPlayer(undefined)}
          onSubmit={handleMatchSubmit}
        />
      )}
    </div>
  );
}
