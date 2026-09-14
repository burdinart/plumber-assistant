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

// Регистрация Service Worker для push-уведомлений
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker зарегистрирован:', registration.scope);
      
      // Проверка обновлений SW
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker обновляется...');
      });
      
    } catch (error) {
      console.error('❌ Ошибка регистрации Service Worker:', error);
    }
  }
};

// Обработка сообщений от Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'REMINDER_COMPLETED') {
      console.log('✅ Напоминание выполнено:', event.data.reminderId);
      // Можно обновить состояние приложения здесь
    } else if (event.data.type === 'REMINDER_SNOOZED') {
      console.log('⏰ Напоминание отложено:', event.data.reminderId);
      // Можно обновить состояние приложения здесь
    }
  });
}

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
