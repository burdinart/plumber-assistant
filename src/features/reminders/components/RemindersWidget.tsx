import { useAppStore } from '../../../shared/store/useAppStore';
import { Bell, Clock, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatNotifyBefore } from '../utils/dateUtils';

export const RemindersWidget = () => {
  const navigate = useNavigate();
  const { reminders } = useAppStore();

  const activeReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => {
      const dateA = a.date ? new Date(`${a.date}T${a.time}`).getTime() : Infinity;
      const dateB = b.date ? new Date(`${b.date}T${b.time}`).getTime() : Infinity;
      return dateA - dateB;
    });

  const now = new Date().getTime();
  const today = new Date().toISOString().split('T')[0];

  const overdueReminders = activeReminders.filter(r => {
    if (!r.date) return false;
    const reminderTime = new Date(`${r.date}T${r.time}`).getTime();
    return reminderTime < now;
  });

  const todayReminders = activeReminders.filter(r => r.date === today);

  const upcomingReminders = activeReminders.filter(r => {
    if (!r.date) return false;
    const reminderTime = new Date(`${r.date}T${r.time}`).getTime();
    return reminderTime > now;
  }).slice(0, 5);

  const getTimeUntil = (date: string, time: string): string => {
    const fireDate = new Date(`${date}T${time}`);
    const diff = fireDate.getTime() - now;
    
    if (diff <= 0) return 'Просрочено';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `через ${days} дн.`;
    if (hours > 0) return `через ${hours} ч.`;
    return `через ${minutes} мин.`;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-900 bg-opacity-20';
      case 'medium': return 'border-l-orange-500 bg-orange-900 bg-opacity-20';
      case 'low': return 'border-l-blue-500 bg-blue-900 bg-opacity-20';
      default: return 'border-l-gray-500 bg-gray-800';
    }
  };

  if (activeReminders.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            Напоминания
          </h2>
          <button
            onClick={() => navigate('/reminders')}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Все →
          </button>
        </div>
        
        <div className="text-center py-8">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 text-sm">Нет предстоящих напоминаний</p>
          <button
            onClick={() => navigate('/reminders')}
            className="mt-3 text-sm text-blue-400 hover:text-blue-300"
          >
            Создать напоминание →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          Напоминания
        </h2>
        <button
          onClick={() => navigate('/reminders')}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Все →
        </button>
      </div>

      {overdueReminders.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400 uppercase">
              Просрочено ({overdueReminders.length})
            </span>
          </div>
          <div className="space-y-2">
            {overdueReminders.map(reminder => (
              <div
                key={reminder.id}
                onClick={() => navigate('/reminders')}
                className="p-3 bg-red-900 bg-opacity-30 border-l-4 border-red-500 rounded-lg cursor-pointer hover:bg-opacity-40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{reminder.title}</p>
                  <span className="text-xs text-red-400">
                    {reminder.date ? getTimeUntil(reminder.date, reminder.time) : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayReminders.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400 uppercase">
              Сегодня ({todayReminders.length})
            </span>
          </div>
          <div className="space-y-2">
            {todayReminders.map(reminder => (
              <div
                key={reminder.id}
                onClick={() => navigate('/reminders')}
                className={`p-3 border-l-4 rounded-lg cursor-pointer hover:bg-opacity-40 transition-colors ${getPriorityColor(reminder.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{reminder.title}</p>
                  <span className="text-xs text-gray-400">{reminder.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingReminders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400 uppercase">
              Предстоящие
            </span>
          </div>
          <div className="space-y-2">
            {upcomingReminders.map(reminder => (
              <div
                key={reminder.id}
                onClick={() => navigate('/reminders')}
                className={`p-3 border-l-4 rounded-lg cursor-pointer hover:bg-opacity-40 transition-colors ${getPriorityColor(reminder.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{reminder.title}</p>
                  <span className="text-xs text-gray-400">
                    {reminder.date ? getTimeUntil(reminder.date, reminder.time) : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {reminder.date && new Date(reminder.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">{reminder.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/reminders')}
        className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Bell className="w-4 h-4" />
        Создать напоминание
      </button>
    </div>
  );
};
