import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PWAInstallButton } from '../../shared/ui/PWAInstallButton';
import { VersionBadge } from '../../shared/ui/VersionBadge';
import { useAppStore } from '../../shared/store/useAppStore';
import { useEffect } from 'react';

export function AppLayout() {
  const theme = useAppStore((s: { theme: string }) => s.theme);

  useEffect(() => {
    console.log('Theme changed to:', theme);
    // Устанавливаем тему при монтировании и при изменении
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('Added dark class to html');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('Removed dark class from html');
    }
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
        <footer className="text-center py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-center gap-2">
            <span>Помощник Сантехника © 2026</span>
            <VersionBadge />
          </div>
        </footer>
      </div>
      <BottomNav />
      <PWAInstallButton />
    </div>
  );
}
