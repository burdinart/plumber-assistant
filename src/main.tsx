import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { APP_VERSION } from './version';

// Логирование версии приложения в консоль
console.log('%c Помощник Сантехника', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
console.log('%cВерсия: ' + APP_VERSION.version, 'color: #10b981; font-size: 14px;');
console.log('%cСборка: ' + APP_VERSION.buildDate + ' ' + APP_VERSION.buildTime, 'color: #6b7280;');
console.log('%cGitHub: https://github.com/burdinart/plumber-assistant', 'color: #6b7280;');
console.log('%cGitHub Pages: https://burdinart.github.io/plumber-assistant/', 'color: #6b7280;');

// Инициализация темы при загрузке приложения
const initializeTheme = () => {
  try {
    const stored = localStorage.getItem('plumber-assistant-settings');
    if (stored) {
      const settings = JSON.parse(stored);
      if (settings.state && settings.state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  } catch (e) {
    console.error('Error initializing theme:', e);
  }
};

initializeTheme();

// Регистрация Service Worker для PWA оффлайн-режима
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Используем BASE_URL для регистрации SW
      const baseUrl = import.meta.env.BASE_URL || '/plumber-assistant/';
      const swUrl = `${baseUrl}sw.js`;
      
      console.log('[SW] Registering Service Worker:', swUrl);
      
      const registration = await navigator.serviceWorker.register(swUrl, {
        scope: baseUrl
      });
      
      console.log('✅ Service Worker зарегистрирован, scope:', registration.scope);
      
      // Логирование обновлений
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker обновляется...');
      });
      
      // Перезагрузка страницы при активации нового SW (однократно, защита от цикла)
      let reloadTriggered = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!reloadTriggered && document.visibilityState === 'visible') {
          reloadTriggered = true;
          console.log('🔄 Controller changed, reloading page...');
          window.location.reload();
        }
      });
      
    } catch (error) {
      console.error('❌ Ошибка регистрации Service Worker:', error);
    }
  }
};

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
