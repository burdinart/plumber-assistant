import { Link } from 'react-router-dom';
import { MODULES, CATEGORIES } from '../../shared/utils/constants';
import {
  Calculator,
  BookOpen,
  Wrench,
  ClipboardList,
  Gauge,
  CircleDot,
  Droplets,
  Thermometer,
  Package,
  GitBranch,
  ArrowLeftRight,
  Ruler,
  Zap,
  ArrowRight,
  Droplet,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Calculator,
  BookOpen,
  Wrench,
  ClipboardList,
  Gauge,
  CircleDot,
  Droplets,
  Thermometer,
  Package,
  GitBranch,
  ArrowLeftRight,
  Ruler,
  Zap,
};

const CATEGORY_COLORS: Record<string, string> = {
  calculators: 'from-blue-500 to-blue-600',
  reference: 'from-emerald-500 to-emerald-600',
  tools: 'from-amber-500 to-amber-600',
  planning: 'from-purple-500 to-purple-600',
};

const CATEGORY_BG: Record<string, string> = {
  calculators: 'bg-blue-50 dark:bg-blue-900/20',
  reference: 'bg-emerald-50 dark:bg-emerald-900/20',
  tools: 'bg-amber-50 dark:bg-amber-900/20',
  planning: 'bg-purple-50 dark:bg-purple-900/20',
};

export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Droplet className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Помощник Сантехника</h1>
              <p className="text-blue-100 text-sm">Профессиональные инструменты для сантехников</p>
            </div>
          </div>
          <p className="text-blue-100 mt-4 max-w-xl">
            Калькуляторы, справочники и инструменты для расчёта систем водоснабжения и отопления. 
            Всё необходимое в одном месте.
          </p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-xl font-bold">{MODULES.length}</div>
              <div className="text-xs text-blue-100">Инструментов</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-xl font-bold">{CATEGORIES.length}</div>
              <div className="text-xs text-blue-100">Категории</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="text-xl font-bold">∞</div>
              <div className="text-xs text-blue-100">Возможностей</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories with modules */}
      {CATEGORIES.map((category) => {
        const categoryModules = MODULES.filter((m) => m.category === category.id);
        const CategoryIcon = ICON_MAP[category.icon] || Wrench;

        return (
          <section key={category.id} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CategoryIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {category.title}
              </h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {categoryModules.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryModules.map((module) => {
                const ModuleIcon = ICON_MAP[module.icon] || Wrench;
                return (
                  <Link
                    key={module.id}
                    to={module.path}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                  >
                    {module.isNew && (
                      <span className="absolute top-3 right-3 text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                        Новое
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                          CATEGORY_COLORS[module.category]
                        } flex items-center justify-center flex-shrink-0`}
                      >
                        <ModuleIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Открыть <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
