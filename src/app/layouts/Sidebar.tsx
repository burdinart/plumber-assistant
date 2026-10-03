import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../shared/store/useAppStore';
import { MODULES, CATEGORIES } from '../../shared/utils/constants';
import {
  Calculator,
  BookOpen,
  Wrench,
  ClipboardList,
  Home,
  ChevronLeft,
  ChevronRight,
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
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  // Закрываем мобильный drawer при переходе по ссылке.
  useEffect(() => {
    onCloseMobile?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop для мобильного drawer (только < sm) */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 sm:hidden transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] overflow-y-auto overscroll-contain bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } sm:transform-none sm:transition-[width] sm:static sm:z-auto sm:flex sm:h-full sm:min-h-0 sm:shrink-0 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Боковая навигация"
      >
        {/* Кнопка закрытия мобильного drawer */}
        <button
          onClick={onCloseMobile}
          className="absolute top-3 right-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 sm:hidden"
          aria-label="Закрыть меню"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo (шапка не уезжает при прокрутке списка пунктов) */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Мобильный drawer всегда полный (с подписями), независимо от sidebarCollapsed */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-sm">Помощник Сантехника</span>
          </div>
          {/* Десктопная шапка (>= lg): при сворачивании остаётся только иконка */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-gray-800 dark:text-white text-sm ${sidebarCollapsed ? 'hidden' : 'inline'}`}>
              Помощник Сантехника
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            aria-label={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
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
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Главная</span>
        </NavLink>

        {/* CRM Section */}
        <div className={`mt-4 mb-2 px-4 ${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>
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
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Клиенты</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/orders/')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Заявки</span>
        </NavLink>

        <NavLink
          to="/objects"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/objects/')
                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Объекты</span>
        </NavLink>

        <NavLink
          to="/reminders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/reminders')
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Напоминания</span>
        </NavLink>

        {/* Finance Section */}
        <div className={`mt-4 mb-2 px-4 ${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>
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
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <DollarSign className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Главная</span>
        </NavLink>

        <NavLink
          to="/finance/price-list"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Прайс-лист</span>
        </NavLink>

        <NavLink
          to="/finance/estimates"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance/estimates')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Сметы</span>
        </NavLink>

        <NavLink
          to="/finance/transactions"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance/transactions')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <Wallet className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Транзакции</span>
        </NavLink>

        <NavLink
          to="/finance/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Отчёты</span>
        </NavLink>

        {/* Documents Section */}
        <div className={`mt-4 mb-2 px-4 ${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>
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
            } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
          }
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Все документы</span>
        </NavLink>

        {/* Tools Section */}
        <div className="mt-4">
          {CATEGORIES.map((category) => {
            const categoryModules = MODULES.filter((m) => m.category === category.id);
            const CategoryIcon = ICON_MAP[category.icon] || Wrench;

            return (
              <div key={category.id} className="mb-2">
                <div className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${sidebarCollapsed ? 'lg:hidden' : 'flex'}`}>
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
                        } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
                      }
                    >
                      <ModuleIcon className="w-4 h-4 flex-shrink-0" />
                      <span className={`text-sm truncate ${sidebarCollapsed ? 'lg:hidden' : ''}`}>{module.title}</span>
                      {module.isNew && (
                        <span className={`ml-auto text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
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
              } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
            }
          >
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>О приложении</span>
          </NavLink>

          <NavLink
            to="/settings/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
                isActive || location.pathname.startsWith('/settings/')
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${sidebarCollapsed ? 'lg:justify-center' : ''}`
            }
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={`text-sm font-medium ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Настройки</span>
          </NavLink>
        </div>
      </nav>
    </aside>
    </>
  );
}
