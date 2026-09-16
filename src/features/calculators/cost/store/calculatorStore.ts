import { create } from 'zustand';
import type { WorkCategory, DifficultyLevel, CostEstimate } from '../types';

interface CostCalculatorState {
  selectedCategory: WorkCategory | null;
  selectedWorkTypeId: string | null;
  quantity: number;
  difficulty: DifficultyLevel;
  materialOptions: Record<string, string>;
  estimate: CostEstimate | null;
  
  setCategory: (category: WorkCategory | null) => void;
  setWorkType: (workTypeId: string | null) => void;
  setQuantity: (quantity: number) => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  setMaterialOption: (groupId: string, optionId: string) => void;
  calculate: () => void;
  reset: () => void;
}

const initialState = {
  selectedCategory: null as WorkCategory | null,
  selectedWorkTypeId: null as string | null,
  quantity: 1,
  difficulty: 'standard' as DifficultyLevel,
  materialOptions: {},
  estimate: null,
};

export const useCostCalculatorStore = create<CostCalculatorState>((set, get) => ({
  ...initialState,
  
  setCategory: (category) => {
    set({ 
      selectedCategory: category,
      selectedWorkTypeId: null,
      materialOptions: {},
      estimate: null,
    });
  },
  
  setWorkType: (workTypeId) => {
    set({ 
      selectedWorkTypeId: workTypeId,
      materialOptions: {},
      estimate: null,
    });
  },
  
  setQuantity: (quantity) => {
    set({ quantity: Math.max(1, quantity), estimate: null });
  },
  
  setDifficulty: (difficulty) => {
    set({ difficulty, estimate: null });
  },
  
  setMaterialOption: (groupId, optionId) => {
    set(state => {
      const newOptions = { ...state.materialOptions, [groupId]: optionId };
      return { materialOptions: newOptions, estimate: null };
    });
  },
  
  calculate: () => {
    const state = get();
    if (!state.selectedWorkTypeId) return;
    
    // Динамический импорт для чистой функции
    import('../logic/calculation').then(({ calculateCost }) => {
      const estimate = calculateCost({
        workTypeId: state.selectedWorkTypeId!,
        quantity: state.quantity,
        difficulty: state.difficulty,
        materialOptions: state.materialOptions,
      });
      set({ estimate });
    });
  },
  
  reset: () => {
    set(initialState);
  },
}));
