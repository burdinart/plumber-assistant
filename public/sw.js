// Service Worker для обработки push-уведомлений

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'У вас есть напоминание',
    icon: '/icon-192x192.svg',
    badge: '/icon-192x192.svg',
    vibrate: [200, 100, 200],
    tag: data.tag || 'reminder-notification',
    requireInteraction: true,
    actions: [
      { action: 'complete', title: 'Выполнено' },
      { action: 'snooze', title: 'Отложить' }
    ],
    data: {
      url: data.url || '/',
      reminderId: data.reminderId
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Помощник Сантехника', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const reminderId = event.notification.data?.reminderId;
  const action = event.action;

  if (action === 'complete') {
    // Отметь как выполненное
    clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'REMINDER_COMPLETED',
          reminderId
        });
      });
    });
  } else if (action === 'snooze') {
    // Отложи на 15 минут
    clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'REMINDER_SNOOZED',
          reminderId,
          delay: 15 * 60 * 1000
        });
      });
    });
  } else {
    // Открой приложение
    const urlToOpen = event.notification.data?.url || '/reminders';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
          for (let client of windowClients) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Обработка сообщений от главного потока
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
