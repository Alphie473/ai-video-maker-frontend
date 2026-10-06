import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Download, Image as ImageIcon, Volume2, Mic, Music, Plus, Trash2, Film, Sparkles, Sliders, Type, ArrowRightLeft, Camera, Check, Loader2, Maximize2 } from 'lucide-react';
import { api } from '../services/api';
import { Project, Scene } from '../types';

interface EditorViewProps {
  projectId: string;
}

export const EditorView: React.FC<EditorViewProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegeneratingScene, setIsRegeneratingScene] = useState(false);
  const [isReRendering, setIsReRendering] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Editable fields for selected scene
  const [scenePrompt, setScenePrompt] = useState('');
  const [sceneImagePrompt, setSceneImagePrompt] = useState('');
  const [sceneCameraEffect, setSceneCameraEffect] = useState('pan-right');

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProjectById(projectId);
      setProject(data);
      if (data.scenes && data.scenes.length > 0) {
        setSelectedScene(data.scenes[0]);
        setScenePrompt(data.scenes[0].prompt);
        setSceneImagePrompt(data.scenes[0].imagePrompt || data.scenes[0].prompt);
        setSceneCameraEffect(data.scenes[0].cameraEffect || 'pan-right');
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScene = (scene: Scene) => {
    setSelectedScene(scene);
    setScenePrompt(scene.prompt);
    setSceneImagePrompt(scene.imagePrompt || scene.prompt);
    setSceneCameraEffect(scene.cameraEffect || 'pan-right');
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || project?.duration || 0);
    }
  };

  // Regenerate single scene prompt & visual
  const handleRegenerateScene = async () => {
    if (!selectedScene) return;
    setIsRegeneratingScene(true);
    try {
      const updated = await api.regenerateScene(selectedScene.id, {
        prompt: scenePrompt,
        imagePrompt: sceneImagePrompt,
        cameraEffect: sceneCameraEffect
      });

      // Update in local project state
      if (project) {
        const updatedScenes = project.scenes.map(s => s.id === updated.id ? updated : s);
        setProject({ ...project, scenes: updatedScenes });
        setSelectedScene(updated);
      }
    } catch (err) {
      console.error('Failed to regenerate scene:', err);
    } finally {
      setIsRegeneratingScene(false);
    }
  };

  // Add new scene
  const handleAddScene = async () => {
    if (!project) return;
    try {
      const newScene = await api.addScene(project.id, {
        prompt: `Scene ${project.scenes.length + 1}: Dramatic visual atmosphere`,
        narrationText: `The story deepens with new insights.`
      });
      const updatedScenes = [...project.scenes, newScene];
      setProject({ ...project, scenes: updatedScenes });
      setSelectedScene(newScene);
    } catch (err) {
      console.error('Failed to add scene:', err);
    }
  };

  // Delete scene
  const handleDeleteScene = async (sceneId: string) => {
    if (!project || project.scenes.length <= 1) return;
    try {
      await api.deleteScene(sceneId);
      const updatedScenes = project.scenes.filter(s => s.id !== sceneId);
      setProject({ ...project, scenes: updatedScenes });
      if (selectedScene?.id === sceneId) {
        setSelectedScene(updatedScenes[0]);
      }
    } catch (err) {
      console.error('Failed to delete scene:', err);
    }
  };

  // Re-render complete video with FFmpeg
  const handleReRenderFullVideo = async () => {
    if (!project) return;
    setIsReRendering(true);
    try {
      await api.reRenderVideo(project.id);
      setTimeout(async () => {
        await fetchProject();
        setIsReRendering(false);
      }, 3000);
    } catch (err) {
      setIsReRendering(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isLoading || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading video project editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      
      {/* Top Editor Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.title}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {project.style.toUpperCase()} • {project.aspectRatio}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Prompt: "{project.originalPrompt}"</p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReRenderFullVideo}
            disabled={isReRendering}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-white/10 text-slate-200 text-xs font-semibold transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReRendering ? 'animate-spin text-purple-400' : ''}`} />
            {isReRendering ? 'Re-Rendering FFmpeg...' : 'Re-Render Full Video'}
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Video
          </button>
        </div>
      </div>

      {/* Main Workspace (Preview Player Left + Scene Inspector Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Column: Video Preview Player */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-3xl border border-white/10 relative overflow-hidden group">
            
            {/* Video Player Box */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl border border-white/5">
              {project.videoUrl ? (
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />
              ) : selectedScene?.visualUrl ? (
                <img
                  src={selectedScene.visualUrl}
                  alt={selectedScene.prompt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8 text-slate-500">
                  <Film className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No video preview rendered yet</p>
                </div>
              )}

              {/* Subtitle Caption Overlay */}
              {selectedScene && (
                <div className="absolute bottom-6 left-6 right-6 text-center pointer-events-none">
                  <span className="inline-block bg-black/75 backdrop-blur-md text-amber-300 px-4 py-2 rounded-xl text-sm font-semibold border border-amber-500/30 shadow-xl max-w-xl">
                    {selectedScene.narrationText}
                  </span>
                </div>
              )}

              {/* Play/Pause Central Overlay */}
              <button
                onClick={handleTogglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-purple-600/80 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl hover:scale-110"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 translate-x-0.5" />}
              </button>
            </div>

            {/* Custom Scrubbing Timeline Bar */}
            <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-300">
              <button
                onClick={handleTogglePlay}
                className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = val;
                  setCurrentTime(val);
                }}
                className="w-full accent-purple-500 bg-dark-800 h-1.5 rounded-lg cursor-pointer"
              />

              <span>{formatTime(duration || project.duration)}</span>
            </div>

          </div>
        </div>

        {/* Right Column: Scene Inspector & Prompt Editor */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {selectedScene ? (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex-1 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/30">
                      #{selectedScene.sceneNumber}
                    </span>
                    <h3 className="font-bold text-white text-base">Scene {selectedScene.sceneNumber} Prompt Editor</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteScene(selectedScene.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Editable Scene Prompt */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Visual Scene Description</label>
                  <textarea
                    rows={3}
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Describe scene visual details..."
                  />
                </div>

                {/* Detailed AI Image Prompt */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">AI Visual Generation Prompt</label>
                  <textarea
                    rows={3}
                    value={sceneImagePrompt}
                    onChange={(e) => setSceneImagePrompt(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {/* Camera Movement Selector */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" /> Camera Motion Effect
                  </label>
                  <select
                    value={sceneCameraEffect}
                    onChange={(e) => setSceneCameraEffect(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="pan-right">Pan Right (Cinematic Reveal)</option>
                    <option value="pan-left">Pan Left (Slow Glide)</option>
                    <option value="zoom-in">Zoom In (Dramatic Push Focus)</option>
                    <option value="zoom-out">Zoom Out (Establishing Shot)</option>
                    <option value="static">Static Shot</option>
                  </select>
                </div>

              </div>

              {/* Regenerate Only This Scene Button */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={handleRegenerateScene}
                  disabled={isRegeneratingScene}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRegeneratingScene ? 'animate-spin' : ''}`} />
                  <span>{isRegeneratingScene ? 'Regenerating Scene...' : 'Regenerate Scene Only'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center text-slate-400">
              Select a scene from the timeline below to edit its prompt.
            </div>
          )}
        </div>

      </div>

      {/* Bottom Timeline Multi-Track */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Scene-by-Scene Timeline</h3>
            <span className="text-xs text-slate-400">({project.scenes.length} Scenes • {project.duration.toFixed(1)}s Total)</span>
          </div>

          <button
            onClick={handleAddScene}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Scene
          </button>
        </div>

        {/* Scene Cards Horizontal Track */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 snap-x">
          {project.scenes.map((scene, idx) => {
            const isSelected = selectedScene?.id === scene.id;
            return (
              <div
                key={scene.id}
                onClick={() => handleSelectScene(scene)}
                className={`snap-start min-w-[220px] max-w-[220px] glass-card p-3 rounded-2xl cursor-pointer transition-all relative group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/15 ring-2 ring-purple-500/30 shadow-xl'
                    : 'hover:border-white/20'
                }`}
              >
                {/* Scene Thumbnail */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-2.5 relative border border-white/5">
                  {scene.visualUrl ? (
                    <img src={scene.visualUrl} alt={scene.prompt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white">
                    #{scene.sceneNumber}
                  </span>

                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-purple-300">
                    {scene.duration.toFixed(1)}s
                  </span>
                </div>

                {/* Prompt Snippet */}
                <p className="text-xs text-slate-200 line-clamp-2 mb-2 font-medium">
                  {scene.prompt}
                </p>

                {/* Transition & Motion Badges */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-white/5 pt-2">
                  <span className="capitalize text-cyan-300">✨ {scene.transition}</span>
                  <span className="capitalize text-purple-300">📹 {scene.cameraEffect}</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Export Video Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl text-center">
            <h3 className="text-xl font-bold text-white mb-2">Export Finished Video</h3>
            <p className="text-xs text-slate-400 mb-6">Your video has been rendered with full audio narration, background music, and smooth transitions.</p>

            <div className="space-y-3 mb-6 text-left">
              <div className="p-3 rounded-xl bg-dark-900 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span>Resolution</span>
                <span className="font-bold text-white">1080p Full HD</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-900 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span>Format</span>
                <span className="font-bold text-white">MP4 (H.264 / AAC)</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-900 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span>Duration</span>
                <span className="font-bold text-white">{project.duration.toFixed(1)} seconds</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>

              <a
                href={project.videoUrl || '#'}
                download={`${project.title.replace(/\s+/g, '_')}.mp4`}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Download className="w-4 h-4" />
                Download MP4
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
