import { useState, useEffect } from 'react';
import { Client } from '../../../shared/types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-clients';

// Демо-данные клиентов
const DEMO_CLIENTS: Client[] = [
  {
    id: 'client-1',
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
    name: 'Сидоров Алексей Петрович',
    phone: '+79033456789',
    address: 'г. Москва, ул. Пушкина, д. 7, кв. 3',
    notes: 'Пенсионер, нужна скидка',
    isFavorite: false,
    createdAt: '2026-03-10T09:15:00Z',
    updatedAt: '2026-03-10T09:15:00Z',
  },
  {
    id: 'client-4',
    name: 'Козлова Елена Дмитриевна',
    phone: '+79254567890',
    address: 'г. Москва, ул. Гагарина, д. 23, кв. 156',
    email: 'kozlova@yandex.ru',
    notes: 'Работает из дома, звонить заранее',
    isFavorite: true,
    createdAt: '2026-04-05T16:45:00Z',
    updatedAt: '2026-04-05T16:45:00Z',
  },
  {
    id: 'client-5',
    name: 'Николаев Дмитрий Владимирович',
    phone: '+79775678901',
    address: 'г. Москва, ул. Чехова, д. 42, кв. 8',
    isFavorite: false,
    createdAt: '2026-05-12T11:20:00Z',
    updatedAt: '2026-05-12T11:20:00Z',
  },
];

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  // Загрузка клиентов из LocalStorage при первом рендере
  useEffect(() => {
    const storedClients = storage.get<Client[]>(STORAGE_KEY, []);
    
    // Если данных нет, загружаем демо-данные
    if (storedClients.length === 0) {
      setClients(DEMO_CLIENTS);
      storage.set(STORAGE_KEY, DEMO_CLIENTS);
    } else {
      setClients(storedClients);
    }
  }, []);

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (clients.length > 0) {
      storage.set(STORAGE_KEY, clients);
    }
  }, [clients]);

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
