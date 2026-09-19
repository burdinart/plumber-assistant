import { useNotifications } from '../hooks/useNotifications';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';

export const NotificationPermissionBanner = () => {
  const { permission, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('notificationBannerDismissed') === 'true'
  );

  if (permission === 'granted' || permission === 'denied' || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    await requestPermission();
    setDismissed(true);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Включить уведомления?</h3>
          <p className="text-sm text-blue-100 mb-3">
            Получайте напоминания о заявках и важных событиях
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnable}
              className="px-3 py-1.5 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
            >
              Включить
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 bg-blue-700 text-white rounded text-sm hover:bg-blue-800"
            >
              Позже
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-blue-200 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
