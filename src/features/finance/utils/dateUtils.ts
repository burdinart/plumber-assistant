/**
 * Утилиты дат для финансового модуля.
 *
 * Исторически getTodayDate/getDateAfterDays дублировались в shared/utils/helpers,
 * а getWeekStart/getWeekEnd — в finance/utils/formatters. Теперь это единственный
 * дом для логики дат финмодуля; formatters оставлен только для форматирования.
 */

/** Сегодняшняя дата в формате YYYY-MM-DD (локальная, не UTC). */
export function getTodayDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Дата через N дней от сегодняшней в формате YYYY-MM-DD. */
export function getDateAfterDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Понедельник недели, содержащей переданную дату. */
export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay(); // 0 = воскресенье
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/** Воскресенье недели, содержащей переданную дату. */
export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}
