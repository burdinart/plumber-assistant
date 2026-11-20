/**
 * Чистые расчётные функции для калькуляторов гидравлики.
 * Вынесены из компонентов страниц (pressure-calculator, water-flow-calculator),
 * чтобы логику можно было переиспользовать и покрывать unit-тестами.
 */

export const WATER_DENSITY = 1000; // кг/м³
export const GRAVITY = 9.81; // м/с²
export const DEFAULT_FRICTION_FACTOR = 0.02; // упрощённый коэффициент трения Дарси

export interface PressureInput {
  /** Высота подъёма, м */
  height: number;
  /** Длина трубопровода, м */
  pipeLength: number;
  /** Внутренний диаметр трубы, мм */
  pipeDiameter: number;
  /** Расход воды, м³/ч */
  flowRate: number;
  /** Давление на входе, бар */
  inletPressure: number;
}

export interface PressureResult {
  /** Статические потери на высоту, бар */
  staticPressure: number;
  /** Динамические потери на трение, бар */
  dynamicPressure: number;
  /** Итоговые потери (статика + динамика), бар */
  totalPressure: number;
  /** Расчётное давление в конце участка, бар */
  pressureBar: number;
  /** Скорость потока, м/с */
  velocity: number;
}

/**
 * Расчёт потерь давления на участке трубопровода.
 * Статика: P = ρgh. Динамика: упрощённая формула Дарси–Вейсбаха.
 */
export function calculatePressureLoss(input: PressureInput): PressureResult {
  const { height, pipeLength, pipeDiameter, flowRate, inletPressure } = input;

  // Статическое давление (потеря на высоту): P = ρgh
  const staticLoss = (WATER_DENSITY * GRAVITY * height) / 100000; // в бар

  // Динамические потери (упрощённый расчёт по Дарси–Вейсбаху)
  const area = Math.PI * Math.pow(pipeDiameter / 2000, 2); // м²
  const velocity = flowRate / (area * 3600); // м/с
  const dynamicLoss =
    (DEFAULT_FRICTION_FACTOR * pipeLength * Math.pow(velocity, 2)) /
    (2 * (pipeDiameter / 1000) * GRAVITY * 10); // в бар (упрощённо)

  const total = staticLoss + dynamicLoss;

  return {
    staticPressure: staticLoss,
    dynamicPressure: dynamicLoss,
    totalPressure: total,
    pressureBar: inletPressure - total,
    velocity,
  };
}

export interface FlowInput {
  /** Внутренний диаметр трубы, мм */
  diameter: number;
  /** Скорость потока, м/с */
  velocity: number;
}

export interface FlowResult {
  /** Расход, м³/ч */
  cubicMetersPerHour: number;
  /** Расход, л/мин */
  litersPerMinute: number;
  /** Площадь сечения, м² */
  area: number;
}

/** Расход через круглое сечение: Q = F · v (с переводом единиц). */
export function calculateFlow({ diameter, velocity }: FlowInput): FlowResult {
  const area = Math.PI * Math.pow(diameter / 2000, 2); // м²
  const m3perSecond = area * velocity;
  return {
    area,
    cubicMetersPerHour: m3perSecond * 3600,
    litersPerMinute: m3perSecond * 60000,
  };
}
