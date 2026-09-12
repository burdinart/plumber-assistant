import { Link } from 'react-router-dom';
import { Bell, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useReminders } from '../hooks/useReminders';
import { getPriorityColor } from '../../../shared/utils/helpers';

export function ReminderWidget() {
  const { getTodayReminders, toggleReminderDone } = useReminders();
  const todayReminders = getTodayReminders();

  if (todayReminders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white">
            Напоминания на сегодня
          </h3>
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
            {todayReminders.length}
          </span>
        </div>
        <Link
          to="/reminders"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          Все <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {todayReminders.slice(0, 3).map((reminder) => {
          const priorityColor = getPriorityColor(reminder.priority);
          return (
            <div
              key={reminder.id}
              className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <button
                onClick={() => toggleReminderDone(reminder.id)}
                className="flex-shrink-0 mt-0.5"
              >
                <Circle className="w-4 h-4 text-gray-400 hover:text-amber-500 transition-colors" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-white truncate">
                  {reminder.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {reminder.time} • <span className={`text-${priorityColor}-600 dark:text-${priorityColor}-400`}>{reminder.priority === 'high' ? 'Высокий' : reminder.priority === 'medium' ? 'Средний' : 'Низкий'}</span>
                </p>
              </div>
            </div>
          );
        })}
        {todayReminders.length > 3 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
            + ещё {todayReminders.length - 3}
          </p>
        )}
      </div>
    </div>
  );
}
