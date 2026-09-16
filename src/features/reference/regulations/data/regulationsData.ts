import type { RegulationEntry } from '../types';

export const regulationsData: RegulationEntry[] = [
  // Высота установки приборов
  { id: 'reg-001', category: 'water', title: 'Высота установки умывальника', keywords: ['умывальник', 'высота', 'раковина', 'инсталляция'], value: '800 мм', source: 'СП 73.13330.2016, табл. 3', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-002', category: 'water', title: 'Высота установки мойки', keywords: ['мойка', 'высота', 'раковина', 'кухня'], value: '850 мм', source: 'СП 73.13330.2016, табл. 3', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-003', category: 'water', title: 'Высота установки ванны', keywords: ['ванна', 'высота', 'бортик'], value: '600 мм', source: 'СП 73.13330.2016, табл. 3', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-004', category: 'water', title: 'Высота установки писсуара', keywords: ['писсуар', 'высота', 'настенный'], value: '650 мм', source: 'СП 73.13330.2016, табл. 3', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-005', category: 'water', title: 'Высота душевого поддона', keywords: ['душ', 'поддон', 'высота'], value: '400 мм', source: 'СП 73.13330.2016, табл. 3', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-006', category: 'water', title: 'Высота смесителя ванны', keywords: ['смеситель', 'ванна', 'высота', 'излив'], value: '800 мм от пола', source: 'СП 73.13330.2016, п. 6.2.1', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-007', category: 'water', title: 'Высота смесителя душа', keywords: ['смеситель', 'душ', 'высота'], value: '1200 мм от пола', source: 'СП 73.13330.2016, п. 6.2.1', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-008', category: 'water', title: 'Высота душевой сетки', keywords: ['душ', 'сетка', 'лейка', 'высота'], value: '2100–2250 мм', source: 'СП 73.13330.2016, п. 6.2.1', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-009', category: 'water', title: 'Высота смывного крана унитаза', keywords: ['унитаз', 'кран', 'смыв', 'высота'], value: '800 мм от пола', source: 'СП 73.13330.2016, п. 6.2.1', isQuickTable: true, quickTableGroup: 'installation-heights' },
  { id: 'reg-010', category: 'water', title: 'Высота крана для мытья полов', keywords: ['пол', 'кран', 'мытье', 'уборка', 'высота'], value: '600 мм от пола', source: 'СП 73.13330.2016, п. 6.2.1', isQuickTable: true, quickTableGroup: 'installation-heights' },
  
  // Давление и температура
  { id: 'reg-011', category: 'water', title: 'Температура ГВС в точке разбора', keywords: ['гвс', 'температура', 'горячая вода', 'разбор'], value: '60–75 °С', source: 'СП 30.13330.2020, п. 4.7', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  { id: 'reg-012', category: 'water', title: 'Температура ГВС для детей', keywords: ['гвс', 'температура', 'дети', 'дошкольные', 'садик'], value: 'не выше 37 °С', source: 'СП 30.13330.2020, п. 4.8', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  { id: 'reg-013', category: 'water', title: 'Свободный напор у диктующего прибора', keywords: ['напор', 'давление', 'диктующий прибор', 'минимум'], value: 'не менее 20 м вод.ст.', source: 'СП 30.13330.2020, п. 8.21', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  { id: 'reg-014', category: 'water', title: 'Максимальный гидростатический напор', keywords: ['напор', 'давление', 'максимум', 'гидростатика'], value: 'не более 45 м вод.ст.', source: 'СП 30.13330.2020, п. 7.10', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  { id: 'reg-015', category: 'heating', title: 'Температура теплоносителя в жилых зданиях', keywords: ['отопление', 'температура', 'теплоноситель', 'жилые'], value: 'не более 95 °С', source: 'СП 60.13330.2020, п. 6.1.14', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  { id: 'reg-016', category: 'heating', title: 'Температура теплоносителя в производственных зданиях', keywords: ['отопление', 'температура', 'теплоноситель', 'производственные'], value: 'не более 115 °С', source: 'СП 60.13330.2020, п. 6.1.14', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  { id: 'reg-017', category: 'heating', title: 'Температура для полимерных труб', keywords: ['полимерные', 'трубы', 'температура', 'давление', 'пластик'], value: 'не более 90 °С, 1,0 МПа', source: 'СП 60.13330.2020, п. 6.1.15', isQuickTable: true, quickTableGroup: 'pressure-temperature' },
  
  // Уклоны
  { id: 'reg-018', category: 'water', title: 'Уклон водопровода', keywords: ['уклон', 'водопровод', 'хвс', 'гвс'], value: 'не менее 0,002', source: 'СП 30.13330.2020, п. 11.19', isQuickTable: true, quickTableGroup: 'slopes' },
  { id: 'reg-019', category: 'sewage', title: 'Уклон канализации самоочищение', keywords: ['уклон', 'канализация', 'самоочищение', 'скорость', 'наполнение'], value: 'скорость ≥ 0,7 м/с, наполнение ≥ 0,3', source: 'СП 30.13330.2020, п. 19.1', isQuickTable: true, quickTableGroup: 'slopes' },
  { id: 'reg-020', category: 'sewage', title: 'Уклон пола душевой', keywords: ['уклон', 'пол', 'душ', 'трап'], value: '0,01–0,02', source: 'СП 30.13330.2020, п. 17.9', isQuickTable: true, quickTableGroup: 'slopes' },
  { id: 'reg-021', category: 'heating', title: 'Уклон отопления вода конденсат', keywords: ['уклон', 'отопление', 'вода', 'конденсат'], value: 'не менее 0,002', source: 'СП 60.13330.2020, п. 6.3.8', isQuickTable: true, quickTableGroup: 'slopes' },
  { id: 'reg-022', category: 'heating', title: 'Уклон паропровода', keywords: ['уклон', 'паропровод', 'пар'], value: 'не менее 0,006', source: 'СП 60.13330.2020, п. 6.3.8', isQuickTable: true, quickTableGroup: 'slopes' },
  
  // Диаметры по приборам
  { id: 'reg-023', category: 'water', title: 'Диаметр подводки умывальника', keywords: ['диаметр', 'умывальник', 'подводка', 'отвод'], value: '10 мм / 32 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-024', category: 'water', title: 'Диаметр подводки мойки', keywords: ['диаметр', 'мойка', 'подводка', 'отвод', 'кухня'], value: '10 мм / 40 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-025', category: 'water', title: 'Диаметр подводки ванны', keywords: ['диаметр', 'ванна', 'подводка', 'отвод'], value: '10 мм / 40 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-026', category: 'water', title: 'Диаметр подводки душевой кабины', keywords: ['диаметр', 'душ', 'кабина', 'подводка', 'отвод'], value: '10 мм / 40 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-027', category: 'sewage', title: 'Диаметр отвода унитаза', keywords: ['диаметр', 'унитаз', 'отвод', 'канализация'], value: '8 мм подводка / 85 мм отвод', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-028', category: 'water', title: 'Диаметр подводки стиральной машины', keywords: ['диаметр', 'стиральная', 'машина', 'подводка', 'отвод'], value: '15 мм / 20 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-029', category: 'water', title: 'Диаметр подводки посудомоечной машины', keywords: ['диаметр', 'посудомоечная', 'машина', 'подводка', 'отвод'], value: '15 мм / 20 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-030', category: 'sewage', title: 'Диаметр трапа 1-2 душа', keywords: ['диаметр', 'трап', 'душ', 'канализация'], value: '50 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  { id: 'reg-031', category: 'sewage', title: 'Диаметр трапа 3-4 душа', keywords: ['диаметр', 'трап', 'душ', 'канализация'], value: '100 мм', source: 'СП 30.13330.2020, табл. А.1', isQuickTable: true, quickTableGroup: 'diameters-by-device' },
  
  // Испытания систем
  { id: 'reg-032', category: 'water', title: 'Испытание ХВС ГВС гидростатическое', keywords: ['испытание', 'опрессовка', 'хвс', 'гвс', 'давление', 'проверка'], value: '1,5 рабочего, 10 мин, падение ≤ 0,05 МПа', source: 'СП 73.13330.2016, разд. 7', isQuickTable: true, quickTableGroup: 'testing' },
  { id: 'reg-033', category: 'heating', title: 'Испытание отопления водяного', keywords: ['испытание', 'опрессовка', 'отопление', 'давление', 'проверка'], value: '1,5 рабочего (не менее 0,2 МПа), 5 мин, падение ≤ 0,02 МПа', source: 'СП 73.13330.2016, разд. 7', isQuickTable: true, quickTableGroup: 'testing' },
  { id: 'reg-034', category: 'heating', title: 'Испытание отопления панельного', keywords: ['испытание', 'опрессовка', 'отопление', 'панельное', 'давление'], value: '1 МПа, 15 мин, падение ≤ 0,01 МПа', source: 'СП 73.13330.2016, разд. 7', isQuickTable: true, quickTableGroup: 'testing' },
  { id: 'reg-035', category: 'sewage', title: 'Испытание канализации пролив', keywords: ['испытание', 'канализация', 'пролив', 'проверка'], value: 'пролив 75% приборов, осмотр, нет течи', source: 'СП 73.13330.2016, разд. 7', isQuickTable: true, quickTableGroup: 'testing' },
  { id: 'reg-036', category: 'sewage', title: 'Испытание водостоков наполнение', keywords: ['испытание', 'водостоки', 'наполнение', 'проверка'], value: 'наполнение до воронки, 10 мин, уровень не меняется', source: 'СП 73.13330.2016, разд. 7', isQuickTable: true, quickTableGroup: 'testing' },
  
  // Крепления труб
  { id: 'reg-037', category: 'general', title: 'Крепление труб 15 мм', keywords: ['крепление', 'хомут', 'труба', '15мм', 'расстояние'], value: '2,5 м (неизолированные) / 1,5 м (изолированные)', source: 'СП 73.13330.2016, табл. 2', isQuickTable: true, quickTableGroup: 'pipe-supports' },
  { id: 'reg-038', category: 'general', title: 'Крепление труб 20 мм', keywords: ['крепление', 'хомут', 'труба', '20мм', 'расстояние'], value: '3,0 м (неизолированные) / 2,0 м (изолированные)', source: 'СП 73.13330.2016, табл. 2', isQuickTable: true, quickTableGroup: 'pipe-supports' },
  { id: 'reg-039', category: 'general', title: 'Крепление труб 25 мм', keywords: ['крепление', 'хомут', 'труба', '25мм', 'расстояние'], value: '3,5 м (неизолированные) / 2,0 м (изолированные)', source: 'СП 73.13330.2016, табл. 2', isQuickTable: true, quickTableGroup: 'pipe-supports' },
  { id: 'reg-040', category: 'general', title: 'Крепление труб 32 мм', keywords: ['крепление', 'хомут', 'труба', '32мм', 'расстояние'], value: '4,0 м (неизолированные) / 2,5 м (изолированные)', source: 'СП 73.13330.2016, табл. 2', isQuickTable: true, quickTableGroup: 'pipe-supports' },
  { id: 'reg-041', category: 'general', title: 'Крепление труб 40 мм', keywords: ['крепление', 'хомут', 'труба', '40мм', 'расстояние'], value: '4,5 м (неизолированные) / 3,0 м (изолированные)', source: 'СП 73.13330.2016, табл. 2', isQuickTable: true, quickTableGroup: 'pipe-supports' },
  { id: 'reg-042', category: 'general', title: 'Крепление труб 50 мм', keywords: ['крепление', 'хомут', 'труба', '50мм', 'расстояние'], value: '5,0 м (неизолированные) / 3,0 м (изолированные)', source: 'СП 73.13330.2016, табл. 2', isQuickTable: true, quickTableGroup: 'pipe-supports' },
];
