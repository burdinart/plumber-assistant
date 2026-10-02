import { useCallback, useEffect, useState } from 'react';

/**
 * Типы блокировки ориентации по Screen Orientation API
 * (https://w3c.github.io/screen-orientation/).
 */
export type OrientationLockType =
  | 'portrait'
  | 'portrait-primary'
  | 'portrait-secondary'
  | 'landscape'
  | 'landscape-primary'
  | 'landscape-secondary'
  | 'any';

export type OrientationCategory = 'portrait' | 'landscape' | 'unknown';

type OrientationApi = ScreenOrientation & {
  lock?: (orientation: OrientationLockType) => Promise<void>;
  unlock?: () => void;
};

function getOrientationApi(): OrientationApi | null {
  if (typeof window === 'undefined' || typeof screen === 'undefined') return null;
  return (screen as Screen & { orientation?: OrientationApi }).orientation ?? null;
}

/**
 * Хук управления ориентацией экрана (Screen Orientation API).
 *
 * - Отслеживает изменение ориентации (событие `change` + fallback на `resize`
 *   для браузеров без API, например старых Safari).
 * - `lockOrientation` / `unlockOrientation` корректно работают только в
 *   установленных PWA (standalone); в обычных браузерах ошибки перехватываются
 *   через try/catch и логируются — приложение не падает.
 * - `isLandscape` — удобно для условной адаптивной верстки.
 */
export function useScreenOrientation() {
  const [orientation, setOrientation] = useState<string>(() => {
    const api = getOrientationApi();
    if (api?.type) return api.type;
    if (typeof window !== 'undefined') {
      return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    }
    return 'unknown';
  });
  /** true, если блокировка доступна в текущем окружении (PWA + поддержка API). */
  const [lockSupported, setLockSupported] = useState<boolean>(false);

  useEffect(() => {
    const api = getOrientationApi();
    setLockSupported(Boolean(api && typeof api.lock === 'function'));

    const updateFromApi = () => {
      if (api?.type) setOrientation(api.type);
    };

    // Fallback: определяем ориентацию по соотношению сторон viewport.
    const updateFromViewport = () => {
      if (!api?.type) {
        setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
      }
    };

    updateFromApi();
    updateFromViewport();

    let removeApiListener: (() => void) | undefined;
    if (api) {
      api.addEventListener('change', updateFromApi);
      removeApiListener = () => api.removeEventListener('change', updateFromApi);
    }
    window.addEventListener('resize', updateFromViewport);

    return () => {
      if (removeApiListener) removeApiListener();
      window.removeEventListener('resize', updateFromViewport);
    };
  }, []);

  const category: OrientationCategory = orientation.startsWith('landscape')
    ? 'landscape'
    : orientation.startsWith('portrait')
      ? 'portrait'
      : 'unknown';

  const isLandscape = category === 'landscape';

  /**
   * Пытается заблокировать ориентацию. Безопасно вызывается везде:
   * при отсутствии поддержки или отказе браузера — warning в консоль, без исключений.
   */
  const lockOrientation = useCallback(async (type: OrientationLockType = 'landscape') => {
    const api = getOrientationApi();
    if (!api || typeof api.lock !== 'function') {
      console.warn('Screen Orientation lock API не поддерживается — ориентация не заблокирована.');
      return false;
    }
    try {
      await api.lock(type);
      setOrientation(api.type ?? type);
      return true;
    } catch (error) {
      // Типичные причины отказа: не standalone-режим, нет пользовательского жеста,
      // десктопный браузер. Приложение должно продолжать работать штатно.
      console.warn('Не удалось заблокировать ориентацию:', error);
      return false;
    }
  }, []);

  /** Снимает блокировку ориентации (безопасно, даже если блокировки не было). */
  const unlockOrientation = useCallback(() => {
    const api = getOrientationApi();
    if (!api || typeof api.unlock !== 'function') return;
    try {
      api.unlock();
    } catch (error) {
      console.warn('Не удалось разблокировать ориентацию:', error);
    }
  }, []);

  return { orientation, category, isLandscape, lockSupported, lockOrientation, unlockOrientation };
}
