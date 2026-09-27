export type Priority = 'high' | 'medium' | 'low' | 'none';
export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReminderItem {
  before: number; // минуты до события
}

// Данные формы создания/редактирования напоминания
export interface ReminderFormData {
  title: string;
  description?: string;
  time: string;
  daysOfWeek: number[];
  date?: string;
  repeat: boolean;
  repeatType?: RepeatType;
  repeatInterval?: number;
  reminders: ReminderItem[];
  priority?: Priority;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string; // формат "HH:mm"
  date?: string; // конкретная дата (YYYY-MM-DD)
  daysOfWeek: number[]; // 0-6 (0=воскресенье)
  repeat: boolean; // повторять
  repeatType?: RepeatType;
  repeatInterval?: number;
  reminders: ReminderItem[]; // МАССИВ напоминаний
  priority?: Priority;
  completed: boolean;
  notified: boolean;
  createdAt: string;
}
