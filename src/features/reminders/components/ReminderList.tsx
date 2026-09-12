import { useState } from 'react';
import { Bell, Plus, Search, CheckCircle, Circle } from 'lucide-react';
import { useReminders } from '../hooks/useReminders';
import { useClients } from '../../clients/hooks/useClients';
import { formatDate, getPriorityColor, getPriorityText } from '../../../shared/utils/helpers';

export function ReminderList() {
  const { reminders, toggleReminderDone, deleteReminder, searchReminders } = useReminders();
  const { getClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDone, setShowDone] = useState(false);

  const filteredReminders = searchReminders(searchQuery)
    .filter((r) => showDone || !r.isDone)
    .sort((a, b) => {
      // Сначала невыполненные, потом по дате
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  const pendingCount = reminders.filter((r) => !r.isDone).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Напоминания</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pendingCount} {pendingCount === 1 ? 'активное' : 'активных'}
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск напоминаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowDone(!showDone)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            showDone
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          {showDone ? 'Скрыть выполненные' : 'Показать выполненные'}
        </button>
      </div>

      {/* Reminders list */}
      {filteredReminders.length > 0 ? (
        <div className="space-y-3">
          {filteredReminders.map((reminder) => {
            const client = reminder.relatedClientId ? getClient(reminder.relatedClientId) : null;
            const priorityColor = getPriorityColor(reminder.priority);

            return (
              <div
                key={reminder.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all ${
                  reminder.isDone
                    ? 'border-gray-200 dark:border-gray-700 opacity-60'
                    : `border-${priorityColor}-200 dark:border-${priorityColor}-800`
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleReminderDone(reminder.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {reminder.isDone ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-amber-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className={`font-medium ${
                        reminder.isDone
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-800 dark:text-white'
                      }`}>
                        {reminder.text}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 bg-${priorityColor}-100 dark:bg-${priorityColor}-900/30 text-${priorityColor}-700 dark:text-${priorityColor}-300`}
                      >
                        {getPriorityText(reminder.priority)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatDate(reminder.date)} в {reminder.time}</span>
                      {client && <span>• {client.name}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="flex-shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {searchQuery || showDone ? 'Напоминания не найдены' : 'Нет напоминаний'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || showDone
              ? 'Попробуйте изменить параметры поиска'
              : 'Напоминания будут создаваться автоматически из заявок'}
          </p>
        </div>
      )}
    </div>
  );
}
