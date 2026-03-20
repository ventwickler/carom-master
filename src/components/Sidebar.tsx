import React from 'react';
import { LayoutDashboard, Trophy, Users, Settings, PlayCircle, LogIn, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'matches', label: 'Matches', icon: PlayCircle },
  { id: 'tournament', label: 'Tournament', icon: Trophy },
  { id: 'players', label: 'Players', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLoginClick, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-[#141414] text-[#E4E3E0] h-screen flex flex-col border-r border-[#2A2A2A]">
      <div className="p-6 border-bottom border-[#2A2A2A]">
        <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          CAROM MASTER
        </h1>
        <p className="text-[10px] uppercase tracking-widest opacity-40 mt-1">Professional Series</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              (activeTab === item.id || (activeTab === 'scoreboard' && item.id === 'matches'))
                ? "bg-[#E4E3E0] text-[#141414]" 
                : "hover:bg-[#2A2A2A] text-[#888]"
            )}
          >
            <item.icon size={18} className={cn(
              "transition-colors",
              (activeTab === item.id || (activeTab === 'scoreboard' && item.id === 'matches')) ? "text-[#141414]" : "group-hover:text-[#E4E3E0]"
            )} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[#2A2A2A]">
        {user ? (
          <div className="flex items-center justify-between gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-500 font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[10px] opacity-40 truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-1 hover:bg-[#2A2A2A] rounded-lg transition-colors text-[#888] hover:text-[#E4E3E0]"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-500 text-[#141414] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors"
          >
            <LogIn size={16} />
            Login to Edit
          </button>
        )}
      </div>
    </div>
  );
}
