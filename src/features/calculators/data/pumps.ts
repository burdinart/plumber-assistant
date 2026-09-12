/**
 * Справочник циркуляционных насосов
 * Данные для подбора насоса по производительности и напору
 */

export interface Pump {
  name: string;
  brand: 'grundfos' | 'wilo' | 'dab';
  flow: number; // Максимальная производительность (м³/ч)
  head: number; // Максимальный напор (м)
  power: number; // Потребляемая мощность (Вт)
  connection: string; // Присоединение
  description: string;
}

export const PUMPS: Pump[] = [
  // Grundfos UPS серия
  {
    name: 'Grundfos UPS 25-40',
    brand: 'grundfos',
    flow: 3.5,
    head: 4,
    power: 45,
    connection: '1"',
    description: 'Для систем отопления до 100 м²',
  },
  {
    name: 'Grundfos UPS 25-60',
    brand: 'grundfos',
    flow: 3.5,
    head: 6,
    power: 70,
    connection: '1"',
    description: 'Для систем отопления до 150 м²',
  },
  {
    name: 'Grundfos UPS 32-80',
    brand: 'grundfos',
    flow: 5.0,
    head: 8,
    power: 120,
    connection: '1¼"',
    description: 'Для систем отопления до 250 м²',
  },
  {
    name: 'Grundfos UPS 25-80',
    brand: 'grundfos',
    flow: 3.5,
    head: 8,
    power: 100,
    connection: '1"',
    description: 'Для систем отопления до 200 м²',
  },
  {
    name: 'Grundfos UPS 32-60',
    brand: 'grundfos',
    flow: 5.0,
    head: 6,
    power: 90,
    connection: '1¼"',
    description: 'Для систем отопления до 180 м²',
  },

  // Wilo Star-RS серия
  {
    name: 'Wilo Star-RS 25/4',
    brand: 'wilo',
    flow: 3.0,
    head: 4,
    power: 48,
    connection: '1"',
    description: 'Для систем отопления до 90 м²',
  },
  {
    name: 'Wilo Star-RS 25/6',
    brand: 'wilo',
    flow: 3.0,
    head: 6,
    power: 70,
    connection: '1"',
    description: 'Для систем отопления до 140 м²',
  },
  {
    name: 'Wilo Star-RS 25/8',
    brand: 'wilo',
    flow: 3.0,
    head: 8,
    power: 95,
    connection: '1"',
    description: 'Для систем отопления до 190 м²',
  },
  {
    name: 'Wilo Star-RS 30/6',
    brand: 'wilo',
    flow: 5.5,
    head: 6,
    power: 90,
    connection: '1¼"',
    description: 'Для систем отопления до 170 м²',
  },

  // DAB серия
  {
    name: 'DAB VA 35/130',
    brand: 'dab',
    flow: 3.5,
    head: 4,
    power: 50,
    connection: '1"',
    description: 'Для систем отопления до 100 м²',
  },
  {
    name: 'DAB VA 55/130',
    brand: 'dab',
    flow: 5.0,
    head: 5,
    power: 75,
    connection: '1¼"',
    description: 'Для систем отопления до 150 м²',
  },
  {
    name: 'DAB VA 65/130',
    brand: 'dab',
    flow: 6.0,
    head: 7,
    power: 110,
    connection: '1¼"',
    description: 'Для систем отопления до 220 м²',
  },
];

/**
 * Подбор насоса по производительности и напору
 * Возвращает список подходящих насосов
 */
export function findSuitablePumps(requiredFlow: number, requiredHead: number): Pump[] {
  return PUMPS.filter(pump => 
    pump.flow >= requiredFlow && pump.head >= requiredHead
  ).sort((a, b) => {
    // Сортировка: сначала по близости к требуемым параметрам
    const aDiff = Math.abs(a.flow - requiredFlow) + Math.abs(a.head - requiredHead);
    const bDiff = Math.abs(b.flow - requiredFlow) + Math.abs(b.head - requiredHead);
    return aDiff - bDiff;
  });
}

/**
 * Получить лучший насос (минимальная мощность при соответствии требованиям)
 */
export function findBestPump(requiredFlow: number, requiredHead: number): Pump | null {
  const suitable = findSuitablePumps(requiredFlow, requiredHead);
  if (suitable.length === 0) return null;
  
  // Возвращаем насос с минимальной мощностью
  return suitable.reduce((best, pump) => 
    pump.power < best.power ? pump : best
  );
}

/**
 * Названия брендов для отображения
 */
export const BRAND_NAMES: Record<string, string> = {
  grundfos: 'Grundfos',
  wilo: 'Wilo',
  dab: 'DAB',
};
