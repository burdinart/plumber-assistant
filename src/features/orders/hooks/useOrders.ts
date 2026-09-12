import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../../shared/types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-orders';

// Демо-данные заявок
const DEMO_ORDERS: Order[] = [
  {
    id: 'order-1',
    clientId: 'client-1',
    type: 'repair',
    address: 'г. Москва, ул. Ленина, д. 1, кв. 10',
    date: '2026-09-01',
    time: '10:00',
    description: 'Замена смесителя на кухне',
    status: 'paid',
    workCost: 1500,
    materialsCost: 800,
    total: 2300,
    createdAt: '2026-08-28T14:00:00Z',
    completedAt: '2026-09-01T12:30:00Z',
  },
  {
    id: 'order-2',
    clientId: 'client-2',
    type: 'installation',
    address: 'г. Москва, пр. Мира, д. 15, кв. 42',
    date: '2026-09-15',
    time: '14:00',
    description: 'Установка счётчика воды',
    status: 'in_progress',
    workCost: 2000,
    materialsCost: 1500,
    total: 3500,
    createdAt: '2026-09-10T09:30:00Z',
  },
  {
    id: 'order-3',
    clientId: 'client-3',
    type: 'emergency',
    address: 'г. Москва, ул. Пушкина, д. 7, кв. 3',
    date: '2026-09-12',
    time: '08:30',
    description: 'Протечка трубы в ванной, срочный вызов',
    status: 'completed',
    workCost: 3000,
    materialsCost: 500,
    total: 3500,
    createdAt: '2026-09-12T07:00:00Z',
    completedAt: '2026-09-12T10:15:00Z',
  },
  {
    id: 'order-4',
    clientId: 'client-4',
    type: 'consultation',
    address: 'г. Москва, ул. Гагарина, д. 23, кв. 156',
    date: '2026-09-18',
    time: '16:00',
    description: 'Консультация по замене труб в квартире',
    status: 'new',
    workCost: 0,
    materialsCost: 0,
    total: 0,
    createdAt: '2026-09-14T11:00:00Z',
  },
  {
    id: 'order-5',
    clientId: 'client-5',
    type: 'repair',
    address: 'г. Москва, ул. Чехова, д. 42, кв. 8',
    date: '2026-09-16',
    time: '11:00',
    description: 'Замена труб в ванной комнате',
    status: 'in_progress',
    workCost: 8000,
    materialsCost: 4500,
    total: 12500,
    createdAt: '2026-09-11T15:20:00Z',
  },
  {
    id: 'order-6',
    clientId: 'client-2',
    type: 'installation',
    address: 'г. Москва, пр. Мира, д. 15, кв. 42',
    date: '2026-09-20',
    time: '10:00',
    description: 'Подключение стиральной машины',
    status: 'new',
    workCost: 1200,
    materialsCost: 600,
    total: 1800,
    createdAt: '2026-09-15T13:45:00Z',
  },
  {
    id: 'order-7',
    clientId: 'client-1',
    type: 'repair',
    address: 'г. Москва, ул. Ленина, д. 1, кв. 10',
    date: '2026-09-05',
    time: '15:00',
    description: 'Прочистка канализации',
    status: 'completed',
    workCost: 2500,
    materialsCost: 0,
    total: 2500,
    createdAt: '2026-09-03T10:30:00Z',
    completedAt: '2026-09-05T17:00:00Z',
  },
];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Загрузка заявок из LocalStorage при первом рендере
  useEffect(() => {
    const storedOrders = storage.get<Order[]>(STORAGE_KEY, []);
    
    // Если данных нет, загружаем демо-данные
    if (storedOrders.length === 0) {
      setOrders(DEMO_ORDERS);
      storage.set(STORAGE_KEY, DEMO_ORDERS);
    } else {
      setOrders(storedOrders);
    }
  }, []);

  // Сохранение в LocalStorage при изменении
  useEffect(() => {
    if (orders.length > 0) {
      storage.set(STORAGE_KEY, orders);
    }
  }, [orders]);

  /**
   * Получить заявку по ID
   */
  const getOrder = (id: string): Order | undefined => {
    return orders.find((o) => o.id === id);
  };

  /**
   * Добавить новую заявку
   */
  const addOrder = (data: Omit<Order, 'id' | 'createdAt' | 'total'>): Order => {
    const total = data.workCost + data.materialsCost;
    const newOrder: Order = {
      ...data,
      id: generateId(),
      total,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  /**
   * Обновить заявку
   */
  const updateOrder = (id: string, data: Partial<Omit<Order, 'id' | 'createdAt'>>): Order | undefined => {
    let updatedOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          updatedOrder = { ...order, ...data };
          // Пересчитываем total если изменились costs
          if (data.workCost !== undefined || data.materialsCost !== undefined) {
            updatedOrder.total = updatedOrder.workCost + updatedOrder.materialsCost;
          }
          return updatedOrder;
        }
        return order;
      })
    );

    return updatedOrder;
  };

  /**
   * Удалить заявку
   */
  const deleteOrder = (id: string): boolean => {
    const exists = orders.some((o) => o.id === id);
    if (exists) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      return true;
    }
    return false;
  };

  /**
   * Изменить статус заявки
   */
  const updateOrderStatus = (id: string, status: OrderStatus): void => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const updated = { ...order, status };
          if (status === 'completed' && !order.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return order;
      })
    );
  };

  /**
   * Получить заявки по клиенту
   */
  const getOrdersByClient = (clientId: string): Order[] => {
    return orders.filter((o) => o.clientId === clientId);
  };

  /**
   * Получить заявки по статусу
   */
  const getOrdersByStatus = (status: OrderStatus): Order[] => {
    return orders.filter((o) => o.status === status);
  };

  /**
   * Поиск заявок
   */
  const searchOrders = (query: string): Order[] => {
    if (!query.trim()) return orders;
    const lowerQuery = query.toLowerCase();
    return orders.filter(
      (order) =>
        order.address.toLowerCase().includes(lowerQuery) ||
        order.description.toLowerCase().includes(lowerQuery)
    );
  };

  /**
   * Получить заявки на сегодня
   */
  const getTodayOrders = (): Order[] => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter((o) => o.date === today);
  };

  /**
   * Получить статистику за месяц
   */
  const getMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthOrders = orders.filter((o) => {
      const orderDate = new Date(o.date);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const totalEarnings = monthOrders
      .filter((o) => o.status === 'paid' || o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);

    const uniqueClients = new Set(monthOrders.map((o) => o.clientId)).size;
    const completedOrders = monthOrders.filter((o) => o.status === 'completed' || o.status === 'paid').length;

    return {
      totalEarnings,
      uniqueClients,
      completedOrders,
      totalOrders: monthOrders.length,
    };
  };

  return {
    orders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    getOrdersByClient,
    getOrdersByStatus,
    searchOrders,
    getTodayOrders,
    getMonthlyStats,
  };
}
