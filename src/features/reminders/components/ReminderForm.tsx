import { useState, useEffect } from 'react';
import { useAppStore } from '../../../shared/store/useAppStore';
import { useNotifications } from '../../../shared/hooks/useNotifications';
import { Bell, Clock, Calendar, X, AlertCircle } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderFormData {
  title: string;
  description?: string;
  time: string;
  daysOfWeek: number[];
  date?: string;
  repeat: boolean;
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
    repeat: existingReminder?.repeat || false
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
                <Clock className="w-4 h-4" />
                Время *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Повтор */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="repeat"
                checked={formData.repeat}
                onChange={(e) => setFormData(prev => ({ ...prev, repeat: e.target.checked }))}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="repeat" className="text-gray-300">
                Повторять еженедельно
              </label>
            </div>

            {/* Дни недели (если повтор) */}
            {formData.repeat && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Дни недели *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeekNames.map((day, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDayToggle(index)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.daysOfWeek.includes(index)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Конкретная дата (если не повтор) */}
            {!formData.repeat && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Дата *
                </label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
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
