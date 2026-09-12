/**
 * Утилиты для безопасной работы с LocalStorage
 * Обрабатывает ошибки, если LocalStorage недоступен
 */

export const storage = {
  /**
   * Получить данные из LocalStorage
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Ошибка чтения из LocalStorage (ключ: ${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Сохранить данные в LocalStorage
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Ошибка записи в LocalStorage (ключ: ${key}):`, error);
      return false;
    }
  },

  /**
   * Удалить данные из LocalStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Ошибка удаления из LocalStorage (ключ: ${key}):`, error);
      return false;
    }
  },

  /**
   * Проверить доступность LocalStorage
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Генерация уникального ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
