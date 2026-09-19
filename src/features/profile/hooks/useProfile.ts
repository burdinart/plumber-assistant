import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, createEmptyProfile } from '../types';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  
  // Actions
  loadProfile: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  resetProfile: () => void;
  exportProfile: () => string;
  importProfile: (json: string) => boolean;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,

      loadProfile: () => {
        // Профиль загружается автоматически через persist middleware
        set({ isLoading: false });
      },

      updateProfile: (data: Partial<UserProfile>) => {
        const currentProfile = get().profile || createEmptyProfile();
        set({
          profile: {
            ...currentProfile,
            ...data,
            updatedAt: new Date().toISOString()
          }
        });
      },

      resetProfile: () => {
        set({ profile: createEmptyProfile() });
      },

      exportProfile: () => {
        const profile = get().profile;
        if (!profile) return '';
        return JSON.stringify(profile, null, 2);
      },

      importProfile: (json: string): boolean => {
        try {
          const imported = JSON.parse(json) as UserProfile;
          // Валидация обязательных полей
          if (!imported.fullName || !imported.companyName) {
            return false;
          }
          set({
            profile: {
              ...imported,
              updatedAt: new Date().toISOString()
            }
          });
          return true;
        } catch {
          return false;
        }
      }
    }),
    {
      name: 'plumber-profile',
      partialize: (state) => ({ profile: state.profile })
    }
  )
);

// Хук для удобного использования
export const useProfile = () => {
  const { profile, isLoading, loadProfile, updateProfile, resetProfile, exportProfile, importProfile } = useProfileStore();

  // Автозагрузка при первом использовании
  if (!profile && !isLoading) {
    loadProfile();
  }

  return {
    profile: profile || createEmptyProfile(),
    isLoading,
    updateProfile,
    resetProfile,
    exportProfile,
    importProfile,
    hasProfile: !!profile && !!profile.fullName
  };
};
