import { useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';

type UnitType = 'pressure' | 'flow' | 'temperature' | 'length';

interface UnitDef {
  id: string;
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNITS: Record<UnitType, UnitDef[]> = {
  pressure: [
    { id: 'bar', name: 'Бар', toBase: (v) => v, fromBase: (v) => v },
    { id: 'atm', name: 'Атмосфера', toBase: (v) => v * 1.01325, fromBase: (v) => v / 1.01325 },
    { id: 'pa', name: 'Паскаль (Па)', toBase: (v) => v / 100000, fromBase: (v) => v * 100000 },
    { id: 'kpa', name: 'кПа', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { id: 'mpa', name: 'МПа', toBase: (v) => v * 10, fromBase: (v) => v / 10 },
    { id: 'psi', name: 'PSI', toBase: (v) => v * 0.06895, fromBase: (v) => v / 0.06895 },
    { id: 'mmhg', name: 'мм рт.ст.', toBase: (v) => v * 0.001333, fromBase: (v) => v / 0.001333 },
    { id: 'kgcm2', name: 'кгс/см²', toBase: (v) => v * 0.98066, fromBase: (v) => v / 0.98066 },
  ],
  flow: [
    { id: 'm3h', name: 'м³/ч', toBase: (v) => v, fromBase: (v) => v },
    { id: 'ls', name: 'л/с', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
    { id: 'lm', name: 'л/мин', toBase: (v) => v * 0.06, fromBase: (v) => v / 0.06 },
    { id: 'm3s', name: 'м³/с', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { id: 'gh', name: 'галлон/ч', toBase: (v) => v * 0.003785, fromBase: (v) => v / 0.003785 },
  ],
  temperature: [
    { id: 'c', name: '°C (Цельсий)', toBase: (v) => v, fromBase: (v) => v },
    { id: 'f', name: '°F (Фаренгейт)', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { id: 'k', name: 'K (Кельвин)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  length: [
    { id: 'm', name: 'Метры', toBase: (v) => v, fromBase: (v) => v },
    { id: 'cm', name: 'Сантиметры', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { id: 'mm', name: 'Миллиметры', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { id: 'ft', name: 'Футы', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { id: 'in', name: 'Дюймы', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
};

const TYPE_NAMES: Record<UnitType, string> = {
  pressure: 'Давление',
  flow: 'Расход',
  temperature: 'Температура',
  length: 'Длина',
};

export function UnitsConverterPage() {
  const [unitType, setUnitType] = useState<UnitType>('pressure');
  const [fromUnit, setFromUnit] = useState(UNITS.pressure[0].id);
  const [toUnit, setToUnit] = useState(UNITS.pressure[1].id);
  const [inputValue, setInputValue] = useState<number>(1);

  const units = UNITS[unitType];
  const from = units.find((u) => u.id === fromUnit)!;
  const to = units.find((u) => u.id === toUnit)!;

  const baseValue = from.toBase(inputValue);
  const result = to.fromBase(baseValue);

  const handleTypeChange = (type: UnitType) => {
    setUnitType(type);
    setFromUnit(UNITS[type][0].id);
    setToUnit(UNITS[type][1].id);
    setInputValue(1);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Конвертер единиц</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Перевод единиц давления, расхода, температуры и длины
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Type selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(TYPE_NAMES) as UnitType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                unitType === type
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {TYPE_NAMES[type]}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Из
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-2"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={swap}
              className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              В
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white mb-2"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <div className="w-full px-3 py-3 border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-lg font-semibold">
              {result.toFixed(6).replace(/\.?0+$/, '')}
            </div>
          </div>
        </div>

        {/* All conversions table */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Все единицы ({TYPE_NAMES[unitType].toLowerCase()}):
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {units.map((u) => {
              const val = u.fromBase(baseValue);
              return (
                <div key={u.id} className="py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{u.name}</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {val.toFixed(6).replace(/\.?0+$/, '')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
