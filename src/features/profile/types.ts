export interface UserProfile {
  // Личные данные
  fullName: string;
  position: string; // "Индивидуальный предприниматель"
  phone: string;
  email: string;
  address: string;
  
  // Реквизиты
  inn?: string;
  ogrn?: string;
  kpp?: string;
  bankAccount?: string;
  bankName?: string;
  bik?: string;
  corrAccount?: string;
  legalAddress?: string;
  
  // Для документов
  companyName: string; // "ИП Иванов И.И."
  stampUrl?: string; // URL изображения печати
  signatureUrl?: string; // URL изображения подписи
  contractNumberTemplate: string; // "№ {number} от {date}"
  
  // Мета
  updatedAt: string;
}

export const createEmptyProfile = (): UserProfile => ({
  fullName: '',
  position: 'Индивидуальный предприниматель',
  phone: '',
  email: '',
  address: '',
  inn: '',
  ogrn: '',
  kpp: '',
  bankAccount: '',
  bankName: '',
  bik: '',
  corrAccount: '',
  legalAddress: '',
  companyName: '',
  stampUrl: undefined,
  signatureUrl: undefined,
  contractNumberTemplate: '№ {number} от {date}',
  updatedAt: new Date().toISOString()
});
