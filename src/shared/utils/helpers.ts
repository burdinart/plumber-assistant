import { OrderStatus, OrderType, ReminderPriority } from '../types';

/**
 * Форматирование даты в русский формат
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Форматирование времени
 */
export function formatTime(timeString: string): string {
  return timeString;
}

/**
 * Форматирование даты и времени
 */
export function formatDateTime(dateString: string, timeString: string): string {
  return `${formatDate(dateString)} в ${timeString}`;
}

/**
 * Форматирование суммы
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Получение цвета статуса заявки
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    new: 'blue',
    in_progress: 'amber',
    completed: 'green',
    paid: 'emerald',
  };
  return colors[status];
}

/**
 * Получение текста статуса заявки
 */
export function getOrderStatusText(status: OrderStatus): string {
  const texts: Record<OrderStatus, string> = {
    new: 'Новая',
    in_progress: 'В работе',
    completed: 'Завершена',
    paid: 'Оплачена',
  };
  return texts[status];
}

/**
 * Получение текста типа работы
 */
export function getOrderTypeText(type: OrderType): string {
  const texts: Record<OrderType, string> = {
    emergency: 'Аварийный выезд',
    installation: 'Установка',
    repair: 'Ремонт',
    consultation: 'Консультация',
  };
  return texts[type];
}

/**
 * Получение цвета приоритета напоминания
 */
export function getPriorityColor(priority: ReminderPriority): string {
  const colors: Record<ReminderPriority, string> = {
    high: 'red',
    medium: 'amber',
    low: 'gray',
  };
  return colors[priority];
}

/**
 * Получение текста приоритета
 */
export function getPriorityText(priority: ReminderPriority): string {
  const texts: Record<ReminderPriority, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
  };
  return texts[priority];
}

/**
 * Форматирование телефона для отображения
 */
export function formatPhone(phone: string): string {
  // Убираем все кроме цифр
  const digits = phone.replace(/\D/g, '');
  
  // Если начинается с 8, заменяем на 7
  if (digits.startsWith('8') && digits.length === 11) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  
  // Если начинается с 7
  if (digits.startsWith('7') && digits.length === 11) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  
  return phone;
}

/**
 * Валидация телефона
 */
export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'));
}

/**
 * Валидация email
 */
export function validateEmail(email: string): boolean {
  if (!email) return true; // email опционален
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Проверка, является ли дата прошедшей
 */
export function isDateInPast(dateString: string, timeString: string): boolean {
  const dateTime = new Date(`${dateString}T${timeString}`);
  return dateTime < new Date();
}

/**
 * Получение сегодняшней даты в формате YYYY-MM-DD
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Получение текущего времени в формате HH:MM
 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Получение инициалов из ФИО
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}
