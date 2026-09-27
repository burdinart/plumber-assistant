import { UserProfile, createEmptyProfile } from '../../profile/types';
import { DocumentContent } from '../types';

/**
 * Минимально необходимые поля профиля для автозаполнения блока «Исполнитель».
 */
export interface ContractorFields {
  fullName: string; // ФИО исполнителя
  phone: string;    // Номер телефона
  address: string;  // Адрес
}

/**
 * Проверка: заполнен ли профиль хотя бы частично
 * (используется для показа подсказки «Заполните профиль» в редакторе).
 */
export const hasContractorData = (profile: UserProfile | null | undefined): boolean =>
  !!profile && !!(profile.fullName || profile.phone || profile.address);

/**
 * Извлечение полей исполнителя (ФИО / телефон / адрес) из профиля пользователя.
 */
export const getContractorFields = (profile: UserProfile | null | undefined): ContractorFields => ({
  fullName: profile?.fullName || '',
  phone: profile?.phone || '',
  address: profile?.address || '',
});

/**
 * Автозаполнение блока «Исполнитель» в контенте документа данными из профиля.
 *
 * Возвращает частичный объект DocumentContent с заполненным полем `contractor`.
 * ВАЖНО: существующие ручные правки не перезаписываются — если в документе уже
 * есть данные исполнителя (документ редактируется), они сохраняются как есть.
 * Поля в редакторе остаются доступными для ручного ввода.
 */
export const buildContractorAutoFill = (
  profile: UserProfile | null | undefined,
  existing?: Partial<DocumentContent>
): Partial<DocumentContent> => {
  if (!hasContractorData(profile)) return {};

  const current = existing?.contractor;
  // Если исполнитель уже заполнен вручную — не трогаем
  if (current && (current.fullName || current.phone || current.address)) {
    return {};
  }

  return {
    contractor: {
      ...createEmptyProfile(),
      ...(current || {}),
      fullName: profile!.fullName,
      phone: profile!.phone,
      address: profile!.address,
      companyName: profile!.companyName || current?.companyName || '',
      inn: profile!.inn || current?.inn || '',
      email: profile!.email || current?.email || '',
    },
  };
};
