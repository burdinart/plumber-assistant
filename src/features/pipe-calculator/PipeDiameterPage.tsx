import { useState } from 'react';
import { CircleDot, RotateCcw, Info } from 'lucide-react';

interface PipeResult {
  diameter: number;
  velocity: number;
  reynolds: number;
  flowRegime: string;
}

export function PipeDiameterPage() {
  const [flowRate, setFlowRate] = useState<number>(2);
  const [targetVelocity, setTargetVelocity] = useState<number>(1.5);
  const [result, setResult] = useState<PipeResult | null>(null);

  const STANDARD_DIAMETERS = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200];

  const calculate = () => {
    // Q = v * A => A = Q / v => π*d²/4 = Q/v => d = √(4Q/(πv))
    const flowRateM3s = flowRate / 3600; // м³/с
    const area = flowRateM3s / targetVelocity;
    const diameterM = Math.sqrt((4 * area) / Math.PI);
    const diameterMm = diameterM * 1000;

    // Подбор стандартного диаметра (ближайший больший)
    const standardDiameter = STANDARD_DIAMETERS.find((d) => d >= diameterMm) || STANDARD_DIAMETERS[STANDARD_DIAMETERS.length - 1];

    // Реальная скорость при стандартном диаметре
    const realArea = Math.PI * Math.pow(standardDiameter / 2000, 2);
    const realVelocity = flowRateM3s / realArea;

    // Число Рейнольдса
    const nu = 1.004e-6; // кинематическая вязкость воды при 20°C
    const reynolds = (realVelocity * (standardDiameter / 1000)) / nu;

    let flowRegime = 'Ламинарный';
    if (reynolds > 4000) flowRegime = 'Турбулентный';
    else if (reynolds > 2300) flowRegime = 'Переходный';

    setResult({
      diameter: standardDiameter,
      velocity: realVelocity,
      reynolds: reynolds,
      flowRegime,
    });
  };

  const reset = () => {
    setFlowRate(2);
    setTargetVelocity(1.5);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <CircleDot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Калькулятор диаметра труб</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Подбор диаметра трубы по расходу и скорости потока
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Исходные данные
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Расход воды (м³/ч)
              </label>
              <input
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Целевая скорость потока (м/с)
              </label>
              <input
                type="number"
                value={targetVelocity}
                onChange={(e) => setTargetVelocity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min="0.1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Рекомендуемая: 0.7–1.5 м/с (ХВС), 0.2–0.6 м/с (отопление)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={calculate}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Результат
                </h2>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    DN {result.diameter}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Рекомендуемый диаметр трубы
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Скорость потока</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {result.velocity.toFixed(2)} м/с
                    </span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Число Рейнольдса</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {result.reynolds.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Режим течения</span>
                    <span className={`font-semibold ${
                      result.flowRegime === 'Турбулентный' ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {result.flowRegime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">
                    <p className="font-medium mb-1">Справка</p>
                    <p>Рекомендуемые скорости: для ХВС — 0.7–1.5 м/с, для ГВС — 0.2–0.6 м/с, для отопления — 0.2–0.6 м/с. Превышение 2.5 м/с может вызвать шум и гидроудары.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center h-64">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <CircleDot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Введите параметры и нажмите «Рассчитать»</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
