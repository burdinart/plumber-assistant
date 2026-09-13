import { useState, useEffect } from 'react';
import { Property } from '../types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-properties';

// Демо-данные объектов
const DEMO_PROPERTIES: Property[] = [
  {
    id: 'property-1',
    clientId: 'client-1',
    name: 'Квартира на Ленина',
    type: 'apartment',
    address: 'г. Москва, ул. Ленина, д. 10, кв. 25',
    city: 'Москва',
    street: 'Ленина',
    building: '10',
    apartment: '25',
    floor: 3,
    area: 65,
    bathrooms: 1,
    bedrooms: 2,
    pipeMaterial: 'ppr',
    heatingSystem: 'radiator',
    hasCentralHeating: true,
    notes: 'Старые трубы, нужно заменить стояк',
    accessInfo: 'Домофон 123, этаж 3',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'property-2',
    clientId: 'client-1',
    name: 'Дача в Подмосковье',
    type: 'house',
    address: 'Московская обл., д. Лесное, ул. Садовая, д. 15',
    city: 'Лесное',
    street: 'Садовая',
    building: '15',
    area: 120,
    bathrooms: 2,
    bedrooms: 4,
    waterSupplyType: 'borehole',
    sewageType: 'septic',
    pipeMaterial: 'steel',
    heatingSystem: 'radiator',
    hasGas: false,
    notes: 'Скважина 30м, септик на 3 куба',
    accessInfo: 'Ключи у соседей (Иван Петрович, тел: +7 999 111-22-33)',
    createdAt: '2026-09-16T10:00:00Z',
    updatedAt: '2026-09-16T10:00:00Z',
  },
  {
    id: 'property-3',
    clientId: 'client-2',
    name: 'Офис на Арбате',
    type: 'office',
    address: 'г. Москва, ул. Арбат, д. 20, оф. 301',
    city: 'Москва',
    street: 'Арбат',
    building: '20',
    apartment: '301',
    floor: 3,
    area: 80,
    bathrooms: 2,
    pipeMaterial: 'copper',
    heatingSystem: 'radiator',
    hasCentralHeating: true,
    notes: 'Бизнес-центр, пропуск оформлять заранее',
    accessInfo: 'Пропуск на ресепшен, пн-пт 9:00-18:00',
    createdAt: '2026-09-17T10:00:00Z',
    updatedAt: '2026-09-17T10:00:00Z',
  },
  {
    id: 'property-4',
    clientId: 'client-3',
    name: 'Квартира на Пушкина',
    type: 'apartment',
    address: 'г. Москва, ул. Пушкина, д. 5, кв. 10',
    city: 'Москва',
    street: 'Пушкина',
    building: '5',
    apartment: '10',
    floor: 5,
    area: 45,
    bathrooms: 1,
    bedrooms: 1,
    pipeMaterial: 'ppr',
    heatingSystem: 'radiator',
    hasCentralHeating: true,
    notes: 'Маленькая квартира, узкий санузел',
    accessInfo: 'Код домофона: 1234#',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'property-5',
    clientId: 'client-4',
    name: 'Коттедж в Жуковке',
    type: 'cottage',
    address: 'Московская обл., п. Жуковка, ул. Лесная, д. 7',
    city: 'Жуковка',
    street: 'Лесная',
    building: '7',
    area: 250,
    bathrooms: 3,
    bedrooms: 5,
    waterSupplyType: 'central',
    sewageType: 'central',
    pipeMaterial: 'copper',
    heatingSystem: 'mixed',
    hasGas: true,
    hasCentralHeating: false,
    notes: 'Двухэтажный коттедж, тёплый пол на первом этаже',
    accessInfo: 'Ворота автоматические, пульт у хозяина',
    createdAt: '2026-09-19T10:00:00Z',
    updatedAt: '2026-09-19T10:00:00Z',
  },
];

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  // Загрузка из LocalStorage
  useEffect(() => {
    const stored = storage.get<Property[]>(STORAGE_KEY, []);
    if (stored.length === 0) {
      // Если данных нет, загружаем демо-данные
      setProperties(DEMO_PROPERTIES);
      storage.set(STORAGE_KEY, DEMO_PROPERTIES);
    } else {
      setProperties(stored);
    }
  }, []);

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (properties.length > 0) {
      storage.set(STORAGE_KEY, properties);
    }
  }, [properties]);

  /**
   * Получить объект по ID
   */
  const getProperty = (id: string): Property | undefined => {
    return properties.find(p => p.id === id);
  };

  /**
   * Получить все объекты клиента
   */
  const getByClient = (clientId: string): Property[] => {
    return properties.filter(p => p.clientId === clientId);
  };

  /**
   * Создать новый объект
   */
  const createProperty = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
    const newProperty: Property = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProperties(prev => [...prev, newProperty]);
    return newProperty;
  };

  /**
   * Обновить объект
   */
  const updateProperty = (id: string, data: Partial<Omit<Property, 'id' | 'createdAt'>>): Property | undefined => {
    let updated: Property | undefined;
    setProperties(prev =>
      prev.map(p => {
        if (p.id === id) {
          updated = { ...p, ...data, updatedAt: new Date().toISOString() };
          return updated;
        }
        return p;
      })
    );
    return updated;
  };

  /**
   * Удалить объект
   */
  const deleteProperty = (id: string): boolean => {
    const exists = properties.some(p => p.id === id);
    if (exists) {
      setProperties(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  };

  /**
   * Поиск объектов
   */
  const search = (query: string): Property[] => {
    if (!query.trim()) return properties;
    const lower = query.toLowerCase();
    return properties.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.address.toLowerCase().includes(lower) ||
      p.city?.toLowerCase().includes(lower)
    );
  };

  /**
   * Фильтрация по типу
   */
  const getByType = (type: Property['type']): Property[] => {
    return properties.filter(p => p.type === type);
  };

  /**
   * Фильтрация по городу
   */
  const getByCity = (city: string): Property[] => {
    return properties.filter(p => p.city === city);
  };

  /**
   * Получить уникальные города
   */
  const getCities = (): string[] => {
    const cities = new Set(properties.map(p => p.city).filter(Boolean));
    return Array.from(cities) as string[];
  };

  return {
    properties,
    getProperty,
    getByClient,
    createProperty,
    updateProperty,
    deleteProperty,
    search,
    getByType,
    getByCity,
    getCities,
  };
}
