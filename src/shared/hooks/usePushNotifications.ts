import { useEffect, useState } from 'react';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  error: string | null;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: 'serviceWorker' in navigator && 'PushManager' in window,
    permission: 'default',
    subscription: null,
    error: null
  });

  // Запрос разрешения на уведомления
  const requestPermission = async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Push notifications not supported' }));
      return;
    }

    const permission = await Notification.requestPermission();
    setState(prev => ({ ...prev, permission }));

    if (permission === 'granted') {
      await subscribeToPush();
    }
  };

  // Подписка на push-уведомления
  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // VAPID key (для локальных уведомлений можно использовать тестовый ключ)
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkGs-dYe0zY7U4ShFS9pFvK8YlDhN9XK8QmZvZvZvZv'
        ) as BufferSource
      });

      setState(prev => ({ ...prev, subscription }));
      
      // Сохрани подписку для будущего использования
      localStorage.setItem('pushSubscription', JSON.stringify(subscription));
      
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      setState(prev => ({ ...prev, error: (error as Error).message }));
    }
  };

  // Отписка от уведомлений
  const unsubscribeFromPush = async () => {
    try {
      if (state.subscription) {
        await state.subscription.unsubscribe();
        setState(prev => ({ ...prev, subscription: null }));
        localStorage.removeItem('pushSubscription');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  // Инициализация при загрузке
  useEffect(() => {
    const init = async () => {
      if (!state.isSupported) return;

      const permission = Notification.permission;
      setState(prev => ({ ...prev, permission }));

      if (permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          
          if (subscription) {
            setState(prev => ({ ...prev, subscription }));
          }
        } catch (error) {
          console.error('Failed to get subscription:', error);
        }
      }
    };

    init();
  }, [state.isSupported]);

  return {
    ...state,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  };
};

// Вспомогательная функция для конвертации VAPID ключа
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
