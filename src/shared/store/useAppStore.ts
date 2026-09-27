import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reminder } from '../../features/reminders/types';
import { Document } from '../../features/documents/types';
import { Client } from '../types';

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
  reminders: Reminder[];
  documents: Document[];
  clients: Client[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
}

const store: StateCreator<AppState, [], []> = (set, get) => ({
  theme: 'light',
  sidebarCollapsed: false,
  reminders: [],
  documents: [],
  clients: [],
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
  
  addReminder: (reminder) => set((state) => ({
    reminders: [...state.reminders, reminder]
  })),
  
  updateReminder: (updatedReminder) => set((state) => ({
    reminders: state.reminders.map(r => 
      r.id === updatedReminder.id ? updatedReminder : r
    )
  })),
  
  deleteReminder: (id) => set((state) => ({
    reminders: state.reminders.filter(r => r.id !== id)
  })),
  
  toggleReminder: (id) => set((state) => ({
    reminders: state.reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    )
  })),

  addDocument: (document) => set((state) => ({
    documents: [...state.documents, document]
  })),

  updateDocument: (updatedDocument) => set((state) => ({
    documents: state.documents.map(d =>
      d.id === updatedDocument.id ? updatedDocument : d
    )
  })),

  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  }))
});

export const useAppStore = create<AppState>()(
  persist(store, {
    name: 'plumber-assistant-settings',
    partialize: (state) => ({
      theme: state.theme,
      sidebarCollapsed: state.sidebarCollapsed,
      reminders: state.reminders,
      documents: state.documents
    })
  })
);
