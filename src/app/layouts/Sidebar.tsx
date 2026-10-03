import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MODULES, CATEGORIES } from '../../shared/utils/constants';
import {
  Calculator,
  BookOpen,
  Wrench,
  ClipboardList,
  Home,
  Gauge,
  CircleDot,
  Droplets,
  Thermometer,
  Package,
  GitBranch,
  ArrowLeftRight,
  Ruler,
  Zap,
  Users,
  ClipboardList as OrdersIcon,
  TrendingDown,
  AlertTriangle,
  Stethoscope,
  DollarSign,
  FileText,
  Wallet,
  BarChart3,
  Flame,
  Building2,
  Info,
  Settings,
  X,
  User,
  Bell,
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
  TrendingDown,
  AlertTriangle,
  Stethoscope,
  Flame,
  DollarSign,
  Settings,
  User,
  Bell,
};

export function Sidebar({ mobileOpen = false, onCloseMobile }: {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
} = {}) {
  const location = useLocation();

  // Десктоп (≥768px / md): сайдбар ВСЕГДА развернут — иконки + полные подписи,
  // не сворачивается и не скрывается. Состояние sidebarCollapsed из стора больше
  // не используется: оно сохранялось в localStorage и приводило к «пропаданию»
  // навигации. Мобильная логика (<768px) не затронута: drawer открывается/закрывается
  // через mobileOpen/onCloseMobile.
  useEffect(() => {
    try {
      localStorage.removeItem('sidebarCollapsed');
    } catch {
      /* localStorage может быть недоступен (private mode) — не критично */
    }
  }, []);

  // Закрываем мобильный drawer при переходе по ссылке.
  useEffect(() => {
    onCloseMobile?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop для мобильного drawer (только < sm) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] overflow-y-auto overscroll-contain bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } md:transform-none md:static md:z-auto md:flex md:h-full md:min-h-0 md:shrink-0 md:w-64`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Боковая навигация"
      >
        {/* Кнопка закрытия мобильного drawer */}
        <button
          onClick={onCloseMobile}
          className="absolute top-3 right-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          aria-label="Закрыть меню"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo (шапка не уезжает при прокрутке списка пунктов) */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Логотип: подпись всегда видна (в мобильном drawer и на десктопе) */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-sm truncate">
              Помощник Сантехника
            </span>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Главная</span>
        </NavLink>

        {/* CRM Section */}
        <div className={`mt-4 mb-2 px-4 `}>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              CRM
            </div>
          </div>

        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/clients/')
                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Клиенты</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/orders/')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Заявки</span>
        </NavLink>

        <NavLink
          to="/objects"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/objects/')
                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Объекты</span>
        </NavLink>

        <NavLink
          to="/reminders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/reminders')
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Напоминания</span>
        </NavLink>

        {/* Finance Section */}
        <div className={`mt-4 mb-2 px-4 `}>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Финансы
            </div>
          </div>

        <NavLink
          to="/finance"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <DollarSign className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Главная</span>
        </NavLink>

        <NavLink
          to="/finance/price-list"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Прайс-лист</span>
        </NavLink>

        <NavLink
          to="/finance/estimates"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance/estimates')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Сметы</span>
        </NavLink>

        <NavLink
          to="/finance/transactions"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance/transactions')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <Wallet className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Транзакции</span>
        </NavLink>

        <NavLink
          to="/finance/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Отчёты</span>
        </NavLink>

        {/* Documents Section */}
        <div className={`mt-4 mb-2 px-4 `}>
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Документы
            </div>
          </div>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/documents')
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium `}>Все документы</span>
        </NavLink>

        {/* Tools Section */}
        <div className="mt-4">
          {CATEGORIES.map((category) => {
            const categoryModules = MODULES.filter((m) => m.category === category.id);
            const CategoryIcon = ICON_MAP[category.icon] || Wrench;

            return (
              <div key={category.id} className="mb-2">
                <div className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider `}>
                    <CategoryIcon className="w-3 h-3" />
                    {category.title}
                  </div>
                {categoryModules.map((module) => {
                  const ModuleIcon = ICON_MAP[module.icon] || Wrench;
                  const isActive = location.pathname === module.path;

                  return (
                    <NavLink
                      key={module.id}
                      to={module.path}
                      title={module.title}
                      className={({ isActive: active }) =>
                        `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      <ModuleIcon className="w-4 h-4 flex-shrink-0" />
                      <span className={`text-sm truncate `}>{module.title}</span>
                      {module.isNew && (
                        <span className={`ml-auto text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded `}>
                          NEW
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* О приложении и Настройки */}
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className={`text-sm font-medium `}>О приложении</span>
          </NavLink>

          <NavLink
            to="/settings/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
                isActive || location.pathname.startsWith('/settings/')
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={`text-sm font-medium `}>Настройки</span>
          </NavLink>
        </div>
      </nav>
    </aside>
    </>
  );
}
