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
  Users,
  ClipboardList as OrdersIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  CheckCircle,
  Plus,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Flame,
} from 'lucide-react';
import { useOrders } from '../orders/hooks/useOrders';
import { useClients } from '../clients/hooks/useClients';
import { useTransactions } from '../finance/hooks/useTransactions';
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../shared/utils/helpers';

const ICON_MAP: Record<string, React.ElementType> = {
  Calculator,
  BookOpen,
  Wrench,
  ClipboardList,
  Gauge,
  TrendingDown,
  AlertTriangle,
  Stethoscope,
  CircleDot,
  Droplets,
  Thermometer,
  Package,
  GitBranch,
  ArrowLeftRight,
  Ruler,
  Zap,
  Flame,
};

const CATEGORY_COLORS: Record<string, string> = {
  calculators: 'from-blue-500 to-blue-600',
  reference: 'from-emerald-500 to-emerald-600',
  tools: 'from-amber-500 to-amber-600',
};

export function DashboardPage() {
  const { getTodayOrders, getMonthlyStats } = useOrders();
  const { clients } = useClients();
  const { getBalance } = useTransactions();

  const todayOrders = getTodayOrders();
  const monthlyStats = getMonthlyStats();

  // Баланс за текущий месяц (как в разделе Финансы)
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const balance = getBalance(startDate, endDate);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Link
          to="/orders/new"
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-white">Новая заявка</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Создать заказ</div>
          </div>
        </Link>

        <Link
          to="/clients/new"
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all"
        >
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-white">Новый клиент</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Добавить</div>
          </div>
        </Link>

        <Link
          to="/orders"
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-amber-300 dark:hover:border-amber-600 transition-all"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-white">Заявки</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Все заказы</div>
          </div>
        </Link>

        <Link
          to="/clients"
          className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
        >
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-white">Клиенты</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">База клиентов</div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className={`bg-white dark:bg-gray-800 rounded-xl border p-4 ${
          balance.balance < 0 
            ? 'border-red-300 dark:border-red-700' 
            : 'border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-5 h-5 ${
              balance.balance < 0 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-green-600 dark:text-green-400'
            }`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">Заработано</span>
          </div>
          <div className={`text-xl font-bold ${
            balance.balance < 0 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-800 dark:text-white'
          }`}>
            {formatCurrency(balance.balance)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">за месяц</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Клиентов</span>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">{clients.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">всего</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Завершено</span>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">{monthlyStats.completedOrders}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">заявок за месяц</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Заявок сегодня</span>
          </div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">{todayOrders.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">на сегодня</div>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Orders - Full Width Now */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Заявки на сегодня
              </h3>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {todayOrders.length}
              </span>
            </div>
            <Link
              to="/orders"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Все <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {todayOrders.length > 0 ? (
            <div className="space-y-2">
              {todayOrders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {getOrderTypeText(order.type)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.time} • {formatCurrency(order.total)}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded bg-${getOrderStatusColor(order.status)}-100 dark:bg-${getOrderStatusColor(order.status)}-900/30 text-${getOrderStatusColor(order.status)}-700 dark:text-${getOrderStatusColor(order.status)}-300`}>
                      {getOrderStatusText(order.status)}
                    </span>
                  </div>
                </Link>
              ))}
              {todayOrders.length > 3 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                  + ещё {todayOrders.length - 3}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Нет заявок на сегодня
            </p>
          )}
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Инструменты и калькуляторы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.slice(0, 6).map((module) => {
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
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
