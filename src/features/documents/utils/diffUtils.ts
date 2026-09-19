import { Document } from '../types';

/**
 * Определяет изменённые поля между старым и новым документом
 */
export const getChangedFields = (
  newDoc: Partial<Document>,
  oldDoc?: Document
): Record<string, { old: any; new: any }> => {
  if (!oldDoc) return {};

  const changes: Record<string, { old: any; new: any }> = {};
  const fieldsToCompare = ['title', 'number', 'date', 'status', 'clientId'];

  fieldsToCompare.forEach(field => {
    const oldValue = (oldDoc as any)[field];
    const newValue = (newDoc as any)[field];
    
    if (oldValue !== newValue) {
      changes[field] = { old: oldValue, new: newValue };
    }
  });

  // Сравниваем содержимое документа
  if (newDoc.content && oldDoc.content) {
    const contentFields = ['subject', 'description', 'totalAmount', 'warrantyPeriod', 'paymentTerms', 'additionalTerms'];
    contentFields.forEach(field => {
      const oldValue = (oldDoc.content as any)[field];
      const newValue = (newDoc.content as any)[field];
      
      if (oldValue !== newValue) {
        changes[`content.${field}`] = { old: oldValue, new: newValue };
      }
    });
  }

  return changes;
};
