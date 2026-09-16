export type RegulationCategory = 'water' | 'sewage' | 'heating' | 'general';

export interface RegulationEntry {
  id: string;
  category: RegulationCategory;
  title: string;
  keywords: string[];      // для поиска, включая синонимы
  value: string;           // основное значение
  source: string;          // источник: "СП 30.13330.2020, п. 4.7"
  isQuickTable: boolean;
  quickTableGroup?: string;
}

export interface QuickTable {
  id: string;
  title: string;
  icon: string;
  rows: { label: string; value: string; source: string }[];
}
