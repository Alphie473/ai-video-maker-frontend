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
    enableAiMockFallback: true,
    maxScenesPerRequest: 3,
    maxDurationPerScene: 5,
    maxCostPerRequest: 1.50,
    veoPricePerSecond: 0.15,
    strictVideoMode: true
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
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Google Gemini / Veo API Key (Gemini 1.5 Flash Scripting & Veo 3.1 Video)
              </label>
              <input
                type="password"
                value={settings.geminiApiKey || ''}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                placeholder="AIzaSy... or AQ..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Veo 3.1 text-to-video generation requires pay-as-you-go billing enabled in Google AI Studio / GCP.
              </span>
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
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Replicate API Key (Minimax Video-01 / Kling / Zeroscope Video Diffusion)
              </label>
              <input
                type="password"
                value={settings.replicateApiKey || ''}
                onChange={(e) => setSettings({ ...settings, replicateApiKey: e.target.value })}
                placeholder="r8_..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Fal.ai API Key (Minimax / Kling / Luma Video Diffusion)
              </label>
              <input
                type="password"
                value={settings.falApiKey || ''}
                onChange={(e) => setSettings({ ...settings, falApiKey: e.target.value })}
                placeholder="fal_key_..."
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Google Veo 3.1 Budget Guardrails & Safety Controls */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Google Veo 3.1 Budget Guardrails & Safety Controls</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Prevent unexpected API charges and enforce strict video output standards before sending requests to Google Veo 3.1.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Max Scenes Per Request (1–10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxScenesPerRequest ?? 3}
                onChange={(e) => setSettings({ ...settings, maxScenesPerRequest: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Limits the number of generated video scenes per generation request.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Max Duration Per Scene (4–8 seconds)
              </label>
              <input
                type="number"
                min="4"
                max="8"
                value={settings.maxDurationPerScene ?? 5}
                onChange={(e) => setSettings({ ...settings, maxDurationPerScene: parseInt(e.target.value, 10) || 5 })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Google Veo 3.1 API strictly requires durations between 4 and 8 seconds.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Estimated Budget Ceiling ($ USD per request)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.10"
                value={settings.maxCostPerRequest ?? 1.50}
                onChange={(e) => setSettings({ ...settings, maxCostPerRequest: parseFloat(e.target.value) || 0.1 })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Requests exceeding this pre-flight estimate are rejected before invoking paid APIs.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Configured Model Rate ($ USD per second)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={settings.veoPricePerSecond ?? 0.15}
                onChange={(e) => setSettings({ ...settings, veoPricePerSecond: parseFloat(e.target.value) || 0.15 })}
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-amber-400/80 mt-0.5 block">
                *Disclosed limitation: Pricing is an estimate based on published rates ($0.15/s) and cannot guarantee actual final provider billing.
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="strictVideoModeToggle"
                checked={settings.strictVideoMode ?? true}
                onChange={(e) => setSettings({ ...settings, strictVideoMode: e.target.checked })}
                className="w-4 h-4 mt-0.5 accent-amber-500 rounded cursor-pointer"
              />
              <div>
                <label htmlFor="strictVideoModeToggle" className="text-xs font-semibold text-white cursor-pointer">
                  Strict Video Mode (Reject silent slideshow image fallback)
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When enabled, generation immediately stops and displays a clear error if Veo video generation fails (e.g. quota limits or billing unconfigured), ensuring you never receive still image slideshows in place of real video.
                </p>
              </div>
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
