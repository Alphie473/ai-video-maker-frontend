import React, { useState, useEffect } from 'react';
import { Search, Trash2, Film, Play, ExternalLink, Download } from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';
import { getMediaUrl } from '../utils/mediaUrl';

interface ProjectsViewProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.originalPrompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Film className="w-8 h-8 text-purple-400" />
            My Video Projects
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and edit your saved AI generated videos</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="glass-card p-4 rounded-2xl cursor-pointer group hover:border-purple-500/50 transition-all flex flex-col justify-between"
            >
              <div>
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

                <h3 className="font-bold text-white text-base truncate mb-1">{project.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{project.originalPrompt}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  {project.style}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 border border-white/10">
          <Film className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <h3 className="text-lg font-bold text-white mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-400">Create a video project to see it saved here.</p>
        </div>
      )}

    </div>
  );
};
