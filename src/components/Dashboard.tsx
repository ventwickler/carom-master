import React, { useState } from 'react';
import { Match, Player } from '../types';
import { MOCK_MATCHES, MOCK_PLAYERS } from '../mockData';
import { Play, CheckCircle2, Clock, ChevronRight, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import MatchDetailsModal from './MatchDetailsModal';

export default function Dashboard() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const liveMatches = MOCK_MATCHES.filter(m => m.status === 'live');
  const upcomingMatches = MOCK_MATCHES.filter(m => m.status === 'upcoming');
  const completedMatches = MOCK_MATCHES.filter(m => m.status === 'completed');

  const getPlayer = (id: number) => MOCK_PLAYERS.find(p => p.id === id);

  return (
    <div className="p-8 space-y-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">Tournament Overview</h2>
          <p className="text-xs tracking-widest opacity-50 uppercase mt-1">Live from Seoul, Korea • May 2024</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-50">Total Players</p>
            <p className="text-2xl font-mono font-bold">{MOCK_PLAYERS.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-50">Matches Played</p>
            <p className="text-2xl font-mono font-bold">{completedMatches.length}/{MOCK_MATCHES.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Live Matches */}
        <div className="col-span-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Live Now</h3>
          </div>
          
          {liveMatches.map(match => {
            const p1 = getPlayer(match.player1Id);
            const p2 = getPlayer(match.player2Id);
            return (
              <div key={match.id} className="bg-white border border-[#141414] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="p-6 grid grid-cols-7 items-center gap-4">
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="text-right flex-1">
                      <p className="font-bold text-lg">{p1?.name}</p>
                      <p className="text-xs opacity-50">{p1?.country}</p>
                    </div>
                    <div className="w-12 h-12 bg-[#141414] text-white flex items-center justify-center font-mono text-xl font-bold rounded-lg">
                      {match.player1Score}
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <p className="text-[10px] font-mono opacity-30">INN {match.innings}</p>
                    <div className="w-px h-8 bg-[#141414]/10 mx-auto my-1" />
                    <p className="text-[10px] font-mono opacity-30">TGT {match.targetPoints}</p>
                  </div>

                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#141414] text-white flex items-center justify-center font-mono text-xl font-bold rounded-lg">
                      {match.player2Score}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg">{p2?.name}</p>
                      <p className="text-xs opacity-50">{p2?.country}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#141414] text-white px-6 py-2 flex justify-between items-center text-[10px] uppercase tracking-widest">
                  <span>Table {match.tableNumber} • Round of 16</span>
                  <span className="flex items-center gap-1">View Match <ChevronRight size={12} /></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Stats */}
        <div className="col-span-4 space-y-8">
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">Recent Results</h3>
            <div className="space-y-3">
              {completedMatches.slice(0, 3).map(match => {
                const p1 = getPlayer(match.player1Id);
                const p2 = getPlayer(match.player2Id);
                return (
                  <div 
                    key={match.id} 
                    onClick={() => setSelectedMatch(match)}
                    className="bg-white border border-[#141414]/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#141414] transition-all cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold">{p1?.name.split(' ').pop()} {match.player1Score} - {match.player2Score} {p2?.name.split(' ').pop()}</p>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      </div>
                      <p className="text-[10px] opacity-40 uppercase tracking-widest">Table {match.tableNumber} • {match.innings} INN</p>
                    </div>
                    <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">Top Performers</h3>
            <div className="space-y-3">
              {MOCK_PLAYERS.slice(0, 4).map((player, i) => (
                <div key={player.id} className="bg-white/50 border border-[#141414]/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs opacity-30">0{i+1}</span>
                    <p className="font-bold text-sm">{player.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-40 uppercase">AVG</p>
                    <p className="font-mono font-bold text-sm">2.105</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">Upcoming</h3>
            <div className="space-y-3">
              {upcomingMatches.map(match => {
                const p1 = getPlayer(match.player1Id);
                const p2 = getPlayer(match.player2Id);
                return (
                  <div key={match.id} className="bg-white border border-[#141414]/10 p-4 rounded-xl flex items-center justify-between group hover:border-[#141414] transition-colors">
                    <div className="flex-1">
                      <p className="text-xs font-bold">{p1?.name.split(' ').pop()} vs {p2?.name.split(' ').pop()}</p>
                      <p className="text-[10px] opacity-40">Table {match.tableNumber} • 14:00</p>
                    </div>
                    <Clock size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
          </section>
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
    </div>
  );
}
