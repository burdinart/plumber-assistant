import { useState } from 'react';
import { Calculator, AlertTriangle, RotateCcw } from 'lucide-react';
import {
  calculatePipeDiameter,
  convertFlowToM3s,
  findNearestStandardDiameter,
  RECOMMENDED_VELOCITIES,
} from '../utils/designCalculations';

export function PipeDiameterCalculator() {
  const [flowRate, setFlowRate] = useState<number>(1.5);
  const [flowUnit, setFlowUnit] = useState<'l/min' | 'm3/h' | 'l/s'>('l/min');
  const [velocity, setVelocity] = useState<number>(1.0);
  const [systemType, setSystemType] = useState<'coldWater' | 'hotWater' | 'heating'>('coldWater');

  // Расчёт
  const flowRateM3s = convertFlowToM3s(flowRate, flowUnit);
  const calculatedDiameter = calculatePipeDiameter(flowRateM3s, velocity);
  const diameterMm = calculatedDiameter * 1000;
  const nearest = findNearestStandardDiameter(calculatedDiameter);
  const actualVelocity = nearest.actualVelocity(flowRateM3s);

  // Проверки
  const isHighVelocity = actualVelocity > 2.0;
  const recommendedVelocity = RECOMMENDED_VELOCITIES[systemType];

  const handleReset = () => {
    setFlowRate(1.5);
    setFlowUnit('l/min');
    setVelocity(1.0);
    setSystemType('coldWater');
  };

  const handleSystemTypeChange = (type: 'coldWater' | 'hotWater' | 'heating') => {
    setSystemType(type);
    setVelocity(RECOMMENDED_VELOCITIES[type].recommended);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Расчёт диаметра трубы
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Подбор диаметра трубы по расходу и скорости потока
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма ввода */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Исходные данные
          </h2>

          <div className="space-y-4">
            {/* Тип системы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тип системы
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSystemTypeChange('coldWater')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    systemType === 'coldWater'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ХВС
                </button>
                <button
                  onClick={() => handleSystemTypeChange('hotWater')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    systemType === 'hotWater'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  ГВС
                </button>
                <button
                  onClick={() => handleSystemTypeChange('heating')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    systemType === 'heating'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Отопление
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Рекомендуемая скорость: {recommendedVelocity.min}-{recommendedVelocity.max} м/с
              </p>
            </div>

            {/* Расход воды */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Расход воды
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0"

                />
                <select
                  value={flowUnit}
                  onChange={(e) => setFlowUnit(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="l/min">л/мин</option>
                  <option value="m3/h">м³/ч</option>
                  <option value="l/s">л/с</option>
                </select>
              </div>
            </div>

            {/* Скорость потока */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Скорость потока (м/с)
              </label>
              <input
                type="number"
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0.1"

              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Формула: D = √(4Q/πv)
              </p>
            </div>

            {/* Кнопка сброса */}
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Сбросить
            </button>
          </div>
        </div>

        {/* Результаты */}
        <div className="space-y-4">
          {/* Основной результат */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Результаты расчёта
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Расчётный диаметр:
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {diameterMm.toFixed(1)} мм
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Рекомендуемый стандартный диаметр:
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {nearest.diameter} мм ({nearest.inch})
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Фактическая скорость при выбранном диаметре:
                </p>
                <p className={`text-xl font-bold ${
                  isHighVelocity 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {actualVelocity.toFixed(2)} м/с
                </p>
              </div>
            </div>
          </div>

          {/* Предупреждения */}
          {isHighVelocity && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                    Высокая скорость потока!
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Скорость {actualVelocity.toFixed(2)} м/с превышает 2 м/с. Это может вызвать:
                  </p>
                  <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside mt-2">
                    <li>Шум в трубопроводе</li>
                    <li>Эрозию стенок труб</li>
                    <li>Повышенный износ арматуры</li>
                  </ul>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                    Рекомендуется увеличить диаметр трубы или снизить расход.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Скорость вне рекомендуемого диапазона */}
          {!isHighVelocity && (actualVelocity < recommendedVelocity.min || actualVelocity > recommendedVelocity.max) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Скорость вне рекомендуемого диапазона
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Для данной системы рекомендуется скорость {recommendedVelocity.min}-{recommendedVelocity.max} м/с.
                    Текущая скорость: {actualVelocity.toFixed(2)} м/с.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Таблица стандартных диаметров */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Стандартные диаметры труб
            </h3>
            <div className="space-y-1 text-sm">
              {[
                { diameter: 15, inch: '1/2"' },
                { diameter: 20, inch: '3/4"' },
                { diameter: 25, inch: '1"' },
                { diameter: 32, inch: '1 1/4"' },
                { diameter: 40, inch: '1 1/2"' },
                { diameter: 50, inch: '2"' },
              ].map((pipe) => (
                <div
                  key={pipe.diameter}
                  className={`flex justify-between py-1 px-2 rounded ${
                    pipe.diameter === nearest.diameter
                      ? 'bg-green-100 dark:bg-green-900/30 font-semibold text-green-900 dark:text-green-200'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{pipe.diameter} мм</span>
                  <span>{pipe.inch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
