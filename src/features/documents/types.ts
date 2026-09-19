import { EstimateItem } from '../finance/types';
import { UserProfile } from '../profile/types';

// Типы документов
export type DocumentType = 'act' | 'contract' | 'warranty' | 'estimate' | 'handover';
export type DocumentStatus = 'draft' | 'signed' | 'completed';

// Базовый интерфейс для всех документов
export interface BaseDocument {
  id: string;
  type: DocumentType;
  number: string; // АКТ-001, ДОГ-001, ГАТ-001
  clientId: string;
  propertyId?: string; // Привязка к объекту
  orderId?: string;
  estimateId?: string;
  createdAt: string;
  notes?: string;
}

// Элемент документа (работа или материал)
export interface DocumentItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

// Расширенный документ с контентом для генерации PDF
export interface DocumentContent {
  contractor: UserProfile; // из профиля
  customer: any; // из CRM (Client)
  subject: string; // предмет договора/акта
  description: string; // описание работ
  items: DocumentItem[]; // позиции (работы/материалы)
  totalAmount: number;
  warrantyPeriod?: string; // "12 месяцев"
  paymentTerms?: string; // условия оплаты
  additionalTerms?: string; // доп. условия
  contractorSigned: boolean;
  customerSigned: boolean;
}

// Акт выполненных работ
export interface Act extends BaseDocument {
  type: 'act';
  completionDate: string;
  performerSignature: string;
  customerSignature: string;
  complaints?: string;
  // Наследуется из сметы
  items: EstimateItem[];
  totalWork: number;
  totalMaterials: number;
  total: number;
  content?: DocumentContent; // Для генерации PDF
  status?: DocumentStatus;
  pdfUrl?: string;
  updatedAt?: string;
}

// Договор с клиентом
export interface Contract extends BaseDocument {
  type: 'contract';
  startDate: string;
  endDate: string;
  cost: number;
  paymentTerms: string;
  warrantyTerms: string;
  additionalTerms?: string;
  content?: DocumentContent;
  status?: DocumentStatus;
  pdfUrl?: string;
  updatedAt?: string;
}

// Гарантийный талон
export interface Warranty extends BaseDocument {
  type: 'warranty';
  issueDate: string;
  expiryDate: string;
  warrantyMonths: number;
  workDescription: string;
  content?: DocumentContent;
  status?: DocumentStatus;
  pdfUrl?: string;
  updatedAt?: string;
}

// Смета как документ
export interface EstimateDocument extends BaseDocument {
  type: 'estimate';
  content?: DocumentContent;
  status?: DocumentStatus;
  pdfUrl?: string;
  updatedAt?: string;
}

// Акт приёмки-передачи
export interface HandoverDocument extends BaseDocument {
  type: 'handover';
  handoverDate: string;
  content?: DocumentContent;
  status?: DocumentStatus;
  pdfUrl?: string;
  updatedAt?: string;
}

// Объединённый тип
export type Document = Act | Contract | Warranty | EstimateDocument | HandoverDocument;

// Структура хранения всех документов
export interface Documents {
  acts: Act[];
  contracts: Contract[];
  warranties: Warranty[];
  estimates?: EstimateDocument[];
  handovers?: HandoverDocument[];
}

// Названия типов документов
export const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
  act: 'Акт выполненных работ',
  contract: 'Договор',
  warranty: 'Гарантийный талон',
  estimate: 'Смета',
  handover: 'Акт приёмки-передачи',
};

// Префиксы для номеров документов
export const DOCUMENT_NUMBER_PREFIXES: Record<DocumentType, string> = {
  act: 'АКТ',
  contract: 'ДОГ',
  warranty: 'ГАТ',
  estimate: 'СМЕ',
  handover: 'ППР',
};

// Статусы документов
export const DOCUMENT_STATUS_NAMES: Record<DocumentStatus, string> = {
  draft: 'Черновик',
  signed: 'Подписан',
  completed: 'Завершён',
};

// Форматирование даты для документов
export const formatDateForDocument = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Форматирование суммы
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' руб.';
};

// Генерация номера документа
export const generateDocumentNumber = (
  profile: UserProfile,
  type: DocumentType
): string => {
  const template = profile.contractNumberTemplate || '{prefix}-{number} от {date}';
  
  // Получаем следующий номер из localStorage
  const storageKey = `document-number-${type}`;
  const lastNumber = parseInt(localStorage.getItem(storageKey) || '0');
  const nextNumber = lastNumber + 1;
  localStorage.setItem(storageKey, nextNumber.toString());
  
  const prefix = DOCUMENT_NUMBER_PREFIXES[type];
  const date = new Date().toLocaleDateString('ru-RU');
  
  return template
    .replace('{prefix}', prefix)
    .replace('{number}', String(nextNumber))
    .replace('{date}', date);
};
