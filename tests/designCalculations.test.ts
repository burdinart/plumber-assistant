import { describe, it, expect } from 'vitest';
import {
  calculatePipeDiameter,
  convertFlowToM3s,
  findNearestStandardDiameter,
  calculateExpansionTankVolume,
} from '../src/features/calculators/utils/designCalculations';

describe('convertFlowToM3s', () => {
  it('л/мин → м³/с', () => expect(convertFlowToM3s(60, 'l/min')).toBeCloseTo(0.001, 9));
  it('м³/ч → м³/с', () => expect(convertFlowToM3s(3.6, 'm3/h')).toBeCloseTo(0.001, 9));
  it('л/с → м³/с', () => expect(convertFlowToM3s(1, 'l/s')).toBeCloseTo(0.001, 9));
});

describe('calculatePipeDiameter', () => {
  it('Q=0.001 м³/с, v=1 м/с → D ≈ 35.7 мм', () => {
    const d = calculatePipeDiameter(0.001, 1);
    expect(d * 1000).toBeCloseTo(35.68, 1);
  });
});

describe('findNearestStandardDiameter', () => {
  it('округляет вверх до ближайшего стандартного диаметра', () => {
    const res = findNearestStandardDiameter(0.0357); // 35.7 мм
    expect(res.diameter).toBeGreaterThanOrEqual(35.7);
    expect(typeof res.inch).toBe('string');
  });

  it('фактическая скорость обратно пропорциональна площади', () => {
    const res = findNearestStandardDiameter(0.025);
    const v1 = res.actualVelocity(0.001);
    const v2 = res.actualVelocity(0.002);
    expect(v2).toBeCloseTo(v1 * 2, 10);
  });
});

describe('calculateExpansionTankVolume', () => {
  it('классический расчёт: 100 л система, k=0.04, 1→3 бар', () => {
    const r = calculateExpansionTankVolume(100, 0.04, 1, 3);
    expect(r.expansionVolume).toBeCloseTo(4, 10);
    expect(r.tankVolume).toBeCloseTo((4 * (3 + 1)) / (3 - 1), 10); // 8 л
    expect(r.recommendedTank).toBeGreaterThanOrEqual(r.tankVolume);
    expect(r.prechargePressure).toBeCloseTo(1.2, 10);
  });

  it('рекомендует максимальный стандарт при огромном объёме', () => {
    const r = calculateExpansionTankVolume(100000, 0.5, 1, 3);
    expect(r.recommendedTank).toBe(200);
  });
});
