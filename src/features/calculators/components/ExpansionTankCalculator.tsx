import { useState } from 'react';
import { Calculator, AlertTriangle, RotateCcw } from 'lucide-react';
import {
  calculateSystemVolume,
  calculateExpansionTankVolume,
  EXPANSION_COEFFICIENTS,
  STANDARD_TANK_VOLUMES,
} from '../utils/designCalculations';

export function ExpansionTankCalculator() {
  const [calculationMethod, setCalculationMethod] = useState<'manual' | 'auto'>('auto');
  const [systemVolume, setSystemVolume] = useState<number>(150);
  const [radiatorCount, setRadiatorCount] = useState<number>(10);
  const [pipeLength, setPipeLength] = useState<number>(80);
  const [coolantType, setCoolantType] = useState<'water' | 'antifreeze'>('water');
  const [temperature, setTemperature] = useState<number>(80);
  const [pMin, setPMin] = useState<number>(1.0);
  const [pMax, setPMax] = useState<number>(3.0);

  // Расчёт объёма системы
  const calculatedSystemVolume = calculationMethod === 'auto'
    ? calculateSystemVolume(radiatorCount, pipeLength)
    : systemVolume;

  // Коэффициент расширения
  const expansionCoeff = coolantType === 'water'
    ? EXPANSION_COEFFICIENTS.water[String(temperature) as keyof typeof EXPANSION_COEFFICIENTS.water] || 0.0289
    : EXPANSION_COEFFICIENTS.antifreeze[String(temperature) as keyof typeof EXPANSION_COEFFICIENTS.antifreeze] || 0.040;

  // Расчёт бака
  const tankData = calculateExpansionTankVolume(
    calculatedSystemVolume,
    expansionCoeff,
    pMin,
    pMax
  );

  // Проверки
  const isPressureError = pMax <= pMin;
  const isTankTooSmall = tankData.recommendedTank < calculatedSystemVolume * 0.1;

  const handleReset = () => {
    setCalculationMethod('auto');
    setSystemVolume(150);
    setRadiatorCount(10);
    setPipeLength(80);
    setCoolantType('water');
    setTemperature(80);
    setPMin(1.0);
    setPMax(3.0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Расчёт расширительного бака
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Подбор объёма расширительного бака для системы отопления
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Форма ввода */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Параметры системы
          </h2>

          <div className="space-y-4">
            {/* Способ расчёта объёма */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Объём системы отопления
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => setCalculationMethod('auto')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    calculationMethod === 'auto'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Авторасчёт
                </button>
                <button
                  onClick={() => setCalculationMethod('manual')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    calculationMethod === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Вручную
                </button>
              </div>

              {calculationMethod === 'auto' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
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
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Длина труб (м)
                    </label>
                    <input
                      type="number"
                      value={pipeLength}
                      onChange={(e) => setPipeLength(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                      step="1"
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Расчётный объём системы: <span className="font-semibold text-gray-900 dark:text-white">{calculatedSystemVolume.toFixed(0)} л</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    value={systemVolume}
                    onChange={(e) => setSystemVolume(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    min="1"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Введите общий объём системы в литрах
                  </p>
                </div>
              )}
            </div>

            {/* Тип теплоносителя */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Тип теплоносителя
              </label>
              <select
                value={coolantType}
                onChange={(e) => setCoolantType(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="water">Вода</option>
                <option value="antifreeze">Антифриз (пропиленгликоль)</option>
              </select>
            </div>

            {/* Температура */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Максимальная температура (°C)
              </label>
              <select
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={60}>60°C</option>
                <option value={70}>70°C</option>
                <option value={80}>80°C</option>
                <option value={90}>90°C</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Коэффициент расширения: {(expansionCoeff * 100).toFixed(2)}%
              </p>
            </div>

            {/* Давления */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  P min (бар)
                </label>
                <input
                  type="number"
                  value={pMin}
                  onChange={(e) => setPMin(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="0.5"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Давление зарядки
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  P max (бар)
                </label>
                <input
                  type="number"
                  value={pMax}
                  onChange={(e) => setPMax(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min="1"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Рабочее давление
                </p>
              </div>
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
          {/* Ошибка давления */}
          {isPressureError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                    Ошибка в параметрах давления!
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Максимальное давление (P max) должно быть больше минимального (P min).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Основные результаты */}
          {!isPressureError && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Результаты расчёта
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Объём расширения теплоносителя:
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tankData.expansionVolume.toFixed(2)} л
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Необходимый объём бака:
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tankData.tankVolume.toFixed(2)} л
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Рекомендуемый объём бака:
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {tankData.recommendedTank} л
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Давление предварительной подкачки:
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {tankData.prechargePressure.toFixed(1)} бар
                    </p>
                  </div>
                </div>
              </div>

              {/* Предупреждение о малом баке */}
              {isTankTooSmall && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                        Малый объём бака
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Рекомендуемый объём бака ({tankData.recommendedTank} л) составляет менее 10% от объёма системы ({calculatedSystemVolume.toFixed(0)} л).
                        Это может привести к частому срабатыванию предохранительного клапана.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Стандартные объёмы баков */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Стандартные объёмы баков (л)
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {STANDARD_TANK_VOLUMES.map((volume) => (
                    <div
                      key={volume}
                      className={`py-2 px-3 rounded text-center text-sm font-medium ${
                        volume === tankData.recommendedTank
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 border-2 border-green-300 dark:border-green-700'
                          : volume >= tankData.tankVolume
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {volume}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded"></div>
                    <span>Рекомендуемый</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-50 dark:bg-blue-900/20 rounded"></div>
                    <span>Подходящие</span>
                  </div>
                </div>
              </div>

              {/* Формулы */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Формулы расчёта:
                </h3>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 font-mono">
                  <p>Ve = V_sys × e</p>
                  <p>V = Ve × (P_max + 1) / (P_max - P_min)</p>
                  <p className="pt-2 text-gray-500 dark:text-gray-500">
                    где: Ve - объём расширения, V_sys - объём системы,<br/>
                    e - коэффициент расширения, P - давление в барах
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
