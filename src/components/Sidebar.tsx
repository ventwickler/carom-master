import React from 'react';
import { LayoutDashboard, Trophy, Users, Settings, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'matches', label: 'Live Matches', icon: PlayCircle },
  { id: 'tournament', label: 'Tournament', icon: Trophy },
  { id: 'players', label: 'Players', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
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
              activeTab === item.id 
                ? "bg-[#E4E3E0] text-[#141414]" 
                : "hover:bg-[#2A2A2A] text-[#888]"
            )}
          >
            <item.icon size={18} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-[#141414]" : "group-hover:text-[#E4E3E0]"
            )} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
            JD
          </div>
          <div>
            <p className="text-xs font-bold">John Doe</p>
            <p className="text-[10px] opacity-40">Tournament Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
