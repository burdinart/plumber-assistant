import type { DocumentItem } from '../types';

/** Новая пустая позиция работ/материалов. */
export function createEmptyItem(): DocumentItem {
  return {
    id: `${Date.now()}`,
    name: '',
    unit: 'шт',
    quantity: 1,
    price: 0,
    total: 0,
  };
}

/** Сумма по всем позициям. */
export function recalcTotalAmount(items: DocumentItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

/** Обновление поля позиции с автопересчётом суммы позиции и общего итога. */
export function updateItemField(
  items: DocumentItem[],
  index: number,
  field: keyof DocumentItem,
  value: unknown,
): { items: DocumentItem[]; totalAmount: number } {
  const next = [...items];
  next[index] = { ...next[index], [field]: value };

  if (field === 'quantity' || field === 'price') {
    const qty = field === 'quantity' ? Number(value) : next[index].quantity;
    const price = field === 'price' ? Number(value) : next[index].price;
    next[index].total = qty * price;
  }

  return { items: next, totalAmount: recalcTotalAmount(next) };
}

/** Удаление позиции с автопересчётом общего итога. */
export function removeItemAt(
  items: DocumentItem[],
  index: number,
): { items: DocumentItem[]; totalAmount: number } {
  const next = items.filter((_, i) => i !== index);
  return { items: next, totalAmount: recalcTotalAmount(next) };
}
