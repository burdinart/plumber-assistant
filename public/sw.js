// Service Worker с правильной логикой кэширования для GitHub Pages
const CACHE_NAME = 'plumber-assistant-v1';
const BASE_URL = '/plumber-assistant/';

// Установка SW - пропускаем ожидание
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker with scope:', self.registration.scope);
  self.skipWaiting();
});

// Активация - очищаем старые кэши и захватываем клиентов
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      console.log('[SW] Service Worker activated, scope:', self.registration.scope);
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
