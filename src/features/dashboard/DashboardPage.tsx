import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MODULES } from '../../shared/utils/constants';
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
  Settings2,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  GripVertical,
} from 'lucide-react';
import { useOrders } from '../orders/hooks/useOrders';
import { useClients } from '../clients/hooks/useClients';
import { useTransactions } from '../finance/hooks/useTransactions';
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusColor, getOrderTypeText } from '../../shared/utils/helpers';
import { RemindersWidget } from '../reminders/components/RemindersWidget';
import { useDashboardStore } from './store/dashboardStore';
import { DraggableWidget } from './components/DraggableWidget';
import type { DashboardWidget } from './types';

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

// ---------------------------------------------------------------------------
// Контентные секции главной страницы (рендерятся внутри DraggableWidget)
// ---------------------------------------------------------------------------

function QuickActionsSection() {
  return (
    <>
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
    </>
  );
}

function StatsSection() {
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
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
    </>
  );
}

function OrdersSection() {
  const { getTodayOrders } = useOrders();
  const todayOrders = getTodayOrders();

  return (
    <>
      <div className="flex items-center gap-2 mb-3 pr-12">
        <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Заявки на сегодня
        </h3>
        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
          {todayOrders.length}
        </span>
        <Link
          to="/orders"
          className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
    </>
  );
}

function RemindersSection() {
  return <RemindersWidget />;
}

function ToolsSection() {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 pr-8">
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
    </>
  );
}

function renderWidgetContent(widget: DashboardWidget) {
  switch (widget.type) {
    case 'quick-actions':
      return <QuickActionsSection />;
    case 'stats':
      return <StatsSection />;
    case 'orders':
      return <OrdersSection />;
    case 'reminders':
      return <RemindersSection />;
    case 'tools':
      return <ToolsSection />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Панель настроек виджетов (видимость + сброс порядка)
// ---------------------------------------------------------------------------

function WidgetSettingsPanel({ onClose }: { onClose: () => void }) {
  const { widgets, toggleWidgetVisibility, resetWidgets } = useDashboardStore();

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Настройки виджетов">
      <button
        type="button"
        aria-label="Закрыть настройки"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h2 className="font-semibold text-gray-800 dark:text-white">Настройка виджетов</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {[...widgets]
            .sort((a, b) => a.order - b.order)
            .map((widget) => (
              <div
                key={widget.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40"
              >
                <GripVertical className="w-4 h-4 text-gray-400 shrink-0" aria-hidden />
                <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white">
                  {widget.title}
                </span>
                <button
                  type="button"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  aria-pressed={widget.isVisible}
                  className={`flex items-center gap-1.5 min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors ${
                    widget.isVisible
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {widget.isVisible ? (
                    <>
                      <Eye className="w-4 h-4" /> Видим
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" /> Скрыт
                    </>
                  )}
                </button>
              </div>
            ))}
        </div>

        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={resetWidgets}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить порядок и видимость
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { widgets, updateWidgetOrder } = useDashboardStore();
  const [items, setItems] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMoveMode, setIsMoveMode] = useState(false);

  // Порядок видимых виджетов — производное состояние из стора
  useEffect(() => {
    const sorted = [...widgets]
      .filter((w) => w.isVisible)
      .sort((a, b) => a.order - b.order)
      .map((w) => w.id);
    setItems(sorted);
  }, [widgets]);

  // Сенсоры: мышь + тач (PointerSensor покрывает touch на iOS и Android) + клавиатура
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // drag начинается после сдвига на 8px — клики по ссылкам не ломаются
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.indexOf(active.id as string);
        const newIndex = current.indexOf(over.id as string);
        if (oldIndex === -1 || newIndex === -1) return current;
        const newOrder = arrayMove(current, oldIndex, newIndex);
        updateWidgetOrder(newOrder); // сохранение в localStorage
        return newOrder;
      });
    }
  };

  const widgetById = new Map(widgets.map((w) => [w.id, w]));

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
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold">Помощник Сантехника</h1>
              <p className="text-blue-100 text-sm">Профессиональные инструменты для сантехников</p>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-3 py-2 text-sm font-medium transition-colors min-h-[44px]"
              aria-label="Настроить виджеты главной страницы"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Настроить</span>
            </button>
          </div>
        </div>
      </div>

      {/* Переключатель режима перемещения (удобен на мобильных) */}
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => setIsMoveMode((v) => !v)}
          aria-pressed={isMoveMode}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium min-h-[40px] transition-colors ${
            isMoveMode
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <GripVertical className="w-4 h-4" />
          {isMoveMode ? 'Режим перемещения включён' : 'Режим перемещения'}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {items.map((widgetId) => {
              const widget = widgetById.get(widgetId);
              if (!widget) return null;
              return (
                <DraggableWidget key={widgetId} id={widgetId} isMoveMode={isMoveMode}>
                  {renderWidgetContent(widget)}
                </DraggableWidget>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Подсказка для пользователя */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <GripVertical className="w-4 h-4 shrink-0" />
          Перетащите виджет за иконку ⋮⋮ справа, чтобы изменить порядок. Порядок сохраняется
          автоматически.
        </p>
      </div>

      {settingsOpen && <WidgetSettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
