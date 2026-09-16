import { create } from 'zustand';
import type { RegulationEntry } from '../types';

interface FavoritesState {
  favorites: string[]; // IDs избранных записей
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  loadFromStorage: () => void;
}

const FAVORITES_KEY = 'plumber-regulations-favorites';

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  
  addFavorite: (id: string) => {
    set(state => {
      if (state.favorites.includes(id)) return state;
      const newFavorites = [...state.favorites, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  removeFavorite: (id: string) => {
    set(state => {
      const newFavorites = state.favorites.filter(fid => fid !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  isFavorite: (id: string) => {
    return get().favorites.includes(id);
  },
  
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ favorites: parsed });
        }
      }
    } catch (e) {
      console.error('Failed to load favorites from storage:', e);
    }
  },
}));
