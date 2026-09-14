import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { APP_VERSION } from './version';

// Логирование версии приложения в консоль
console.log('%c Помощник Сантехника', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
console.log('%cВерсия: ' + APP_VERSION.version, 'color: #10b981; font-size: 14px;');
console.log('%cСборка: ' + APP_VERSION.buildDate + ' ' + APP_VERSION.buildTime, 'color: #6b7280;');
console.log('%c' + APP_VERSION.phase, 'color: #f59e0b; font-weight: bold;');
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

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
