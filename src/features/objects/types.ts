/**
 * Типы для модуля "Объекты" (Properties)
 */

export type ObjectType = 'apartment' | 'house' | 'office' | 'cottage' | 'commercial';

export type WaterSupplyType = 'central' | 'well' | 'borehole';
export type SewageType = 'central' | 'septic';
export type PipeMaterial = 'ppr' | 'copper' | 'steel' | 'pex';
export type HeatingSystem = 'radiator' | 'underfloor' | 'mixed';

export interface Property {
  id: string;
  clientId: string; // Владелец объекта (из CRM)
  name: string; // Название: "Квартира на Ленина" или "Дача"
  type: ObjectType;
  
  // Адрес
  address: string; // Полный адрес
  city?: string;
  street?: string;
  building?: string;
  apartment?: string;
  floor?: number;
  entrance?: number;
  
  // Характеристики
  area?: number; // Площадь (м²)
  bathrooms?: number; // Количество санузлов
  bedrooms?: number; // Количество комнат
  hasGas?: boolean; // Есть газ
  hasCentralHeating?: boolean; // Центральное отопление
  
  // Технические особенности
  waterSupplyType?: WaterSupplyType; // Водоснабжение
  sewageType?: SewageType; // Канализация
  pipeMaterial?: PipeMaterial; // Материал труб
  heatingSystem?: HeatingSystem; // Система отопления
  
  // Дополнительная информация
  notes?: string; // Особенности: "старые трубы", "нет горячей воды"
  accessInfo?: string; // Как попасть: "домофон 123", "ключи у консьержа"
  photos?: string[]; // URL фото (base64 или ссылки)
  
  // Геолокация (для карты)
  latitude?: number;
  longitude?: number;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Названия типов объектов для отображения
 */
export const OBJECT_TYPE_NAMES: Record<ObjectType, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  office: 'Офис',
  cottage: 'Коттедж',
  commercial: 'Коммерческая недвижимость',
};

/**
 * Иконки типов объектов (emoji)
 */
export const OBJECT_TYPE_ICONS: Record<ObjectType, string> = {
  apartment: '🏢',
  house: '🏡',
  office: '🏢',
  cottage: '🏠',
  commercial: '🏬',
};

/**
 * Названия типов водоснабжения
 */
export const WATER_SUPPLY_NAMES: Record<WaterSupplyType, string> = {
  central: 'Центральное',
  well: 'Колодец',
  borehole: 'Скважина',
};

/**
 * Названия типов канализации
 */
export const SEWAGE_NAMES: Record<SewageType, string> = {
  central: 'Центральная',
  septic: 'Септик',
};

/**
 * Названия материалов труб
 */
export const PIPE_MATERIAL_NAMES: Record<PipeMaterial, string> = {
  ppr: 'Полипропилен (PPR)',
  copper: 'Медь',
  steel: 'Сталь',
  pex: 'Сшитый полиэтилен (PEX)',
};

/**
 * Названия систем отопления
 */
export const HEATING_SYSTEM_NAMES: Record<HeatingSystem, string> = {
  radiator: 'Радиаторное',
  underfloor: 'Тёплый пол',
  mixed: 'Комбинированное',
};
