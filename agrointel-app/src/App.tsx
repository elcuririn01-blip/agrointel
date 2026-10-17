import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './views/DashboardView';
import { SkillsCatalogView } from './views/SkillsCatalogView';
import { SkillExecutionView } from './views/SkillExecutionView';
import { AgentsCatalogView } from './views/AgentsCatalogView';
import { AgentDetailView } from './views/AgentDetailView';
import { HistoryView } from './views/HistoryView';
import { FavoritesView } from './views/FavoritesView';
import { NotesView } from './views/NotesView';
import { SettingsView } from './views/SettingsView';

export function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="skills" element={<SkillsCatalogView />} />
          <Route path="skills/:skillId" element={<SkillExecutionView />} />
          <Route path="agents" element={<AgentsCatalogView />} />
          <Route path="agents/:agentId" element={<AgentDetailView />} />
          <Route path="notes" element={<NotesView />} />
          <Route path="history" element={<HistoryView />} />
          <Route path="favorites" element={<FavoritesView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
