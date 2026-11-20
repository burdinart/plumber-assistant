import { describe, it, expect } from 'vitest';
import {
  calculatePressureLoss,
  calculateFlow,
} from '../src/features/calculators/utils/flowCalculations';

describe('calculatePressureLoss', () => {
  it('считает статические потери по формуле ρgh (10 м ≈ 0.981 бар)', () => {
    const r = calculatePressureLoss({
      height: 10,
      pipeLength: 0,
      pipeDiameter: 25,
      flowRate: 0,
      inletPressure: 3,
    });
    expect(r.staticPressure).toBeCloseTo(0.981, 3);
    expect(r.dynamicPressure).toBe(0);
  });

  it('итоговые потери = статика + динамика, давление на выходе уменьшается', () => {
    const r = calculatePressureLoss({
      height: 5,
      pipeLength: 50,
      pipeDiameter: 25,
      flowRate: 1.5,
      inletPressure: 3,
    });
    expect(r.totalPressure).toBeCloseTo(r.staticPressure + r.dynamicPressure, 10);
    expect(r.pressureBar).toBeLessThan(3);
    expect(r.velocity).toBeGreaterThan(0);
  });

  it('нулевой расход даёт нулевые динамические потери', () => {
    const r = calculatePressureLoss({
      height: 0,
      pipeLength: 100,
      pipeDiameter: 32,
      flowRate: 0,
      inletPressure: 4,
    });
    expect(r.dynamicPressure).toBe(0);
    expect(r.pressureBar).toBe(4);
  });
});

describe('calculateFlow', () => {
  it('DN25 (внутр. 25 мм) при 1 м/с ≈ 1.77 м³/ч', () => {
    const r = calculateFlow({ diameter: 25, velocity: 1 });
    expect(r.cubicMetersPerHour).toBeCloseTo(1.767, 2);
  });

  it('согласованность единиц: л/мин = м³/ч · 1000 / 60', () => {
    const r = calculateFlow({ diameter: 32, velocity: 1.5 });
    expect(r.litersPerMinute).toBeCloseTo((r.cubicMetersPerHour * 1000) / 60, 6);
  });
});
