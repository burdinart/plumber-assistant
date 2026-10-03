import type { DocumentItem } from '../types';
import { createEmptyItem, recalcTotalAmount, updateItemField, removeItemAt } from '../model/documentItems';

interface UseDocumentItemsResult {
  addItem: () => void;
  updateItem: (index: number, field: keyof DocumentItem, value: any) => void;
  removeItem: (index: number) => void;
}

/**
 * Логика управления позициями (работами/материалами) редактора документов:
 * добавление, обновление с автопересчётом сумм, удаление.
 * Колбэк onChange вызывается при любом изменении (для отметки "есть несохранённые правки").
 */
export function useDocumentItems(
  getItems: () => DocumentItem[],
  setItemsAndTotal: (items: DocumentItem[], totalAmount: number) => void,
  onChange?: () => void,
): UseDocumentItemsResult {
  const addItem = () => {
    const items = [...getItems(), createEmptyItem()];
    setItemsAndTotal(items, recalcTotalAmount(items));
    onChange?.();
  };

  const updateItem = (index: number, field: keyof DocumentItem, value: any) => {
    const { items, totalAmount } = updateItemField(getItems(), index, field, value);
    setItemsAndTotal(items, totalAmount);
    onChange?.();
  };

  const removeItem = (index: number) => {
    const { items, totalAmount } = removeItemAt(getItems(), index);
    setItemsAndTotal(items, totalAmount);
    onChange?.();
  };

  return { addItem, updateItem, removeItem };
}
