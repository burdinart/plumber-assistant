import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';
import { APP_VERSION } from '../../version';

/**
 * Баннер «Доступно обновление» для PWA (браузер + установленный APK/TWA).
 *
 * Как это работает:
 * 1. Регистрация sw.js выполняется в src/main.tsx; здесь мы только
 *    наблюдаем за состоянием Service Worker через нативный API.
 * 2. Когда браузер скачал новый sw.js (изменился контент), новый Service
 *    Worker переходит в состояние «waiting» (в sw.js убран авто-skipWaiting).
 * 3. Показываем баннер; по кнопке «Обновить» отправляем SKIP_WAITING и
 *    перезагружаем страницу ровно один раз (защита от цикла reload).
 * 4. Данные пользователя в localStorage не трогаются — они переживают
 *    обновление полностью.
 */

// Ключ версии, которую пользователь уже «отложил» (см. handleLater).
let dismissedVersion: string | null = null;
try {
  dismissedVersion = localStorage.getItem(STORAGE_KEYS.updateDismissedAt);
} catch {
  /* приватный режим */
}

export const UpdatePrompt = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [reloading, setReloading] = useState(false);
  const reloadGuardRef = useRef(false);

  // Периодическая проверка: waiting-воркер мог появиться в любой момент
  // (браузер проверяет sw.js при открытии вкладки и каждые ~24 часа).
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let cancelled = false;

    const grab = (registration?: ServiceWorkerRegistration | null) => {
      if (!cancelled && registration?.waiting) setWaitingWorker(registration.waiting);
    };

    const attachInstalling = (registration: ServiceWorkerRegistration) => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        // installed + существующий controller ⇒ есть обновление, воркер ждёт
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          grab(registration);
        }
      });
    };

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (cancelled || !registration) return;
      grab(registration);
      attachInstalling(registration);
      registration.addEventListener('updatefound', () => attachInstalling(registration));
    });

    const timer = window.setInterval(async () => {
      try {
        grab(await navigator.serviceWorker.getRegistration());
      } catch {
        /* ignore */
      }
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  // Не показываем уведомление повторно до следующей версии, если пользователь
  // нажал «Позже».
  const sameVersionDismissed = dismissedVersion === APP_VERSION.version;

  const handleUpdate = useCallback(async () => {
    if (!waitingWorker || reloadGuardRef.current) return;
    reloadGuardRef.current = true;
    setReloading(true);

    // Защита от цикла перезагрузок: если страница перегружается, а новый
    // контроллер ещё не перехватил управление, больше не предлагаем
    // обновление до конца сессии.
    try {
      if (sessionStorage.getItem('plumber-assistant-reload-pending')) {
        sessionStorage.removeItem('plumber-assistant-reload-pending');
        setWaitingWorker(null);
        setDismissed(true);
        return;
      }
      sessionStorage.setItem('plumber-assistant-reload-pending', '1');
    } catch {
      /* приватный режим — пропускаем guard */
    }

    // Перезагружаем страницу ровно один раз — при активации нового контроллера.
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => window.location.reload(),
      { once: true }
    );

    try {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } catch (error) {
      console.warn('[UpdatePrompt] Не удалось применить обновление:', error);
      // Fallback — обычная перезагрузка: новый SW активируется сам.
      window.location.reload();
    }
  }, [waitingWorker]);

  const handleLater = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.updateDismissedAt, APP_VERSION.version);
    } catch {
      /* приватный режим — просто скрываем баннер */
    }
    setDismissed(true);
  }, []);

  if (!waitingWorker || dismissed || sameVersionDismissed) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-[9999]"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white p-4 rounded-xl shadow-2xl border border-blue-500">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-lg shrink-0">
            <RefreshCw className={`w-5 h-5 ${reloading ? 'animate-spin' : ''}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">Доступно обновление</h3>
            <p className="text-sm text-blue-100 mb-3">
              Появилась новая версия приложения (v{APP_VERSION.version}) с улучшениями и
              исправлениями. Ваши данные сохранятся.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={reloading}
                className="flex-1 min-h-[44px] px-3 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 active:bg-blue-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 ${reloading ? 'animate-spin' : ''}`} />
                {reloading ? 'Обновляем…' : 'Обновить'}
              </button>
              <button
                onClick={handleLater}
                className="min-h-[44px] px-3 py-2 bg-blue-800/50 text-white rounded-lg text-sm hover:bg-blue-800/70 transition-colors"
              >
                Позже
              </button>
            </div>
          </div>

          <button
            onClick={handleLater}
            className="text-blue-200 hover:text-white transition-colors p-1 shrink-0"
            aria-label="Закрыть уведомление"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
