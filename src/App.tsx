import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { CreateVideoView } from './views/CreateVideoView';
import { EditorView } from './views/EditorView';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { TemplatesView } from './views/TemplatesView';
import { SettingsView } from './views/SettingsView';

export function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | undefined>(undefined);

  const handleVideoCreated = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab('editor');
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab('editor');
  };

  const handleUseTemplate = (prompt: string, style: string) => {
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProjectTitle={activeProjectTitle}
      />

      <main className="flex-1">
        {activeTab === 'create' && (
          <CreateVideoView onVideoCreated={handleVideoCreated} />
        )}

        {activeTab === 'editor' && activeProjectId && (
          <EditorView projectId={activeProjectId} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab, projId) => {
              if (projId) setActiveProjectId(projId);
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView onSelectProject={handleSelectProject} />
        )}

        {activeTab === 'templates' && (
          <TemplatesView onUseTemplate={handleUseTemplate} />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
        <p>CineAI Studio Pro — Next-Gen Story to Video AI Pipeline Engine</p>
      </footer>
    </div>
  );
}

export default App;
