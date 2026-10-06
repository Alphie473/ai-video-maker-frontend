import React, { useState, useEffect } from 'react';
import { Sliders, Key, ShieldCheck, Check, Save, HardDrive } from 'lucide-react';
import { api } from '../services/api';
import { AppSettings } from '../types';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<Partial<AppSettings>>({
    openaiApiKey: '',
    geminiApiKey: '',
    elevenlabsApiKey: '',
    replicateApiKey: '',
    falApiKey: '',
    defaultResolution: '1080p',
    defaultFps: 30,
    enableAiMockFallback: true
  });

  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      setSavedMessage('Settings saved securely on backend!');
      setTimeout(() => setSavedMessage(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Sliders className="w-8 h-8 text-purple-400" />
          System & AI Provider Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure external AI API keys (OpenAI, Gemini, ElevenLabs, Replicate, Fal.ai) and video rendering options.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* API Key Management Box */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">AI Service Provider Credentials</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            API keys are securely processed backend-side and stored in environment configuration. If omitted, CineAI automatically uses built-in high-quality canvas & audio synthesis fallback engines!
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">OpenAI API Key (DALL-E 3 & GPT-4o Scripting)</label>
              <input
                type="password"
                value={settings.openaiApiKey || ''}
                onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                placeholder="sk-proj-..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Google Gemini API Key (Gemini 1.5 Flash Scripting)</label>
              <input
                type="password"
                value={settings.geminiApiKey || ''}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">ElevenLabs API Key (Ultra-realistic Voices)</label>
              <input
                type="password"
                value={settings.elevenlabsApiKey || ''}
                onChange={(e) => setSettings({ ...settings, elevenlabsApiKey: e.target.value })}
                placeholder="xi-..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Replicate / Fal.ai API Key (Text-to-Video Models)</label>
              <input
                type="password"
                value={settings.replicateApiKey || ''}
                onChange={(e) => setSettings({ ...settings, replicateApiKey: e.target.value })}
                placeholder="r8_..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Video Rendering Defaults */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">FFmpeg Video Quality & Dev Mode</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Default Output Resolution</label>
              <select
                value={settings.defaultResolution || '1080p'}
                onChange={(e) => setSettings({ ...settings, defaultResolution: e.target.value })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="720p">720p HD</option>
                <option value="1080p">1080p Full HD (Recommended)</option>
                <option value="4k">4K Ultra HD</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Developer Offline Fallback Mode</label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="mockToggle"
                  checked={settings.enableAiMockFallback ?? true}
                  onChange={(e) => setSettings({ ...settings, enableAiMockFallback: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
                <label htmlFor="mockToggle" className="text-xs text-slate-300 cursor-pointer">
                  Enable high quality canvas & procedural audio when API keys are absent
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Banner */}
        {savedMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{savedMessage}</span>
          </div>
        )}

        <div className="text-right">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-2 ml-auto"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>

      </form>

    </div>
  );
};
