import { useEffect, useState } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface ScheduledNotification {
  id: string;
  title: string;
  options: {
    body: string;
    tag?: string;
    data?: any;
  };
  scheduledTime: number;
  reminderId: string;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  // Запрос разрешения
  const requestPermission = async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') {
      console.warn('Notifications not supported');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === 'granted') {
      // Регистрируем Service Worker
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }
    }
    
    return result === 'granted';
  };

  // Показать локальное уведомление
  const showLocalNotification = async (
    title: string,
    options: { body: string; tag?: string; data?: any }
  ): Promise<void> => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
        ...options,
        icon: '/plumber-assistant/icon-192x192.svg',
        badge: '/plumber-assistant/icon-192x192.svg',
        vibrate: [200, 100, 200],
        requireInteraction: true
      };
      await registration.showNotification(title, notificationOptions);
    } else if (typeof Notification !== 'undefined') {
      new Notification(title, options);
    }
  };

  // Запланировать уведомление
  const scheduleNotification = (
    reminderId: string,
    title: string,
    body: string,
    fireTime: Date
  ): string => {
    const delay = fireTime.getTime() - Date.now();
    
    if (delay <= 0) {
      console.warn('Cannot schedule notification in the past');
      return '';
    }

    const notificationId = `reminder-${reminderId}-${Date.now()}`;
    
    // Сохраняем в localStorage
    const scheduled: ScheduledNotification = {
      id: notificationId,
      title,
      options: {
        body,
        tag: reminderId,
        data: {
          url: '/plumber-assistant/#/reminders',
          reminderId
        }
      },
      scheduledTime: fireTime.getTime(),
      reminderId
    };

    const existing = JSON.parse(
      localStorage.getItem('scheduledNotifications') || '[]'
    );
    existing.push(scheduled);
    localStorage.setItem('scheduledNotifications', JSON.stringify(existing));

    // Планируем показ
    const timeoutId = window.setTimeout(async () => {
      await showLocalNotification(title, scheduled.options);
      // Удаляем из localStorage после показа
      const remaining = JSON.parse(
        localStorage.getItem('scheduledNotifications') || '[]'
      ).filter((n: ScheduledNotification) => n.id !== notificationId);
      localStorage.setItem('scheduledNotifications', JSON.stringify(remaining));
    }, delay);

    return notificationId;
  };

  // Отменить уведомление
  const cancelNotification = (notificationId: string): void => {
    const timeoutId = parseInt(notificationId.split('-').pop() || '0');
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    
    const remaining = JSON.parse(
      localStorage.getItem('scheduledNotifications') || '[]'
    ).filter((n: ScheduledNotification) => n.id !== notificationId);
    localStorage.setItem('scheduledNotifications', JSON.stringify(remaining));
  };

  // Проверить пропущенные уведомления при запуске
  const checkMissedNotifications = async (): Promise<void> => {
    const scheduled = JSON.parse(
      localStorage.getItem('scheduledNotifications') || '[]'
    );
    const now = Date.now();
    const missed = scheduled.filter((n: ScheduledNotification) => n.scheduledTime <= now);
    
    for (const notification of missed) {
      await showLocalNotification(notification.title, notification.options);
    }
    
    // Удаляем показанные
    const remaining = scheduled.filter((n: ScheduledNotification) => n.scheduledTime > now);
    localStorage.setItem('scheduledNotifications', JSON.stringify(remaining));
  };

  // Инициализация при загрузке
  useEffect(() => {
    if (permission === 'granted') {
      checkMissedNotifications();
    }
  }, [permission]);

  return {
    permission,
    requestPermission,
    showLocalNotification,
    scheduleNotification,
    cancelNotification,
    checkMissedNotifications,
    isSupported: typeof Notification !== 'undefined' && 'serviceWorker' in navigator
  };
};
