import React from 'react';
import { Video, Film, LayoutDashboard, Sparkles, Sliders } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeProjectTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, activeProjectTitle }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Video', icon: Sparkles },
    { id: 'editor', label: 'Video Editor', icon: Film, requiresProject: true },
    { id: 'projects', label: 'My Projects', icon: Film },
    { id: 'templates', label: 'Templates', icon: Video },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('create')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d1117] rounded-[11px] flex items-center justify-center">
              <Film className="w-5 h-5 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">Cine<span className="gradient-text">AI</span></span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">STUDIO PRO</span>
            </div>
            {activeProjectTitle && activeTab === 'editor' && (
              <p className="text-xs text-slate-400 truncate max-w-[200px]">
                Editing: <span className="text-slate-200 font-medium">{activeProjectTitle}</span>
              </p>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-800/80 p-1.5 rounded-2xl border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>New Video</span>
          </button>
        </div>

      </div>
    </header>
  );
};
