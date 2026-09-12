import { useState, useEffect } from 'react';
import { Reminder } from '../../../shared/types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-reminders';

// Демо-данные напоминаний
const DEMO_REMINDERS: Reminder[] = [
  {
    id: 'reminder-1',
    text: 'Позвонить Петровой насчёт счётчика',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // завтра
    time: '10:00',
    priority: 'high',
    isDone: false,
    relatedClientId: 'client-2',
    relatedOrderId: 'order-2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reminder-2',
    text: 'Проверить оплату от Сидорова',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // через 2 дня
    time: '14:00',
    priority: 'medium',
    isDone: false,
    relatedClientId: 'client-3',
    relatedOrderId: 'order-3',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reminder-3',
    text: 'Профилактический звонок Козловой',
    date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // через 3 месяца
    time: '11:00',
    priority: 'low',
    isDone: false,
    relatedClientId: 'client-4',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'reminder-4',
    text: 'Купить материалы для Николаева',
    date: new Date().toISOString().split('T')[0], // сегодня
    time: '09:00',
    priority: 'high',
    isDone: false,
    relatedClientId: 'client-5',
    relatedOrderId: 'order-5',
    createdAt: new Date().toISOString(),
  },
];

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Загрузка напоминаний из LocalStorage при первом рендере
  useEffect(() => {
    const storedReminders = storage.get<Reminder[]>(STORAGE_KEY, []);
    
    // Если данных нет, загружаем демо-данные
    if (storedReminders.length === 0) {
      setReminders(DEMO_REMINDERS);
      storage.set(STORAGE_KEY, DEMO_REMINDERS);
    } else {
      setReminders(storedReminders);
    }
  }, []);

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (reminders.length > 0) {
      storage.set(STORAGE_KEY, reminders);
    }
  }, [reminders]);

  /**
   * Добавить новое напоминание
   */
  const addReminder = (data: Omit<Reminder, 'id' | 'createdAt' | 'isDone'>): Reminder => {
    const newReminder: Reminder = {
      ...data,
      id: generateId(),
      isDone: false,
      createdAt: new Date().toISOString(),
    };

    setReminders((prev) => [...prev, newReminder]);
    return newReminder;
  };

  /**
   * Обновить напоминание
   */
  const updateReminder = (id: string, data: Partial<Omit<Reminder, 'id' | 'createdAt'>>): Reminder | undefined => {
    let updatedReminder: Reminder | undefined;

    setReminders((prev) =>
      prev.map((reminder) => {
        if (reminder.id === id) {
          updatedReminder = { ...reminder, ...data };
          return updatedReminder;
        }
        return reminder;
      })
    );

    return updatedReminder;
  };

  /**
   * Удалить напоминание
   */
  const deleteReminder = (id: string): boolean => {
    const exists = reminders.some((r) => r.id === id);
    if (exists) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      return true;
    }
    return false;
  };

  /**
   * Отметить напоминание как выполненное
   */
  const toggleReminderDone = (id: string): void => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, isDone: !reminder.isDone } : reminder
      )
    );
  };

  /**
   * Получить напоминания на сегодня
   */
  const getTodayReminders = (): Reminder[] => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter((r) => r.date === today && !r.isDone);
  };

  /**
   * Получить ближайшие напоминания
   */
  const getUpcomingReminders = (days: number = 7): Reminder[] => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return reminders
      .filter((r) => {
        const reminderDate = new Date(r.date);
        return reminderDate >= now && reminderDate <= futureDate && !r.isDone;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  /**
   * Получить все невыполненные напоминания
   */
  const getPendingReminders = (): Reminder[] => {
    return reminders.filter((r) => !r.isDone);
  };

  /**
   * Поиск напоминаний
   */
  const searchReminders = (query: string): Reminder[] => {
    if (!query.trim()) return reminders;
    const lowerQuery = query.toLowerCase();
    return reminders.filter((r) => r.text.toLowerCase().includes(lowerQuery));
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderDone,
    getTodayReminders,
    getUpcomingReminders,
    getPendingReminders,
    searchReminders,
  };
}
