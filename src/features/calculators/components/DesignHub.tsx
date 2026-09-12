import { Link } from 'react-router-dom';
import { Ruler, Droplets, Flame, Gauge, CircleDot } from 'lucide-react';

export function DesignHub() {
  const calculators = [
    {
      id: 'pipe-diameter',
      title: 'Расчёт диаметра трубы',
      description: 'Подбор диаметра трубы по расходу и скорости потока',
      icon: Droplets,
      path: '/design/pipe-diameter',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'pump',
      title: 'Расчёт циркуляционного насоса',
      description: 'Подбор насоса по производительности и напору',
      icon: CircleDot,
      path: '/design/pump',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'expansion-tank',
      title: 'Расчёт расширительного бака',
      description: 'Подбор объёма расширительного бака',
      icon: Gauge,
      path: '/design/expansion-tank',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'radiator',
      title: 'Расчёт радиаторов',
      description: 'Подбор мощности и количества секций',
      icon: Flame,
      path: '/design/radiator',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Проектирование
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Инженерные калькуляторы для систем отопления и водоснабжения
            </p>
          </div>
        </div>
      </div>

      {/* Карточки калькуляторов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calc) => {
          const Icon = calc.icon;
          return (
            <Link
              key={calc.id}
              to={calc.path}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${calc.color}`}></div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${calc.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {calc.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span>Открыть калькулятор</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Информация */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          О разделе "Проектирование"
        </h2>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
          <p>
            Данный раздел содержит инженерные калькуляторы для проектирования систем отопления и водоснабжения. 
            Все расчёты основаны на стандартных формулах и рекомендациях.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Расчёт диаметра трубы — подбор оптимального диаметра по расходу и скорости</li>
            <li>Расчёт насоса — подбор циркуляционного насоса по производительности и напору</li>
            <li>Расчёт расширительного бака — определение необходимого объёма бака</li>
            <li>Расчёт радиаторов — подбор мощности и количества секций</li>
          </ul>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
            <strong>Важно:</strong> Данные расчёты являются предварительными. Для сложных систем рекомендуется консультация с инженером-проектировщиком.
          </p>
        </div>
      </div>
    </div>
  );
}
