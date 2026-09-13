import { PriceItem } from '../types';

/**
 * Типовые работы по умолчанию
 * Эти работы загружаются при первом запуске приложения
 */
export const DEFAULT_PRICE_LIST: PriceItem[] = [
  // Сантехника
  {
    id: 'plumbing-1',
    name: 'Замена смесителя',
    category: 'plumbing',
    price: 1500,
    unit: 'шт',
    description: 'Демонтаж старого, установка нового смесителя',
    isDefault: true,
  },
  {
    id: 'plumbing-2',
    name: 'Установка счётчика воды',
    category: 'plumbing',
    price: 2000,
    unit: 'шт',
    description: 'Установка счётчика ХВС или ГВС с опломбировкой',
    isDefault: true,
  },
  {
    id: 'plumbing-3',
    name: 'Замена унитаза',
    category: 'plumbing',
    price: 3000,
    unit: 'шт',
    description: 'Демонтаж старого, установка нового унитаза',
    isDefault: true,
  },
  {
    id: 'plumbing-4',
    name: 'Установка полотенцесушителя',
    category: 'plumbing',
    price: 2500,
    unit: 'шт',
    description: 'Монтаж полотенцесушителя с подключением',
    isDefault: true,
  },
  {
    id: 'plumbing-5',
    name: 'Замена сифона',
    category: 'plumbing',
    price: 1200,
    unit: 'шт',
    description: 'Замена сифона под раковиной или ванной',
    isDefault: true,
  },
  {
    id: 'plumbing-6',
    name: 'Замена трубы (за точку)',
    category: 'plumbing',
    price: 800,
    unit: 'точка',
    description: 'Замена участка трубы между двумя точками подключения',
    isDefault: true,
  },

  // Отопление
  {
    id: 'heating-1',
    name: 'Монтаж радиатора',
    category: 'heating',
    price: 2500,
    unit: 'шт',
    description: 'Установка радиатора отопления с подключением',
    isDefault: true,
  },
  {
    id: 'heating-2',
    name: 'Промывка системы отопления',
    category: 'heating',
    price: 5000,
    unit: 'шт',
    description: 'Гидродинамическая промывка системы отопления',
    isDefault: true,
  },
  {
    id: 'heating-3',
    name: 'Опрессовка системы',
    category: 'heating',
    price: 3000,
    unit: 'шт',
    description: 'Опрессовка системы отопления или водоснабжения',
    isDefault: true,
  },

  // Канализация
  {
    id: 'sewage-1',
    name: 'Прочистка канализации',
    category: 'sewage',
    price: 3000,
    unit: 'точка',
    description: 'Механическая прочистка канализации',
    isDefault: true,
  },
  {
    id: 'sewage-2',
    name: 'Установка канализационного насоса',
    category: 'sewage',
    price: 4500,
    unit: 'шт',
    description: 'Монтаж сололифта (канализационного насоса)',
    isDefault: true,
  },

  // Котлы
  {
    id: 'boilers-1',
    name: 'Установка бойлера',
    category: 'boilers',
    price: 4000,
    unit: 'шт',
    description: 'Монтаж водонагревателя с подключением',
    isDefault: true,
  },
  {
    id: 'boilers-2',
    name: 'Монтаж котла',
    category: 'boilers',
    price: 15000,
    unit: 'шт',
    description: 'Установка газового или электрического котла',
    isDefault: true,
  },
  {
    id: 'boilers-3',
    name: 'Обслуживание котла',
    category: 'boilers',
    price: 3500,
    unit: 'шт',
    description: 'Плановое техническое обслуживание котла',
    isDefault: true,
  },
  {
    id: 'boilers-4',
    name: 'Ремонт котла',
    category: 'boilers',
    price: 5000,
    unit: 'шт',
    description: 'Диагностика и ремонт котла (без стоимости запчастей)',
    isDefault: true,
  },
];
