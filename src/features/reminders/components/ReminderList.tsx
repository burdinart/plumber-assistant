import { Bell, Check, Trash2, Clock, Calendar, Edit } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

export const ReminderList = ({ reminders, onToggleComplete, onDelete, onEdit }: ReminderListProps) => {
  const daysOfWeekNames = [
    'Вс',
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб'
  ];

  const formatDaysOfWeek = (days: number[]) => {
    if (days.length === 0) return '';
    if (days.length === 7) return 'Ежедневно';
    if (days.length === 2 && days.includes(1) && days.includes(2)) return 'Пн-Вт';
    return days.map(d => daysOfWeekNames[d]).join(', ');
  };

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-400 mb-2">Нет напоминаний</h3>
        <p className="text-gray-500 text-sm">Создайте первое напоминание, чтобы не забыть о важном</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className={`bg-gray-800 rounded-lg p-4 border transition-colors ${
            reminder.completed
              ? 'border-green-700 bg-opacity-50'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Чекбокс */}
            <button
              onClick={() => onToggleComplete(reminder.id)}
              className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                reminder.completed
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-500 hover:border-gray-400'
              }`}
            >
              {reminder.completed && <Check className="w-4 h-4 text-white" />}
            </button>

            {/* Контент */}
            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-white ${
                  reminder.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {reminder.title}
              </h3>

              {reminder.description && (
                <p className={`text-sm mt-1 ${
                  reminder.completed ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {reminder.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-2">
                {/* Время */}
                <span className="text-xs bg-blue-600 bg-opacity-30 text-blue-300 px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {reminder.time}
                </span>

                {/* Дни недели или дата */}
                {reminder.repeat ? (
                  <span className="text-xs bg-purple-600 bg-opacity-30 text-purple-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDaysOfWeek(reminder.daysOfWeek)}
                  </span>
                ) : reminder.date ? (
                  <span className="text-xs bg-purple-600 bg-opacity-30 text-purple-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(reminder.date).toLocaleDateString('ru-RU')}
                  </span>
                ) : null}

                {/* Статус уведомления */}
                {reminder.notified && (
                  <span className="text-xs bg-green-600 bg-opacity-30 text-green-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <Bell className="w-3 h-3" />
                    Уведомление отправлено
                  </span>
                )}
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(reminder)}
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Редактировать"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(reminder.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
