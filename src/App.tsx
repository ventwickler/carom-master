import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Scoreboard from './components/Scoreboard';
import PlayerList from './components/PlayerList';
import TournamentView from './components/TournamentView';
import MatchManagement from './components/MatchManagement';
import LoginModal from './components/LoginModal';
import { Match, Player, User, AppSettings } from './types';

const DEFAULT_SETTINGS: AppSettings = {
  targetPoints: 40,
  timeLimit: 40,
  equalizingInnings: true,
  inningsLimit: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScoreboardMatch, setActiveScoreboardMatch] = useState<{match: Match, p1: Player, p2: Player} | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedUser = localStorage.getItem('carom_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('carom_user');
      }
    }

    const savedSettings = localStorage.getItem('carom_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('carom_settings', JSON.stringify(updated));
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('carom_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('carom_user');
  };

  const handleOpenScoreboard = (match: Match, p1: Player, p2: Player) => {
    setActiveScoreboardMatch({ match, p1, p2 });
    setActiveTab('scoreboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'matches':
        return <MatchManagement onOpenScoreboard={handleOpenScoreboard} isLoggedIn={!!user} settings={settings} />;
      case 'scoreboard':
        if (activeScoreboardMatch) {
          return (
            <Scoreboard 
              match={activeScoreboardMatch.match} 
              player1={activeScoreboardMatch.p1} 
              player2={activeScoreboardMatch.p2} 
              onBack={() => setActiveTab('matches')} 
              isLoggedIn={!!user}
            />
          );
        }
        return <MatchManagement onOpenScoreboard={handleOpenScoreboard} isLoggedIn={!!user} settings={settings} />;
      case 'tournament':
        return <TournamentView isLoggedIn={!!user} settings={settings} />;
      case 'players':
        return <PlayerList isLoggedIn={!!user} settings={settings} />;
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
                    <input 
                      type="number" 
                      value={settings.targetPoints} 
                      onChange={(e) => handleUpdateSettings({ targetPoints: parseInt(e.target.value) || 0 })}
                      className="bg-[#E4E3E0] border-none rounded px-3 py-1 font-mono w-20" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Innings Limit (0 for none)</span>
                    <input 
                      type="number" 
                      value={settings.inningsLimit} 
                      onChange={(e) => handleUpdateSettings({ inningsLimit: parseInt(e.target.value) || 0 })}
                      className="bg-[#E4E3E0] border-none rounded px-3 py-1 font-mono w-20" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Limit (seconds)</span>
                    <input 
                      type="number" 
                      value={settings.timeLimit} 
                      onChange={(e) => handleUpdateSettings({ timeLimit: parseInt(e.target.value) || 0 })}
                      className="bg-[#E4E3E0] border-none rounded px-3 py-1 font-mono w-20" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Equalizing Innings</span>
                    <input 
                      type="checkbox" 
                      checked={settings.equalizingInnings} 
                      onChange={(e) => handleUpdateSettings({ equalizingInnings: e.target.checked })}
                      className="accent-[#141414] w-5 h-5" 
                    />
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
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto bg-[#E4E3E0]">
        {renderContent()}
      </main>
      {isLoginModalOpen && (
        <LoginModal 
          onLogin={handleLogin} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </div>
  );
}
