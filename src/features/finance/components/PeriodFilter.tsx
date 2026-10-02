import { CalendarDays } from 'lucide-react';
import type { PeriodType } from '../utils/period';

interface PeriodFilterProps {
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
}

const QUICK_FILTERS: Array<{ value: PeriodType; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Эта неделя' },
  { value: 'month', label: 'Этот месяц' },
  { value: 'lastMonth', label: 'Прошлый месяц' },
  { value: 'all', label: 'Весь период' },
  { value: 'custom', label: 'Произвольный' },
];

/**
 * Панель фильтрации по периоду.
 * Быстрые кнопки — горизонтально прокручиваемые на мобильных,
 * произвольный диапазон — нативные <input type="date"> (календарь телефона).
 */
export function PeriodFilter({
  period,
  onPeriodChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}: PeriodFilterProps) {
  return (
    <div className="mb-4">
      {/* Быстрые фильтры: горизонтальный скролл на узких экранах */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {QUICK_FILTERS.map((f) => {
          const isActive = period === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onPeriodChange(f.value)}
              aria-pressed={isActive}
              className={`snap-start shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Поля произвольного диапазона */}
      {period === 'custom' && (
        <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-end bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 sm:pb-2 hidden sm:flex">
            <CalendarDays className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Период
          </div>
          <label className="flex-1">
            <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Дата начала
            </span>
            <input
              type="date"
              value={customStart}
              max={customEnd || undefined}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px]"
            />
          </label>
          <label className="flex-1">
            <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Дата окончания
            </span>
            <input
              type="date"
              value={customEnd}
              min={customStart || undefined}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px]"
            />
          </label>
        </div>
      )}
    </div>
  );
}
