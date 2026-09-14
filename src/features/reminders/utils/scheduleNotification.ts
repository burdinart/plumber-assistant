import { Reminder } from '../../../shared/types';

// Расширенный интерфейс для опций уведомлений
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  requireInteraction?: boolean;
  actions?: Array<{ action: string; title: string }>;
  data?: any;
  tag?: string;
  badge?: string;
}

// Планирование локального уведомления
export const scheduleLocalNotification = async (reminder: Reminder) => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  
  // Вычисли время до напоминания
  const reminderTime = new Date(reminder.date + 'T' + reminder.time);
  const now = new Date();
  const delay = reminderTime.getTime() - now.getTime();

  if (delay <= 0) {
    console.warn('Reminder time already passed');
    return;
  }

  // Для отложенных уведомлений используем setTimeout + showNotification
  setTimeout(async () => {
    const notificationOptions: ExtendedNotificationOptions = {
      body: reminder.text,
      icon: '/icon-192x192.svg',
      badge: '/icon-192x192.svg',
      vibrate: [200, 100, 200],
      tag: `reminder-${reminder.id}`,
      requireInteraction: true,
      data: {
        url: `/reminders`,
        reminderId: reminder.id
      },
      actions: [
        { action: 'complete', title: 'Выполнено' },
        { action: 'snooze', title: 'Отложить на 15 мин' }
      ]
    };
    
    await registration.showNotification('Помощник Сантехника', notificationOptions);

    // Отметь напоминание как показанное
    await markReminderAsNotified(reminder.id);
  }, delay);

  // Сохрани информацию о запланированном уведомлении
  saveScheduledNotification(reminder.id, delay);
};

// Сохранение запланированного уведомления
const saveScheduledNotification = (id: string, delay: number) => {
  const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  scheduled.push({ id, scheduledAt: Date.now(), delay });
  localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));
};

// Отметка напоминания как показанного
const markReminderAsNotified = async (id: string) => {
  // Обнови напоминание в хранилище
  const reminders = JSON.parse(localStorage.getItem('plumber-assistant-reminders') || '[]');
  const updated = reminders.map((r: any) => 
    r.id === id ? { ...r, notified: true } : r
  );
  localStorage.setItem('plumber-assistant-reminders', JSON.stringify(updated));
};

// Отмена запланированного уведомления
export const cancelScheduledNotification = (id: string) => {
  const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  const filtered = scheduled.filter((n: any) => n.id !== id);
  localStorage.setItem('scheduledNotifications', JSON.stringify(filtered));
};

// Показ немедленного уведомления
export const showImmediateNotification = async (title: string, options: ExtendedNotificationOptions) => {
  if (!('serviceWorker' in navigator)) {
    // Fallback на стандартные уведомления
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, options);
};

// Перепланирование всех уведомлений при загрузке приложения
export const rescheduleAllNotifications = async () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const reminders = JSON.parse(localStorage.getItem('plumber-assistant-reminders') || '[]');
  
  for (const reminder of reminders) {
    if (!reminder.isDone && !reminder.notified) {
      const reminderTime = new Date(reminder.date + 'T' + reminder.time);
      const now = new Date();
      const delay = reminderTime.getTime() - now.getTime();
      
      if (delay > 0) {
        await scheduleLocalNotification(reminder);
      }
    }
  }
};
