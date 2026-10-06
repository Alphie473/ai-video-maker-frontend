import axios from 'axios';
import { Project, Scene, VideoTemplate, GenerationProgress, AppSettings } from '../types';

const API_BASE = '/api';

export const api = {
  // Video Generation
  generateVideo: async (data: {
    prompt: string;
    scriptText?: string;
    style?: string;
    aspectRatio?: string;
    voiceId?: string;
    musicTrack?: string;
  }): Promise<{ projectId: string; status: string }> => {
    const res = await axios.post(`${API_BASE}/generate`, data);
    return res.data;
  },

  getGenerationProgress: async (projectId: string): Promise<GenerationProgress> => {
    const res = await axios.get(`${API_BASE}/generate/progress/${projectId}`);
    return res.data;
  },

  regenerateScene: async (
    sceneId: string,
    data: { prompt?: string; imagePrompt?: string; cameraEffect?: string }
  ): Promise<Scene> => {
    const res = await axios.post(`${API_BASE}/scenes/${sceneId}/regenerate`, data);
    return res.data;
  },

  replaceSceneVisual: async (sceneId: string, visualUrl: string): Promise<Scene> => {
    const res = await axios.post(`${API_BASE}/scenes/${sceneId}/replace-visual`, { visualUrl });
    return res.data;
  },

  reRenderVideo: async (projectId: string): Promise<{ message: string; projectId: string }> => {
    const res = await axios.post(`${API_BASE}/projects/${projectId}/rerender`);
    return res.data;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await axios.get(`${API_BASE}/projects`);
    return res.data;
  },

  getProjectById: async (id: string): Promise<Project> => {
    const res = await axios.get(`${API_BASE}/projects/${id}`);
    return res.data;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await axios.put(`${API_BASE}/projects/${id}`, data);
    return res.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/${id}`);
  },

  addScene: async (projectId: string, data: { prompt?: string; narrationText?: string }): Promise<Scene> => {
    const res = await axios.post(`${API_BASE}/projects/${projectId}/scenes`, data);
    return res.data;
  },

  deleteScene: async (sceneId: string): Promise<void> => {
    await axios.delete(`${API_BASE}/scenes/${sceneId}`);
  },

  // File Upload
  uploadScriptFile: async (file: File): Promise<{ scriptText: string; filename: string }> => {
    const formData = new FormData();
    formData.append('scriptFile', file);
    const res = await axios.post(`${API_BASE}/upload-script`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Templates & Settings
  getTemplates: async (): Promise<VideoTemplate[]> => {
    const res = await axios.get(`${API_BASE}/templates`);
    return res.data;
  },

  getSettings: async (): Promise<AppSettings> => {
    const res = await axios.get(`${API_BASE}/settings`);
    return res.data;
  },

  updateSettings: async (settings: Partial<AppSettings>): Promise<{ message: string; settings: AppSettings }> => {
    const res = await axios.post(`${API_BASE}/settings`, settings);
    return res.data;
  }
};
