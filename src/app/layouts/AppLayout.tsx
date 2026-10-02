import { Suspense, lazy, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PWAInstallButton } from '../../shared/ui/PWAInstallButton';
import { VersionBadge } from '../../shared/ui/VersionBadge';
import { useAppStore } from '../../shared/store/useAppStore';

// Ленивая загрузка тяжёлых элементов оформления — они не блокируют первый рендер.
const NotificationPermissionBanner = lazy(() =>
  import('../../shared/ui/NotificationPermissionBanner').then((m) => ({
    default: m.NotificationPermissionBanner,
  }))
);

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Загрузка страницы">
      <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}

export function AppLayout() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    // Устанавливаем тему при монтировании и при изменении
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 pb-20 sm:pb-6" style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
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
