/**
 * Логика периодов для фильтрации транзакций.
 * Единый источник правды для PeriodFilter и TransactionsPage.
 */

export type PeriodType = 'today' | 'week' | 'month' | 'lastMonth' | 'all' | 'custom';

export interface PeriodRange {
  /** Начало периода, YYYY-MM-DD (включительно) */
  start: string;
  /** Конец периода, YYYY-MM-DD (включительно) */
  end: string;
}

const toISODate = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const FAR_PAST = '2000-01-01';
const FAR_FUTURE = '2099-12-31';

/**
 * Вычисляет границы периода [start, end] в формате YYYY-MM-DD включительно.
 * Для custom пустые значения означают «без ограничения» с соответствующей стороны.
 */
export function getPeriodRange(
  period: PeriodType,
  customStart?: string,
  customEnd?: string,
): PeriodRange {
  const now = new Date();

  switch (period) {
    case 'today': {
      const d = toISODate(now);
      return { start: d, end: d };
    }
    case 'week': {
      // Понедельник — воскресенье текущей недели
      const day = now.getDay(); // 0 = воскресенье
      const diff = day === 0 ? -6 : 1 - day;
      const start = new Date(now);
      start.setDate(start.getDate() + diff);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { start: toISODate(start), end: toISODate(end) };
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: toISODate(start), end: toISODate(end) };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: toISODate(start), end: toISODate(end) };
    }
    case 'custom': {
      return {
        start: customStart || FAR_PAST,
        end: customEnd || FAR_FUTURE,
      };
    }
    case 'all':
    default:
      return { start: FAR_PAST, end: FAR_FUTURE };
  }
}

/** Человекочитаемое описание выбранного периода (для подписи карточек сводки). */
export function getPeriodLabel(period: PeriodType, range?: PeriodRange): string {
  switch (period) {
    case 'today':
      return 'сегодня';
    case 'week':
      return 'эта неделя';
    case 'month':
      return 'этот месяц';
    case 'lastMonth':
      return 'прошлый месяц';
    case 'all':
      return 'весь период';
    case 'custom':
      if (range && range.start !== FAR_PAST && range.end !== FAR_FUTURE) {
        return `${range.start} — ${range.end}`;
      }
      if (range && range.start !== FAR_PAST) return `с ${range.start}`;
      if (range && range.end !== FAR_FUTURE) return `по ${range.end}`;
      return 'произвольный период';
    default:
      return '';
  }
}
