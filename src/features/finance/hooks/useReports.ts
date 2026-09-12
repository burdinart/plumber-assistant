import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useClients } from '../../clients/hooks/useClients';
import { Transaction } from '../types';
import { getWeekStart, getWeekEnd } from '../utils/formatters';
import { calculateBalance, calculatePercentChange } from '../utils/calculations';

export function useReports() {
  const { transactions, getByPeriod } = useTransactions();
  const { clients } = useClients();

  /**
   * Отчёт за конкретный день
   */
  const getDailyReport = (date: string) => {
    const dayTransactions = transactions.filter(t => t.date === date);
    const balance = calculateBalance(dayTransactions);
    return {
      ...balance,
      count: dayTransactions.length,
    };
  };

  /**
   * Отчёт за неделю
   */
  const getWeeklyReport = (date: Date) => {
    const start = getWeekStart(date);
    const end = getWeekEnd(date);
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    const weekTransactions = getByPeriod(startDate, endDate);
    const balance = calculateBalance(weekTransactions);

    // Предыдущая неделя для сравнения
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 7);
    const prevEnd = new Date(end);
    prevEnd.setDate(prevEnd.getDate() - 7);
    const prevTransactions = getByPeriod(
      prevStart.toISOString().split('T')[0],
      prevEnd.toISOString().split('T')[0]
    );
    const prevBalance = calculateBalance(prevTransactions);

    return {
      ...balance,
      count: weekTransactions.length,
      incomeChange: calculatePercentChange(balance.income, prevBalance.income),
      expenseChange: calculatePercentChange(balance.expense, prevBalance.expense),
    };
  };

  /**
   * Отчёт за месяц
   */
  const getMonthlyReport = (year: number, month: number) => {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
    
    const monthTransactions = getByPeriod(startDate, endDate);
    const balance = calculateBalance(monthTransactions);

    // Предыдущий месяц для сравнения
    const prevStartDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const prevEndDate = new Date(year, month, 0).toISOString().split('T')[0];
    const prevTransactions = getByPeriod(prevStartDate, prevEndDate);
    const prevBalance = calculateBalance(prevTransactions);

    // Топ-5 клиентов по сумме
    const clientTotals = new Map<string, number>();
    monthTransactions
      .filter(t => t.type === 'income' && t.clientId)
      .forEach(t => {
        const current = clientTotals.get(t.clientId!) || 0;
        clientTotals.set(t.clientId!, current + t.amount);
      });

    const topClients = Array.from(clientTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([clientId, amount]) => {
        const client = clients.find(c => c.id === clientId);
        return {
          clientId,
          clientName: client?.name || 'Неизвестный',
          amount,
        };
      });

    return {
      ...balance,
      count: monthTransactions.length,
      incomeChange: calculatePercentChange(balance.income, prevBalance.income),
      expenseChange: calculatePercentChange(balance.expense, prevBalance.expense),
      topClients,
    };
  };

  /**
   * Отчёт за год (помесячная динамика)
   */
  const getYearlyReport = (year: number) => {
    const monthlyData = Array.from({ length: 12 }, (_, month) => {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      const monthTransactions = getByPeriod(startDate, endDate);
      const balance = calculateBalance(monthTransactions);
      return {
        month,
        ...balance,
      };
    });

    const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0);

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      monthlyData,
    };
  };

  /**
   * Топ-5 работ по популярности
   */
  const getTopServices = (startDate: string, endDate: string, limit: number = 5) => {
    const periodTransactions = getByPeriod(startDate, endDate);
    const serviceCounts = new Map<string, { count: number; total: number }>();

    periodTransactions
      .filter(t => t.description)
      .forEach(t => {
        const current = serviceCounts.get(t.description!) || { count: 0, total: 0 };
        serviceCounts.set(t.description!, {
          count: current.count + 1,
          total: current.total + t.amount,
        });
      });

    return Array.from(serviceCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, limit)
      .map(([name, data]) => ({
        name,
        count: data.count,
        total: data.total,
      }));
  };

  return {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getYearlyReport,
    getTopServices,
  };
}
