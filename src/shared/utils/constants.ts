import { Module, CategoryInfo } from '../types';

export const MODULES: Module[] = [
  // Калькуляторы
  {
    id: 'pressure',
    title: 'Калькулятор давления',
    description: 'Расчёт давления воды в системе с учётом высоты и потерь',
    icon: 'Gauge',
    path: '/calculators/pressure',
    category: 'calculators',
  },
  {
    id: 'pipe-diameter',
    title: 'Диаметр труб',
    description: 'Подбор диаметра трубы по расходу и скорости потока',
    icon: 'CircleDot',
    path: '/calculators/pipe-diameter',
    category: 'calculators',
  },
  {
    id: 'water-flow',
    title: 'Расход воды',
    description: 'Расчёт расхода воды по сечению трубы и скорости',
    icon: 'Droplets',
    path: '/calculators/water-flow',
    category: 'calculators',
  },
  {
    id: 'heat-loss',
    title: 'Теплопотери',
    description: 'Расчёт теплопотерь через трубопровод',
    icon: 'Thermometer',
    path: '/calculators/heat-loss',
    category: 'calculators',
    isNew: true,
  },
  // Справочники
  {
    id: 'materials',
    title: 'Материалы труб',
    description: 'Справочник по материалам: сталь, медь, полипропилен, PEX',
    icon: 'Package',
    path: '/reference/materials',
    category: 'reference',
  },
  {
    id: 'fittings',
    title: 'Фитинги и соединения',
    description: 'Справочник фитингов, их типов и назначений',
    icon: 'GitBranch',
    path: '/reference/fittings',
    category: 'reference',
  },
  {
    id: 'units-converter',
    title: 'Конвертер единиц',
    description: 'Перевод единиц давления, расхода, температуры',
    icon: 'ArrowLeftRight',
    path: '/tools/units-converter',
    category: 'tools',
  },
  {
    id: 'pipe-length',
    title: 'Длина трубопровода',
    description: 'Расчёт длины трубы с учётом фитингов (эквивалентная длина)',
    icon: 'Ruler',
    path: '/calculators/pipe-length',
    category: 'calculators',
  },
  {
    id: 'slope',
    title: 'Уклон канализации',
    description: 'Расчёт уклона канализационной трубы по нормативам СП 30.13330.2020',
    icon: 'TrendingDown',
    path: '/calculators/slope',
    category: 'calculators',
    isNew: true,
  },
  {
    id: 'pump-selection',
    title: 'Подбор насоса',
    description: 'Расчёт необходимых параметров насоса для системы',
    icon: 'Zap',
    path: '/planning/pump-selection',
    category: 'planning',
    isNew: true,
  },
];

export const CATEGORIES: CategoryInfo[] = [
  { id: 'calculators', title: 'Калькуляторы', icon: 'Calculator' },
  { id: 'reference', title: 'Справочники', icon: 'BookOpen' },
  { id: 'tools', title: 'Инструменты', icon: 'Wrench' },
  { id: 'planning', title: 'Проектирование', icon: 'ClipboardList' },
];
