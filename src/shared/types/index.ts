export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: ModuleCategory;
  isNew?: boolean;
}

export type ModuleCategory = 'calculators' | 'reference' | 'tools' | 'planning' | 'design';

export interface CategoryInfo {
  id: ModuleCategory;
  title: string;
  icon: string;
}

// CRM Types
export type ClientType = 'individual' | 'legal';

export interface Client {
  id: string;
  type: ClientType; // Тип клиента: физическое или юридическое лицо
  name: string; // Для физ: ФИО, для юр: Название организации
  phone: string;
  email?: string;
  address: string; // Для физ: адрес проживания, для юр: юридический адрес
  
  // Поля для юридических лиц
  inn?: string; // ИНН (10 или 12 цифр)
  kpp?: string; // КПП (9 цифр)
  ogrn?: string; // ОГРН
  legalAddress?: string; // Фактический адрес (если отличается от юридического)
  bankName?: string; // Название банка
  bik?: string; // БИК банка
  account?: string; // Расчётный счёт
  correspondentAccount?: string; // Корреспондентский счёт
  
  // Поля для физических лиц (опционально)
  passportSeries?: string; // Серия паспорта
  passportNumber?: string; // Номер паспорта
  passportIssuedBy?: string; // Кем выдан
  passportDate?: string; // Дата выдачи
  
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'new' | 'in_progress' | 'completed' | 'paid';
export type OrderType = 'emergency' | 'installation' | 'repair' | 'consultation';

export interface Order {
  id: string;
  clientId: string;
  propertyId?: string; // Привязка к объекту
  type: OrderType;
  address: string;
  date: string;
  time: string;
  description: string;
  status: OrderStatus;
  workCost: number;
  materialsCost: number;
  total: number;
  createdAt: string;
  completedAt?: string;
}

export type ReminderPriority = 'low' | 'medium' | 'high';

export interface Reminder {
  id: string;
  text: string;
  date: string;
  time: string;
  priority: ReminderPriority;
  isDone: boolean;
  relatedClientId?: string;
  relatedOrderId?: string;
  createdAt: string;
}
