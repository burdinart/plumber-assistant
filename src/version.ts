/**
 * Система версионирования приложения "Помощник Сантехника"
 * 
 * Для обновления версии:
 * 1. Измените version (например: '1.0.1')
 * 2. Обновите buildDate на текущую дату
 * 3. Обновите phase если началась новая фаза
 * 4. Добавьте новую запись в CHANGELOG
 */

export interface AppVersion {
  version: string;
  buildDate: string;
  buildTime: string;
  phase: string;
}

export const APP_VERSION: AppVersion = {
  version: '1.0.0',
  buildDate: '14.09.2026',
  buildTime: new Date().toLocaleTimeString('ru-RU'),
  phase: 'Фаза 1'
};

export interface ChangelogEntry {
  version: string;
  date: string;
  phase: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '14.09.2026',
    phase: 'Фаза 1',
    changes: [
      '🎉 Первый релиз приложения',
      '✅ Калькуляторы: объём воды, давление, расход воды, теплопотери',
      '✅ Справочники: материалы труб, ошибки котлов, диагностика',
      '✅ CRM: клиенты, заявки, напоминания',
      '✅ Финансы: прайс-лист, сметы, транзакции, отчёты',
      '✅ Проектирование: диаметр трубы, насос, расширительный бак, радиаторы',
      '✅ PWA: установка на телефон и компьютер',
      '✅ Развёртывание на GitHub Pages'
    ]
  }
];
