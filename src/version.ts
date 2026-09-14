/**
 * Система версионирования приложения "Помощник Сантехника"
 * 
 * Для обновления версии:
 * 1. Измените version (например: '1.0.1')
 * 2. Добавьте новую запись в CHANGELOG
 * 
 * Дата и время сборки обновляются автоматически при каждой загрузке приложения
 */

export interface AppVersion {
  version: string;
  buildDate: string;
  buildTime: string;
}

// Функция для получения текущей даты в формате DD.MM.YYYY
function getCurrentDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
}

// Функция для получения текущего времени в формате HH:MM:SS
function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export const APP_VERSION: AppVersion = {
  version: '1.0.1',
  buildDate: getCurrentDate(),
  buildTime: getCurrentTime(),
};

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.1',
    date: getCurrentDate(),
    changes: [
      '🔧 Исправлено автоматическое обновление даты и времени сборки',
      '🗑️ Удалена функциональность фотоотчётов',
      '🗑️ Удалена вкладка "Планирование"',
      '🗑️ Удалены все упоминания "Фаза 1" из интерфейса',
      '🔧 Убраны все ограничения на ввод числовых значений в финансовых полях',
      '🌙 Исправлена работа ночной темы на мобильных устройствах',
      '📋 Добавлена система версионирования',
      '🏠 Добавлена поддержка объектов (квартиры, дома, офисы)',
      '📄 Добавлена система документооборота (акты, договоры, гарантийные талоны)'
    ]
  },
  {
    version: '1.0.0',
    date: '14.09.2026',
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
