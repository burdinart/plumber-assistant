import { useState } from 'react';
import { Calculator, RotateCcw, CheckCircle } from 'lucide-react';
import {
  calculatePumpFlow,
  calculatePumpHead,
} from '../utils/designCalculations';
import { findSuitablePumps, findBestPump, BRAND_NAMES } from '../data/pumps';

export function PumpCalculator() {
  const [contourLength, setContourLength] = useState<number>(50);
  const [radiatorCount, setRadiatorCount] = useState<number>(8);
  const [heightDifference, setHeightDifference] = useState<number>(3);
  const [systemType, setSystemType] = useState<'single-pipe' | 'two-pipe' | 'floor-heating'>('two-pipe');
  const [boilerPower, setBoilerPower] = useState<number | null>(24);
  const [deltaT, setDeltaT] = useState<number>(20);

  // Расчёты
  const flow = calculatePumpFlow(boilerPower, radiatorCount, deltaT);
  const headData = calculatePumpHead(contourLength, heightDifference, systemType);
  const requiredFlow = flow;
  const requiredHead = headData.totalHeadWithMargin;

  // Подбор насосов
  const suitablePumps = findSuitablePumps(requiredFlow, requiredHead);
  const bestPump = findBestPump(requiredFlow, requiredHead);

  const handleReset = () => {
    setContourLength(50);
    setRadiatorCount(8);
    setHeightDifference(3);
    setSystemType('two-pipe');
    setBoilerPower(24);
    setDeltaT(20);
  };

  const systemTypeNames = {
    'single-pipe': 'Однотрубная',
    'two-pipe': 'Двухтрубная',
    'floor-heating': 'Тёплый пол',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Расчёт циркуляционного насоса
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Подбор насоса по производительности и напору
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма ввода */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Параметры системы
          </h2>

          <div className="space-y-4">
            {/* Тип системы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тип системы отопления
              </label>
              <select
                value={systemType}
                onChange={(e) => setSystemType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="single-pipe">Однотрубная</option>
                <option value="two-pipe">Двухтрубная</option>
                <option value="floor-heating">Тёплый пол</option>
              </select>
            </div>

            {/* Длина контура */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Общая длина контура (м)
              </label>
              <input
                type="number"
                value={contourLength}
                onChange={(e) => setContourLength(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"

              />
            </div>

            {/* Количество радиаторов */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Количество радиаторов (шт)
              </label>
              <input
                type="number"
                value={radiatorCount}
                onChange={(e) => setRadiatorCount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="1"
                step="1"
              />
            </div>

            {/* Перепад высот */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Перепад высот (м)
              </label>
              <input
                type="number"
                value={heightDifference}
                onChange={(e) => setHeightDifference(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"

              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Между котлом и самой высокой точкой
              </p>
            </div>

            {/* Мощность котла */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Мощность котла (кВт) - опционально
              </label>
              <input
                type="number"
                value={boilerPower || ''}
                onChange={(e) => setBoilerPower(e.target.value ? Number(e.target.value) : null)}
                placeholder="Не указана"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Если не указана, расчёт по количеству радиаторов
              </p>
            </div>

            {/* Перепад температур */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Перепад температур ΔT (°C)
              </label>
              <input
                type="number"
                value={deltaT}
                onChange={(e) => setDeltaT(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="5"
                step="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Обычно 20°C для радиаторов, 5-10°C для тёплого пола
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
          {/* Основные требования */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Необходимые параметры насоса
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Производительность:
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {requiredFlow.toFixed(2)} м³/ч
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Напор:
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {requiredHead.toFixed(2)} м
                </p>
              </div>
            </div>

            {/* Детализация расчёта напора */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Структура напора:
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Потери на трение:</span>
                  <span className="font-medium">{headData.frictionLoss.toFixed(2)} м</span>
                </div>
                <div className="flex justify-between">
                  <span>Местные сопротивления:</span>
                  <span className="font-medium">{headData.localLoss.toFixed(2)} м</span>
                </div>
                <div className="flex justify-between">
                  <span>Геометрический напор:</span>
                  <span className="font-medium">{headData.geometricHead.toFixed(2)} м</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Итого (без запаса):</span>
                  <span className="font-medium">{headData.totalHead.toFixed(2)} м</span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>С запасом 10%:</span>
                  <span className="font-bold">{headData.totalHeadWithMargin.toFixed(2)} м</span>
                </div>
              </div>
            </div>
          </div>

          {/* Рекомендуемый насос */}
          {bestPump && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-1">
                    Рекомендуемая модель:
                  </h3>
                  <p className="text-lg font-bold text-green-900 dark:text-green-200">
                    {bestPump.name}
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
                    <p>Производительность: до {bestPump.flow} м³/ч</p>
                    <p>Напор: до {bestPump.head} м</p>
                    <p>Мощность: {bestPump.power} Вт</p>
                    <p>Присоединение: {bestPump.connection}</p>
                    <p className="italic">{bestPump.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Все подходящие насосы */}
          {suitablePumps.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Все подходящие модели ({suitablePumps.length}):
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {suitablePumps.map((pump) => (
                  <div
                    key={pump.name}
                    className={`p-3 rounded-lg border ${
                      bestPump?.name === pump.name
                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {pump.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {BRAND_NAMES[pump.brand]} • {pump.connection}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                        <p>{pump.flow} м³/ч</p>
                        <p>{pump.head} м</p>
                        <p className="font-medium">{pump.power} Вт</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Если нет подходящих насосов */}
          {suitablePumps.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Нет подходящих насосов в справочнике
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Требуется насос с производительностью {requiredFlow.toFixed(2)} м³/ч и напором {requiredHead.toFixed(2)} м.
                    Рассмотрите промышленные модели или обратитесь к специалисту.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
