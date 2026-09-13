import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
}

const store: StateCreator<AppState, [], []> = (set) => ({
  theme: 'light',
  sidebarCollapsed: false,
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => set({ theme }),
});

export const useAppStore = create<AppState>()(
  persist(store, {
    name: 'plumber-assistant-settings',
  })
);
