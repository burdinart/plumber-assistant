import { useState } from 'react';
import { Ruler, RotateCcw, Info } from 'lucide-react';

interface FittingEquivalent {
  name: string;
  diameter: number;
  equivalentLength: number; // в диаметрах трубы
}

const FITTING_DATA: FittingEquivalent[] = [
  { name: 'Уголок 90°', diameter: 0, equivalentLength: 30 },
  { name: 'Уголок 45°', diameter: 0, equivalentLength: 15 },
  { name: 'Тройник (проход)', diameter: 0, equivalentLength: 20 },
  { name: 'Тройник (ответвление)', diameter: 0, equivalentLength: 60 },
  { name: 'Муфта', diameter: 0, equivalentLength: 5 },
  { name: 'Задвижка (открытая)', diameter: 0, equivalentLength: 8 },
  { name: 'Обратный клапан', diameter: 0, equivalentLength: 100 },
  { name: 'Вентиль прямоточный', diameter: 0, equivalentLength: 150 },
];

export function PipeLengthPage() {
  const [actualLength, setActualLength] = useState<number>(30);
  const [diameter, setDiameter] = useState<number>(25);
  const [fittings, setFittings] = useState<Record<string, number>>({
    'Уголок 90°': 4,
    'Уголок 45°': 0,
    'Тройник (проход)': 2,
    'Тройник (ответвление)': 1,
    'Муфта': 3,
    'Задвижка (открытая)': 1,
    'Обратный клапан': 0,
    'Вентиль прямоточный': 0,
  });

  const calculate = () => {
    let totalEquivalent = 0;
    const details: { name: string; count: number; eqPerUnit: number; total: number }[] = [];

    FITTING_DATA.forEach((fitting) => {
      const count = fittings[fitting.name] || 0;
      if (count > 0) {
        const eqLength = fitting.equivalentLength * (diameter / 1000); // в метрах
        const total = count * eqLength;
        totalEquivalent += total;
        details.push({
          name: fitting.name,
          count,
          eqPerUnit: eqLength,
          total,
        });
      }
    });

    return {
      actualLength,
      equivalentLength: totalEquivalent,
      totalLength: actualLength + totalEquivalent,
      details,
    };
  };

  const result = calculate();

  const updateFitting = (name: string, value: number) => {
    setFittings((prev) => ({ ...prev, [name]: Math.max(0, value) }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Ruler className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Длина трубопровода</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Расчёт эквивалентной длины с учётом местных сопротивлений
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Параметры
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Фактическая длина трубы (м)
                </label>
                <input
                  type="number"
                  value={actualLength}
                  onChange={(e) => setActualLength(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Диаметр трубы (мм)
                </label>
                <input
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10"
                  step="1"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Фитинги и арматура
            </h2>
            <div className="space-y-2">
              {FITTING_DATA.map((fitting) => (
                <div key={fitting.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300 flex-1">
                    {fitting.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFitting(fitting.name, (fittings[fitting.name] || 0) - 1)}
                      className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800 dark:text-white">
                      {fittings[fitting.name] || 0}
                    </span>
                    <button
                      onClick={() => updateFitting(fitting.name, (fittings[fitting.name] || 0) + 1)}
                      className="w-7 h-7 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Результаты
            </h2>
            <div className="space-y-3">
              <div className="text-center py-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {result.totalLength.toFixed(1)} м
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Эквивалентная длина
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {result.actualLength} м
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Фактическая</div>
                </div>
                <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    +{result.equivalentLength.toFixed(1)} м
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">На фитинги</div>
                </div>
              </div>
            </div>
          </div>

          {result.details.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                Детализация:
              </h3>
              <div className="space-y-1">
                {result.details.map((d) => (
                  <div key={d.name} className="flex justify-between text-sm py-1 px-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <span className="text-gray-600 dark:text-gray-300">
                      {d.name} × {d.count}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      +{d.total.toFixed(2)} м
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Метод эквивалентной длины</p>
                <p>Каждый фитинг заменяется эквивалентным участком прямой трубы. Эквивалентная длина выражается в диаметрах трубы и конвертируется в метры.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
