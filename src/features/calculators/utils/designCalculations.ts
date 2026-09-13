/**
 * Инженерные формулы для расчётов систем отопления и водоснабжения
 */

// Константы
export const PI = Math.PI;

/**
 * Стандартные диаметры труб (мм)
 */
export const STANDARD_PIPE_DIAMETERS = [
  { diameter: 15, inch: '1/2"' },
  { diameter: 20, inch: '3/4"' },
  { diameter: 25, inch: '1"' },
  { diameter: 32, inch: '1 1/4"' },
  { diameter: 40, inch: '1 1/2"' },
  { diameter: 50, inch: '2"' },
  { diameter: 65, inch: '2 1/2"' },
  { diameter: 80, inch: '3"' },
  { diameter: 100, inch: '4"' },
];

/**
 * Стандартные объёмы расширительных баков (л)
 */
export const STANDARD_TANK_VOLUMES = [8, 12, 18, 24, 35, 50, 80, 100, 150, 200];

/**
 * Рекомендуемые скорости потока (м/с)
 */
export const RECOMMENDED_VELOCITIES = {
  coldWater: { min: 0.5, max: 1.5, recommended: 1.0 },
  hotWater: { min: 0.5, max: 1.0, recommended: 0.7 },
  heating: { min: 0.3, max: 0.7, recommended: 0.5 },
};

/**
 * КАЛЬКУЛЯТОР 1: Расчёт диаметра трубы
 * Формула: D = √(4Q/πv)
 */
export function calculatePipeDiameter(
  flowRate: number, // м³/с
  velocity: number // м/с
): number {
  // D = √(4Q/πv)
  return Math.sqrt((4 * flowRate) / (PI * velocity));
}

/**
 * Конвертация расхода в м³/с
 */
export function convertFlowToM3s(value: number, unit: 'l/min' | 'm3/h' | 'l/s'): number {
  switch (unit) {
    case 'l/min':
      return value / 60000; // л/мин → м³/с
    case 'm3/h':
      return value / 3600; // м³/ч → м³/с
    case 'l/s':
      return value / 1000; // л/с → м³/с
  }
}

/**
 * Найти ближайший стандартный диаметр
 */
export function findNearestStandardDiameter(calculatedDiameter: number): {
  diameter: number;
  inch: string;
  actualVelocity: (flowRate: number) => number;
} {
  const diameterMm = calculatedDiameter * 1000;
  
  // Найти ближайший больший стандартный диаметр
  const nearest = STANDARD_PIPE_DIAMETERS.find(d => d.diameter >= diameterMm) 
    || STANDARD_PIPE_DIAMETERS[STANDARD_PIPE_DIAMETERS.length - 1];
  
  // Функция расчёта фактической скорости для выбранного диаметра
  const actualVelocity = (flowRate: number): number => {
    const area = PI * Math.pow(nearest.diameter / 2000, 2); // м²
    return flowRate / area;
  };
  
  return { ...nearest, actualVelocity };
}

/**
 * КАЛЬКУЛЯТОР 2: Расчёт циркуляционного насоса
 */

/**
 * Расчёт производительности насоса (м³/ч)
 * Формула: G = P × 0.86 / ΔT
 */
export function calculatePumpFlow(
  boilerPower: number | null, // кВт
  radiatorCount: number, // шт
  deltaT: number = 20 // °C (перепад температур)
): number {
  if (boilerPower && boilerPower > 0) {
    // По мощности котла
    return (boilerPower * 0.86) / deltaT;
  } else {
    // По количеству радиаторов (приблизительно 0.15 м³/ч на радиатор)
    return radiatorCount * 0.15;
  }
}

/**
 * Расчёт напора насоса (м)
 */
export function calculatePumpHead(
  contourLength: number, // м
  heightDifference: number, // м
  systemType: 'single-pipe' | 'two-pipe' | 'floor-heating'
): {
  frictionLoss: number;
  localLoss: number;
  geometricHead: number;
  totalHead: number;
  totalHeadWithMargin: number;
} {
  // Коэффициент потерь на трение (Па/м) в зависимости от типа системы
  const frictionFactor = systemType === 'floor-heating' ? 0.12 : 0.15;
  
  // Потери на трение
  const frictionLoss = contourLength * frictionFactor;
  
  // Потери на местные сопротивления (30% от потерь на трение)
  const localLoss = frictionLoss * 0.3;
  
  // Геометрический напор
  const geometricHead = heightDifference;
  
  // Общий напор
  const totalHead = frictionLoss + localLoss + geometricHead;
  
  // Запас 10%
  const totalHeadWithMargin = totalHead * 1.1;
  
  return {
    frictionLoss,
    localLoss,
    geometricHead,
    totalHead,
    totalHeadWithMargin,
  };
}

/**
 * КАЛЬКУЛЯТОР 3: Расчёт расширительного бака
 */

/**
 * Коэффициент расширения теплоносителя
 */
export const EXPANSION_COEFFICIENTS = {
  water: {
    '60': 0.0177,
    '70': 0.0219,
    '80': 0.0289,
    '90': 0.0359,
  },
  antifreeze: {
    '60': 0.025,
    '70': 0.032,
    '80': 0.040,
    '90': 0.045,
  },
};

/**
 * Расчёт объёма системы отопления (л)
 */
export function calculateSystemVolume(
  radiatorCount: number,
  pipeLength: number,
  pipeDiameter: number = 20 // мм
): number {
  // Радиаторы: примерно 15 л на секцию
  const radiatorVolume = radiatorCount * 15;
  
  // Трубы: объём зависит от диаметра
  const pipeArea = PI * Math.pow(pipeDiameter / 2000, 2); // м²
  const pipeVolume = pipeLength * pipeArea * 1000; // л
  
  return radiatorVolume + pipeVolume;
}

/**
 * Расчёт объёма расширительного бака
 * Формула: V = Ve × (P_max + 1) / (P_max - P_min)
 */
export function calculateExpansionTankVolume(
  systemVolume: number, // л
  expansionCoefficient: number,
  pMin: number, // бар
  pMax: number // бар
): {
  expansionVolume: number;
  tankVolume: number;
  recommendedTank: number;
  prechargePressure: number;
} {
  // Объём расширения
  const expansionVolume = systemVolume * expansionCoefficient;
  
  // Объём бака
  const tankVolume = expansionVolume * (pMax + 1) / (pMax - pMin);
  
  // Рекомендуемый стандартный объём (ближайший больший)
  const recommendedTank = STANDARD_TANK_VOLUMES.find(v => v >= tankVolume) 
    || STANDARD_TANK_VOLUMES[STANDARD_TANK_VOLUMES.length - 1];
  
  // Давление предварительной подкачки
  const prechargePressure = pMin + 0.2;
  
  return {
    expansionVolume,
    tankVolume,
    recommendedTank,
    prechargePressure,
  };
}

/**
 * КАЛЬКУЛЯТОР 4: Расчёт количества радиаторов
 */

/**
 * Мощность одной секции радиатора (Вт)
 */
export const RADIATOR_SECTION_POWER = {
  aluminum: 190, // Вт
  bimetal: 170, // Вт
  castIron: 150, // Вт
  steel: 135, // Вт
};

/**
 * Расчёт необходимой тепловой мощности
 */
export function calculateRadiatorPower(
  area: number, // м²
  ceilingHeight: number, // м
  roomType: 'living' | 'corner' | 'bathroom' | 'kitchen',
  region: 'south' | 'center' | 'north',
  insulation: 'good' | 'medium' | 'poor',
  windowCount: number
): {
  basePower: number;
  totalPower: number;
  coefficients: {
    height: number;
    type: number;
    region: number;
    insulation: number;
    windows: number;
  };
} {
  // Базовая мощность (100 Вт/м² для потолков 2.7м)
  const basePower = area * 100;
  
  // Коэффициенты
  const heightCoeff = ceilingHeight / 2.7;
  
  const typeCoeffs = {
    living: 1.0,
    corner: 1.2,
    bathroom: 1.1,
    kitchen: 1.0,
  };
  
  const regionCoeffs = {
    south: 0.9,
    center: 1.0,
    north: 1.2,
  };
  
  const insulationCoeffs = {
    good: 0.8,
    medium: 1.0,
    poor: 1.3,
  };
  
  const windowCoeff = 1 + (windowCount * 0.1);
  
  // Итоговая мощность
  const totalPower = basePower 
    * heightCoeff 
    * typeCoeffs[roomType] 
    * regionCoeffs[region] 
    * insulationCoeffs[insulation] 
    * windowCoeff;
  
  return {
    basePower,
    totalPower,
    coefficients: {
      height: heightCoeff,
      type: typeCoeffs[roomType],
      region: regionCoeffs[region],
      insulation: insulationCoeffs[insulation],
      windows: windowCoeff,
    },
  };
}

/**
 * Расчёт количества секций радиатора
 */
export function calculateRadiatorSections(
  requiredPower: number, // Вт
  radiatorType: 'aluminum' | 'bimetal' | 'castIron' | 'steel'
): number {
  const sectionPower = RADIATOR_SECTION_POWER[radiatorType];
  return Math.ceil(requiredPower / sectionPower);
}
