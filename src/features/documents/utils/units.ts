// Справочник единиц измерения для позиций документов
// (сметы, акты, договоры, гарантийные талоны) — единый источник для всего приложения.

export interface UnitOfMeasure {
  id: string;
  name: string;      // полное название (для подсказок/опций)
  shortName: string; // короткое обозначение (хранится в позиции)
}

export const UNITS_OF_MEASURE: UnitOfMeasure[] = [
  { id: 'шт', name: 'Штука', shortName: 'шт' },
  { id: 'м', name: 'Метр', shortName: 'м' },
  { id: 'м2', name: 'Квадратный метр', shortName: 'м²' },
  { id: 'м3', name: 'Кубический метр', shortName: 'м³' },
  { id: 'кг', name: 'Килограмм', shortName: 'кг' },
  { id: 'л', name: 'Литр', shortName: 'л' },
  { id: 'точка', name: 'Точка (услуга)', shortName: 'точка' },
  { id: 'усл', name: 'Услуга', shortName: 'усл' },
  { id: 'час', name: 'Час', shortName: 'час' },
  { id: 'день', name: 'День', shortName: 'день' },
  { id: 'рулон', name: 'Рулон', shortName: 'рул' },
  { id: 'упак', name: 'Упаковка', shortName: 'упак' },
  { id: 'пара', name: 'Пара', shortName: 'пара' },
  { id: 'компл', name: 'Комплект', shortName: 'компл' },
];

/** Единица измерения по умолчанию для новых позиций */
export const DEFAULT_UNIT = 'шт';

/** Fallback-значение unit для старых позиций/документов, созданных без поля unit */
export const withUnitFallback = <T extends { unit?: string }>(item: T): T => ({
  ...item,
  unit: item.unit && item.unit.trim() ? item.unit : DEFAULT_UNIT,
});

export const getUnitByShortName = (shortName: string): UnitOfMeasure | undefined =>
  UNITS_OF_MEASURE.find(u => u.shortName === shortName);

export const getDefaultUnit = (): UnitOfMeasure =>
  UNITS_OF_MEASURE.find(u => u.shortName === DEFAULT_UNIT) ?? UNITS_OF_MEASURE[0];

/**
 * Опции select с гарантированным присутствием текущего значения:
 * если unit позиции отсутствует в справочнике (пользовательский ввод через datalist),
 * добавляем его отдельной опцией, чтобы выбор не "сбрасывался".
 */
export const unitOptionsFor = (current?: string): Array<{ value: string; label: string }> => {
  const options = UNITS_OF_MEASURE.map(u => ({ value: u.shortName, label: `${u.shortName} — ${u.name}` }));
  const trimmed = (current || '').trim();
  if (trimmed && !UNITS_OF_MEASURE.some(u => u.shortName === trimmed)) {
    options.unshift({ value: trimmed, label: `${trimmed} (своя)` });
  }
  return options;
};
