import { useState } from 'react';
import { Droplets, RotateCcw, Info } from 'lucide-react';

export function WaterFlowPage() {
  const [diameter, setDiameter] = useState<number>(25);
  const [velocity, setVelocity] = useState<number>(1.0);
  const [result, setResult] = useState<{
    flowRateM3h: number;
    flowRateLs: number;
    flowRateLm: number;
  } | null>(null);

  const calculate = () => {
    const area = Math.PI * Math.pow(diameter / 2000, 2); // м²
    const flowRateM3s = area * velocity; // м³/с
    const flowRateM3h = flowRateM3s * 3600;
    const flowRateLs = flowRateM3s * 1000;
    const flowRateLm = flowRateLs * 60;

    setResult({ flowRateM3h, flowRateLs, flowRateLm });
  };

  const reset = () => {
    setDiameter(25);
    setVelocity(1.0);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <Droplets className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Калькулятор расхода воды</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Расчёт расхода воды по сечению трубы и скорости
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Параметры</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Внутренний диаметр трубы (мм)
              </label>
              <input
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="5"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Скорость потока (м/с)
              </label>
              <input
                type="number"
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="0.1"

              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={calculate}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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

        <div className="space-y-4">
          {result ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Расход воды</h2>
              <div className="space-y-3">
                <div className="text-center py-4 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">
                    {result.flowRateM3h.toFixed(2)}
                  </div>
                  <div className="text-sm text-cyan-600 dark:text-cyan-400">м³/ч</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800 dark:text-white">
                      {result.flowRateLs.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">л/с</div>
                  </div>
                  <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-xl font-bold text-gray-800 dark:text-white">
                      {result.flowRateLm.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">л/мин</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center h-64">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <Droplets className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Введите параметры и нажмите «Рассчитать»</p>
              </div>
            </div>
          )}

          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800 p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-cyan-700 dark:text-cyan-300">
                <p className="font-medium mb-1">Нормы расхода</p>
                <p>Умывальник: 0.1 л/с | Ванна: 0.3 л/с | Душ: 0.2 л/с | Кухонная мойка: 0.12 л/с | Унитаз: 0.1 л/с</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
