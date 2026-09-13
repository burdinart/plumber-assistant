import { useState, useEffect } from 'react';
import { PriceItem, PriceCategory } from '../types';
import { DEFAULT_PRICE_LIST } from '../data/defaultPriceList';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-price-list';

export function usePriceList() {
  const [priceList, setPriceList] = useState<PriceItem[]>([]);

  // Загрузка из LocalStorage при первом рендере
  useEffect(() => {
    const stored = storage.get<PriceItem[]>(STORAGE_KEY, []);
    
    // Если данных нет, загружаем демо-данные
    if (stored.length === 0) {
      setPriceList(DEFAULT_PRICE_LIST);
      storage.set(STORAGE_KEY, DEFAULT_PRICE_LIST);
    } else {
      setPriceList(stored);
    }
  }, []);

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (priceList.length > 0) {
      storage.set(STORAGE_KEY, priceList);
    }
  }, [priceList]);

  /**
   * Добавить новую работу
   */
  const addPriceItem = (data: Omit<PriceItem, 'id' | 'isDefault'>): PriceItem => {
    const newItem: PriceItem = {
      ...data,
      id: generateId(),
      isDefault: false,
    };
    setPriceList(prev => [...prev, newItem]);
    return newItem;
  };

  /**
   * Обновить работу
   */
  const updatePriceItem = (id: string, data: Partial<Omit<PriceItem, 'id'>>): PriceItem | undefined => {
    let updated: PriceItem | undefined;
    setPriceList(prev =>
      prev.map(item => {
        if (item.id === id) {
          updated = { ...item, ...data };
          return updated;
        }
        return item;
      })
    );
    return updated;
  };

  /**
   * Удалить работу (только не системные)
   */
  const deletePriceItem = (id: string): boolean => {
    const item = priceList.find(i => i.id === id);
    if (!item || item.isDefault) return false;
    
    setPriceList(prev => prev.filter(i => i.id !== id));
    return true;
  };

  /**
   * Получить работы по категории
   */
  const getByCategory = (category: PriceCategory): PriceItem[] => {
    return priceList.filter(item => item.category === category);
  };

  /**
   * Поиск по названию
   */
  const search = (query: string): PriceItem[] => {
    if (!query.trim()) return priceList;
    const lower = query.toLowerCase();
    return priceList.filter(item =>
      item.name.toLowerCase().includes(lower) ||
      item.description?.toLowerCase().includes(lower)
    );
  };

  return {
    priceList,
    addPriceItem,
    updatePriceItem,
    deletePriceItem,
    getByCategory,
    search,
  };
}
