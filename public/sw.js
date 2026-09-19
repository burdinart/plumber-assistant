// Service Worker с правильной логикой кэширования для GitHub Pages
// ВЕРСИЯ КЭША ОБНОВЛЯЕТСЯ ПРИ КАЖДОЙ СБОРКЕ
const CACHE_VERSION = 'v1'; // Обновлять вручную при изменении структуры кэша
const CACHE_NAME = `plumber-assistant-${CACHE_VERSION}`;
const BASE_URL = '/plumber-assistant/';

// Установка SW - пропускаем ожидание
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker with scope:', self.registration.scope);
  // Пропускаем ожидание для быстрой активации
  self.skipWaiting();
});

// Активация - очищаем старые кэши и захватываем клиентов
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Service Worker activated, scope:', self.registration.scope);
      console.log('[SW] Cache name:', CACHE_NAME);
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Навигация - network first с fallback на кэш
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(`${BASE_URL}index.html`);
          });
        })
    );
    return;
  }
  
  // Same-origin ассеты - cache first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          // Кэшируем успешные ответы
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }
  
  // Остальные запросы - network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Обработка показа уведомления
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'У вас есть напоминание',
      icon: '/plumber-assistant/icon-192x192.svg',
      badge: '/plumber-assistant/icon-192x192.svg',
      vibrate: [200, 100, 200],
      tag: data.tag || 'reminder',
      requireInteraction: true,
      data: {
        url: data.url || '/plumber-assistant/#/reminders',
        reminderId: data.reminderId
      },
      actions: [
        { action: 'open', title: 'Открыть' },
        { action: 'dismiss', title: 'Закрыть' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Помощник Сантехника', options)
    );
  }
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/plumber-assistant/#/reminders';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (let client of windowClients) {
          if (client.url.includes('plumber-assistant') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
