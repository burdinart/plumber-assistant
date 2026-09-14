import { useState, useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-transactions';

// Демо-данные транзакций
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'trans-1',
    type: 'income',
    amount: 15000,
    date: '2026-09-10',
    category: 'private_client',
    description: 'Оплата по смете СМ-001',
    clientId: 'client-1',
    clientName: 'Иванов Иван Иванович',
    clientType: 'individual',
    createdAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'trans-2',
    type: 'income',
    amount: 45000,
    date: '2026-09-12',
    category: 'legal_entity',
    description: 'Оплата по договору',
    clientId: 'client-4',
    clientName: 'ООО "Стройинвест"',
    clientType: 'legal',
    createdAt: '2026-09-12T14:30:00Z',
  },
  {
    id: 'trans-3',
    type: 'expense',
    amount: 8500,
    date: '2026-09-11',
    category: 'materials',
    description: 'Закупка труб и фитингов',
    createdAt: '2026-09-11T09:15:00Z',
  },
  {
    id: 'trans-4',
    type: 'expense',
    amount: 2000,
    date: '2026-09-13',
    category: 'transport',
    description: 'Бензин',
    createdAt: '2026-09-13T16:45:00Z',
  },
  {
    id: 'trans-5',
    type: 'income',
    amount: 3500,
    date: '2026-09-14',
    category: 'emergency',
    description: 'Аварийный вызов',
    clientId: 'client-3',
    clientName: 'Сидоров Алексей Петрович',
    clientType: 'individual',
    createdAt: '2026-09-14T11:20:00Z',
  },
];

/**
 * Загружает транзакции из LocalStorage или демо-данные
 */
function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Если данных нет — загружаем демо-данные и сохраняем
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_TRANSACTIONS));
    return DEMO_TRANSACTIONS;
  } catch (error) {
    console.error('Error loading transactions:', error);
    return DEMO_TRANSACTIONS;
  }
}

/**
 * Сохраняет транзакции в LocalStorage
 */
function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}

export function useTransactions() {
  // Инициализируем state сразу из localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

  // Синхронизируем состояние с localStorage при каждом рендере
  // Это нужно для случаев, когда данные изменились в другой вкладке/компоненте
  useEffect(() => {
    const handleStorageChange = () => {
      const freshData = loadTransactions();
      setTransactions(freshData);
    };

    // Слушаем изменения в localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Также перечитываем при фокусе на окне
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  /**
   * Добавить транзакцию
   */
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTransaction: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      // Сразу сохраняем в LocalStorage
      saveTransactions(updated);
      return updated;
    });

    return newTransaction;
  };

  /**
   * Обновить транзакцию
   */
  const updateTransaction = (id: string, data: Partial<Transaction>): Transaction | undefined => {
    let updated: Transaction | undefined;

    setTransactions(prev => {
      const newTransactions = prev.map(t => {
        if (t.id === id) {
          updated = { ...t, ...data };
          return updated;
        }
        return t;
      });
      // Сохраняем после обновления
      saveTransactions(newTransactions);
      return newTransactions;
    });

    return updated;
  };

  /**
   * Удалить транзакцию
   */
  const deleteTransaction = (id: string): boolean => {
    let deleted = false;

    setTransactions(prev => {
      const exists = prev.some(t => t.id === id);
      if (exists) {
        deleted = true;
        const newTransactions = prev.filter(t => t.id !== id);
        // Сохраняем после удаления
        saveTransactions(newTransactions);
        return newTransactions;
      }
      return prev;
    });

    return deleted;
  };

  /**
   * Получить транзакции за период
   */
  const getByPeriod = (startDate: string, endDate: string): Transaction[] => {
    return transactions.filter(t => t.date >= startDate && t.date <= endDate);
  };

  /**
   * Получить транзакции по типу
   */
  const getByType = (type: 'income' | 'expense'): Transaction[] => {
    return transactions.filter(t => t.type === type);
  };

  /**
   * Получить транзакции по категории
   */
  const getByCategory = (category: string): Transaction[] => {
    return transactions.filter(t => t.category === category);
  };

  /**
   * Получить баланс за период
   */
  const getBalance = (startDate: string, endDate: string) => {
    const periodTransactions = getByPeriod(startDate, endDate);
    const income = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  };

  /**
   * Поиск транзакций
   */
  const search = (query: string): Transaction[] => {
    if (!query.trim()) return transactions;
    const lower = query.toLowerCase();
    return transactions.filter(t =>
      t.description?.toLowerCase().includes(lower) ||
      t.category.toLowerCase().includes(lower)
    );
  };

  /**
   * Получить последние N транзакций
   */
  const getRecent = (limit: number = 5): Transaction[] => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  /**
   * Перечитать данные из localStorage
   */
  const refreshTransactions = () => {
    const freshData = loadTransactions();
    setTransactions(freshData);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getByPeriod,
    getByType,
    getByCategory,
    getBalance,
    search,
    getRecent,
    refreshTransactions,
  };
}
