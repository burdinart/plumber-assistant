import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Загрузка из LocalStorage
  useEffect(() => {
    const stored = storage.get<Transaction[]>(STORAGE_KEY, []);
    setTransactions(stored);
  }, []);

  // Сохранение в LocalStorage
  useEffect(() => {
    storage.set(STORAGE_KEY, transactions);
  }, [transactions]);

  /**
   * Добавить транзакцию
   */
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
    const newTransaction: Transaction = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
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
