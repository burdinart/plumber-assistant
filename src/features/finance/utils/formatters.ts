/**
 * Утилиты для форматирования финансовых данных
 */

/**
 * Форматирование денежной суммы
 * Пример: 185000 → "185 000 ₽"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Форматирование процента
 * Пример: 15.5 → "+15.5%"
 */
export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value}%`;
}

/**
 * Форматирование даты в читаемый формат
 * Пример: "2026-09-15" → "15 сентября 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Форматирование даты в короткий формат
 * Пример: "2026-09-15" → "15.09.2026"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

/**
 * Получение названия месяца
 * Пример: 8 → "Сентябрь"
 */
export function getMonthName(month: number): string {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[month];
}

// Логика дат перенесена в ./dateUtils (getTodayDate, getDateAfterDays, getWeekStart, getWeekEnd).
