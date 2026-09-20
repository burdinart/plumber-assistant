import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, DollarSign, Building2, Bell, MoreHorizontal, FileText, Calculator, Settings } from 'lucide-react';
import { useState } from 'react';

export function BottomNav() {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  
  // Основные разделы (всегда видны на мобильном)
  const mainItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/clients', icon: Users, label: 'Клиенты' },
    { path: '/orders', icon: ClipboardList, label: 'Заявки' },
    { path: '/reminders', icon: Bell, label: 'Напоминания' },
  ];

  // Дополнительные разделы (в меню "Ещё")
  const moreItems = [
    { path: '/objects', icon: Building2, label: 'Объекты' },
    { path: '/finance', icon: DollarSign, label: 'Финансы' },
    { path: '/documents', icon: FileText, label: 'Документы' },
    { path: '/calculators/pressure', icon: Calculator, label: 'Калькуляторы' },
    { path: '/settings/profile', icon: Settings, label: 'Настройки' },
  ];
  
  return (
    <>
      {/* Нижняя панель */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 dark:bg-gray-800 border-t border-gray-700 md:hidden z-40">
        <div className="flex items-center justify-around h-16">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-2 px-2 min-w-0 flex-1 transition-colors ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium truncate">{item.label}</span>
              </NavLink>
            );
          })}

          {/* Кнопка "Ещё" */}
          <button
            onClick={() => setShowMore(true)}
            className={`flex flex-col items-center gap-1 py-2 px-2 min-w-0 flex-1 transition-colors ${
              location.pathname === '/settings/profile' || 
              moreItems.some(item => location.pathname.startsWith(item.path))
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Ещё</span>
          </button>
        </div>
      </nav>

      {/* Модальное меню "Ещё" */}
      {showMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:hidden">
          <div className="bg-gray-800 dark:bg-gray-800 rounded-t-2xl w-full max-h-[70vh] overflow-y-auto">
            {/* Заголовок */}
            <div className="sticky top-0 bg-gray-800 dark:bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Меню</h3>
              <button
                onClick={() => setShowMore(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Пункты меню */}
            <div className="p-4 space-y-2">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Отступ для контента, чтобы не перекрывался нижней панелью */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
