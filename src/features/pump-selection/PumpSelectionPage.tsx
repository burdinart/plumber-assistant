import { useState } from 'react';
import { Zap, RotateCcw, Info, Check, AlertTriangle } from 'lucide-react';

interface PumpResult {
  requiredHead: number;
  requiredFlow: number;
  pumpPower: number;
  recommendation: string;
  suitable: boolean;
}

export function PumpSelectionPage() {
  const [geodeticHeight, setGeodeticHeight] = useState<number>(5);
  const [pipeLength, setPipeLength] = useState<number>(30);
  const [pipeDiameter, setPipeDiameter] = useState<number>(32);
  const [flowRate, setFlowRate] = useState<number>(3);
  const [fittingsCount, setFittingsCount] = useState<number>(8);
  const [result, setResult] = useState<PumpResult | null>(null);

  const calculate = () => {
    // Геометрический напор
    const geoHead = geodeticHeight;

    // Потери на трение (упрощённый расчёт)
    const D = pipeDiameter / 1000;
    const area = Math.PI * Math.pow(D / 2, 2);
    const flowM3s = flowRate / 3600;
    const velocity = flowM3s / area;
    const frictionFactor = 0.02;
    const frictionLoss = (frictionFactor * pipeLength * Math.pow(velocity, 2)) / (2 * D * 9.81);

    // Местные сопротивления (приблизительно 30% от потерь на трение)
    const localLoss = frictionLoss * 0.3 * (fittingsCount / 10);

    // Общий напор
    const totalHead = geoHead + frictionLoss + localLoss;

    // Необходимая мощность насоса
    const rho = 1000;
    const g = 9.81;
    const eta = 0.5; // КПД насоса
    const power = (rho * g * flowM3s * totalHead) / (eta * 1000); // кВт

    let recommendation = '';
    let suitable = true;

    if (totalHead < 3) {
      recommendation = 'Маломощный циркуляционный насос (25-40 Вт)';
    } else if (totalHead < 8) {
      recommendation = 'Стандартный циркуляционный насос (40-80 Вт)';
    } else if (totalHead < 15) {
      recommendation = 'Повысительный насос средней мощности (80-150 Вт)';
    } else if (totalHead < 30) {
      recommendation = 'Мощный повысительный насос (150-400 Вт)';
    } else {
      recommendation = 'Требуется профессиональная насосная станция';
      suitable = false;
    }

    setResult({
      requiredHead: totalHead,
      requiredFlow: flowRate,
      pumpPower: power,
      recommendation,
      suitable,
    });
  };

  const reset = () => {
    setGeodeticHeight(5);
    setPipeLength(30);
    setPipeDiameter(32);
    setFlowRate(3);
    setFittingsCount(8);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Подбор насоса</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Расчёт необходимых параметров насоса для системы
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Параметры системы
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Геометрическая высота подъёма (м)
              </label>
              <input
                type="number"
                value={geodeticHeight}
                onChange={(e) => setGeodeticHeight(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Общая длина трубопровода (м)
              </label>
              <input
                type="number"
                value={pipeLength}
                onChange={(e) => setPipeLength(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Диаметр трубопровода (мм)
              </label>
              <input
                type="number"
                value={pipeDiameter}
                onChange={(e) => setPipeDiameter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="15"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Требуемый расход (м³/ч)
              </label>
              <input
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Кол-во фитингов/арматуры (шт)
              </label>
              <input
                type="number"
                value={fittingsCount}
                onChange={(e) => setFittingsCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="0"
                step="1"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={calculate}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Подобрать насос
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
                  Требования к насосу
                </h2>
                <div className="space-y-3">
                  <div className="text-center py-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      {result.requiredHead.toFixed(1)} м
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Необходимый напор</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {result.requiredFlow.toFixed(1)} м³/ч
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Расход</div>
                    </div>
                    <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                      <div className="text-lg font-bold text-gray-800 dark:text-white">
                        {result.pumpPower.toFixed(0)} Вт
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Мощность</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl border p-4 ${
                result.suitable
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-start gap-2">
                  {result.suitable ? (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className={`text-sm ${
                    result.suitable ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'
                  }`}>
                    <p className="font-medium mb-1">Рекомендация</p>
                    <p>{result.recommendation}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center h-64">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Введите параметры и нажмите «Подобрать насос»</p>
              </div>
            </div>
          )}

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-700 dark:text-purple-300">
                <p className="font-medium mb-1">Совет</p>
                <p>При подборе насоса добавьте запас 15-20% по напору. Для систем отопления выбирайте насос с 3 скоростями.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
