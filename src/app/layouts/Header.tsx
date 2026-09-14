import { Moon, Sun, Menu } from 'lucide-react';
import { useAppStore } from '../../shared/store/useAppStore';

export function Header() {
  const { theme, toggleTheme } = useAppStore();

  const handleToggleTheme = () => {
    console.log('Current theme:', theme);
    toggleTheme();
    console.log('Theme toggled');
  };

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Помощник Сантехника
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
