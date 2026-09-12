import { EstimateItem } from '../finance/types';

// Типы документов
export type DocumentType = 'act' | 'contract' | 'warranty' | 'photo_report';

// Базовый интерфейс для всех документов
export interface BaseDocument {
  id: string;
  type: DocumentType;
  number: string; // АКТ-001, ДОГ-001, ГАТ-001, ФОТ-001
  clientId: string;
  orderId?: string;
  estimateId?: string;
  createdAt: string;
  notes?: string;
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
}

// Гарантийный талон
export interface Warranty extends BaseDocument {
  type: 'warranty';
  issueDate: string;
  expiryDate: string;
  warrantyMonths: number;
  workDescription: string;
}

// Фотоотчёт
export interface PhotoReport extends BaseDocument {
  type: 'photo_report';
  photos: Photo[];
}

// Фото в фотоотчёте
export interface Photo {
  id: string;
  data: string; // base64
  type: 'before' | 'after';
  comment?: string;
  uploadedAt: string;
}

// Структура хранения всех документов
export interface Documents {
  acts: Act[];
  contracts: Contract[];
  warranties: Warranty[];
  photoReports: PhotoReport[];
}

// Названия типов документов
export const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
  act: 'Акт выполненных работ',
  contract: 'Договор',
  warranty: 'Гарантийный талон',
  photo_report: 'Фотоотчёт',
};

// Префиксы для номеров документов
export const DOCUMENT_NUMBER_PREFIXES: Record<DocumentType, string> = {
  act: 'АКТ',
  contract: 'ДОГ',
  warranty: 'ГАТ',
  photo_report: 'ФОТ',
};
