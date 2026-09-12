import { useState, useEffect } from 'react';
import { Estimate, EstimateStatus } from '../types';
import { storage, generateId } from '../../../shared/utils/storage';

const STORAGE_KEY = 'plumber-assistant-estimates';

export function useEstimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);

  // Загрузка из LocalStorage
  useEffect(() => {
    const stored = storage.get<Estimate[]>(STORAGE_KEY, []);
    setEstimates(stored);
  }, []);

  // Сохранение в LocalStorage
  useEffect(() => {
    storage.set(STORAGE_KEY, estimates);
  }, [estimates]);

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
