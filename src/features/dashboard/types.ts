// ---------------------------------------------------------------------------
// Типы виджетов главной страницы (Dashboard)
// ---------------------------------------------------------------------------

export type WidgetType = 'stats' | 'quick-actions' | 'orders' | 'reminders' | 'tools';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  isVisible: boolean;
  order: number;
}

/** Порядок и состав виджетов по умолчанию. */
export const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'quick-actions', type: 'quick-actions', title: 'Быстрые действия', isVisible: true, order: 0 },
  { id: 'stats', type: 'stats', title: 'Статистика', isVisible: true, order: 1 },
  { id: 'orders', type: 'orders', title: 'Заявки на сегодня', isVisible: true, order: 2 },
  { id: 'reminders', type: 'reminders', title: 'Напоминания', isVisible: true, order: 3 },
  { id: 'tools', type: 'tools', title: 'Инструменты и калькуляторы', isVisible: true, order: 4 },
];
