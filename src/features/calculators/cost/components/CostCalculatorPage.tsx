import React, { useState } from 'react';
import { useCostCalculatorStore } from '../store/calculatorStore';
import { getUniqueCategories, getWorkTypesByCategory, getWorkTypeById } from '../logic/calculation';
import type { WorkCategory, DifficultyLevel } from '../types';

const CATEGORY_LABELS: Record<WorkCategory, string> = {
  plumbing: '🔧 Сантехника',
  heating: '🔥 Отопление',
  sewage: '🚽 Канализация',
  'water-supply': '💧 Водоснабжение',
  bathroom: '🛁 Ванная комната',
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  simple: 'Простая (×0.85)',
  standard: 'Стандартная (×1.0)',
  complex: 'Сложная (×1.3)',
};

export const CostCalculatorPage: React.FC = () => {
  const store = useCostCalculatorStore();
  const [showResult, setShowResult] = useState(false);
  
  const categories = getUniqueCategories();
  const selectedWork = store.selectedWorkTypeId ? getWorkTypeById(store.selectedWorkTypeId) : null;
  const workTypes = store.selectedCategory ? getWorkTypesByCategory(store.selectedCategory) : [];
  
  const handleCalculate = () => {
    store.calculate();
    setShowResult(true);
  };
  
  const handleCreateOrder = () => {
    // Переход к созданию заявки с данными из калькулятора
    // TODO: Интеграция с модулем orders
    alert('Функция создания заявки будет реализована в следующей версии');
  };
  
  const canCalculate = !!store.selectedWorkTypeId;
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">💰 Калькулятор стоимости работ</h1>
      
      {/* Шаг 1: Выбор категории */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">1. Выберите категорию работ</h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => store.setCategory(cat === store.selectedCategory ? null : cat)}
              className={`p-3 rounded-lg border min-h-[48px] transition-all ${
                store.selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>
      
      {/* Шаг 2: Выбор работы */}
      {store.selectedCategory && (
        <div className="mb-6 animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">2. Выберите тип работы</h2>
          <div className="space-y-2">
            {workTypes.map(work => (
              <button
                key={work.id}
                onClick={() => store.setWorkType(work.id === store.selectedWorkTypeId ? null : work.id)}
                className={`w-full p-3 rounded-lg border text-left min-h-[48px] transition-all ${
                  store.selectedWorkTypeId === work.id
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                    : 'bg-white border-gray-300 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{work.name}</span>
                  <span className="text-sm text-gray-500">от {work.basePrice} ₽/{work.unit}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Шаг 3: Параметры */}
      {selectedWork && (
        <div className="mb-6 animate-fadeIn">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">3. Параметры расчёта</h2>
          
          {/* Количество */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество ({selectedWork.unit})
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => store.setQuantity(store.quantity - 1)}
                className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
                disabled={store.quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                value={store.quantity}
                onChange={(e) => store.setQuantity(parseInt(e.target.value) || 1)}
                className="w-24 h-12 text-center border border-gray-300 rounded-lg text-lg font-semibold"
                min="1"
              />
              <button
                onClick={() => store.setQuantity(store.quantity + 1)}
                className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Сложность */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Сложность работ</label>
            <div className="space-y-2">
              {(['simple', 'standard', 'complex'] as DifficultyLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => store.setDifficulty(level)}
                  className={`w-full p-3 rounded-lg border text-left min-h-[48px] transition-all ${
                    store.difficulty === level
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-200'
                      : 'bg-white border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {DIFFICULTY_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
          
          {/* Материалы */}
          {selectedWork.materials.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Материалы</label>
              <div className="space-y-3">
                {selectedWork.materials.map(group => (
                  <div key={group.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">{group.name}</p>
                    <select
                      value={store.materialOptions[group.id] || ''}
                      onChange={(e) => store.setMaterialOption(group.id, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white min-h-[48px]"
                    >
                      <option value="">Не выбрано</option>
                      {group.options.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} {opt.priceMultiplier !== 1.0 ? `(×${opt.priceMultiplier})` : ''} {opt.materialCost > 0 ? `+${opt.materialCost}₽` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Кнопка расчёта */}
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className={`w-full py-4 rounded-lg font-bold text-lg min-h-[48px] transition-all ${
              canCalculate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Рассчитать стоимость
          </button>
        </div>
      )}
      
      {/* Результат */}
      {showResult && store.estimate && (
        <div className="mb-6 animate-fadeIn bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-800 mb-3">✅ Результат расчёта</h2>
          
          <div className="space-y-2 mb-4">
            {store.estimate.breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.min} – {item.max} ₽</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-green-300 pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Работа:</span>
              <span className="font-medium">{store.estimate.workCost.min} – {store.estimate.workCost.max} ₽</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Материалы:</span>
              <span className="font-medium">{store.estimate.materialsCost.min} – {store.estimate.materialsCost.max} ₽</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-green-800">
              <span>Итого:</span>
              <span>{store.estimate.total.min} – {store.estimate.total.max} ₽</span>
            </div>
          </div>
          
          <button
            onClick={handleCreateOrder}
            className="w-full mt-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 min-h-[48px]"
          >
            📋 Создать заявку с этой ценой
          </button>
        </div>
      )}
    </div>
  );
};
