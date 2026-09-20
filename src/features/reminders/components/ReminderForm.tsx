import { useState, useEffect } from 'react';
import { useAppStore } from '../../../shared/store/useAppStore';
import { useNotifications } from '../../../shared/hooks/useNotifications';
import { Bell, Clock, Calendar, X, AlertCircle, Plus, Flag, Repeat } from 'lucide-react';
import { Reminder, ReminderFormData, Priority, RepeatType } from '../types';
import { getTimeUntil, getNextFireDate, formatDate, formatNotifyBefore } from '../utils/dateUtils';

interface ReminderFormData {
  title: string;
  description?: string;
  time: string;
  daysOfWeek: number[];
  date?: string;
  repeat: boolean;
  repeatType?: RepeatType;
  repeatInterval?: number;
  reminders: { before: number }[];
  priority?: Priority;
}

interface ReminderFormProps {
  onClose: () => void;
  existingReminder?: Reminder;
}

export const ReminderForm = ({ onClose, existingReminder }: ReminderFormProps) => {
  const { addReminder, updateReminder } = useAppStore();
  const { permission, requestPermission, scheduleNotification, isSupported } = useNotifications();
  
  const [formData, setFormData] = useState<ReminderFormData>({
    title: existingReminder?.title || '',
    description: existingReminder?.description || '',
    time: existingReminder?.time || '09:00',
    daysOfWeek: existingReminder?.daysOfWeek || [],
    date: existingReminder?.date || '',
    repeat: existingReminder?.repeat || false,
    repeatType: existingReminder?.repeatType,
    repeatInterval: existingReminder?.repeatInterval,
    reminders: existingReminder?.reminders || [{ before: 30 }], // по умолчанию за 30 минут
    priority: existingReminder?.priority || 'none'
  });

  const [showPermissionRequest, setShowPermissionRequest] = useState(false);

  const daysOfWeekNames = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ];

  const handleDayToggle = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayIndex)
        ? prev.daysOfWeek.filter(d => d !== dayIndex)
        : [...prev.daysOfWeek, dayIndex]
    }));
  };

  // Добавление напоминания
  const addReminderItem = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, { before: 0 }]
    }));
  };

  // Удаление напоминания
  const removeReminderItem = (index: number) => {
    if (formData.reminders.length > 1) {
      setFormData(prev => ({
        ...prev,
        reminders: prev.reminders.filter((_, i) => i !== index)
      }));
    }
  };

  // Обновление напоминания
  const updateReminderItem = (index: number, before: number) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map((r, i) => 
        i === index ? { ...r, before } : r
      )
    }));
  };

  const calculateNextFireTime = (
    date: string | undefined,
    time: string,
    daysOfWeek: number[]
  ): Date => {
    const [hours, minutes] = time.split(':').map(Number);
    
    if (date) {
      // Конкретная дата
      const fireDate = new Date(`${date}T${time}`);
      return fireDate;
    } else if (daysOfWeek.length > 0) {
      // Повторяющееся
      const now = new Date();
      const currentDay = now.getDay();
      
      // Находим следующий день
      let nextDayIndex = -1;
      for (let i = 0; i < 7; i++) {
        const dayIndex = (currentDay + i) % 7;
        if (daysOfWeek.includes(dayIndex)) {
          nextDayIndex = i;
          break;
        }
      }
      
      const fireDate = new Date(now);
      fireDate.setDate(now.getDate() + nextDayIndex);
      fireDate.setHours(hours, minutes, 0, 0);
      
      return fireDate;
    }
    
    return new Date();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Введите тему напоминания');
      return;
    }

    if (!formData.repeat && !formData.date) {
      alert('Выберите дату');
      return;
    }

    if (formData.repeat && formData.daysOfWeek.length === 0) {
      alert('Выберите хотя бы один день недели');
      return;
    }

    // Запрашиваем разрешение на уведомления, если ещё не запрошено
    if (permission === 'default') {
      setShowPermissionRequest(true);
    }

    // Создаём или обновляем напоминание
    const reminder = {
      id: existingReminder?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      time: formData.time,
      daysOfWeek: formData.daysOfWeek,
      date: formData.date,
      repeat: formData.repeat,
      repeatType: formData.repeatType,
      repeatInterval: formData.repeatInterval,
      reminders: formData.reminders,
      priority: formData.priority,
      completed: existingReminder?.completed || false,
      notified: existingReminder?.notified || false,
      createdAt: existingReminder?.createdAt || new Date().toISOString()
    };

    if (existingReminder) {
      updateReminder(reminder);
    } else {
      addReminder(reminder);
    }

    // Планируем уведомление
    if (permission === 'granted' || (await requestPermission())) {
      const fireTime = calculateNextFireTime(
        formData.date,
        formData.time,
        formData.daysOfWeek
      );

      const notificationId = scheduleNotification(
        reminder.id,
        'Напоминание',
        `${formData.title}${formData.description ? ': ' + formData.description : ''}`,
        fireTime
      );

      if (notificationId) {
        console.log('✅ Уведомление запланировано:', fireTime);
      }
    }

    onClose();
  };

  if (!isSupported && permission === 'default') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Уведомления не поддерживаются
              </h3>
              <p className="text-gray-400 text-sm">
                Ваш браузер не поддерживает push-уведомления. 
                Напоминание будет сохранено, но уведомление не придёт.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Понятно
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-400" />
              {existingReminder ? 'Редактировать напоминание' : 'Новое напоминание'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Тема */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Тема *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Позвонить клиенту"
                required
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Дополнительная информация (опционально)"
              />
            </div>

            {/* Время */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Время события *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              
              {/* Быстрый выбор времени */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {['08:00', '09:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, time }))}
                    className={`px-3 py-1.5 rounded text-xs transition-colors ${
                      formData.time === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Дата */}
            {!formData.repeat && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Дата события *
                </label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                
                {/* Быстрый выбор даты */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setFormData(prev => ({ ...prev, date: today.toISOString().split('T')[0] }));
                    }}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                  >
                    Сегодня
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setFormData(prev => ({ ...prev, date: tomorrow.toISOString().split('T')[0] }));
                    }}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                  >
                    Завтра
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setFormData(prev => ({ ...prev, date: nextWeek.toISOString().split('T')[0] }));
                    }}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                  >
                    Через неделю
                  </button>
                </div>
              </div>
            )}

            {/* Приоритет */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Flag className="w-4 h-4 text-blue-400" />
                Приоритет
              </label>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: 'high' }))}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === 'high'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  🔴 Высокий
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: 'medium' }))}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === 'medium'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  🟠 Средний
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: 'low' }))}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === 'low'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  🔵 Низкий
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: 'none' }))}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === 'none' || !formData.priority
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  ⚪ Нет
                </button>
              </div>
            </div>

            {/* Напоминания */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  Напоминания
                </label>
                <button
                  type="button"
                  onClick={addReminderItem}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Добавить
                </button>
              </div>

              <div className="space-y-2">
                {formData.reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                    <Bell className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <select
                      value={reminder.before}
                      onChange={(e) => updateReminderItem(index, parseInt(e.target.value))}
                      className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                    >
                      <option value={0}>В момент события</option>
                      <option value={5}>За 5 минут</option>
                      <option value={15}>За 15 минут</option>
                      <option value={30}>За 30 минут</option>
                      <option value={60}>За 1 час</option>
                      <option value={120}>За 2 часа</option>
                      <option value={1440}>За 1 день</option>
                      <option value={2880}>За 2 дня</option>
                      <option value={10080}>За 1 неделю</option>
                    </select>
                    {formData.reminders.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReminderItem(index)}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Повторение с расширенными настройками */}
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="repeat"
                  checked={formData.repeat}
                  onChange={(e) => setFormData(prev => ({ ...prev, repeat: e.target.checked }))}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600"
                />
                <label htmlFor="repeat" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-blue-400" />
                  Повторять
                </label>
              </div>

              {formData.repeat && (
                <div className="p-4 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg space-y-4">
                  {/* Тип повторения */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, repeatType: 'daily' }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.repeatType === 'daily'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Каждый день
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, repeatType: 'weekly' }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.repeatType === 'weekly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Каждую неделю
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, repeatType: 'monthly' }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.repeatType === 'monthly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Каждый месяц
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, repeatType: 'yearly' }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.repeatType === 'yearly'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Каждый год
                    </button>
                  </div>

                  {/* Дни недели для weekly */}
                  {formData.repeatType === 'weekly' && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Выберите дни:</p>
                      <div className="flex gap-1 flex-wrap">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => {
                          const dayIndex = (index + 1) % 7; // Пн=1, Вт=2, ..., Вс=0
                          const isSelected = formData.daysOfWeek.includes(dayIndex);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  daysOfWeek: isSelected
                                    ? prev.daysOfWeek.filter(d => d !== dayIndex)
                                    : [...prev.daysOfWeek, dayIndex]
                                }));
                              }}
                              className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Конкретная дата (если не повтор) - удалено, перенесено выше */}

            {/* Предпросмотр напоминания */}
            {formData.date && formData.time && (
              <div className="mt-6 p-4 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl border border-blue-700">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-semibold text-blue-100">Предпросмотр</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-300" />
                    <span className="text-white text-sm">
                      {new Date(formData.date).toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span className="text-white text-sm">В {formData.time}</span>
                  </div>

                  {formData.reminders.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-700">
                      <p className="text-xs text-blue-300 mb-2">Напоминания:</p>
                      {formData.reminders.map((reminder, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-blue-100 mb-1">
                          <Bell className="w-3 h-3" />
                          <span>{formatNotifyBefore(reminder.before)} до события</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.priority && formData.priority !== 'none' && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        formData.priority === 'high' ? 'bg-red-600 text-white' :
                        formData.priority === 'medium' ? 'bg-orange-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {formData.priority === 'high' ? '🔴 Высокий приоритет' :
                         formData.priority === 'medium' ? '🟠 Средний приоритет' :
                         '🔵 Низкий приоритет'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Информация об уведомлениях */}
            {permission === 'granted' && (
              <div className="p-3 bg-green-900 bg-opacity-30 border border-green-700 rounded-lg">
                <p className="text-green-300 text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Уведомления включены. Вы получите уведомление в заданное время.
                </p>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Запрос разрешения на уведомления */}
      {showPermissionRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-gray-800 rounded-xl max-w-sm w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <Bell className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Разрешить уведомления?
                </h3>
                <p className="text-gray-400 text-sm">
                  Мы будем показывать вам напоминания в заданное время, даже если приложение закрыто.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await requestPermission();
                  setShowPermissionRequest(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Разрешить
              </button>
              <button
                onClick={() => setShowPermissionRequest(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
