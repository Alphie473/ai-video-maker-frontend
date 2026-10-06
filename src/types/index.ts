export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  prompt: string;
  imagePrompt: string;
  visualUrl: string | null;
  visualType: 'image' | 'video';
  narrationText: string;
  narrationUrl: string | null;
  duration: number;
  transition: 'fade' | 'crossfade' | 'dissolve' | 'wipe' | 'slide' | 'zoom';
  sfxTrack: string | null;
  cameraEffect: 'pan-right' | 'pan-left' | 'zoom-in' | 'zoom-out' | 'static';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  originalPrompt: string;
  scriptText?: string | null;
  style: string;
  aspectRatio: string;
  voiceId: string;
  musicTrack: string;
  musicVolume: number;
  captionStyle: string;
  renderStatus: 'draft' | 'analyzing' | 'generating' | 'rendering' | 'completed' | 'failed';
  renderProgress: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  duration: number;
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
}

export interface VideoTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Sci-Fi' | 'Fantasy' | 'History' | 'Commercial' | 'Nature' | 'Thriller';
  prompt: string;
  style: string;
  thumbnailUrl: string;
  duration: string;
  sceneCount: number;
}

export interface GenerationProgress {
  projectId: string;
  percent: number;
  step: string;
}

export interface AppSettings {
  id: string;
  openaiApiKey?: string;
  geminiApiKey?: string;
  elevenlabsApiKey?: string;
  replicateApiKey?: string;
  falApiKey?: string;
  defaultResolution: string;
  defaultFps: number;
  enableAiMockFallback: boolean;
}
