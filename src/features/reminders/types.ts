export interface Reminder {
  id: string;
  title: string;
  description?: string;
  time: string; // формат "HH:mm"
  daysOfWeek: number[]; // 0-6 (0=воскресенье)
  date?: string; // конкретная дата (YYYY-MM-DD)
  repeat: boolean; // повторять еженедельно
  completed: boolean;
  notified: boolean;
  createdAt: string;
}
