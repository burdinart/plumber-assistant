import { useState, useEffect, useCallback } from 'react';
import { Estimate, EstimateStatus } from '../types';
import { storage, generateId } from '../../../shared/utils/storage';
import { STORAGE_KEYS } from '../../../shared/utils/constants';

const STORAGE_KEY = STORAGE_KEYS.estimates;

// Общее состояние для всех экземпляров хука: раньше каждый компонент
// держал копию смет в локальном useState и перезаписывал localStorage
// своей (пустой на первом рендере) копией — из-за этого при переходе
// «Редактировать» (список размонтируется → редактор монтируется) все
// сметы сбрасывались и форма показывала режим создания новой сметы.
let globalEstimates: Estimate[] | null = null;
const listeners = new Set<(list: Estimate[]) => void>();

function loadEstimates(): Estimate[] {
  if (globalEstimates === null) {
    globalEstimates = storage.get<Estimate[]>(STORAGE_KEY, []);
  }
  return globalEstimates;
}

function commitEstimates(next: Estimate[]): void {
  globalEstimates = next;
  storage.set(STORAGE_KEY, next);
  listeners.forEach((l) => l(next));
}

export function useEstimates() {
  const [estimates, setEstimatesState] = useState<Estimate[]>(loadEstimates);

  useEffect(() => {
    const listener = (list: Estimate[]) => setEstimatesState(list);
    listeners.add(listener);
    // Синхронизация с актуальным состоянием (на случай изменений между render и subscribe)
    setEstimatesState(loadEstimates());
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setEstimates = useCallback(
    (updater: Estimate[] | ((prev: Estimate[]) => Estimate[])) => {
      const next =
        typeof updater === 'function'
          ? (updater as (prev: Estimate[]) => Estimate[])(loadEstimates())
          : updater;
      commitEstimates(next);
    },
    []
  );

  /**
   * Генерация номера сметы (СМ-001, СМ-002, ...)
   */
  const generateEstimateNumber = (): string => {
    const maxNumber = estimates.reduce((max, estimate) => {
      const match = estimate.number.match(/СМ-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);

    return `СМ-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  /**
   * Создать новую смету
   */
  const createEstimate = (data: Omit<Estimate, 'id' | 'number' | 'createdAt' | 'totalWork' | 'totalMaterials' | 'total'>): Estimate => {
    const newEstimate: Estimate = {
      ...data,
      id: generateId(),
      number: generateEstimateNumber(),
      createdAt: new Date().toISOString(),
      totalWork: data.items
        .filter(item => item.type === 'work')
        .reduce((sum, item) => sum + item.quantity * item.price, 0),
      totalMaterials: data.items
        .filter(item => item.type === 'material')
        .reduce((sum, item) => sum + item.quantity * item.price, 0),
      total: 0, // Будет рассчитано ниже
    };

    // Расчёт итоговой суммы с учётом скидки
    const subtotal = newEstimate.totalWork + newEstimate.totalMaterials;
    const discountAmount = data.discountType === 'percent'
      ? (subtotal * data.discount) / 100
      : data.discount;
    newEstimate.total = Math.max(0, subtotal - discountAmount);

    setEstimates(prev => [...prev, newEstimate]);
    return newEstimate;
  };

  /**
   * Обновить смету
   */
  const updateEstimate = (id: string, data: Partial<Omit<Estimate, 'id' | 'number' | 'createdAt'>>): Estimate | undefined => {
    let updated: Estimate | undefined;

    setEstimates(prev =>
      prev.map(estimate => {
        if (estimate.id === id) {
          updated = { ...estimate, ...data };

          // Пересчёт итогов если изменились items или discount
          if (data.items || data.discount !== undefined || data.discountType) {
            const items = data.items || estimate.items;
            const discount = data.discount !== undefined ? data.discount : estimate.discount;
            const discountType = data.discountType || estimate.discountType;

            updated.totalWork = items
              .filter(item => item.type === 'work')
              .reduce((sum, item) => sum + item.quantity * item.price, 0);

            updated.totalMaterials = items
              .filter(item => item.type === 'material')
              .reduce((sum, item) => sum + item.quantity * item.price, 0);

            const subtotal = updated.totalWork + updated.totalMaterials;
            const discountAmount = discountType === 'percent'
              ? (subtotal * discount) / 100
              : discount;
            updated.total = Math.max(0, subtotal - discountAmount);
          }

          return updated;
        }
        return estimate;
      })
    );

    return updated;
  };

  /**
   * Удалить смету
   */
  const deleteEstimate = (id: string): boolean => {
    const exists = estimates.some(e => e.id === id);
    if (exists) {
      setEstimates(prev => prev.filter(e => e.id !== id));
      return true;
    }
    return false;
  };

  /**
   * Изменить статус сметы
   */
  const updateEstimateStatus = (id: string, status: EstimateStatus): void => {
    setEstimates(prev =>
      prev.map(estimate =>
        estimate.id === id ? { ...estimate, status } : estimate
      )
    );
  };

  /**
   * Получить смету по ID
   */
  const getEstimate = (id: string): Estimate | undefined => {
    return estimates.find(e => e.id === id);
  };

  /**
   * Получить сметы по статусу
   */
  const getByStatus = (status: EstimateStatus): Estimate[] => {
    return estimates.filter(e => e.status === status);
  };

  /**
   * Получить сметы клиента
   */
  const getByClient = (clientId: string): Estimate[] => {
    return estimates.filter(e => e.clientId === clientId);
  };

  /**
   * Поиск смет
   */
  const search = (query: string): Estimate[] => {
    if (!query.trim()) return estimates;
    const lower = query.toLowerCase();
    return estimates.filter(e =>
      e.number.toLowerCase().includes(lower) ||
      e.address.toLowerCase().includes(lower)
    );
  };

  return {
    estimates,
    createEstimate,
    updateEstimate,
    deleteEstimate,
    updateEstimateStatus,
    getEstimate,
    getByStatus,
    getByClient,
    search,
  };
}
