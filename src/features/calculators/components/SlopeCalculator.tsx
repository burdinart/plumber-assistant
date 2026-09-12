import { useState, useMemo } from 'react';
import { TrendingDown, RotateCcw, Info, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * Нормативные уклоны по СП 30.13330.2020
 * Уклон указан в м/м (безразмерная величина)
 */
const PIPE_DIAMETERS = [
  { diameter: 50, slope: 0.03, description: '50 мм — умывальник, ванна, душ' },
  { diameter: 110, slope: 0.02, description: '110 мм — унитаз, стояк' },
  { diameter: 160, slope: 0.008, description: '160 мм — выпуск, наружная сеть' },
  { diameter: 200, slope: 0.007, description: '200 мм — дворовая сеть' },
];

interface CalculationResult {
  totalDrop: number; // общий перепад в см
  dropPerMeter: number; // перепад на 1 метр в см
  slope: number; // уклон в м/м
  warning: 'too_steep' | 'too_flat' | null;
}

export function SlopeCalculator() {
  const [selectedDiameter, setSelectedDiameter] = useState<number>(110);
  const [slope, setSlope] = useState<number>(0.02);
  const [length, setLength] = useState<number>(10);
  const [manualSlope, setManualSlope] = useState<boolean>(false);

  // При изменении диаметра — обновляем уклон (если не ручной режим)
  const handleDiameterChange = (diameter: number) => {
    setSelectedDiameter(diameter);
    if (!manualSlope) {
      const pipe = PIPE_DIAMETERS.find((p) => p.diameter === diameter);
      if (pipe) {
        setSlope(pipe.slope);
      }
    }
  };

  // Расчёт результатов
  const result: CalculationResult = useMemo(() => {
    const totalDrop = length * slope * 100; // в сантиметрах
    const dropPerMeter = slope * 100; // см на метр

    let warning: 'too_steep' | 'too_flat' | null = null;
    if (dropPerMeter > 15) {
      warning = 'too_steep';
    } else if (dropPerMeter < 1) {
      warning = 'too_flat';
    }

    return {
      totalDrop,
      dropPerMeter,
      slope,
      warning,
    };
  }, [length, slope]);

  const reset = () => {
    setSelectedDiameter(110);
    setSlope(0.02);
    setLength(10);
    setManualSlope(false);
  };

  const handleSlopeChange = (value: number) => {
    setSlope(value);
    setManualSlope(true);
  };

  // Рекомендация по креплению
  const getMountingRecommendation = () => {
    if (selectedDiameter <= 50) return 'Каждые 0.5–1 метр';
    if (selectedDiameter <= 110) return 'Каждые 1–1.5 метра';
    return 'Каждые 1.5–2 метра';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
          <TrendingDown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Уклон канализационной трубы
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Расчёт перепада высоты по нормативам СП 30.13330.2020
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Параметры трубы
          </h2>

          <div className="space-y-4">
            {/* Диаметр трубы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Диаметр трубы
              </label>
              <select
                value={selectedDiameter}
                onChange={(e) => handleDiameterChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {PIPE_DIAMETERS.map((pipe) => (
                  <option key={pipe.diameter} value={pipe.diameter}>
                    {pipe.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Уклон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Уклон (м/м)
                {manualSlope && (
                  <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                    (ручной режим)
                  </span>
                )}
              </label>
              <input
                type="number"
                value={slope}
                onChange={(e) => handleSlopeChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0.001"
                max="0.1"
                step="0.001"
              />
              <p className="text-xs text-gray-400 mt-1">
                Нормативный: {(slope * 100).toFixed(1)} см на 1 метр
              </p>
              {manualSlope && (
                <button
                  onClick={() => {
                    setManualSlope(false);
                    const pipe = PIPE_DIAMETERS.find((p) => p.diameter === selectedDiameter);
                    if (pipe) setSlope(pipe.slope);
                  }}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline mt-1"
                >
                  Вернуть нормативное значение
                </button>
              )}
            </div>

            {/* Длина участка */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Длина участка (м)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0.1"
                max="1000"
                step="0.1"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Сбросить
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Main result */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Результаты расчёта
            </h2>

            <div className="text-center py-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800 mb-4">
              <div className="text-4xl font-bold text-teal-700 dark:text-teal-300">
                {result.totalDrop.toFixed(1)} см
              </div>
              <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">
                Общий перепад высоты
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Перепад на 1 метр</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {result.dropPerMeter.toFixed(2)} см/м
                </span>
              </div>
              <div className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Уклон</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {result.slope.toFixed(4)} м/м
                </span>
              </div>
              <div className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-300">Крепление трубы</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {getMountingRecommendation()}
                </span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {result.warning === 'too_steep' && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <p className="font-medium mb-1">Слишком большой уклон!</p>
                  <p>
                    Перепад более 15 см/м — возможен срыв гидрозатвора и появление шума в канализации. 
                    Рекомендуется уменьшить уклон.
                  </p>
                </div>
              </div>
            </div>
          )}

          {result.warning === 'too_flat' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium mb-1">Слишком малый уклон!</p>
                  <p>
                    Перепад менее 1 см/м — высокий риск засоров. Стоки не будут самоочищаться. 
                    Необходимо увеличить уклон.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!result.warning && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p className="font-medium">Уклон в норме</p>
                  <p>Параметры соответствуют нормативам.</p>
                </div>
              </div>
            </div>
          )}

          {/* Visual scheme */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
              Схема трубы
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <svg viewBox="0 0 400 120" className="w-full h-32">
                {/* Ground line */}
                <line x1="20" y1="100" x2="380" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4" className="text-gray-300 dark:text-gray-600" />
                
                {/* Pipe */}
                <line
                  x1="30"
                  y1={80 - result.totalDrop * 2}
                  x2="370"
                  y2="80"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-teal-500"
                />
                
                {/* Start point */}
                <circle cx="30" cy={80 - result.totalDrop * 2} r="6" className="fill-teal-600 dark:fill-teal-400" />
                <text x="30" y={65 - result.totalDrop * 2} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs">
                  Начало
                </text>
                
                {/* End point */}
                <circle cx="370" cy="80" r="6" className="fill-teal-600 dark:fill-teal-400" />
                <text x="370" y="98" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs">
                  Конец
                </text>
                
                {/* Drop indicator */}
                <line
                  x1="30"
                  y1={80 - result.totalDrop * 2}
                  x2="30"
                  y2="80"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3"
                  className="text-gray-400 dark:text-gray-500"
                />
                <text x="15" y={80 - result.totalDrop} textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs" transform={`rotate(-90, 15, ${80 - result.totalDrop})`}>
                  {result.totalDrop.toFixed(1)} см
                </text>
                
                {/* Length indicator */}
                <line x1="30" y1="110" x2="370" y2="110" stroke="currentColor" strokeWidth="1" className="text-gray-400 dark:text-gray-500" />
                <text x="200" y="118" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-xs">
                  {length} м
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Нормативные уклоны (СП 30.13330.2020)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-300 font-medium">
                  Диаметр трубы
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-300 font-medium">
                  Уклон (м/м)
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-300 font-medium">
                  Перепад (см/м)
                </th>
                <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-300 font-medium">
                  Применение
                </th>
              </tr>
            </thead>
            <tbody>
              {PIPE_DIAMETERS.map((pipe) => (
                <tr
                  key={pipe.diameter}
                  className={`border-b border-gray-100 dark:border-gray-700 ${
                    pipe.diameter === selectedDiameter
                      ? 'bg-teal-50 dark:bg-teal-900/20'
                      : ''
                  }`}
                >
                  <td className="py-2 px-3 font-medium text-gray-800 dark:text-white">
                    {pipe.diameter} мм
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300">
                    {pipe.slope.toFixed(3)}
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300">
                    {(pipe.slope * 100).toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-300">
                    {pipe.description.split(' — ')[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Справка</p>
              <p>
                Оптимальный уклон для бытовой канализации — 2-3 см на метр. 
                Минимальный уклон определяется расчётом на самоочищающуюся скорость (не менее 0.7 м/с). 
                Данные соответствуют СП 30.13330.2020 «Внутренний водопровод и канализация зданий».
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
