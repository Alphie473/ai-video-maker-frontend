import React, { useState, useEffect } from 'react';
import { Video, Wand2, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { VideoTemplate } from '../types';

interface TemplatesViewProps {
  onUseTemplate: (prompt: string, style: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onUseTemplate }) => {
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CURATED PROMPT TEMPLATES</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2">Video Prompt Library</h1>
        <p className="text-slate-400 text-sm">Launch instant video generation using pre-tuned cinematic prompt templates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between group hover:border-purple-500/50 transition-all">
            <div>
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 relative border border-white/5">
                <img src={tpl.thumbnailUrl} alt={tpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  {tpl.category}
                </span>

                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white">
                  {tpl.duration}
                </span>
              </div>

              <h3 className="font-extrabold text-white text-lg mb-1">{tpl.title}</h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{tpl.description}</p>
            </div>

            <button
              onClick={() => onUseTemplate(tpl.prompt, tpl.style)}
              className="w-full py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <Wand2 className="w-4 h-4" />
              Use This Template
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
