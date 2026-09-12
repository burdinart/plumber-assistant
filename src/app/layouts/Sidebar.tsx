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
  Bell,
  TrendingDown,
  AlertTriangle,
  Stethoscope,
  DollarSign,
  FileText,
  Wallet,
  BarChart3,
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
};

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-sm">
              Помощник Сантехника
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
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
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Главная</span>}
        </NavLink>

        {/* CRM Section */}
        {!sidebarCollapsed && (
          <div className="mt-4 mb-2 px-4">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              CRM
            </div>
          </div>
        )}

        <NavLink
          to="/clients"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/clients/')
                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <Users className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Клиенты</span>}
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/orders/')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Заявки</span>}
        </NavLink>

        <NavLink
          to="/reminders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Напоминания</span>}
        </NavLink>

        {/* Finance Section */}
        {!sidebarCollapsed && (
          <div className="mt-4 mb-2 px-4">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Финансы
            </div>
          </div>
        )}

        <NavLink
          to="/finance"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <DollarSign className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Главная</span>}
        </NavLink>

        <NavLink
          to="/finance/price-list"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <FileText className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Прайс-лист</span>}
        </NavLink>

        <NavLink
          to="/finance/estimates"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance/estimates')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <ClipboardList className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Сметы</span>}
        </NavLink>

        <NavLink
          to="/finance/transactions"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive || location.pathname.startsWith('/finance/transactions')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <Wallet className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Транзакции</span>}
        </NavLink>

        <NavLink
          to="/finance/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
        >
          <BarChart3 className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Отчёты</span>}
        </NavLink>

        {/* Tools Section */}
        <div className="mt-4">
          {CATEGORIES.map((category) => {
            const categoryModules = MODULES.filter((m) => m.category === category.id);
            const CategoryIcon = ICON_MAP[category.icon] || Wrench;

            return (
              <div key={category.id} className="mb-2">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <CategoryIcon className="w-3 h-3" />
                    {category.title}
                  </div>
                )}
                {categoryModules.map((module) => {
                  const ModuleIcon = ICON_MAP[module.icon] || Wrench;
                  const isActive = location.pathname === module.path;

                  return (
                    <NavLink
                      key={module.id}
                      to={module.path}
                      title={sidebarCollapsed ? module.title : undefined}
                      className={({ isActive: active }) =>
                        `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg transition-colors ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } ${sidebarCollapsed ? 'justify-center' : ''}`
                      }
                    >
                      <ModuleIcon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm truncate">{module.title}</span>
                      )}
                      {!sidebarCollapsed && module.isNew && (
                        <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
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
      </nav>
    </aside>
  );
}
