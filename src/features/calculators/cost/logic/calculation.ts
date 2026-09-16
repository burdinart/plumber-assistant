import type { WorkType, CostEstimate, CostCalculationInput, DifficultyLevel } from '../types';
import { workTypesData } from '../data/workTypesData';

const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  simple: 0.85,
  standard: 1.0,
  complex: 1.3,
};

/**
 * Округление до сотен
 */
function roundToHundreds(value: number): number {
  return Math.round(value / 100) * 100;
}

/**
 * Найти работу по ID
 */
export function getWorkTypeById(id: string): WorkType | undefined {
  return workTypesData.find(work => work.id === id);
}

/**
 * Получить все работы категории
 */
export function getWorkTypesByCategory(category: WorkType['category']): WorkType[] {
  return workTypesData.filter(work => work.category === category);
}

/**
 * Получить уникальные категории
 */
export function getUniqueCategories(): WorkType['category'][] {
  const categories = new Set(workTypesData.map(w => w.category));
  return Array.from(categories);
}

/**
 * Чистая функция расчёта стоимости
 * Логика:
 * 1. workBase = basePrice × quantity × difficultyMultiplier
 * 2. workCost.min = workBase × 0.9, workCost.max = workBase × 1.1
 * 3. materialsCost = Σ(option.materialCost × quantity), диапазон ×0.9–×1.1
 * 4. Если priceMultiplier ≠ 1.0 → применить к workBase
 * 5. total = workCost + materialsCost
 * 6. Округление всех сумм до сотен: Math.round(x / 100) * 100
 */
export function calculateCost(input: CostCalculationInput): CostEstimate | null {
  const work = getWorkTypeById(input.workTypeId);
  if (!work) return null;
  
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[input.difficulty];
  const quantity = input.quantity || 1;
  
  // Базовая стоимость работы
  let workBase = work.basePrice * quantity * difficultyMultiplier;
  
  // Применяем множители материалов к работе
  let totalMaterialMultiplier = 1;
  let totalMaterialCost = 0;
  const breakdown: { label: string; min: number; max: number }[] = [];
  
  for (const group of work.materials) {
    const selectedOptionId = input.materialOptions[group.id];
    if (selectedOptionId) {
      const option = group.options.find(opt => opt.id === selectedOptionId);
      if (option) {
        totalMaterialMultiplier *= option.priceMultiplier;
        totalMaterialCost += option.materialCost * quantity;
        breakdown.push({
          label: `${group.name}: ${option.name}`,
          min: roundToHundreds(option.materialCost * quantity * 0.9),
          max: roundToHundreds(option.materialCost * quantity * 1.1),
        });
      }
    }
  }
  
  // Применяем множитель материалов к базовой стоимости работы
  workBase *= totalMaterialMultiplier;
  
  // Расчёт стоимости работы с диапазоном
  const workCostMin = workBase * work.minMultiplier;
  const workCostMax = workBase * work.maxMultiplier;
  
  // Расчёт стоимости материалов с диапазоном
  const materialsCostMin = totalMaterialCost * 0.9;
  const materialsCostMax = totalMaterialCost * 1.1;
  
  // Итоговая стоимость
  const totalMin = workCostMin + materialsCostMin;
  const totalMax = workCostMax + materialsCostMax;
  
  // Добавляем работу в breakdown
  breakdown.unshift({
    label: `Работа (${work.unit})`,
    min: roundToHundreds(workCostMin),
    max: roundToHundreds(workCostMax),
  });
  
  return {
    workCost: {
      min: roundToHundreds(workCostMin),
      max: roundToHundreds(workCostMax),
    },
    materialsCost: {
      min: roundToHundreds(materialsCostMin),
      max: roundToHundreds(materialsCostMax),
    },
    total: {
      min: roundToHundreds(totalMin),
      max: roundToHundreds(totalMax),
    },
    breakdown,
  };
}
