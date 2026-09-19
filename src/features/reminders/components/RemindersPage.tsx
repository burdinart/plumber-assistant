import { useState } from 'react';
import { useAppStore } from '../../../shared/store/useAppStore';
import { ReminderForm } from './ReminderForm';
import { ReminderList } from './ReminderList';
import { Bell, Plus } from 'lucide-react';
import { Reminder } from '../types';

export const RemindersPage = () => {
  const { reminders, toggleReminder, deleteReminder, updateReminder } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();

  const handleToggleComplete = (id: string) => {
    toggleReminder(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это напоминание?')) {
      deleteReminder(id);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReminder(undefined);
  };

  // Фильтрация активных и завершённых
  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Заголовок */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-bold text-white">Напоминания</h1>
              <span className="text-sm text-gray-400">
                ({activeReminders.length})
              </span>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Активные напоминания */}
        {activeReminders.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Активные</h2>
            <ReminderList
              reminders={activeReminders}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </section>
        )}

        {/* Завершённые напоминания */}
        {completedReminders.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 text-gray-400">
              Завершённые ({completedReminders.length})
            </h2>
            <ReminderList
              reminders={completedReminders}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </section>
        )}

        {/* Пустое состояние */}
        {reminders.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">Нет напоминаний</h3>
            <p className="text-gray-500 text-sm mb-4">
              Создайте первое напоминание, чтобы не забыть о важном
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Создать напоминание
            </button>
          </div>
        )}
      </div>

      {/* Форма создания/редактирования */}
      {showForm && (
        <ReminderForm
          onClose={handleCloseForm}
          existingReminder={editingReminder}
        />
      )}
    </div>
  );
};
