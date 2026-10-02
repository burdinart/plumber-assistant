import { create } from 'zustand';
import { STORAGE_KEYS } from '../../../shared/utils/constants';
import { DashboardWidget, DEFAULT_WIDGETS } from '../types';

// ---------------------------------------------------------------------------
// Store виджетов главной страницы: порядок + видимость, persist в localStorage.
// ---------------------------------------------------------------------------

interface DashboardState {
  widgets: DashboardWidget[];
  loadWidgets: () => void;
  /** Сохраняет новый порядок видимых виджетов (массив id сверху вниз). */
  updateWidgetOrder: (newOrder: string[]) => void;
  toggleWidgetVisibility: (id: string) => void;
  resetWidgets: () => void;
}

function readFromStorage(): DashboardWidget[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.dashboardWidgets);
    if (!saved) return DEFAULT_WIDGETS;
    const parsed = JSON.parse(saved) as DashboardWidget[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_WIDGETS;

    // Миграция: добавляем отсутствующие виджеты из дефолта, убираем неизвестные
    const known = new Map(DEFAULT_WIDGETS.map((w) => [w.id, w]));
    const merged: DashboardWidget[] = [];
    for (const w of parsed) {
      const def = known.get(w.id);
      if (def) {
        merged.push({ ...def, isVisible: w.isVisible !== false, order: merged.length });
        known.delete(w.id);
      }
    }
    for (const def of known.values()) {
      merged.push({ ...def, order: merged.length });
    }
    return merged;
  } catch {
    return DEFAULT_WIDGETS;
  }
}

function writeToStorage(widgets: DashboardWidget[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.dashboardWidgets, JSON.stringify(widgets));
  } catch {
    // хранилище недоступно (приватный режим и т.п.) — работаем в памяти
  }
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Инициализация сразу из localStorage — порядок восстанавливается при загрузке
  widgets: readFromStorage(),

  loadWidgets: () => set({ widgets: readFromStorage() }),

  updateWidgetOrder: (newOrder) =>
    set((state) => {
      const hidden = state.widgets.filter((w) => !w.isVisible);
      const reordered: DashboardWidget[] = [];
      newOrder.forEach((id, index) => {
        const widget = state.widgets.find((w) => w.id === id);
        if (widget) reordered.push({ ...widget, order: index });
      });
      // Скрытые виджеты дописываем в конец, чтобы не потерять их
      hidden.forEach((w) => reordered.push({ ...w, order: reordered.length }));

      writeToStorage(reordered);
      return { widgets: reordered };
    }),

  toggleWidgetVisibility: (id) =>
    set((state) => {
      const updated = state.widgets.map((w) =>
        w.id === id ? { ...w, isVisible: !w.isVisible } : w,
      );
      writeToStorage(updated);
      return { widgets: updated };
    }),

  resetWidgets: () => {
    writeToStorage(DEFAULT_WIDGETS);
    set({ widgets: DEFAULT_WIDGETS.map((w) => ({ ...w })) });
  },
}));
