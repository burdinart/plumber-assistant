import { useState } from 'react';
import { Gauge, RotateCcw, Info } from 'lucide-react';

interface CalculationResult {
  staticPressure: number;
  dynamicPressure: number;
  totalPressure: number;
  pressureBar: number;
}

export function PressureCalculatorPage() {
  const [height, setHeight] = useState<number>(10);
  const [pipeLength, setPipeLength] = useState<number>(50);
  const [pipeDiameter, setPipeDiameter] = useState<number>(25);
  const [flowRate, setFlowRate] = useState<number>(1.5);
  const [inletPressure, setInletPressure] = useState<number>(3);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculate = () => {
    // Статическое давление (потеря на высоту): P = ρgh
    const rho = 1000; // плотность воды кг/м³
    const g = 9.81;
    const staticLoss = (rho * g * height) / 100000; // в бар

    // Динамические потери (упрощённый расчёт по Дарси-Вейсбаху)
    const area = Math.PI * Math.pow(pipeDiameter / 2000, 2); // м²
    const velocity = flowRate / (area * 3600); // м/с
    const frictionFactor = 0.02; // коэффициент трения
    const dynamicLoss =
      (frictionFactor * pipeLength * Math.pow(velocity, 2)) / (2 * (pipeDiameter / 1000) * 9.81 * 10); // в бар (упрощённо)

    const totalLoss = staticLoss + dynamicLoss;
    const outletPressure = Math.max(0, inletPressure - totalLoss);

    setResult({
      staticPressure: staticLoss,
      dynamicPressure: dynamicLoss,
      totalPressure: totalLoss,
      pressureBar: outletPressure,
    });
  };

  const reset = () => {
    setHeight(10);
    setPipeLength(50);
    setPipeDiameter(25);
    setFlowRate(1.5);
    setInletPressure(3);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Калькулятор давления</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Расчёт давления воды в системе с учётом высоты и потерь
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Параметры системы
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Давление на входе (бар)
              </label>
              <input
                type="number"
                value={inletPressure}
                onChange={(e) => setInletPressure(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Перепад высоты (м)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Длина трубопровода (м)
              </label>
              <input
                type="number"
                value={pipeLength}
                onChange={(e) => setPipeLength(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Диаметр трубы (мм)
              </label>
              <input
                type="number"
                value={pipeDiameter}
                onChange={(e) => setPipeDiameter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Расход воды (м³/ч)
              </label>
              <input
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.1"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={calculate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Рассчитать
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Результаты расчёта
                </h2>
                <div className="space-y-3">
                  <ResultRow
                    label="Давление на выходе"
                    value={`${result.pressureBar.toFixed(2)} бар`}
                    highlight
                  />
                  <ResultRow
                    label="Потери на высоту"
                    value={`${result.staticPressure.toFixed(3)} бар`}
                  />
                  <ResultRow
                    label="Потери на трение"
                    value={`${result.dynamicPressure.toFixed(3)} бар`}
                  />
                  <ResultRow
                    label="Общие потери"
                    value={`${result.totalPressure.toFixed(3)} бар`}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Рекомендации</p>
                    {result.pressureBar < 1.5 && (
                      <p>Давление ниже нормы. Рассмотрите установку повысительного насоса.</p>
                    )}
                    {result.pressureBar >= 1.5 && result.pressureBar <= 4 && (
                      <p>Давление в норме для бытового использования (1.5–4 бар).</p>
                    )}
                    {result.pressureBar > 4 && (
                      <p>Давление выше нормы. Рекомендуется установка редуктора давления.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center h-64">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <Gauge className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Введите параметры и нажмите «Рассчитать»</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
        highlight
          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
          : 'bg-gray-50 dark:bg-gray-700/50'
      }`}
    >
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? 'text-blue-700 dark:text-blue-300 text-lg' : 'text-gray-800 dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
