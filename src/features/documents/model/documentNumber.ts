import type { Document, DocumentType } from '../types';

/**
 * Генерация номера нового документа по шаблону из профиля.
 * Шаблон поддерживает плейсхолдеры {number} и {date}.
 */
export function generateDocumentNumber(
  template: string | undefined,
  documents: Document[],
  type: DocumentType,
): string {
  const tpl = template || '№ {number} от {date}';
  const nextNumber = (documents.filter((d) => d.type === type).length + 1).toString();
  const dateStr = new Date().toLocaleDateString('ru-RU');

  return tpl.replace('{number}', nextNumber).replace('{date}', dateStr);
}
