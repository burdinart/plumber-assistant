export interface Symptom {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  causes: {
    description: string;
    action: string;
  }[];
  checkOrder: number[];
  urgentActions?: string[];
}

export const SYMPTOMS: Symptom[] = [
  {
    id: 'no-hot-water',
    name: 'Нет горячей воды',
    severity: 'high',
    causes: [
      { description: 'Котёл/бойлер не работает', action: 'Проверить электропитание/газ' },
      { description: 'Нет электричества/газа', action: 'Проверить ввод в дом' },
      { description: 'Давление в системе ниже нормы', action: 'Долить воду до 1.5-2 бар' },
      { description: 'ТЭН/горелка неисправны', action: 'Вызвать сервис' },
      { description: 'Термостат установлен неправильно', action: 'Проверить настройку' },
      { description: 'Сработал предохранительный клапан', action: 'Проверить давление' },
    ],
    checkOrder: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 'low-water-pressure',
    name: 'Слабый напор воды',
    severity: 'medium',
    causes: [
      { description: 'Забит фильтр грубой очистки', action: 'Прочистить/заменить' },
      { description: 'Забит аэратор на смесителе', action: 'Открутить, прочистить' },
      { description: 'Шаровый кран открыт не полностью', action: 'Открыть полностью' },
      { description: 'Засор в трубах', action: 'Прочистить/заменить участок' },
      { description: 'Низкое давление в стояке', action: 'Замерить манометром (норма 2-4 бар)' },
      { description: 'Неисправен редуктор давления', action: 'Проверить/заменить' },
    ],
    checkOrder: [1, 2, 3, 5, 4, 6],
  },
  {
    id: 'pipe-leak',
    name: 'Течёт труба/соединение',
    severity: 'high',
    causes: [
      { description: 'Ослабло резьбовое соединение', action: 'Подтянуть ключом' },
      { description: 'Износилась прокладка', action: 'Заменить прокладку' },
      { description: 'Трещина в трубе', action: 'Заменить участок' },
      { description: 'Неправильная пайка (PPR)', action: 'Перепаять соединение' },
      { description: 'Коррозия (стальные трубы)', action: 'Заменить участок' },
    ],
    checkOrder: [1, 2, 3, 4, 5],
    urgentActions: [
      'Перекрыть воду',
      'Слить давление',
      'Устранить течь',
    ],
  },
  {
    id: 'boiler-frequent-shutdown',
    name: 'Котёл часто отключается',
    severity: 'medium',
    causes: [
      { description: 'Перегрев', action: 'Проверить насос, воздушные пробки' },
      { description: 'Низкое давление', action: 'Долить воду' },
      { description: 'Неисправен датчик температуры', action: 'Заменить датчик' },
      { description: 'Засорён теплообменник', action: 'Промыть теплообменник' },
      { description: 'Проблемы с дымоходом', action: 'Проверить тягу' },
      { description: 'Скачки напряжения', action: 'Установить стабилизатор' },
    ],
    checkOrder: [2, 1, 3, 5, 4, 6],
  },
  {
    id: 'cold-radiators',
    name: 'Холодные радиаторы',
    severity: 'medium',
    causes: [
      { description: 'Воздушная пробка', action: 'Стравить воздух краном Маевского' },
      { description: 'Закрыт кран на радиаторе', action: 'Открыть кран' },
      { description: 'Забит радиатор', action: 'Промыть радиатор' },
      { description: 'Не работает циркуляционный насос', action: 'Проверить/заменить насос' },
      { description: 'Низкое давление в системе', action: 'Долить воду' },
      { description: 'Неправильная балансировка системы', action: 'Отбалансировать' },
    ],
    checkOrder: [1, 2, 5, 4, 3, 6],
  },
  {
    id: 'noise-in-pipes',
    name: 'Шум в трубах/радиаторах',
    severity: 'low',
    causes: [
      { description: 'Воздушная пробка', action: 'Стравить воздух' },
      { description: 'Высокая скорость теплоносителя', action: 'Уменьшить скорость насоса' },
      { description: 'Засор в трубах', action: 'Прочистить' },
      { description: 'Неправильный уклон труб', action: 'Исправить уклон' },
      { description: 'Кавитация в насосе', action: 'Проверить давление на входе насоса' },
    ],
    checkOrder: [1, 2, 5, 3, 4],
  },
  {
    id: 'gas-smell',
    name: 'Запах газа',
    severity: 'critical',
    causes: [
      { description: 'Утечка газа', action: 'Немедленно перекрыть газ и вызвать аварийную службу' },
    ],
    checkOrder: [1],
    urgentActions: [
      'НЕ ВКЛЮЧАТЬ свет и электроприборы!',
      'НЕ пользоваться спичками/зажигалкой!',
      'Открыть окна для проветривания',
      'Перекрыть газовый кран',
      'Выйти из помещения',
      'Позвонить в газовую службу: 104 или 112',
    ],
  },
  {
    id: 'water-not-hot-enough',
    name: 'Вода не нагревается до нужной температуры',
    severity: 'medium',
    causes: [
      { description: 'Низкая температура на котле', action: 'Увеличить уставку' },
      { description: 'Засорён теплообменник', action: 'Промыть' },
      { description: 'Неисправен датчик температуры', action: 'Заменить' },
      { description: 'Большой расход воды', action: 'Уменьшить расход' },
      { description: 'Низкое давление газа', action: 'Проверить газовый кран' },
      { description: 'Накипь в бойлере', action: 'Промыть бойлер' },
    ],
    checkOrder: [1, 4, 5, 2, 3, 6],
  },
  {
    id: 'faucet-dripping',
    name: 'Капает из-под крана',
    severity: 'low',
    causes: [
      { description: 'Износилась прокладка/кран-букса', action: 'Заменить прокладку/кран-буксу' },
      { description: 'Износился картридж смесителя', action: 'Заменить картридж' },
      { description: 'Ослабло соединение', action: 'Подтянуть' },
      { description: 'Трещина в корпусе смесителя', action: 'Заменить смеситель' },
    ],
    checkOrder: [3, 1, 2, 4],
  },
  {
    id: 'water-meter-spinning',
    name: 'Счётчик воды крутится без расхода',
    severity: 'medium',
    causes: [
      { description: 'Утечка в системе (скрытая)', action: 'Проверить все соединения' },
      { description: 'Неисправен счётчик', action: 'Заменить счётчик' },
      { description: 'Обратный поток (нет обратного клапана)', action: 'Установить обратный клапан' },
      { description: 'Воздушная пробка перед счётчиком', action: 'Стравить воздух' },
    ],
    checkOrder: [1, 4, 3, 2],
  },
  {
    id: 'boiler-not-starting',
    name: 'Котёл не запускается',
    severity: 'high',
    causes: [
      { description: 'Нет электропитания', action: 'Проверить автомат, розетку' },
      { description: 'Нет газа', action: 'Проверить газовый кран, давление' },
      { description: 'Низкое давление воды', action: 'Долить до 1-1.5 бар' },
      { description: 'Сработала защита', action: 'Сбросить ошибку (кнопка Reset)' },
      { description: 'Неисправен датчик', action: 'Проверить/заменить датчик' },
      { description: 'Неисправна плата управления', action: 'Обратиться в сервис' },
    ],
    checkOrder: [1, 2, 3, 4, 5, 6],
  },
];
