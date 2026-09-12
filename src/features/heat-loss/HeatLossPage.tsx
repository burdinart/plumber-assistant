import { useState } from 'react';
import { Thermometer, RotateCcw, Info } from 'lucide-react';

export function HeatLossPage() {
  const [pipeDiameter, setPipeDiameter] = useState<number>(32);
  const [pipeLength, setPipeLength] = useState<number>(20);
  const [waterTemp, setWaterTemp] = useState<number>(70);
  const [ambientTemp, setAmbientTemp] = useState<number>(20);
  const [insulation, setInsulation] = useState<string>('none');
  const [result, setResult] = useState<{
    heatLossPerMeter: number;
    totalHeatLoss: number;
    tempDrop: number;
    outletTemp: number;
  } | null>(null);

  const INSULATION_FACTORS: Record<string, { name: string; factor: number }> = {
    none: { name: 'Без изоляции', factor: 1.0 },
    foam20: { name: 'Пенополиэтилен 20мм', factor: 0.3 },
    foam30: { name: 'Пенополиэтилен 30мм', factor: 0.18 },
    mineral40: { name: 'Минеральная вата 40мм', factor: 0.12 },
    elastomeric25: { name: 'Эластомер 25мм', factor: 0.15 },
  };

  const calculate = () => {
    // Упрощённый расчёт теплопотерь
    // Q = k * π * D * L * ΔT
    const D = pipeDiameter / 1000; // м
    const deltaT = waterTemp - ambientTemp;
    const insulationFactor = INSULATION_FACTORS[insulation].factor;

    // Коэффициент теплопередачи (Вт/(м·°C)) для неизолированной трубы
    const kBase = 10; // Вт/(м·°C) для стальной трубы без изоляции
    const k = kBase * insulationFactor;

    const heatLossPerMeter = k * Math.PI * D * deltaT; // Вт/м
    const totalHeatLoss = heatLossPerMeter * pipeLength; // Вт

    // Падение температуры (упрощённо)
    const waterMass = Math.PI * Math.pow(D / 2 - 0.002, 2) * pipeLength * 1000; // кг (приблизительно)
    const specificHeat = 4186; // Дж/(кг·°C)
    const tempDrop = (totalHeatLoss * 3600) / (waterMass * specificHeat); // °C за час

    setResult({
      heatLossPerMeter: heatLossPerMeter,
      totalHeatLoss: totalHeatLoss,
      tempDrop: tempDrop,
      outletTemp: waterTemp - tempDrop,
    });
  };

  const reset = () => {
    setPipeDiameter(32);
    setPipeLength(20);
    setWaterTemp(70);
    setAmbientTemp(20);
    setInsulation('none');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Thermometer className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Расчёт теплопотерь</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Расчёт теплопотерь через неизолированный/изолированный трубопровод
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
                Диаметр трубы (мм)
              </label>
              <input
                type="number"
                value={pipeDiameter}
                onChange={(e) => setPipeDiameter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="10"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Длина участка (м)
              </label>
              <input
                type="number"
                value={pipeLength}
                onChange={(e) => setPipeLength(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="1"
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Температура теплоносителя (°C)
              </label>
              <input
                type="number"
                value={waterTemp}
                onChange={(e) => setWaterTemp(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="10"
                step="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Температура окружающей среды (°C)
              </label>
              <input
                type="number"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="-30"
                step="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Изоляция
              </label>
              <select
                value={insulation}
                onChange={(e) => setInsulation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {Object.entries(INSULATION_FACTORS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={calculate}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Результаты
              </h2>
              <div className="space-y-3">
                <div className="text-center py-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                    {result.totalHeatLoss.toFixed(0)} Вт
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Общие теплопотери</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {result.heatLossPerMeter.toFixed(1)} Вт/м
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">На 1 метр</div>
                  </div>
                  <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      {result.tempDrop.toFixed(2)} °C
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Падение за час</div>
                  </div>
                </div>
                <div className="py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Температура на выходе (за час)</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {result.outletTemp.toFixed(1)} °C
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-center h-64">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <Thermometer className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Введите параметры и нажмите «Рассчитать»</p>
              </div>
            </div>
          )}

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-700 dark:text-orange-300">
                <p className="font-medium mb-1">Важно</p>
                <p>Расчёт является приближённым. Для точного проектирования используйте специализированное ПО (Danfoss, Valtec, HERZ).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
