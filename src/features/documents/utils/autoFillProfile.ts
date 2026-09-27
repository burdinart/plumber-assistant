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

/** Заглушка для пустых полей в печатных формах */
export const DASH = '_______________';

/**
 * Строки блока «Исполнитель» из профиля пользователя.
 * Пустые поля заменяются прочерками "_______".
 */
export const getContractorLines = (profile: UserProfile | null | undefined): string[] => {
  const name = profile?.companyName || profile?.fullName;
  return [
    name ? `${name}, ИНН ${profile?.inn || DASH}` : `_______________, ИНН _______________`,
    `${profile?.position || '_______________'}: ${profile?.fullName || DASH}`,
    `Тел: ${profile?.phone || DASH}`,
    `Адрес: ${profile?.address || DASH}`,
  ];
};

/**
 * Однострочное представление исполнителя для шапки документов/печатных форм:
 * "ИП Иванов И.И., ИНН 123456789012, тел: +7..., адрес: ..."
 */
export const getContractorHeaderLine = (profile: UserProfile | null | undefined): string => {
  const parts = [
    profile?.companyName || profile?.fullName || DASH,
    `ИНН ${profile?.inn || DASH}`,
  ];
  if (profile?.phone) parts.push(`тел: ${profile.phone}`);
  if (profile?.address) parts.push(`адрес: ${profile.address}`);
  return parts.join(', ');
};

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
