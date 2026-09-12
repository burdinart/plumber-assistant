export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: ModuleCategory;
  isNew?: boolean;
}

export type ModuleCategory = 'calculators' | 'reference' | 'tools' | 'planning';

export interface CategoryInfo {
  id: ModuleCategory;
  title: string;
  icon: string;
}
