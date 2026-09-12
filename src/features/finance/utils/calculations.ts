import { Estimate, EstimateItem, DiscountType } from '../types';

/**
 * Расчёт суммы позиции сметы
 */
export function calculateItemTotal(item: EstimateItem): number {
  return item.quantity * item.price;
}

/**
 * Расчёт итогов сметы
 */
export function calculateEstimateTotals(items: EstimateItem[]): {
  totalWork: number;
  totalMaterials: number;
  subtotal: number;
} {
  const totalWork = items
    .filter(item => item.type === 'work')
    .reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const totalMaterials = items
    .filter(item => item.type === 'material')
    .reduce((sum, item) => sum + calculateItemTotal(item), 0);

  return {
    totalWork,
    totalMaterials,
    subtotal: totalWork + totalMaterials,
  };
}

/**
 * Расчёт скидки
 */
export function calculateDiscount(subtotal: number, discount: number, discountType: DiscountType): number {
  if (discountType === 'percent') {
    return (subtotal * discount) / 100;
  }
  return discount;
}

/**
 * Расчёт итоговой суммы с учётом скидки
 */
export function calculateFinalTotal(
  items: EstimateItem[],
  discount: number,
  discountType: DiscountType
): number {
  const { subtotal } = calculateEstimateTotals(items);
  const discountAmount = calculateDiscount(subtotal, discount, discountType);
  return Math.max(0, subtotal - discountAmount);
}

/**
 * Расчёт баланса за период
 */
export function calculateBalance(
  transactions: Array<{ type: 'income' | 'expense'; amount: number }>
): {
  income: number;
  expense: number;
  balance: number;
} {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}

/**
 * Расчёт процента изменения
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Фильтрация транзакций по периоду
 */
export function filterTransactionsByPeriod<T extends { date: string }>(
  transactions: T[],
  startDate: string,
  endDate: string
): T[] {
  return transactions.filter(t => {
    const date = t.date;
    return date >= startDate && date <= endDate;
  });
}

/**
 * Группировка транзакций по дате
 */
export function groupTransactionsByDate<T extends { date: string }>(
  transactions: T[]
): Record<string, T[]> {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Получение топ-N элементов по сумме
 */
export function getTopByAmount<T>(
  items: T[],
  getValue: (item: T) => number,
  limit: number = 5
): T[] {
  return [...items]
    .sort((a, b) => getValue(b) - getValue(a))
    .slice(0, limit);
}
