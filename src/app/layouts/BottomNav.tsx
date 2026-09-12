import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, DollarSign, Menu } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/clients', icon: Users, label: 'Клиенты' },
    { path: '/orders', icon: ClipboardList, label: 'Заявки' },
    { path: '/finance', icon: DollarSign, label: 'Финансы' },
    { path: '/calculators/pressure', icon: Menu, label: 'Ещё' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-3 px-2 min-w-0 flex-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
