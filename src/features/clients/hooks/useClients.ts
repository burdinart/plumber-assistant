import { useState, useEffect } from 'react';
import { Client } from '../../../shared/types';
import { storage, generateId } from '../../../shared/utils/storage';
import { useAppStore } from '../../../shared/store/useAppStore';

import { STORAGE_KEYS } from '../../../shared/utils/constants';

export const CLIENTS_STORAGE_KEY = STORAGE_KEYS.clients;

// Демо-данные клиентов
export const DEMO_CLIENTS: Client[] = [
  // Физические лица
  {
    id: 'client-1',
    type: 'individual',
    name: 'Иванов Иван Иванович',
    phone: '+79991234567',
    address: 'г. Москва, ул. Ленина, д. 1, кв. 10',
    email: 'ivanov@mail.ru',
    notes: 'Старые трубы, боится штробления',
    isFavorite: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'client-2',
    type: 'individual',
    name: 'Петрова Мария Сергеевна',
    phone: '+79162345678',
    address: 'г. Москва, пр. Мира, д. 15, кв. 42',
    email: 'petrova@gmail.com',
    notes: 'Не курить в квартире',
    isFavorite: false,
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
  },
  {
    id: 'client-3',
    type: 'individual',
    name: 'Сидоров Алексей Петрович',
    phone: '+79033456789',
    address: 'г. Москва, ул. Пушкина, д. 7, кв. 3',
    notes: 'Пенсионер, нужна скидка',
    isFavorite: false,
    createdAt: '2026-03-10T09:15:00Z',
    updatedAt: '2026-03-10T09:15:00Z',
  },
  // Юридические лица
  {
    id: 'client-4',
    type: 'legal',
    name: 'ООО "Стройинвест"',
    phone: '+79254567890',
    address: 'г. Москва, ул. Гагарина, д. 23, оф. 156',
    email: 'info@stroyinvest.ru',
    inn: '7712345678',
    kpp: '771201001',
    ogrn: '1167746123456',
    legalAddress: 'г. Москва, ул. Гагарина, д. 23, оф. 156',
    bankName: 'ПАО Сбербанк',
    bik: '044525225',
    account: '40702810123456789012',
    correspondentAccount: '30101810400000000225',
    notes: 'Крупный заказчик, оплата по безналу',
    isFavorite: true,
    createdAt: '2026-04-05T16:45:00Z',
    updatedAt: '2026-04-05T16:45:00Z',
  },
  {
    id: 'client-5',
    type: 'legal',
    name: 'ИП Козлов А.В.',
    phone: '+79775678901',
    address: 'г. Москва, ул. Чехова, д. 42, оф. 8',
    email: 'kozlov@mail.ru',
    inn: '772345678901',
    ogrn: '318774612345678',
    notes: 'Частые заказы, постоянный клиент',
    isFavorite: false,
    createdAt: '2026-05-12T11:20:00Z',
    updatedAt: '2026-05-12T11:20:00Z',
  },
];

/**
 * Гидрация CRM-клиентов из LocalStorage в глобальный стор (useAppStore).
 * Вызывается при монтировании DocumentEditor, чтобы выбор заказчика
 * наполнялся реальными данными даже без посещения страницы «Клиенты».
 */
export function hydrateClientsFromStorage(): void {
  const stored = storage.get<Client[]>(CLIENTS_STORAGE_KEY, []);
  useAppStore.getState().setClients(stored.length > 0 ? stored : DEMO_CLIENTS);
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const setStoreClients = useAppStore((s) => s.setClients);

  // Загрузка клиентов из LocalStorage при первом рендере
  useEffect(() => {
    const storedClients = storage.get<Client[]>(CLIENTS_STORAGE_KEY, []);
    
    // Если данных нет, загружаем демо-данные
    if (storedClients.length === 0) {
      setClients(DEMO_CLIENTS);
      storage.set(CLIENTS_STORAGE_KEY, DEMO_CLIENTS);
    } else {
      setClients(storedClients);
    }
  }, []);

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (clients.length > 0) {
      storage.set(CLIENTS_STORAGE_KEY, clients);
    }
  }, [clients]);

  // Синхронизация CRM-клиентов с глобальным стором
  // (DocumentEditor и другие компоненты читают clients из useAppStore)
  useEffect(() => {
    setStoreClients(clients);
  }, [clients, setStoreClients]);

  // Синхронизация между вкладками: при изменении ключа в другой вкладке перечитываем данные
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CLIENTS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Client[];
          if (Array.isArray(parsed)) {
            setClients(parsed);
          }
        } catch (error) {
          console.error('Ошибка синхронизации клиентов между вкладками:', error);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  /**
   * Получить клиента по ID
   */
  const getClient = (id: string): Client | undefined => {
    return clients.find((c) => c.id === id);
  };

  /**
   * Добавить нового клиента
   */
  const addClient = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite'>): Client => {
    const newClient: Client = {
      ...data,
      id: generateId(),
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setClients((prev) => [...prev, newClient]);
    return newClient;
  };

  /**
   * Обновить клиента
   */
  const updateClient = (id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Client | undefined => {
    let updatedClient: Client | undefined;

    setClients((prev) =>
      prev.map((client) => {
        if (client.id === id) {
          updatedClient = {
            ...client,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return updatedClient;
        }
        return client;
      })
    );

    return updatedClient;
  };

  /**
   * Удалить клиента
   */
  const deleteClient = (id: string): boolean => {
    const exists = clients.some((c) => c.id === id);
    if (exists) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
    return false;
  };

  /**
   * Переключить избранное
   */
  const toggleFavorite = (id: string): void => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? { ...client, isFavorite: !client.isFavorite, updatedAt: new Date().toISOString() }
          : client
      )
    );
  };

  /**
   * Поиск клиентов по имени или телефону
   */
  const searchClients = (query: string): Client[] => {
    if (!query.trim()) return clients;

    const lowerQuery = query.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.phone.includes(query) ||
        client.address.toLowerCase().includes(lowerQuery)
    );
  };

  /**
   * Получить избранных клиентов
   */
  const getFavoriteClients = (): Client[] => {
    return clients.filter((c) => c.isFavorite);
  };

  return {
    clients,
    getClient,
    addClient,
    updateClient,
    deleteClient,
    toggleFavorite,
    searchClients,
    getFavoriteClients,
  };
}
