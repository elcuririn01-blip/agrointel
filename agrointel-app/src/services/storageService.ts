import { HistoryEntry, UserSettings, NoteEntry } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'agrointel_history_v1',
  FAVORITES: 'agrointel_favorites_v1',
  SETTINGS: 'agrointel_settings_v1',
  NOTES: 'agrointel_notes_v1',
  DRAFTS: 'agrointel_drafts_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  agronomistName: 'Eng. Agrônomo Responsável',
  creaNumber: 'CREA-SP / Federal',
  companyName: 'Consultoria Agropecuária',
  defaultRegion: 'Cerrado / Sudeste / Sul',
  defaultModel: 'claude',
  includeDisclaimer: true,
};

export const storageService = {
  // Settings
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    return ['relatorio-visita', 'analise-solo-calagem', 'planejamento-safra', 'laudo-vistoria'];
  },

  toggleFavorite(skillId: string): string[] {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(skillId);
    let updated: string[];
    if (index >= 0) {
      updated = favorites.filter(id => id !== skillId);
    } else {
      updated = [...favorites, skillId];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
    return updated;
  },

  isFavorite(skillId: string): boolean {
    return this.getFavorites().includes(skillId);
  },

  // History
  getHistory(): HistoryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
    return [];
  },

  addHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry {
    const history = this.getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };

    // Keep max 50 recent entries
    const updated = [newEntry, ...history].slice(0, 50);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history', e);
    }
    return newEntry;
  },

  removeHistory(id: string): void {
    const history = this.getHistory().filter(h => h.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to remove history entry', e);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  },

  // Notes (Anotações Locais)
  getNotes(): NoteEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
    return [];
  },

  saveNote(noteData: Omit<NoteEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): NoteEntry {
    const notes = this.getNotes();
    const now = new Date().toISOString();

    if (noteData.id) {
      // Update existing note
      const index = notes.findIndex(n => n.id === noteData.id);
      if (index >= 0) {
        const updatedNote: NoteEntry = {
          ...notes[index],
          ...noteData,
          id: noteData.id,
          updatedAt: now,
        };
        notes[index] = updatedNote;
        try {
          localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        } catch (e) {
          console.error('Failed to save note', e);
        }
        return updatedNote;
      }
    }

    // Create new note
    const newNote: NoteEntry = {
      ...noteData,
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newNote, ...notes];
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to create note', e);
    }
    return newNote;
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to delete note', e);
    }
  },

  // Skill Form Drafts (Auto-save de rascunhos de preenchimento no celular)
  getSkillDraft(skillId: string): Record<string, any> | null {
    try {
      const allDrafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '{}');
      return allDrafts[skillId] || null;
    } catch (e) {
      return null;
    }
  },

  saveSkillDraft(skillId: string, inputs: Record<string, any>): void {
    try {
      const allDrafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '{}');
      allDrafts[skillId] = inputs;
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(allDrafts));
    } catch (e) {
      console.error('Failed to save skill draft', e);
    }
  },

  clearSkillDraft(skillId: string): void {
    try {
      const allDrafts = JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAFTS) || '{}');
      delete allDrafts[skillId];
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(allDrafts));
    } catch (e) {
      console.error('Failed to clear skill draft', e);
    }
  },

  // Export / Backup
  exportData(): string {
    const data = {
      settings: this.getSettings(),
      favorites: this.getFavorites(),
      history: this.getHistory(),
      notes: this.getNotes(),
      exportedAt: new Date().toISOString(),
      app: 'AgroIntel PRO',
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (Array.isArray(parsed.favorites)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(parsed.favorites));
      }
      if (Array.isArray(parsed.history)) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      }
      if (Array.isArray(parsed.notes)) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(parsed.notes));
      }
      return true;
    } catch (e) {
      console.error('Failed to import data', e);
      return false;
    }
  }
};
