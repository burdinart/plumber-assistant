import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

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
