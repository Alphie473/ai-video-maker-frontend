import React, { useState, useEffect } from 'react';
import { Film, Sparkles, Clock, Wand2, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Project, VideoTemplate } from '../types';
import { getMediaUrl } from '../utils/mediaUrl';

interface DashboardViewProps {
  onNavigate: (tab: string, projectId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [projData, tplData] = await Promise.all([
        api.getProjects(),
        api.getTemplates()
      ]);
      setRecentProjects(projData);
      setTemplates(tplData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDurationSeconds = recentProjects.reduce((acc, p) => acc + p.duration, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI VIDEO CREATION STUDIO</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Welcome to <span className="gradient-text">CineAI Studio</span>
          </h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Create cinema-grade videos from text ideas, stories, or scripts. Customize scenes, prompts, narration, music, and export high resolution MP4 files.
          </p>

          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-500/20 hover:scale-105 transition-all"
          >
            <Wand2 className="w-4 h-4" />
            Start New Video Project
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Total Videos Generated</p>
            <h3 className="text-3xl font-extrabold text-white">{recentProjects.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Film className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Total Generated Duration</p>
            <h3 className="text-3xl font-extrabold text-white">{(totalDurationSeconds / 60).toFixed(1)}m</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">AI Service Health</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-base font-bold text-emerald-300">Operational</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            Recent Projects
          </h2>

          <button
            onClick={() => onNavigate('projects')}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
          >
            View All Projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigate('editor', project.id)}
                className="glass-card p-4 rounded-2xl cursor-pointer group hover:border-purple-500/40 transition-all"
              >
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-3 relative border border-white/5">
                  {project.thumbnailUrl ? (
                    <img src={getMediaUrl(project.thumbnailUrl)} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Film className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 translate-x-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-white">
                    {project.duration.toFixed(1)}s
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm truncate mb-1">{project.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">{project.originalPrompt}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2">
                  <span className="capitalize text-purple-300">{project.style}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center text-slate-400">
            <p className="text-sm">No video projects yet. Click "Start New Video Project" to create your first AI video!</p>
          </div>
        )}
      </div>

    </div>
  );
};
