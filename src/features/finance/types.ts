// Типы для модуля "Финансы"

export type PriceCategory = 'plumbing' | 'heating' | 'sewage' | 'boilers';
export type PriceUnit = 'шт' | 'м' | 'точка' | 'час';
export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined';
export type EstimateItemType = 'work' | 'material';
export type TransactionType = 'income' | 'expense';
export type DiscountType = 'percent' | 'fixed';

export type IncomeCategory = 'private_client' | 'legal_entity' | 'emergency';
export type ExpenseCategory = 'materials' | 'transport' | 'tools' | 'ads' | 'other';
export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface PriceItem {
  id: string;
  name: string;
  category: PriceCategory;
  price: number;
  unit: PriceUnit;
  description?: string;
  isDefault: boolean;
}

export interface EstimateItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  type: EstimateItemType;
}

export interface Estimate {
  id: string;
  number: string;
  clientId: string;
  propertyId?: string; // Привязка к объекту
  orderId?: string;
  address: string;
  createdAt: string;
  validUntil: string;
  status: EstimateStatus;
  items: EstimateItem[];
  discount: number;
  discountType: DiscountType;
  notes?: string;
  totalWork: number;
  totalMaterials: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: TransactionCategory;
  description?: string;
  
  // Связь с клиентами
  clientId?: string; // ID клиента из CRM
  clientName?: string; // Имя клиента для быстрого отображения (денормализация)
  clientType?: 'individual' | 'legal'; // Тип клиента для отображения иконки
  
  propertyId?: string; // Привязка к объекту
  orderId?: string; // ID заявки (если есть)
  estimateId?: string; // ID сметы (если есть)
  
  createdAt: string;
}

export interface FinanceSettings {
  monthlyPlan: number;
  currency: string;
  taxRate: number;
}

export const PRICE_CATEGORY_NAMES: Record<PriceCategory, string> = {
  plumbing: 'Сантехника',
  heating: 'Отопление',
  sewage: 'Канализация',
  boilers: 'Котлы',
};

export const ESTIMATE_STATUS_NAMES: Record<EstimateStatus, string> = {
  draft: 'Черновик',
  sent: 'Отправлена',
  accepted: 'Принята',
  declined: 'Отклонена',
};

export const ESTIMATE_STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: 'gray',
  sent: 'blue',
  accepted: 'green',
  declined: 'red',
};

export const INCOME_CATEGORY_NAMES: Record<IncomeCategory, string> = {
  private_client: 'Частный клиент',
  legal_entity: 'Юрлицо',
  emergency: 'Срочный вызов',
};

export const EXPENSE_CATEGORY_NAMES: Record<ExpenseCategory, string> = {
  materials: 'Материалы',
  transport: 'Транспорт',
  tools: 'Инструмент',
  ads: 'Реклама',
  other: 'Прочее',
};

export const TRANSACTION_CATEGORY_NAMES: Record<TransactionCategory, string> = {
  ...INCOME_CATEGORY_NAMES,
  ...EXPENSE_CATEGORY_NAMES,
};
