import React, { useState, useRef } from 'react';
import { Sparkles, Upload, FileText, Wand2, Film, Music, Mic, Layers, CheckCircle2, Loader2, Play } from 'lucide-react';
import { api } from '../services/api';
import { GenerationProgress } from '../types';
import { formatError } from '../utils/formatError';

interface CreateVideoViewProps {
  onVideoCreated: (projectId: string) => void;
}

export const CreateVideoView: React.FC<CreateVideoViewProps> = ({ onVideoCreated }) => {
  const [prompt, setPrompt] = useState('Create a 2-minute cinematic video about a young man discovering an abandoned city.');
  const [scriptText, setScriptText] = useState('');
  const [scriptFileName, setScriptFileName] = useState<string | null>(null);
  const [style, setStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [voiceId, setVoiceId] = useState('adam-deep');
  const [musicTrack, setMusicTrack] = useState('ambient-epic');

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({ projectId: '', percent: 0, step: 'Initializing AI Pipeline...' });
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const styleOptions = [
    { id: 'cinematic', label: 'Cinematic', desc: 'Moody film lighting & 35mm depth of field', bg: 'from-amber-500/20 to-purple-600/20' },
    { id: 'cyberpunk', label: 'Cyberpunk', desc: 'Neon reflections, rainy pavement & glowing holograms', bg: 'from-cyan-500/20 to-purple-600/20' },
    { id: 'anime', label: 'Anime / Fantasy', desc: 'Vibrant hand-drawn aesthetic & dramatic skies', bg: 'from-pink-500/20 to-indigo-600/20' },
    { id: 'documentary', label: 'Documentary', desc: 'Realistic historical texture & archival tone', bg: 'from-yellow-600/20 to-amber-800/20' },
    { id: '3d', label: '3D Render', desc: 'Octane / Unreal engine raytraced 3D CGI', bg: 'from-blue-500/20 to-teal-500/20' },
    { id: 'photorealistic', label: 'Photorealistic', desc: 'Ultra-clear 8k DSLR photography', bg: 'from-emerald-500/20 to-cyan-600/20' }
  ];

  const aspectRatios = [
    { id: '16:9', label: '16:9 Landscape', icon: '📺', desc: 'YouTube, TV & Cinema' },
    { id: '9:16', label: '9:16 Portrait', icon: '📱', desc: 'TikTok, Reels & Shorts' },
    { id: '1:1', label: '1:1 Square', icon: '⏹️', desc: 'Instagram & Feed Posts' }
  ];

  const voiceOptions = [
    { id: 'adam-deep', label: 'Adam', desc: 'Deep, authoritative cinematic narrator' },
    { id: 'rachel-soft', label: 'Rachel', desc: 'Warm, articulate female storyteller' },
    { id: 'alex-narrator', label: 'Alex', desc: 'Engaging neutral documentary voice' },
    { id: 'synth-ai', label: 'Synth AI', desc: 'Futuristic electronic sci-fi voice' }
  ];

  const musicOptions = [
    { id: 'ambient-epic', label: 'Ambient Epic', desc: 'Sweeping orchestra & atmospheric pads' },
    { id: 'sci-fi-synth', label: 'Sci-Fi Synthwave', desc: 'Analog synthesizers & pulsing bass' },
    { id: 'lo-fi-chill', label: 'Lo-Fi Chill', desc: 'Relaxing hip-hop beats & soft chords' },
    { id: 'dramatic-tension', label: 'Dramatic Tension', desc: 'Pounding percussion & suspense' },
    { id: 'upbeat-synth', label: 'Upbeat Energetic', desc: 'Fast paced electronic synth pop' }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await api.uploadScriptFile(file);
      setScriptText(res.scriptText);
      setScriptFileName(res.filename);
      if (!prompt.trim()) {
        setPrompt(res.scriptText.slice(0, 300));
      }
    } catch (err: any) {
      setError('Failed to read script file');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe the video you want to generate');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setProgress({ projectId: '', percent: 5, step: 'Analyzing your idea & launching AI pipeline...' });

    try {
      const { projectId } = await api.generateVideo({
        prompt,
        scriptText,
        style,
        aspectRatio,
        voiceId,
        musicTrack
      });

      // Poll progress until video is ready
      const interval = setInterval(async () => {
        try {
          const statusRes = await api.getGenerationProgress(projectId);
          setProgress(statusRes);

          if (statusRes.percent >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              onVideoCreated(projectId);
            }, 1000);
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 1200);

    } catch (err: any) {
      setIsGenerating(false);
      setError(formatError(err) || 'Failed to start video generation');
    }
  };

  const stepsList = [
    'Analyzing your idea...',
    'Creating storyboard...',
    'Generating scenes...',
    'Creating narration...',
    'Adding music...',
    'Rendering video...',
    'Finalizing your video...'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          <span>NEXT-GEN AI STORY TO VIDEO PIPELINE</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Turn your ideas into <span className="gradient-text">cinematic videos</span>
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Enter a prompt, story, or script. CineAI breaks it down, generates AI visual scenes, records voiceovers, mixes background tracks, and exports a complete video.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl mb-8 border border-white/10 shadow-2xl relative">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400" />
            Video Prompt & Concept
          </label>

          {/* Upload Script Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-xs font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            {scriptFileName ? `Script: ${scriptFileName}` : 'Upload Script (.txt)'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />
        </div>

        {/* Large Prompt Textarea */}
        <textarea
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to create… (e.g. 'Create a 2-minute cinematic video about a young man discovering an abandoned city.')"
          className="w-full bg-[#07090e]/90 border border-white/10 rounded-2xl p-4 text-white text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-500 resize-none mb-4"
        />

        {/* Sample Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Try an example:</span>
          {[
            'Create a 2-minute cinematic video about a young man discovering an abandoned city.',
            'A historical documentary about ancient Egyptian pyramids and secret tombs.',
            'Futuristic cyberpunk drone race through a neon metropolis.'
          ].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(sample)}
              className="text-xs bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1 rounded-lg border border-white/5 hover:border-purple-500/30 transition-all truncate max-w-[280px]"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Generation Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Visual Style Options */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Visual Style
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStyle(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  style === opt.id
                    ? 'border-purple-500 bg-purple-500/15 text-white ring-2 ring-purple-500/20'
                    : 'border-white/5 bg-dark-800/60 text-slate-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <div className="font-semibold text-xs text-slate-200">{opt.label}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio & Voice Selector */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between gap-4">
          
          {/* Aspect Ratio */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span>Aspect Ratio</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    aspectRatio === ar.id
                      ? 'border-purple-500 bg-purple-500/20 text-white font-semibold'
                      : 'border-white/5 bg-dark-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-base mb-1">{ar.icon}</div>
                  <div className="text-xs font-medium">{ar.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Narrator & Music */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice Narrator
              </label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {voiceOptions.map((v) => (
                  <option key={v.id} value={v.id}>{v.label} - {v.desc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-400" /> Music Track
              </label>
              <select
                value={musicTrack}
                onChange={(e) => setMusicTrack(e.target.value)}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {musicOptions.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <span>⚠️ {formatError(error)}</span>
        </div>
      )}

      {/* Action CTA Button */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-lg shadow-xl shadow-purple-500/25 hover:opacity-95 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 mx-auto"
        >
          <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
          <span>Generate Video</span>
        </button>
      </div>

      {/* Progress Screen Modal Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-[#07090e]/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-lg w-full glass-panel p-8 rounded-3xl border border-purple-500/30 text-center shadow-2xl relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-2">Generating Your Video</h2>
            <p className="text-sm text-slate-400 mb-6 truncate">{prompt}</p>

            {/* Progress Bar */}
            <div className="w-full bg-dark-800 rounded-full h-3 mb-4 p-0.5 border border-white/5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                style={{ width: `${Math.max(5, progress.percent)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-8 font-mono">
              <span className="text-purple-300 font-medium">{progress.step}</span>
              <span className="font-bold text-white">{progress.percent}%</span>
            </div>

            {/* Step Indicators */}
            <div className="space-y-2 text-left">
              {stepsList.map((stepName, i) => {
                const stepIndex = i + 1;
                const isCurrent = progress.percent >= (i * 14) && progress.percent < ((i + 1) * 14);
                const isCompleted = progress.percent >= ((i + 1) * 14);

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded-xl text-xs transition-colors ${
                      isCurrent
                        ? 'bg-purple-500/15 text-white font-semibold border border-purple-500/30'
                        : isCompleted
                        ? 'text-slate-300 opacity-80'
                        : 'text-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 text-[9px] flex items-center justify-center shrink-0">
                        {stepIndex}
                      </div>
                    )}
                    <span>{stepName}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
