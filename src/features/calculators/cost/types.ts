export type WorkCategory = 'plumbing' | 'heating' | 'sewage' | 'water-supply' | 'bathroom';

export interface WorkType {
  id: string;
  name: string;
  category: WorkCategory;
  basePrice: number;       // базовая цена работы, ₽
  minMultiplier: number;   // множитель для мин цены (0.9)
  maxMultiplier: number;   // множитель для макс цены (1.1)
  unit: 'шт' | 'м' | 'точка' | 'комплект';
  materials: MaterialGroup[];
}

export interface MaterialGroup {
  id: string;
  name: string;            // напр. "Материал труб"
  options: MaterialOption[];
}

export interface MaterialOption {
  id: string;
  name: string;            // напр. "Полипропилен"
  priceMultiplier: number; // множитель к работе
  materialCost: number;    // фикс. стоимость, ₽
}

export type DifficultyLevel = 'simple' | 'standard' | 'complex';
// Множители: 0.85 / 1.0 / 1.3

export interface CostEstimate {
  workCost: { min: number; max: number };
  materialsCost: { min: number; max: number };
  total: { min: number; max: number };
  breakdown: { label: string; min: number; max: number }[];
}

export interface CostCalculationInput {
  workTypeId: string;
  quantity: number;
  difficulty: DifficultyLevel;
  materialOptions: Record<string, string>; // groupId -> optionId
}
