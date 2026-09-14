import { useState } from 'react';
import { usePushNotifications } from '../../../shared/hooks/usePushNotifications';
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react';

export const NotificationSettings = () => {
  const {
    isSupported,
    permission,
    subscription,
    requestPermission,
    unsubscribeFromPush
  } = usePushNotifications();

  const [isLoading, setIsLoading] = useState(false);

  const handleEnable = async () => {
    setIsLoading(true);
    await requestPermission();
    setIsLoading(false);
  };

  const handleDisable = async () => {
    setIsLoading(true);
    await unsubscribeFromPush();
    setIsLoading(false);
  };

  if (!isSupported) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                Push-уведомления не поддерживаются
              </h3>
              <p className="text-red-700 dark:text-red-300">
                Ваш браузер не поддерживает push-уведомления. Попробуйте использовать Chrome, Firefox или Edge.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Push-уведомления
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Настройки уведомлений для напоминаний
            </p>
          </div>
        </div>

        {permission === 'granted' && subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-200">
                    Уведомления включены
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Напоминания будут приходить даже когда приложение закрыто
                  </p>
                </div>
              </div>
              <button
                onClick={handleDisable}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isLoading ? 'Отключаем...' : 'Отключить'}
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Как это работает?
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                <li>• Уведомления приходят в системный трей вашего устройства</li>
                <li>• Работают даже когда приложение закрыто</li>
                <li>• Можно отметить напоминание как выполненное прямо из уведомления</li>
                <li>• Можно отложить напоминание на 15 минут</li>
              </ul>
            </div>
          </div>
        ) : permission === 'denied' ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <BellOff className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                  Уведомления заблокированы
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-3">
                  Вы заблокировали уведомления для этого сайта. Чтобы включить их:
                </p>
                <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2 list-decimal list-inside">
                  <li>Откройте настройки браузера</li>
                  <li>Перейдите в раздел "Конфиденциальность и безопасность"</li>
                  <li>Найдите настройки уведомлений для этого сайта</li>
                  <li>Разрешите уведомления</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Включите push-уведомления, чтобы получать напоминания даже когда приложение закрыто.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Уведомления в системном трее</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Работают при закрытом приложении</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Быстрые действия из уведомления</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleEnable}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              <Bell className="w-5 h-5" />
              {isLoading ? 'Запрашиваем разрешение...' : 'Включить уведомления'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
