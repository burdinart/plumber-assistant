import { useState, useEffect } from 'react';
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

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Загрузка из LocalStorage
  useEffect(() => {
    console.log('Loading transactions from localStorage...');
    const stored = storage.get<Transaction[]>(STORAGE_KEY, []);
    console.log('Loaded transactions:', stored);
    
    // Если данных нет, загружаем демо-данные
    if (stored.length === 0) {
      console.log('No stored transactions, loading demo data');
      setTransactions(DEMO_TRANSACTIONS);
      storage.set(STORAGE_KEY, DEMO_TRANSACTIONS);
    } else {
      setTransactions(stored);
    }
  }, []);

  // Сохранение в LocalStorage
  useEffect(() => {
    console.log('Saving transactions to localStorage:', transactions);
    const success = storage.set(STORAGE_KEY, transactions);
    console.log('LocalStorage save result:', success);
  }, [transactions]);

  /**
   * Добавить транзакцию
   */
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    console.log('Adding transaction with data:', data);
    
    const newTransaction: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    console.log('New transaction created:', newTransaction);
    
    // Обновляем state
    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      console.log('Updated transactions array:', updated);
      
      // Сразу сохраняем в LocalStorage
      const saveSuccess = storage.set(STORAGE_KEY, updated);
      console.log('Immediate save to localStorage:', saveSuccess);
      
      return updated;
    });
    
    return newTransaction;
  };

  /**
   * Обновить транзакцию
   */
  const updateTransaction = (id: string, data: Partial<Transaction>): Transaction | undefined => {
    let updated: Transaction | undefined;
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === id) {
          updated = { ...t, ...data };
          return updated;
        }
        return t;
      })
    );
    return updated;
  };

  /**
   * Удалить транзакцию
   */
  const deleteTransaction = (id: string): boolean => {
    const exists = transactions.some(t => t.id === id);
    if (exists) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      return true;
    }
    return false;
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
  };
}
