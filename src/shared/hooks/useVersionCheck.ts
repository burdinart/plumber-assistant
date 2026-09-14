import { useEffect } from 'react';
import { APP_VERSION } from '../../version';

/**
 * Хук для проверки обновлений версии приложения
 * Сравнивает текущую версию с сохранённой в localStorage
 * При обнаружении обновления логирует это и сохраняет новую версию
 */
export const useVersionCheck = () => {
  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');
    
    if (storedVersion !== APP_VERSION.version) {
      console.log('🔄 Версия обновлена:', storedVersion, '→', APP_VERSION.version);
      localStorage.setItem('app_version', APP_VERSION.version);
      
      // Если это не первая установка, можно показать уведомление
      if (storedVersion) {
        console.log('✨ Приложение обновлено до версии', APP_VERSION.version);
        // Здесь можно добавить показ toast-уведомления
        // Например: toast.success('Приложение обновлено!')
      }
    }
  }, []);
};
