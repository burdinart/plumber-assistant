import { DocumentType, DOCUMENT_NUMBER_PREFIXES } from '../types';

/**
 * Генерация номера документа
 * @param type - тип документа
 * @param existingNumbers - массив существующих номеров
 * @returns новый номер документа (например, АКТ-001)
 */
export function generateDocumentNumber(
  type: DocumentType,
  existingNumbers: string[]
): string {
  const prefix = DOCUMENT_NUMBER_PREFIXES[type];
  
  // Извлекаем числа из существующих номеров с таким же префиксом
  const numbers = existingNumbers
    .filter(num => num.startsWith(prefix))
    .map(num => {
      const match = num.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
  
  // Находим максимальный номер и увеличиваем на 1
  const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
  const newNumber = maxNumber + 1;
  
  // Форматируем с ведущими нулями (001, 002, ...)
  return `${prefix}-${newNumber.toString().padStart(3, '0')}`;
}

/**
 * Форматирование даты для отображения
 * @param dateString - дата в формате ISO
 * @returns отформатированная дата (например, "15 сентября 2026")
 */
export function formatDocumentDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Получение даты окончания гарантии
 * @param issueDate - дата выдачи
 * @param months - количество месяцев гарантии
 * @returns дата окончания гарантии в формате ISO
 */
export function calculateWarrantyExpiry(issueDate: string, months: number): string {
  const date = new Date(issueDate);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

/**
 * Проверка, истекает ли гарантия в течение указанного количества дней
 * @param expiryDate - дата окончания гарантии
 * @param daysUntilExpiry - количество дней до истечения
 * @returns true, если гарантия истекает в указанный период
 */
export function isWarrantyExpiringSoon(expiryDate: string, daysUntilExpiry: number = 30): boolean {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntil = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return daysUntil <= daysUntilExpiry && daysUntil > 0;
}

/**
 * Конвертация файла в base64
 * @param file - файл для конвертации
 * @returns Promise с base64 строкой
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Форматирование суммы для документов
 * @param amount - сумма
 * @returns отформатированная сумма с символом рубля
 */
export function formatDocumentAmount(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
