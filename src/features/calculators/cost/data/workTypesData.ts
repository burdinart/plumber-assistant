import type { WorkType } from '../types';

export const workTypesData: WorkType[] = [
  // Сантехника (5 работ)
  {
    id: 'work-001',
    name: 'Замена смесителя',
    category: 'plumbing',
    basePrice: 1500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-001',
        name: 'Тип смесителя',
        options: [
          { id: 'opt-001', name: 'Стандартный', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-002', name: 'Дизайнерский', priceMultiplier: 1.3, materialCost: 0 },
          { id: 'opt-003', name: 'С термостатом', priceMultiplier: 1.5, materialCost: 0 },
        ],
      },
      {
        id: 'mat-002',
        name: 'Подключение',
        options: [
          { id: 'opt-004', name: 'На готовые выводы', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-005', name: 'С заменой гибкой подводки', priceMultiplier: 1.2, materialCost: 500 },
        ],
      },
    ],
  },
  {
    id: 'work-002',
    name: 'Установка фильтра для воды',
    category: 'plumbing',
    basePrice: 2500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-003',
        name: 'Тип фильтра',
        options: [
          { id: 'opt-006', name: 'Кувшин', priceMultiplier: 0.5, materialCost: 0 },
          { id: 'opt-007', name: 'Проточный под мойку', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-008', name: 'Обратный осмос', priceMultiplier: 1.8, materialCost: 0 },
        ],
      },
    ],
  },
  {
    id: 'work-003',
    name: 'Замена гибкой подводки',
    category: 'plumbing',
    basePrice: 800,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'точка',
    materials: [
      {
        id: 'mat-004',
        name: 'Материал подводки',
        options: [
          { id: 'opt-009', name: 'Резиновая оплётка', priceMultiplier: 1.0, materialCost: 300 },
          { id: 'opt-010', name: 'Нержавеющая сталь', priceMultiplier: 1.2, materialCost: 500 },
          { id: 'opt-011', name: 'Сильфонная', priceMultiplier: 1.5, materialCost: 800 },
        ],
      },
    ],
  },
  {
    id: 'work-004',
    name: 'Установка водонагревателя',
    category: 'plumbing',
    basePrice: 4500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-005',
        name: 'Тип подключения',
        options: [
          { id: 'opt-012', name: 'На готовые выводы', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-013', name: 'С разводкой труб', priceMultiplier: 1.5, materialCost: 2000 },
        ],
      },
      {
        id: 'mat-006',
        name: 'Объём бака',
        options: [
          { id: 'opt-014', name: 'До 50 л', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-015', name: '50-100 л', priceMultiplier: 1.2, materialCost: 0 },
          { id: 'opt-016', name: 'Более 100 л', priceMultiplier: 1.5, materialCost: 0 },
        ],
      },
    ],
  },
  {
    id: 'work-005',
    name: 'Замена сифона',
    category: 'plumbing',
    basePrice: 1000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-007',
        name: 'Тип сифона',
        options: [
          { id: 'opt-017', name: 'Пластиковый стандарт', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-018', name: 'Хромированный', priceMultiplier: 1.5, materialCost: 500 },
          { id: 'opt-019', name: 'Скрытый монтаж', priceMultiplier: 1.8, materialCost: 800 },
        ],
      },
    ],
  },
  
  // Отопление (5 работ)
  {
    id: 'work-006',
    name: 'Монтаж радиатора отопления',
    category: 'heating',
    basePrice: 3500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-008',
        name: 'Тип подключения',
        options: [
          { id: 'opt-020', name: 'Боковое', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-021', name: 'Нижнее', priceMultiplier: 1.2, materialCost: 500 },
          { id: 'opt-022', name: 'Диагональное', priceMultiplier: 1.3, materialCost: 800 },
        ],
      },
      {
        id: 'mat-009',
        name: 'Дополнительно',
        options: [
          { id: 'opt-023', name: 'Без доп.', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-024', name: 'С кранами', priceMultiplier: 1.3, materialCost: 1500 },
          { id: 'opt-025', name: 'С термоголовкой', priceMultiplier: 1.5, materialCost: 2500 },
        ],
      },
    ],
  },
  {
    id: 'work-007',
    name: 'Замена стояка отопления',
    category: 'heating',
    basePrice: 8000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'м',
    materials: [
      {
        id: 'mat-010',
        name: 'Материал труб',
        options: [
          { id: 'opt-026', name: 'Полипропилен', priceMultiplier: 1.0, materialCost: 500 },
          { id: 'opt-027', name: 'Металлопластик', priceMultiplier: 1.2, materialCost: 700 },
          { id: 'opt-028', name: 'Сталь', priceMultiplier: 1.5, materialCost: 1000 },
        ],
      },
    ],
  },
  {
    id: 'work-008',
    name: 'Обвязка котла',
    category: 'heating',
    basePrice: 15000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'комплект',
    materials: [
      {
        id: 'mat-011',
        name: 'Тип котла',
        options: [
          { id: 'opt-029', name: 'Одноконтурный', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-030', name: 'Двухконтурный', priceMultiplier: 1.3, materialCost: 0 },
          { id: 'opt-031', name: 'Твердотопливный', priceMultiplier: 1.5, materialCost: 0 },
        ],
      },
    ],
  },
  {
    id: 'work-009',
    name: 'Монтаж тёплого пола',
    category: 'heating',
    basePrice: 1200,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'м²',
    materials: [
      {
        id: 'mat-012',
        name: 'Тип системы',
        options: [
          { id: 'opt-032', name: 'Водяной на мате', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-033', name: 'Водяной в стяжку', priceMultiplier: 1.2, materialCost: 0 },
          { id: 'opt-034', name: 'Электрический мат', priceMultiplier: 1.5, materialCost: 0 },
        ],
      },
    ],
  },
  {
    id: 'work-010',
    name: 'Установка расширительного бака',
    category: 'heating',
    basePrice: 2500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-013',
        name: 'Расположение',
        options: [
          { id: 'opt-035', name: 'На готовое место', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-036', name: 'С креплением на стену', priceMultiplier: 1.3, materialCost: 500 },
        ],
      },
    ],
  },
  
  // Канализация (4 работы)
  {
    id: 'work-011',
    name: 'Замена стояка канализации',
    category: 'sewage',
    basePrice: 6000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'м',
    materials: [
      {
        id: 'mat-014',
        name: 'Диаметр трубы',
        options: [
          { id: 'opt-037', name: 'Ø110 мм', priceMultiplier: 1.0, materialCost: 800 },
          { id: 'opt-038', name: 'Ø160 мм', priceMultiplier: 1.3, materialCost: 1200 },
        ],
      },
    ],
  },
  {
    id: 'work-012',
    name: 'Разводка канализации',
    category: 'sewage',
    basePrice: 800,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'м',
    materials: [
      {
        id: 'mat-015',
        name: 'Диаметр трубы',
        options: [
          { id: 'opt-039', name: 'Ø50 мм', priceMultiplier: 1.0, materialCost: 300 },
          { id: 'opt-040', name: 'Ø110 мм', priceMultiplier: 1.2, materialCost: 500 },
        ],
      },
    ],
  },
  {
    id: 'work-013',
    name: 'Установка унитаза',
    category: 'sewage',
    basePrice: 2500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-016',
        name: 'Тип унитаза',
        options: [
          { id: 'opt-041', name: 'Напольный', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-042', name: 'Подвесной (инсталляция)', priceMultiplier: 2.0, materialCost: 0 },
          { id: 'opt-043', name: 'Приставной', priceMultiplier: 1.3, materialCost: 0 },
        ],
      },
    ],
  },
  {
    id: 'work-014',
    name: 'Прочистка засора',
    category: 'sewage',
    basePrice: 1500,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'точка',
    materials: [
      {
        id: 'mat-017',
        name: 'Метод прочистки',
        options: [
          { id: 'opt-044', name: 'Механическая (трос)', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-045', name: 'Гидродинамическая', priceMultiplier: 2.0, materialCost: 0 },
          { id: 'opt-046', name: 'Химическая', priceMultiplier: 0.8, materialCost: 500 },
        ],
      },
    ],
  },
  
  // Водоснабжение (3 работы)
  {
    id: 'work-015',
    name: 'Разводка водоснабжения',
    category: 'water-supply',
    basePrice: 1000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'м',
    materials: [
      {
        id: 'mat-018',
        name: 'Материал труб',
        options: [
          { id: 'opt-047', name: 'Полипропилен', priceMultiplier: 1.0, materialCost: 400 },
          { id: 'opt-048', name: 'Металлопластик', priceMultiplier: 1.2, materialCost: 600 },
          { id: 'opt-049', name: 'Сшитый полиэтилен', priceMultiplier: 1.5, materialCost: 800 },
        ],
      },
    ],
  },
  {
    id: 'work-016',
    name: 'Замена стояка ХВС/ГВС',
    category: 'water-supply',
    basePrice: 7000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'м',
    materials: [
      {
        id: 'mat-019',
        name: 'Материал труб',
        options: [
          { id: 'opt-050', name: 'Полипропилен', priceMultiplier: 1.0, materialCost: 600 },
          { id: 'opt-051', name: 'Сталь оцинкованная', priceMultiplier: 1.4, materialCost: 1000 },
        ],
      },
    ],
  },
  {
    id: 'work-017',
    name: 'Установка счётчика воды',
    category: 'water-supply',
    basePrice: 2000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-020',
        name: 'Комплектация',
        options: [
          { id: 'opt-052', name: 'Только установка', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-053', name: 'С пломбировкой', priceMultiplier: 1.2, materialCost: 0 },
          { id: 'opt-054', name: 'С фильтром и краном', priceMultiplier: 1.5, materialCost: 1000 },
        ],
      },
    ],
  },
  
  // Ванная комната (3 работы)
  {
    id: 'work-018',
    name: 'Установка ванны',
    category: 'bathroom',
    basePrice: 4000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-021',
        name: 'Тип ванны',
        options: [
          { id: 'opt-055', name: 'Стальная', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-056', name: 'Акриловая', priceMultiplier: 1.2, materialCost: 0 },
          { id: 'opt-057', name: 'Чугунная', priceMultiplier: 1.5, materialCost: 0 },
        ],
      },
      {
        id: 'mat-022',
        name: 'Дополнительно',
        options: [
          { id: 'opt-058', name: 'Без доп.', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-059', name: 'С экраном', priceMultiplier: 1.3, materialCost: 1500 },
          { id: 'opt-060', name: 'С гидромассажем', priceMultiplier: 1.8, materialCost: 3000 },
        ],
      },
    ],
  },
  {
    id: 'work-019',
    name: 'Монтаж полотенцесушителя',
    category: 'bathroom',
    basePrice: 3000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-023',
        name: 'Тип подключения',
        options: [
          { id: 'opt-061', name: 'К готовым выводам', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-062', name: 'С переносом труб', priceMultiplier: 1.5, materialCost: 2000 },
        ],
      },
    ],
  },
  {
    id: 'work-020',
    name: 'Установка душевой кабины',
    category: 'bathroom',
    basePrice: 6000,
    minMultiplier: 0.9,
    maxMultiplier: 1.1,
    unit: 'шт',
    materials: [
      {
        id: 'mat-024',
        name: 'Тип кабины',
        options: [
          { id: 'opt-063', name: 'Открытая (уголок)', priceMultiplier: 1.0, materialCost: 0 },
          { id: 'opt-064', name: 'Закрытая', priceMultiplier: 1.3, materialCost: 0 },
          { id: 'opt-065', name: 'С парогенератором', priceMultiplier: 1.8, materialCost: 0 },
        ],
      },
    ],
  },
];
