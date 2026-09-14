import { EstimateItem } from '../finance/types';

// Типы документов
export type DocumentType = 'act' | 'contract' | 'warranty';

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

// Структура хранения всех документов
export interface Documents {
  acts: Act[];
  contracts: Contract[];
  warranties: Warranty[];
}

// Названия типов документов
export const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
  act: 'Акт выполненных работ',
  contract: 'Договор',
  warranty: 'Гарантийный талон',
};

// Префиксы для номеров документов
export const DOCUMENT_NUMBER_PREFIXES: Record<DocumentType, string> = {
  act: 'АКТ',
  contract: 'ДОГ',
  warranty: 'ГАТ',
};
