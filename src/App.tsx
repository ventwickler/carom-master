import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Scoreboard from './components/Scoreboard';
import PlayerList from './components/PlayerList';
import TournamentView from './components/TournamentView';
import MatchManagement from './components/MatchManagement';
import { MOCK_MATCHES, MOCK_PLAYERS } from './mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'matches':
        return <MatchManagement />;
      case 'tournament':
        return <TournamentView />;
      case 'players':
        return <PlayerList />;
      case 'settings':
        return (
          <div className="p-8 bg-[#E4E3E0] min-h-screen text-[#141414]">
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">Settings</h2>
            <div className="mt-8 max-w-2xl space-y-6">
              <div className="bg-white border border-[#141414] p-6 rounded-2xl">
                <h3 className="font-bold mb-4">Match Rules</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Target Points</span>
                    <input type="number" defaultValue={40} className="bg-[#E4E3E0] border-none rounded px-3 py-1 font-mono w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Limit (seconds)</span>
                    <input type="number" defaultValue={40} className="bg-[#E4E3E0] border-none rounded px-3 py-1 font-mono w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Equalizing Innings</span>
                    <input type="checkbox" defaultChecked className="accent-[#141414]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto bg-[#E4E3E0]">
        {renderContent()}
      </main>
    </div>
  );
}
