export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  category: ModuleCategory;
  isNew?: boolean;
}

export type ModuleCategory = 'calculators' | 'reference' | 'tools' | 'planning';

export interface CategoryInfo {
  id: ModuleCategory;
  title: string;
  icon: string;
}

// CRM Types
export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
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
